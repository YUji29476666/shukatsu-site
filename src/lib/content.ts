import { articles } from "@/data/articles";
import { categories } from "@/data/categories";
import type { Article, Category, CategoryId, Section } from "@/data/types";

export const articleUrl = (a: Article) => `/ja/${a.category}/${a.slug}/`;
export const categoryUrl = (id: CategoryId) => `/ja/${id}/`;

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
export function panelArticles(c: Category, limit = 4): Article[] {
  const slugs = c.features ? c.features.articles : c.sections.flatMap((s) => s.articles);
  return slugs.slice(0, limit).map(mustArticle);
}

/** パネル上部のピル（中カテゴリ） */
export function panelPills(c: Category): { name: string; href: string }[] {
  if (c.features) return [{ name: c.features.name, href: `${categoryUrl(c.id)}#popular` }];
  return c.sections.map((s) => ({ name: s.name, href: `${categoryUrl(c.id)}#${s.id}` }));
}

export const dateOrPlaceholder = (d: string) => d || "［日付］";
