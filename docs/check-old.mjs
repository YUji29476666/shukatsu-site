// 書き出したサイト（out/）を確認する：リンク切れ・タブの切り替え・前後の記事・スクリーンショット
// 使い方: npm run build && node scripts/check.mjs
import { chromium } from "playwright-core";
import { createServer } from "node:http";
import { readFile, stat, mkdir } from "node:fs/promises";
import { join, extname } from "node:path";

const OUT = "out";
const types = { ".html": "text/html; charset=utf-8", ".css": "text/css", ".js": "text/javascript", ".png": "image/png", ".jpg": "image/jpeg", ".svg": "image/svg+xml", ".ico": "image/x-icon", ".txt": "text/plain" };
const server = createServer(async (req, res) => {
  let p = decodeURIComponent(new URL(req.url, "http://x").pathname);
  let f = join(OUT, p);
  try { if ((await stat(f)).isDirectory()) f = join(f, "index.html"); } catch { f = p.endsWith("/") ? f : f + ".html"; }
  try { res.writeHead(200, { "content-type": types[extname(f)] || "application/octet-stream" }); res.end(await readFile(f)); }
  catch { res.writeHead(404); res.end("404"); }
}).listen(4401);
const base = "http://localhost:4401";
const exe = process.env.CHROME || (process.platform === "win32"
  ? "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe"
  : process.platform === "darwin" ? "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome" : "/usr/bin/google-chrome");
const browser = await chromium.launch({ executablePath: exe, args: ["--no-sandbox"] });
const problems = [];
const ok = (cond, msg) => { if (!cond) problems.push(msg); console.log((cond ? "OK  " : "NG  ") + msg); };

// 1. リンク切れ（サイト内の全ページをたどる）
const seen = new Set(); const queue = ["/ja/"];
const page = await browser.newPage();
while (queue.length) {
  const u = queue.shift(); if (seen.has(u)) continue; seen.add(u);
  const r = await page.goto(base + u);
  if (!r || r.status() !== 200) { problems.push(`404: ${u}`); continue; }
  const links = await page.$$eval("a[href]", (as) => as.map((a) => a.getAttribute("href")));
  for (const h of links) {
    if (!h || h.startsWith("http") || h.startsWith("#") || h.startsWith("mailto")) continue;
    const path = h.split("#")[0].split("?")[0]; if (path && !seen.has(path)) queue.push(path);
  }
}
ok(problems.filter((p) => p.startsWith("404")).length === 0, `リンク切れなし（${seen.size}ページを確認）`);

// 2. タブの切り替え（クリックと矢印キー）
await page.goto(base + "/ja/");
const visible = async () => page.$eval('[role="tabpanel"]:not([hidden])', (e) => e.id);
ok((await visible()) === "panel-bosscari", "最初はボスキャリのパネル");
await page.click("#tab-jobs");
ok((await visible()) === "panel-jobs", "クリックで求人・就職情報に切り替わる");
await page.keyboard.press("ArrowDown");
ok((await visible()) === "panel-selection", "矢印キーで応募・面接に切り替わる");
const more = await page.$eval('[data-more]:not([hidden])', (e) => e.textContent);
ok(more.includes("応募・面接"), "「もっと見る」の文言もカテゴリに合わせて変わる");

// 3. 自己PRの前後の記事と関連記事
await page.goto(base + "/ja/selection/self-pr/");
const pn = await page.$$eval('nav[aria-label="前の記事と次の記事"] a', (as) => as.map((a) => a.textContent));
ok(pn[0].includes("ガクチカ") && pn[1].includes("長所短所"), `自己PRの前後：${pn.join(" / ")}`);
const rel = await page.$$eval('section[aria-labelledby="rel-h"] a', (as) => as.map((a) => a.querySelector("p.font-bold")?.textContent));
ok(rel.join() === "STARストーリー,自己紹介,志望動機", `関連記事：${rel.join("・")}`);
await page.goto(base + "/ja/selection/application-prep/");
const first = await page.$eval('nav[aria-label="前の記事と次の記事"] a', (a) => a.textContent);
ok(first.includes("記事一覧へ"), "1本目の記事の「前」はカテゴリの記事一覧へ");

// 4. 検索
await page.goto(base + "/ja/search/?q=SPI", { waitUntil: "networkidle" });
await page.waitForFunction(() => document.getElementById("search-count")?.textContent, null, { timeout: 5000 }).catch(() => {});
const cnt = await page.textContent("#search-count");
ok(/SPI/.test(cnt) && !/：0件/.test(cnt), `検索：${cnt}`);

// 5. スクリーンショット
await mkdir("screenshots", { recursive: true });
for (const [name, path] of [["top", "/ja/"], ["category", "/ja/selection/"], ["article", "/ja/selection/self-pr/"]]) {
  for (const [dev, w] of [["pc", 1440], ["sp", 390]]) {
    const p2 = await browser.newPage({ viewport: { width: w, height: 900 } });
    await p2.goto(base + path, { waitUntil: "networkidle" }).catch(() => {});
    const overflow = await p2.evaluate(() => document.documentElement.scrollWidth > window.innerWidth + 1);
    ok(!overflow, `${name}（${dev}）：横にはみ出していない`);
    await p2.screenshot({ path: `screenshots/${name}-${dev}.png`, fullPage: true });
    await p2.close();
  }
}
await browser.close(); server.close();
console.log(problems.length ? `\n問題 ${problems.length} 件:\n` + problems.join("\n") : "\nすべて OK");
process.exit(problems.length ? 1 : 0);
