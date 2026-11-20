// 記事の誤りの報告を受け取る Cloudflare Pages Functions。
// 1. Cloudflare Turnstile で、人が送ったものか確かめる（ボット対策）
// 2. Cloudflare D1 に保存する（消さずに残す。ユーザーと決めた）
// 3. 報告用の「非公開」リポジトリに GitHub Issue を立てる（対応状況は Issue で管理する）
// 連絡先・名前・IP アドレスは受け取らない・保存しない。
//
// Pages の設定（本番・プレビュー両方）：
//   D1 のつなぎ込み  DB
//   環境変数（Secret） TURNSTILE_SECRET_KEY … Turnstile の秘密キー
//                     GITHUB_TOKEN         … 報告用リポジトリの Issue だけ書ける GitHub のトークン
//   環境変数          REPORT_REPO          … 報告用リポジトリ（例：YUji29476666/shukatsu-site-reports）。必ず非公開のリポジトリにする
//
// POST /api/report  本文：{"slug","title","path","body","sourceUrl","token"}

const SLUG = /^[a-z0-9-]{1,80}$/;
const PATH = /^\/ja\/[a-z0-9/-]{1,200}$/;
const LABEL = "読者の報告";

const json = (body, status = 200) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { "content-type": "application/json; charset=utf-8", "cache-control": "no-store" },
  });

// 読者の文章を Issue にそのまま入れると、@ で人に通知が飛んだり表示が崩れたりするので、コードの枠に入れる
const fence = (s) => "```text\n" + s.replace(/```/g, "ʼʼʼ") + "\n```";

async function verifyTurnstile(secret, token) {
  const form = new FormData();
  form.append("secret", secret);
  form.append("response", token);
  try {
    const res = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", { method: "POST", body: form });
    if (!res.ok) return false;
    const d = await res.json();
    return d.success === true;
  } catch {
    return false; // 確かめられないときは受け付けない
  }
}

// REPORT_REPO は「持ち主/リポジトリ名」。前後の空白や、URL のまま貼られた形（https://github.com/…/….git）も受け付ける
const repoName = (v) =>
  String(v ?? "")
    .trim()
    .replace(/^https?:\/\/github\.com\//i, "")
    .replace(/\.git$/i, "")
    .replace(/\/+$/, "");

async function createIssue(env, { title, url, body, sourceUrl, createdAt }) {
  const issue = {
    title: `[読者の報告] ${title}`,
    body: [
      `**記事**：${title}`,
      `**URL**：${url}`,
      `**受付日時**：${createdAt}`,
      "",
      "**報告の内容**",
      fence(body),
      ...(sourceUrl ? ["", "**根拠の URL（読者が書いたもの。開く前に確認すること）**", fence(sourceUrl)] : []),
      "",
      "---",
      "48時間以内に対応する：修正が必要なら記事を直す PR を出す／対象外ならコメントを書いて閉じる。",
    ].join("\n"),
    labels: [LABEL],
  };
  const post = (payload) =>
    fetch(`https://api.github.com/repos/${repoName(env.REPORT_REPO)}/issues`, {
      method: "POST",
      headers: {
        authorization: `Bearer ${env.GITHUB_TOKEN}`,
        accept: "application/vnd.github+json",
        "x-github-api-version": "2022-11-28",
        "user-agent": "shukatsu-site-report",
        "content-type": "application/json",
      },
      body: JSON.stringify(payload),
    });
  let res = await post(issue);
  // ラベルを付けられない設定のときは、ラベルなしで立て直す
  if (res.status === 422 || res.status === 403) {
    res = await post({ title: issue.title, body: issue.body });
  }
  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`github-${res.status} (repo=${repoName(env.REPORT_REPO)}): ${text.slice(0, 200)}`);
  }
  const d = await res.json();
  if (typeof d.number !== "number") throw new Error("github-no-number");
  return d.number;
}

export async function onRequestPost({ request, env }) {
  if (!env.DB || !env.TURNSTILE_SECRET_KEY) return json({ ok: false, error: "not-configured" }, 503);

  let b;
  try {
    b = await request.json();
  } catch {
    return json({ ok: false, error: "bad-request" }, 400);
  }
  const slug = String(b?.slug ?? "");
  const title = String(b?.title ?? "").slice(0, 120);
  const path = String(b?.path ?? "");
  const body = String(b?.body ?? "").trim();
  const sourceUrl = String(b?.sourceUrl ?? "").trim();
  const token = String(b?.token ?? "");

  if (!SLUG.test(slug) || !title || !PATH.test(path)) return json({ ok: false, error: "bad-request" }, 400);
  if (!body || body.length > 1000) return json({ ok: false, error: "bad-body" }, 400);
  if (sourceUrl && (sourceUrl.length > 500 || !/^https?:\/\/\S+$/.test(sourceUrl))) return json({ ok: false, error: "bad-url" }, 400);
  if (!token || !(await verifyTurnstile(env.TURNSTILE_SECRET_KEY, token))) return json({ ok: false, error: "turnstile" }, 403);

  const createdAt = new Date().toISOString();
  await env.DB.prepare(
    "CREATE TABLE IF NOT EXISTS reports (id INTEGER PRIMARY KEY AUTOINCREMENT, slug TEXT NOT NULL, title TEXT NOT NULL, body TEXT NOT NULL, source_url TEXT, issue_number INTEGER, created_at TEXT NOT NULL)",
  ).run();
  // 失敗の理由を書く列（あとから足した列なので、なければ足す）
  try {
    await env.DB.prepare("ALTER TABLE reports ADD COLUMN issue_error TEXT").run();
  } catch {
    // すでにある
  }
  const saved = await env.DB.prepare("INSERT INTO reports (slug, title, body, source_url, created_at) VALUES (?1, ?2, ?3, ?4, ?5) RETURNING id")
    .bind(slug, title, body, sourceUrl || null, createdAt)
    .first();

  // Issue を立てる。失敗しても報告は D1 に残り、失敗の理由を issue_error に書く（確認：SELECT id, created_at, issue_number, issue_error FROM reports ORDER BY id DESC;）
  let issueError = null;
  if (!env.GITHUB_TOKEN || !env.REPORT_REPO) {
    issueError = `missing-config: GITHUB_TOKEN=${env.GITHUB_TOKEN ? "set" : "none"}, REPORT_REPO=${env.REPORT_REPO ? env.REPORT_REPO : "none"}`;
  } else {
    try {
      const url = new URL(path, request.url).toString();
      const number = await createIssue(env, { title, url, body, sourceUrl, createdAt });
      if (saved?.id) await env.DB.prepare("UPDATE reports SET issue_number = ?1 WHERE id = ?2").bind(number, saved.id).run();
    } catch (e) {
      issueError = String(e?.message ?? e).slice(0, 400);
    }
  }
  if (issueError) {
    console.error("report issue failed:", issueError);
    if (saved?.id) {
      try {
        await env.DB.prepare("UPDATE reports SET issue_error = ?1 WHERE id = ?2").bind(issueError, saved.id).run();
      } catch {
        // issue_error の列がまだない古い表でも、受け付け自体は止めない
      }
    }
  }
  return json({ ok: true });
}

export const onRequestGet = () => json({ ok: false, error: "method-not-allowed" }, 405);
