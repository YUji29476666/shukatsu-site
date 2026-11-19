// 記事のいいね（♡）を数える Cloudflare Pages Functions。
// 保存先：Cloudflare D1（無料枠）。Pages の設定で、D1 データベースを「DB」という名前でつなぐ。
// 個人情報・Cookie・IP アドレスは使わない。ブラウザごとのランダムな匿名ID（visitor）で、
// 「同じブラウザから同じ記事へのいいねは1件まで」にする（ブラウザの記録を消せば押し直せる。ユーザーと決めた許容範囲）。
//
// GET  /api/like?slug=self-pr&visitor=xxxx   → {"ok":true,"count":3,"liked":false}
// POST /api/like  本文：{"slug":"self-pr","visitor":"xxxx","liked":true}（true＝いいね、false＝取り消し）

const SLUG = /^[a-z0-9-]{1,80}$/;
const VISITOR = /^[A-Za-z0-9-]{16,64}$/;

const json = (body, status = 200) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { "content-type": "application/json; charset=utf-8", "cache-control": "no-store" },
  });

// 表がなければ作る（最初の1回だけ。手で SQL を流さなくてよい）
const ensureTable = (db) =>
  db
    .prepare(
      "CREATE TABLE IF NOT EXISTS likes (slug TEXT NOT NULL, visitor_id TEXT NOT NULL, created_at TEXT NOT NULL, PRIMARY KEY (slug, visitor_id))",
    )
    .run();

async function state(db, slug, visitor) {
  const row = await db
    .prepare("SELECT COUNT(*) AS n, SUM(CASE WHEN visitor_id = ?2 THEN 1 ELSE 0 END) AS mine FROM likes WHERE slug = ?1")
    .bind(slug, visitor || "")
    .first();
  return { ok: true, count: Number(row?.n ?? 0), liked: Number(row?.mine ?? 0) > 0 };
}

export async function onRequestGet({ request, env }) {
  if (!env.DB) return json({ ok: false, error: "not-configured" }, 503);
  const url = new URL(request.url);
  const slug = url.searchParams.get("slug") ?? "";
  const visitor = url.searchParams.get("visitor") ?? "";
  if (!SLUG.test(slug) || (visitor && !VISITOR.test(visitor))) return json({ ok: false, error: "bad-request" }, 400);
  await ensureTable(env.DB);
  return json(await state(env.DB, slug, visitor));
}

export async function onRequestPost({ request, env }) {
  if (!env.DB) return json({ ok: false, error: "not-configured" }, 503);
  let body;
  try {
    body = await request.json();
  } catch {
    return json({ ok: false, error: "bad-request" }, 400);
  }
  const slug = String(body?.slug ?? "");
  const visitor = String(body?.visitor ?? "");
  if (!SLUG.test(slug) || !VISITOR.test(visitor) || typeof body?.liked !== "boolean") return json({ ok: false, error: "bad-request" }, 400);

  await ensureTable(env.DB);
  if (body.liked) {
    // すでにあれば何もしない（同じブラウザから2件目は入らない）
    await env.DB.prepare("INSERT OR IGNORE INTO likes (slug, visitor_id, created_at) VALUES (?1, ?2, ?3)")
      .bind(slug, visitor, new Date().toISOString())
      .run();
  } else {
    await env.DB.prepare("DELETE FROM likes WHERE slug = ?1 AND visitor_id = ?2").bind(slug, visitor).run();
  }
  return json(await state(env.DB, slug, visitor));
}
