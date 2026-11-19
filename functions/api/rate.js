// 記事の評価ボタン（役に立った／役に立たなかった）の数を数える Cloudflare Pages Functions。
// 保存先：Cloudflare D1（無料枠）。Pages の設定で、D1 データベースを「DB」という名前でつなぐ。
// 個人情報・Cookie は使わない。記事ごとに「役に立った」「役に立たなかった」の数だけを持つ。
//
// POST /api/rate  本文：{"slug":"los-angeles-career-forum","value":"up"}（value は "up" か "down"）

const SLUG = /^[a-z0-9-]{1,80}$/;

const json = (body, status = 200) =>
  new Response(JSON.stringify(body), { status, headers: { "content-type": "application/json; charset=utf-8", "cache-control": "no-store" } });

export async function onRequestPost({ request, env }) {
  if (!env.DB) return json({ ok: false, error: "not-configured" }, 503);

  let body;
  try {
    body = await request.json();
  } catch {
    return json({ ok: false, error: "bad-request" }, 400);
  }
  const slug = String(body?.slug ?? "");
  const value = body?.value;
  if (!SLUG.test(slug) || (value !== "up" && value !== "down")) return json({ ok: false, error: "bad-request" }, 400);

  // 表がなければ作る（最初の1回だけ）
  await env.DB.prepare(
    "CREATE TABLE IF NOT EXISTS ratings (slug TEXT PRIMARY KEY, up INTEGER NOT NULL DEFAULT 0, down INTEGER NOT NULL DEFAULT 0, updated TEXT)",
  ).run();
  const col = value === "up" ? "up" : "down";
  await env.DB.prepare(
    `INSERT INTO ratings (slug, ${col}, updated) VALUES (?1, 1, ?2)
     ON CONFLICT(slug) DO UPDATE SET ${col} = ${col} + 1, updated = ?2`,
  )
    .bind(slug, new Date().toISOString().slice(0, 10))
    .run();
  return json({ ok: true });
}

// POST 以外は受け付けない
export const onRequestGet = () => json({ ok: false, error: "method-not-allowed" }, 405);
