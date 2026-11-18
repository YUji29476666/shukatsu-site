import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowRight, Flag } from "lucide-react";
import { ArticleBody, buildToc, Toc } from "@/components/ArticleBody";
import { ArticleCard, labelColor } from "@/components/ArticleCard";
import { Breadcrumb } from "@/components/Breadcrumb";
import { Photo } from "@/components/Photo";
import { RatingButtons } from "@/components/RatingButtons";
import { ArticleRows, ListLayout } from "@/components/ListLayout";
import { SectionIcon } from "@/components/SectionIcon";
import { articles } from "@/data/articles";
import { categories } from "@/data/categories";
import { site } from "@/data/site";
import type { Article } from "@/data/types";
import {
  articleUrl,
  categoryUrl,
  dateOrPlaceholder,
  getArticle,
  getCategory,
  popularArticles,
  prevNext,
  mustArticle,
  relatedOf,
  sectionOf,
  sectionPages,
  sectionUrl,
} from "@/lib/content";

export const dynamicParams = false;
// この URL（/ja/{カテゴリ}/{xxx}/）は、記事ページと「分け方ごとの記事一覧ページ」の両方に使う
export function generateStaticParams() {
  return [
    ...articles.map((a) => ({ category: a.category, slug: a.slug })),
    ...sectionPages().map(({ c, s }) => ({ category: c.id, slug: s.id })),
  ];
}

const findSection = (category: string, slug: string) => sectionPages().find(({ c, s }) => c.id === category && s.id === slug);

type Params = Promise<{ category: string; slug: string }>;

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { category, slug } = await params;
  const sp = findSection(category, slug);
  if (sp) return { title: `${sp.s.name}の記事一覧` };
  return { title: getArticle(slug)?.title };
}

function PrevNextCard({ a, dir, fallback }: { a?: Article; dir: "prev" | "next"; fallback: { name: string; href: string } }) {
  const label = dir === "prev" ? "前の記事" : "次の記事";
  const title = a ? a.title : `${fallback.name}の記事一覧へ`;
  const href = a ? articleUrl(a) : fallback.href;
  return (
    <a
      href={href}
      className={`flex min-h-20 flex-col justify-center rounded-2xl border border-slate-100 bg-white px-5 py-4 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md ${dir === "next" ? "items-end text-right" : ""}`}
    >
      <span className="flex items-center gap-1 text-xs text-sub">
        {dir === "prev" && <ArrowLeft size={14} aria-hidden="true" />}
        {a ? label : dir === "prev" ? "最初の記事です" : "最後の記事です"}
        {dir === "next" && <ArrowRight size={14} aria-hidden="true" />}
      </span>
      <span className="mt-1 font-bold">{title}</span>
    </a>
  );
}

