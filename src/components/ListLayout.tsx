import { ChevronRight, Search } from "lucide-react";
import { categories } from "@/data/categories";
import { site } from "@/data/site";
import type { Article } from "@/data/types";
import { articleUrl, categoryUrl, dateOrPlaceholder, getCategory, sectionOf, sectionUrl } from "@/lib/content";
import { Breadcrumb } from "./Breadcrumb";
import { Photo } from "./Photo";
import { SectionIcon } from "./SectionIcon";
import { labelColor } from "./ArticleCard";

// カテゴリページ・記事一覧ページの共通の枠：パンくず、見出し、左の中身、右のサイドバー（検索・カテゴリー一覧）
export function ListLayout({
  crumbs,
  title,
  count,
  icon,
  children,
}: {
  crumbs: { name: string; href?: string }[];
  title: string;
  count: number;
  icon?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <div className="mx-auto max-w-6xl px-5 pb-16">
      <Breadcrumb items={crumbs} />
      <div className="grid gap-10 md:grid-cols-[minmax(0,1fr)_260px] lg:grid-cols-[minmax(0,1fr)_300px]">
        <div className="min-w-0">
          <header className="flex items-center gap-4 border-b border-line pb-6 pt-2">
            {icon && <span className="grid h-14 w-14 shrink-0 place-items-center rounded-full bg-navy text-white md:h-16 md:w-16">{icon}</span>}
            <div>
              <h1 className="text-2xl font-bold tracking-tight md:text-3xl">{title}</h1>
              <p className="mt-1 text-sm text-sub">{count}記事</p>
            </div>
          </header>
          {children}
        </div>
        <ListSidebar />
      </div>
    </div>
  );
}

/** 記事一覧：写真・分け方のラベル・タイトル・最終確認日 */
export function ArticleRows({ items }: { items: Article[] }) {
  return (
    <ul className="divide-y divide-line">
      {items.map((a) => {
        const s = sectionOf(a);
        const c = getCategory(a.category)!;
        return (
          <li key={a.slug}>
            <a href={articleUrl(a)} className="group flex items-center gap-4 py-5 md:gap-6 md:py-6">
              <div className="aspect-video w-32 shrink-0 md:w-56">
                <Photo id={a.slug} category={a.category} rounded="rounded-xl" small />
              </div>
              <div className="min-w-0">
                <span className={`inline-block rounded-full px-2.5 py-0.5 text-[11px] font-bold ${labelColor[c.id]}`}>{c.sections.length > 1 && s ? s.name : c.name}</span>
                <p className="mt-2 text-base font-bold leading-snug group-hover:text-navy md:text-lg">{a.title}</p>
                <p className="mt-2 text-xs text-sub">最終確認日：{dateOrPlaceholder(a.lastChecked)}</p>
              </div>
            </a>
          </li>
        );
      })}
    </ul>
  );
}

function ListSidebar() {
  return (
    <aside className="space-y-8">
      <form action="/ja/search/" method="get" role="search" className="flex items-center gap-2 rounded-full border border-line bg-white py-1.5 pl-5 pr-1.5 shadow-sm">
        <label htmlFor="list-q" className="sr-only">
          キーワードで探す
        </label>
        <input id="list-q" name="q" placeholder={site.searchPlaceholder} className="min-h-10 w-full min-w-0 bg-transparent text-sm outline-none placeholder:text-slate-400" />
        <button type="submit" aria-label="検索" className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-navy text-white hover:bg-navy-soft">
          <Search size={18} aria-hidden="true" />
        </button>
      </form>
      <nav aria-labelledby="side-cats">
        <h2 id="side-cats" className="text-lg font-bold">
          カテゴリー一覧
        </h2>
        <div className="mt-3 space-y-5">
          {categories.map((c) => (
            <div key={c.id}>
              <a href={categoryUrl(c.id)} className="flex items-center justify-between border-b-2 border-navy pb-1.5 text-sm font-bold hover:text-orange">
                {c.name} <ChevronRight size={15} aria-hidden="true" />
              </a>
              {c.sectionPages && (
                <ul className="divide-y divide-line">
                  {c.sections.map((s) => (
                    <li key={s.id}>
                      <a href={sectionUrl(c, s)} className="flex min-h-11 items-center gap-3 text-sm hover:text-orange">
                        <SectionIcon name={s.icon} size={18} className="text-orange" />
                        {s.name}
                      </a>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          ))}
        </div>
      </nav>
    </aside>
  );
}
