// 使い方：npm run dev を動かしたまま、別のターミナルで npm run shot
// トップと記事ページを PC（1440px）とスマホ（390px）で撮り、screenshots/ に保存する。
// 撮った画像を design/ の画像と並べて見比べる。
import { chromium } from "playwright-core";
import { existsSync, mkdirSync } from "node:fs";
import path from "node:path";

const base = process.env.BASE_URL || "http://localhost:3000";
const pages = [
  { name: "top", url: "/ja/" },
  { name: "article", url: "/ja/selection/self-pr/" },
];
const sizes = [
  { name: "pc", width: 1440, height: 900 },
  { name: "sp", width: 390, height: 844 },
];

const local = process.env.LOCALAPPDATA || "";
const candidates = [
  process.env.CHROME,
  "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe",
  "C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe",
  local && path.join(local, "Google\\Chrome\\Application\\chrome.exe"),
  "C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe",
  "C:\\Program Files\\Microsoft\\Edge\\Application\\msedge.exe",
  "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
  "/usr/bin/google-chrome",
].filter(Boolean);
const exe = candidates.find((p) => existsSync(p));
if (!exe) {
  console.error("Chrome または Edge が見つかりません。環境変数 CHROME にブラウザの場所を入れてください。");
  process.exit(1);
}

mkdirSync("screenshots", { recursive: true });
const browser = await chromium.launch({ executablePath: exe });
let problems = 0;
for (const s of sizes) {
  const page = await browser.newPage({ viewport: { width: s.width, height: s.height } });
  const errors = [];
  page.on("pageerror", (e) => errors.push(e.message));
  for (const p of pages) {
    const res = await page.goto(base + p.url, { waitUntil: "networkidle" }).catch((e) => {
      console.error(`開けません：${base + p.url}（npm run dev は動いていますか？）`);
      throw e;
    });
    if (!res || res.status() >= 400) { console.error(`NG ${p.url}：${res?.status()}`); problems++; }
    const overflow = await page.evaluate(() => document.documentElement.scrollWidth > window.innerWidth);
    if (overflow) { console.error(`NG ${p.name}-${s.name}：横にはみ出しています`); problems++; }
    const file = `screenshots/${p.name}-${s.name}.png`;
    await page.screenshot({ path: file, fullPage: true });
    console.log(`撮影：${file}`);
  }
  if (errors.length) { console.error(`NG ${s.name}：ページのエラー`, errors); problems++; }
  await page.close();
}
await browser.close();
console.log(problems ? `問題 ${problems} 件` : "撮影完了。design/ の画像と見比べてください");
process.exit(problems ? 1 : 0);
