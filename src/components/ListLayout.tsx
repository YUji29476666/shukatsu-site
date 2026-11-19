import { ChevronRight, Search } from "lucide-react";
import { site } from "@/data/site";
import type { Article } from "@/data/types";
import { articleUrl, browseItems, dateOrPlaceholder, getCategory, sectionOf } from "@/lib/content";
import { Photo } from "./Photo";
import { SectionIcon } from "./SectionIcon";

// カテゴリの記事一覧ページ（トップと記事ページの間のページ）の共通の枠。ユーザーの見本（PORTキャリアの構成）のとおり
// 上：薄い帯にパンくず ／ 左：丸いアイコン・「〇〇の記事一覧」・記事数・記事の一覧 ／ 右：検索・Category（今いるカテゴリに印）
export function ListLayout({
  crumbs,
  title,
  count,
  icon,
  current,
  children,
}: {
  crumbs: { name: string; href?: string }[];
  title: string;
  count: number;
  icon?: React.ReactNode;
  current?: string; // サイドバーの Category で印をつける項目（browseItems の id）
  children: React.ReactNode;
}) {
  return (
    <div>
      <div className="border-b border-line bg-sky-soft">
        <nav aria-label="パンくずリスト" className="mx-auto max-w-6xl px-5 py-3 text-xs text-sub">
          <ol className="flex flex-wrap items-center gap-1.5">
            <li>
              <a href="/ja/" className="underline underline-offset-2 hover:text-navy">
                ホーム
              </a>
            </li>
            {crumbs.map((it, i) => (
              <li key={i} className="flex items-center gap-1.5">
                <ChevronRight size={12} aria-hidden="true" />
                {it.href ? (
                  <a href={it.href} className="underline underline-offset-2 hover:text-navy">
                    {it.name}
                  </a>
                ) : (
                  <span aria-current="page" className="font-bold text-navy">
                    {it.name}
                  </span>
                )}
              </li>
            ))}
          </ol>
        </nav>
      </div>
      <div className="mx-auto grid max-w-6xl gap-12 px-5 pb-20 pt-10 md:grid-cols-[minmax(0,1fr)_260px] lg:grid-cols-[minmax(0,1fr)_300px] lg:gap-16">
        <div className="min-w-0">
          <header className="flex items-center gap-5 border-b border-line pb-8">
            {icon && <span className="grid h-16 w-16 shrink-0 place-items-center rounded-full bg-sky text-white md:h-20 md:w-20">{icon}</span>}
            <div>
              <h1 className="text-2xl font-bold tracking-tight md:text-3xl">{title}</h1>
              <p className="mt-1 text-sm text-sub">{count}記事</p>
            </div>
          </header>
          {children}
        </div>
        <ListSidebar current={current} />
      </div>
    </div>
  );
}

/** 記事一覧：左に写真、右にカテゴリ名（オレンジの小さな文字）・タイトル・最終確認日 */
export function ArticleRows({ items }: { items: Article[] }) {
  return (
    <ul className="divide-y divide-line border-b border-line">
      {items.map((a) => {
        const s = sectionOf(a);
        const c = getCategory(a.category)!;
        const label = c.sectionPages && s ? s.name : c.shortName ?? c.name;
        return (
          <li key={a.slug}>
            <a href={articleUrl(a)} className="group flex items-center gap-4 py-6 md:gap-8 md:py-8">
              <div className="aspect-[16/10] w-32 shrink-0 overflow-hidden rounded-lg md:w-60 lg:w-72">
                <Photo id={a.slug} category={a.category} rounded="rounded-lg" small className="transition duration-300 group-hover:scale-[1.03]" />
              </div>
              <div className="min-w-0">
                <p className="text-xs font-bold text-sky-ink">{label}</p>
                <p className="mt-1.5 text-base font-bold leading-snug group-hover:text-navy md:text-xl">{a.title}</p>
                <p className="mt-2 text-xs text-sub">最終確認日：{dateOrPlaceholder(a.lastChecked)}</p>
              </div>
            </a>
          </li>
        );
      })}
    </ul>
  );
}

function ListSidebar({ current }: { current?: string }) {
  return (
    <aside className="md:sticky md:top-24 md:self-start">
      <form action="/ja/search/" method="get" role="search" className="flex items-center rounded-full border border-line bg-white pl-5 pr-2 shadow-sm focus-within:border-navy">
        <label htmlFor="list-q" className="sr-only">
          キーワードで探す
        </label>
        <input id="list-q" name="q" placeholder={site.searchPlaceholder} className="min-h-12 w-full min-w-0 bg-transparent text-sm outline-none placeholder:text-slate-400" />
        <button type="submit" aria-label="検索" className="grid h-10 w-10 shrink-0 place-items-center rounded-full text-sub hover:text-navy">
          <Search size={18} aria-hidden="true" />
        </button>
      </form>
      <nav aria-labelledby="side-cats" className="mt-10">
        <h2 id="side-cats" className="flex flex-wrap items-baseline gap-x-2">
          <span className="text-xl font-bold tracking-tight" lang="en">
            Category
          </span>
          <span className="text-xs text-sub">カテゴリーから探す</span>
        </h2>
        <ul className="mt-4 grid grid-cols-2 gap-x-5">
          {browseItems(false).map((it) => {
            const on = it.id === current;
            return (
              <li key={it.id} className={on ? "border-b-2 border-sky" : "border-b border-line"}>
                <a href={it.href} aria-current={on ? "page" : undefined} className={`flex min-h-12 items-center gap-2 text-sm hover:text-sky-ink ${on ? "font-bold text-navy" : ""}`}>
                  <SectionIcon name={it.icon} size={16} className="shrink-0 text-sky" />
                  {it.name}
                </a>
              </li>
            );
          })}
        </ul>
      </nav>
    </aside>
  );
}
