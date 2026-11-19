// 出典の自動チェック（週1回、GitHub Actions で動かす。手元でも `npm run check:sources` で動く）
//
// やること
// 1. 記事データ（src/data）の出典の URL を全部開き、リンク切れを調べる
// 2. ページの文字を前回と比べ、変わった出典を探す（前回の文字は data/source-snapshots.json に保存）
// 3. 最終確認日＋見直し間隔（src/data/review.ts）から、見直しの時期が来た（または7日以内に来る）記事を探す。
//    記事の reviewBy（開催日の翌日など）を過ぎた記事も入れる。最終確認日がない記事は「未確認」として一覧だけ出す
// 5. 全記事の鮮度一覧を data/freshness.csv に書く（Google スプレッドシートの IMPORTDATA で読む。見るだけの一覧）
// 4. 結果を check-report.md に書く。要確認があれば終了コード 0 のまま report の先頭に「要確認あり」と書く
//
// やらないこと：変わった内容が記事の誤りかどうかの判断（人が Claude に「この記事を確認して」と頼む）
// AI は使わない（費用がかからない）

import { mkdirSync, readFileSync, readdirSync, writeFileSync, existsSync, rmSync } from "node:fs";
import { createHash } from "node:crypto";
import path from "node:path";
import { pathToFileURL } from "node:url";
import ts from "typescript";

const ROOT = process.cwd();
const SNAP_FILE = path.join(ROOT, "data/source-snapshots.json");
const CSV_FILE = path.join(ROOT, "data/freshness.csv");
const SITE = "https://shukatsu-site.pages.dev";
const REPORT_FILE = path.join(ROOT, "check-report.md");
const TODAY = process.env.CHECK_TODAY || new Date().toISOString().slice(0, 10);
const SOON_DAYS = 7; // 見直し日の7日前から知らせる（毎週のチェックで必ず1回は拾える）

// --- 記事データ（TypeScript）を読み込む：一時フォルダに .mjs として書き出して import する
async function loadArticles() {
  const out = path.join(ROOT, ".tmp-data");
  rmSync(out, { recursive: true, force: true });
  const walk = (dir) =>
    readdirSync(dir, { withFileTypes: true }).flatMap((e) => (e.isDirectory() ? walk(path.join(dir, e.name)) : [path.join(dir, e.name)]));
  for (const file of walk(path.join(ROOT, "src/data")).filter((f) => f.endsWith(".ts"))) {
    const code = ts.transpileModule(readFileSync(file, "utf8"), {
      compilerOptions: { module: ts.ModuleKind.ESNext, target: ts.ScriptTarget.ES2022 },
    }).outputText.replace(/from "(\.{1,2}\/[^"]+)"/g, 'from "$1.mjs"');
    const dest = path.join(out, path.relative(path.join(ROOT, "src/data"), file)).replace(/\.ts$/, ".mjs");
    mkdirSync(path.dirname(dest), { recursive: true });
    writeFileSync(dest, code);
  }
  const mod = await import(pathToFileURL(path.join(out, "articles.mjs")).href);
  const review = await import(pathToFileURL(path.join(out, "review.mjs")).href);
  const cats = await import(pathToFileURL(path.join(out, "categories.mjs")).href);
  rmSync(out, { recursive: true, force: true });
  return { articles: mod.articles, intervalFor: review.intervalFor, categories: cats.categories };
}

// --- ページの文字を取り出す（タグ・スクリプト・スタイルを除き、空白をまとめる）
function pageText(html) {
  return html
    .replace(/<script[\s\S]*?<\/script>/gi, " ")
    .replace(/<style[\s\S]*?<\/style>/gi, " ")
    .replace(/<noscript[\s\S]*?<\/noscript>/gi, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/\s+/g, " ")
    .trim();
}

async function fetchSource(url) {
  try {
    const res = await fetch(url, {
      redirect: "follow",
      signal: AbortSignal.timeout(30000),
      headers: {
        // 正体を隠さず名乗る（ブラウザのふりはしない）。断られた出典は人の見直しに回す
        "user-agent": "shukatsu-site-source-check/1.0 (+https://github.com/YUji29476666/shukatsu-site)",
        accept: "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
        "accept-language": "ja,en;q=0.8",
      },
    });
    const html = await res.text();
    return { status: res.status, finalUrl: res.url, text: pageText(html) };
  } catch (e) {
    return { status: 0, error: String(e.message || e) };
  }
}