export default async function ArticlePage({ params }: { params: Params }) {
  const { category, slug } = await params;
  const sp = findSection(category, slug);
  if (sp) {
    return (
      <ListLayout
        crumbs={[{ name: sp.s.name }]}
        current={sp.s.id}
        title={`${sp.s.name}の記事一覧`}
        count={sp.s.articles.length}
        icon={<SectionIcon name={sp.s.icon} size={30} />}
      >
        <ArticleRows items={sp.s.articles.map(mustArticle)} />
      </ListLayout>
    );
  }
  const a = getArticle(slug);
  if (!a || a.category !== category) notFound();
  const c = getCategory(a.category)!;
  const section = sectionOf(a);
  const { prev, next } = prevNext(a);
  const related = relatedOf(a);
  const { toc, numbers } = a.blocks ? buildToc(a.blocks) : { toc: [], numbers: {} };
  const reportHref = `${site.reportFormUrl}`;
  const fallback = { name: c.name, href: categoryUrl(c.id) };

  // 右のサイドバー（人気記事・カテゴリー）。PC は本文の横、スマホは「準備中」／本文のすぐ下に出す
  const sideCards = (
    <>
      <section aria-labelledby="side-pop" className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm">
        <h2 id="side-pop" className="font-bold">
          人気記事
        </h2>
        <ol className="mt-4 space-y-4">
          {popularArticles(5).map((p, i) => (
            <li key={p.slug}>
              <a href={articleUrl(p)} className="group flex items-center gap-3">
                <div className="relative aspect-[4/3] w-20 shrink-0">
                  <Photo id={p.slug} category={p.category} rounded="rounded-lg" small />
                  <span className="absolute left-0 top-0 grid h-6 w-6 place-items-center rounded-br-lg rounded-tl-lg bg-navy text-xs font-bold text-white">{i + 1}</span>
                </div>
                <span className="min-w-0">
                  <span className="block text-sm font-bold leading-snug group-hover:text-navy">{p.title}</span>
                  <span className="text-[11px] text-sub">最終確認日：{dateOrPlaceholder(p.lastChecked)}</span>
                </span>
              </a>
            </li>
          ))}
        </ol>
      </section>
      <section aria-labelledby="side-cat" className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm">
        <h2 id="side-cat" className="font-bold">
          カテゴリー
        </h2>
        <ul className="mt-3 divide-y divide-line text-sm">
          {categories.map((x) => (
            <li key={x.id}>
              <a href={categoryUrl(x.id)} className={`flex min-h-11 items-center justify-between hover:text-orange ${x.id === c.id ? "font-bold" : ""}`}>
                {x.name} <ArrowRight size={14} aria-hidden="true" />
              </a>
            </li>
          ))}
        </ul>
      </section>
    </>
  );

  return (
    <div className="mx-auto max-w-6xl px-5">
      <Breadcrumb
        items={[
          { name: c.name, href: categoryUrl(c.id) },
          ...(section && c.sections.length > 1 ? [{ name: section.name, href: sectionUrl(c, section) }] : []),
          { name: a.title },
        ]}
      />
      <div className="grid gap-10 pb-10 md:grid-cols-[minmax(0,1fr)_260px] lg:grid-cols-[minmax(0,1fr)_300px]">
        <article className="min-w-0">
          <header>
            <div className="flex items-start gap-4">
              <div className="shrink-0 rounded-lg border border-line bg-white px-3 py-1.5 text-center">
                <p className="text-[10px] text-sub">最終確認日</p>
                <p className="text-sm font-bold">{a.lastChecked || "未確認"}</p>
              </div>
              <h1 className="pt-1 text-2xl font-bold leading-snug tracking-tight md:text-3xl">{a.title}</h1>
            </div>
            <p className="mt-4 flex flex-wrap items-center gap-2 text-xs">
              <a href={categoryUrl(c.id)} className={`rounded-full px-2.5 py-0.5 font-bold ${labelColor[c.id]}`}>
                {c.name}
              </a>
              {section && c.sections.length > 1 && (
                <a href={sectionUrl(c, section)} className="rounded-full bg-slate-100 px-2.5 py-0.5 text-ink">
                  {section.name}
                </a>
              )}
              <span className="text-sub">更新日：{dateOrPlaceholder(a.updated)}</span>
            </p>
            {a.blocks && !a.lastChecked && (
              <p className="mt-4 rounded-xl border border-dashed border-line bg-white px-4 py-3 text-sm text-sub">
                この記事は、まだ確認担当が出典を確かめていません（AI が出典と照らし合わせた段階です）。
              </p>
            )}
          </header>

          <div className="mt-6 aspect-video">
            <Photo id={a.slug} category={a.category} rounded="rounded-2xl" />
          </div>

          {a.blocks ? (
            <>
              {a.lead && <p className="prose-ja mt-6 leading-[1.9]">{a.lead}</p>}
              <div className="mt-6">
                <Toc toc={toc} />
              </div>
              <div className="mt-4">
                <ArticleBody blocks={a.blocks} numbers={numbers} />
              </div>
            </>
          ) : (
            <p className="mt-8 rounded-2xl border border-dashed border-line bg-white p-8 text-center text-sub">この記事は準備中です。</p>
          )}

          {/* 評価ボタン：本文がある記事だけ。票は Cloudflare（functions/api/rate.js → D1）に数だけ残る */}
          {a.blocks && <RatingButtons slug={a.slug} />}

          <div className="mt-8 space-y-6 md:hidden">{sideCards}</div>

          {/* 出典は記事データ（sources）に持つだけで、読む人には見せない（ユーザーの指示） */}
          {a.origin && <p className="mt-10 text-xs text-sub">この記事は Ryugaku Wiki「{a.origin}」をもとに作成しています。</p>}

          <section aria-labelledby="report-h" className="mt-5 flex flex-wrap items-center gap-4 rounded-2xl border border-slate-100 bg-white p-5 shadow-sm">
            <span className="grid h-10 w-10 place-items-center rounded-full bg-amber-soft text-amber-ink">
              <Flag size={18} aria-hidden="true" />
            </span>
            <div className="min-w-0 flex-1">
              <h2 id="report-h" className="font-bold">
                記事の誤りを報告する
              </h2>
              <p className="text-sm text-sub">内容の誤りや古くなった情報に気づいたら、教えてください。確認して修正します。</p>
            </div>
            <a href={reportHref} data-article={a.title} className="inline-flex min-h-11 items-center gap-1.5 rounded-full border border-navy px-5 text-sm font-medium text-navy hover:bg-navy hover:text-white">
              報告する <ArrowRight size={15} aria-hidden="true" />
            </a>
          </section>

          <nav aria-label="前の記事と次の記事" className="mt-8 grid gap-3 sm:grid-cols-2">
            <PrevNextCard a={prev} dir="prev" fallback={fallback} />
            <PrevNextCard a={next} dir="next" fallback={fallback} />
          </nav>

          <section aria-labelledby="rel-h" className="mt-12">
            <h2 id="rel-h" className="border-l-4 border-navy pl-3 text-xl font-bold">
              関連記事
            </h2>
            <div className="mt-5 grid gap-5 sm:grid-cols-3">
              {related.map((r) => (
                <ArticleCard key={r.slug} a={r} />
              ))}
            </div>
          </section>
        </article>

        <aside className="hidden space-y-6 md:sticky md:top-24 md:block md:self-start">
          {sideCards}
          {toc.length > 0 && (
            <div className="hidden md:block">
              <Toc toc={toc} />
            </div>
          )}
        </aside>
      </div>
    </div>
  );
}
