import { articles } from "@/data/articles";
import { browseOrder, categories } from "@/data/categories";
import { defaultReviewInterval } from "@/data/review";
import type { Article, Category, CategoryId, Section, ReviewInterval } from "@/data/types";

export const articleUrl = (a: Article) => `/ja/${a.category}/${a.slug}/`;
export const categoryUrl = (id: CategoryId) => `/ja/${id}/`;
/** 中の分け方のリンク先。sectionPages のカテゴリは分け方ごとの記事一覧ページ、ほかはカテゴリページの中の見出し */
export function sectionUrl(c: Category, s: Section): string {
  if (c.sectionPages) return `/ja/${c.id}/${s.id}/`;
  return c.sections.length > 1 ? `${categoryUrl(c.id)}#${s.id}` : categoryUrl(c.id);
}

/** 記事一覧ページを作る分け方（sectionPages のカテゴリだけ）。記事の slug と URL が重なったら止める */
export function sectionPages(): { c: Category; s: Section }[] {
  const out = categories.filter((c) => c.sectionPages).flatMap((c) => c.sections.map((s) => ({ c, s })));
  for (const { c, s } of out) {
    if (articles.some((a) => a.category === c.id && a.slug === s.id)) throw new Error(`分け方の id「${s.id}」が記事の slug と同じです（src/data/categories.ts）`);
  }
  return out;
}


export function getCategory(id: string): Category | undefined {
  return categories.find((c) => c.id === id);
}

export function getArticle(slug: string): Article | undefined {
  return articles.find((a) => a.slug === slug);
}

export function mustArticle(slug: string): Article {
  const a = getArticle(slug);
  if (!a) throw new Error(`記事が見つかりません: ${slug}（src/data/articles.ts に追加してください）`);
  return a;
}

/** そのカテゴリがホームの記事を、並び順のとおり1列にしたもの（前の記事／次の記事の順番） */
export function sequenceOf(id: CategoryId): Article[] {
  const c = getCategory(id);
  if (!c) return [];
  return c.sections.flatMap((s) => s.articles).map(mustArticle);
}

/** 記事が入っている中カテゴリ */
export function sectionOf(a: Article): Section | undefined {
  return getCategory(a.category)?.sections.find((s) => s.articles.includes(a.slug));
}

export function prevNext(a: Article): { prev?: Article; next?: Article } {
  const seq = sequenceOf(a.category);
  const i = seq.findIndex((x) => x.slug === a.slug);
  return { prev: i > 0 ? seq[i - 1] : undefined, next: i >= 0 && i < seq.length - 1 ? seq[i + 1] : undefined };
}

/** 関連記事：related に指定があればそれ。なければ同じ中カテゴリ→同じカテゴリから、前後の記事と重ならないものを3本 */
export function relatedOf(a: Article): Article[] {
  const { prev, next } = prevNext(a);
  const exclude = new Set([a.slug, prev?.slug, next?.slug]);
  if (a.related?.length) return a.related.map(mustArticle).filter((x) => !exclude.has(x.slug)).slice(0, 3);
  const section = sectionOf(a)?.articles ?? [];
  const pool = [...section, ...sequenceOf(a.category).map((x) => x.slug)];
  const out: Article[] = [];
  for (const slug of pool) {
    if (exclude.has(slug) || out.some((x) => x.slug === slug)) continue;
    out.push(mustArticle(slug));
    if (out.length === 3) break;
  }
  return out;
}

export function popularArticles(limit = 6): Article[] {
  return articles
    .filter((a) => a.popular !== undefined)
    .sort((x, y) => (x.popular ?? 0) - (y.popular ?? 0))
    .slice(0, limit);
}

/** トップページのパネルに出す記事（ボスキャリは「人気のページ」の紹介を優先） */
/** 「カテゴリから探す」のパネルに出す記事。ボスキャリは features、ほかはカテゴリの並び順の先頭から */
// 先頭の4件を最初に見せ、残りは「もっと見る」で開く。ボスキャリは features のあとに自分の記事を足す
export function panelArticles(c: Category): Article[] {
  const own = c.sections.flatMap((s) => s.articles);
  const slugs = c.features ? [...new Set([...c.features.articles, ...own])] : own;
  return slugs.map(mustArticle);
}

/** パネル上部のピル（中カテゴリ） */
export function panelPills(c: Category): { name: string; href: string }[] {
  if (c.features) return [{ name: c.features.name, href: "#" }];
  return c.sections.map((s) => ({ name: s.name, href: "#" }));
}

export const dateOrPlaceholder = (d: string) => d || "［日付］";

export const intervalLabel: Record<ReviewInterval, string> = { "1m": "1か月ごと", "3m": "3か月ごと", "6m": "6か月ごと", "12m": "12か月ごと" };

/** 次の見直し予定日（YYYY-MM-DD）。最終確認日と見直しの間隔から計算する。どちらかがなければ空 */
export function nextReview(a: Article): string {
  if (!a.lastChecked) return "";
  const [y, m, d] = a.lastChecked.split("-").map(Number);
  const months = Number((a.reviewInterval ?? defaultReviewInterval).replace("m", ""));
  const t = new Date(Date.UTC(y, m - 1 + months, d));
  return t.toISOString().slice(0, 10);
}

/** 検索用：記事のタイトル・中カテゴリ・導入文・本文をつないだ文字列（カテゴリ名は入れない。「面接」でカテゴリ全体が出てしまうため） */
export function searchText(a: Article): string {
  const parts: string[] = [a.title, sectionOf(a)?.name ?? "", a.lead ?? ""];
  for (const b of a.blocks ?? []) {
    if ("text" in b) parts.push(b.text);
    if (b.type === "example") parts.push(b.title);
    if (b.type === "steps") b.items.forEach((i) => parts.push(i.title, i.text));
    if (b.type === "ngok") b.pairs.forEach((p) => parts.push(p.ng, p.ok));
    if (b.type === "checklist" || b.type === "list") parts.push(...b.items);
    if (b.type === "table") b.rows.forEach(([k, v]) => parts.push(k, v));
  }
  return parts.join(" ").replace(/\[S\d+\]/g, ""); // 出典の印 [S1] は検索の対象にしない
}

/** サイト内のすべての記事（カテゴリの並び順） */
export function allArticles(): Article[] {
  return categories.flatMap((c) => sequenceOf(c.id));
}

/** トップの「カテゴリから探す」に並べる項目：sectionPages のカテゴリ（応募・面接）は分け方ごと、ほかはカテゴリそのもの */
export function browseItems(sorted = true): { id: string; name: string; href: string; icon: Section["icon"] }[] {
  const items = categories.flatMap((c) =>
    c.sectionPages
      ? c.sections.map((s) => ({ id: s.id, name: s.name, href: sectionUrl(c, s), icon: s.icon }))
      : [{ id: c.id, name: c.shortName ?? c.name, href: categoryUrl(c.id), icon: c.icon }],
  );
  const rank = (id: string) => (browseOrder.includes(id) ? browseOrder.indexOf(id) : browseOrder.length);
  return sorted ? items.sort((a, b) => rank(a.id) - rank(b.id)) : items; // sorted=false：カテゴリの並び順のまま（サイドバー）
}