const addMonths = (date, months) => {
  const [y, m, d] = date.split("-").map(Number);
  return new Date(Date.UTC(y, m - 1 + months, d)).toISOString().slice(0, 10);
};
const daysBetween = (a, b) => Math.round((Date.parse(b) - Date.parse(a)) / 864e5);

// 2つの文字の、変わった所の前後だけを短く取り出す（報告用）
function changedPart(before, after) {
  let i = 0;
  while (i < before.length && i < after.length && before[i] === after[i]) i++;
  let j = 0;
  while (j < before.length - i && j < after.length - i && before[before.length - 1 - j] === after[after.length - 1 - j]) j++;
  const cut = (s) => (s.length > 160 ? s.slice(0, 160) + "…" : s);
  return { before: cut(before.slice(Math.max(0, i - 40), before.length - j)), after: cut(after.slice(Math.max(0, i - 40), after.length - j)) };
}

const { articles, intervalFor, categories } = await loadArticles();
const urlOf = (a) => `${SITE}/ja/${a.category}/${a.slug}/`;
const catName = (a) => categories.find((c) => c.id === a.category)?.name ?? a.category;
const snaps = existsSync(SNAP_FILE) ? JSON.parse(readFileSync(SNAP_FILE, "utf8")) : {};
const newSnaps = { ...snaps };

const dead = []; // リンク切れ・開けない
const changed = []; // 前回から文字が変わった
const added = []; // 初めて記録した
const manual = []; // 自動では開かない出典（autoCheck: false）
const due = []; // 見直しの時期
const unchecked = []; // 最終確認日がない（まだ人が確かめていない）
const rows = []; // 鮮度一覧（CSV）

const byUrl = new Map(); // 同じ URL を何度も開かない
for (const a of articles) {
  for (const s of a.sources ?? []) {
    if (s.autoCheck === false) {
      manual.push({ url: s.url, where: `${a.title}（${s.id}：${s.supports}）` });
      continue;
    }
    if (!byUrl.has(s.url)) byUrl.set(s.url, []);
    byUrl.get(s.url).push({ article: a, source: s });
  }
  const interval = intervalFor(a);
  let next = "", left = "", status = "未確認", reason = "";
  if (a.lastChecked) {
    next = addMonths(a.lastChecked, Number(interval.replace("m", "")));
    // 開催日などの reviewBy が先に来るなら、そちらを見直し日にする
    if (a.reviewBy && a.reviewBy < next) { next = a.reviewBy; reason = "日程が過ぎる"; }
    left = daysBetween(TODAY, next);
    status = left < 0 ? "期限切れ" : left <= SOON_DAYS ? "まもなく" : "OK";
    if (left <= SOON_DAYS) due.push({ article: a, next, left, interval, reason });
  } else {
    unchecked.push(a);
  }
  rows.push([a.title, catName(a), urlOf(a), a.lastChecked || "", interval.replace("m", "か月"), a.reviewBy || "", next, left, status, a.blocks ? "あり" : "準備中"]);
}

for (const [url, uses] of byUrl) {
  const r = await fetchSource(url);
  const where = uses.map((u) => `${u.article.title}（${u.source.id}：${u.source.supports}）`).join("、");
  if (r.status === 0 || r.status >= 400) {
    dead.push({ url, status: r.status, error: r.error, where });
    continue;
  }
  const hash = createHash("sha256").update(r.text).digest("hex");
  const prev = snaps[url];
  if (!prev) added.push({ url, where });
  else if (prev.hash !== hash) changed.push({ url, where, since: prev.checkedAt, diff: changedPart(prev.text, r.text) });
  newSnaps[url] = { hash, checkedAt: TODAY, status: r.status, finalUrl: r.finalUrl, text: r.text };
  await new Promise((ok) => setTimeout(ok, 1000)); // 相手のサイトに負担をかけないよう1秒あける
}

// 記事から消えた出典は記録からも消す
for (const url of Object.keys(newSnaps)) if (!byUrl.has(url)) delete newSnaps[url];

mkdirSync(path.dirname(SNAP_FILE), { recursive: true });
writeFileSync(SNAP_FILE, JSON.stringify(newSnaps, null, 2) + "\n");

// --- 報告
const needs = dead.length + changed.length + due.length;
const L = [];
L.push(`# 出典の自動チェック（${TODAY}）`, "");
L.push(needs ? `**要確認あり：${needs}件**。下の記事を Claude に「この記事を確認して」と頼んでください。` : "要確認はありません。", "");
L.push(`調べた出典：${byUrl.size}件、自動では確かめない出典：${manual.length}件（記事 ${articles.filter((a) => a.sources?.length).length}本）`, "");
if (dead.length) {
  L.push("## 開けなかった出典（リンク切れなど）", "");
  for (const d of dead) L.push(`- ${d.url}（状態：${d.status || d.error}）`, `  - 使っている記事：${d.where}`);
  L.push("");
}
if (changed.length) {
  L.push("## 前回から内容が変わった出典", "");
  L.push("ページの文字が変わりました。記事が間違いになったかどうかは、まだ判断していません。", "");
  for (const c of changed) {
    L.push(`- ${c.url}（前回：${c.since}）`, `  - 使っている記事：${c.where}`);
    L.push(`  - 変わった所（前）：${c.diff.before || "（なし）"}`, `  - 変わった所（後）：${c.diff.after || "（なし）"}`);
  }
  L.push("");
}
if (due.length) {
  L.push(`## 見直しの時期が来た記事（${SOON_DAYS}日以内を含む）`, "");
  for (const d of due) {
    const when = d.left < 0 ? `${-d.left}日過ぎています` : d.left === 0 ? "今日" : `あと${d.left}日`;
    L.push(`### ${d.article.title}（${catName(d.article)}）`, "");
    L.push(`- 見直し日：${d.next}（${when}）${d.reason ? `｜理由：${d.reason}` : `｜最終確認日 ${d.article.lastChecked} から ${d.interval.replace("m", "か月")}`}`);
    L.push(`- 記事：${urlOf(d.article)}`);
    if (d.article.sources?.length) {
      L.push("- 確かめる出典：");
      for (const s of d.article.sources) L.push(`  - ${s.title}（${s.publisher}）${s.url}｜${s.supports}`);
    }
    L.push("- 終わったら：Claude に「" + d.article.title + " を確認した。最終確認日を今日にして」（直す所があれば一緒に伝える）", "");
  }
}
if (manual.length) {
  L.push("## 自動では確かめない出典（見直しの時期に人が確かめる）", "");
  for (const m of manual) L.push(`- ${m.url}（${m.where}）`);
  L.push("");
}
if (added.length) {
  L.push("## 今回初めて記録した出典（次回から比べます）", "");
  for (const a of added) L.push(`- ${a.url}（${a.where}）`);
  L.push("");
}
if (unchecked.length) {
  // 未確認は毎週ずっと出るので「要確認」の件数には入れない（本文を書いて人が確かめたら、最終確認日を入れる）
  L.push(`<details><summary>未確認の記事（最終確認日がない）：${unchecked.length}本</summary>`, "");
  for (const a of unchecked) L.push(`- ${a.title}（${catName(a)}${a.blocks ? "" : "・準備中"}）`);
  L.push("", "</details>", "");
}
writeFileSync(REPORT_FILE, L.join("\n"));

// --- 鮮度一覧（CSV）。スプレッドシートで見るためのもの。ここで日付を書き換えてもサイトには戻らない
const csvCell = (v) => (/[",\n]/.test(String(v)) ? `"${String(v).replace(/"/g, '""')}"` : String(v));
const header = ["記事", "カテゴリ", "URL", "最終確認日", "見直しの間隔", "日程の見直し日", "次の見直し日", "あと何日", "状態", "本文"];
writeFileSync(CSV_FILE, [header, ...rows].map((r) => r.map(csvCell).join(",")).join("\n") + "\n");
console.log(L.join("\n"));
// GitHub Actions に「要確認があるか」を伝える
if (process.env.GITHUB_OUTPUT) writeFileSync(process.env.GITHUB_OUTPUT, `needs=${needs}\n`, { flag: "a" });
