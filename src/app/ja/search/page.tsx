import type { Metadata } from "next";
import { Search } from "lucide-react";
import { SearchResults, type SearchItem } from "@/components/SearchResults";
import { site } from "@/data/site";
import { allArticles, articleUrl, getCategory, searchText } from "@/lib/content";

export const metadata: Metadata = { title: "検索結果" };

// 検索結果のページ（/ja/search/?q=キーワード）
export default function SearchPage() {
  const items: SearchItem[] = allArticles().map((a) => ({
    slug: a.slug,
    title: a.title,
    url: articleUrl(a),
    category: a.category,
    categoryName: getCategory(a.category)?.name ?? "",
    lastChecked: a.lastChecked,
    text: searchText(a),
  }));
  return (
    <div className="mx-auto max-w-4xl px-5 py-12">
      <h1 className="text-2xl font-bold tracking-tight">サイト内を検索</h1>
      <form action="/ja/search/" method="get" role="search" className="mt-6 flex items-center gap-2 rounded-2xl border border-line bg-white p-2 shadow-sm">
        <label htmlFor="search-q" className="sr-only">
          キーワードで探す
        </label>
        <Search size={20} className="ml-3 shrink-0 text-sub" aria-hidden="true" />
        <input id="search-q" name="q" placeholder={site.searchPlaceholder} className="min-h-12 w-full bg-transparent text-base outline-none placeholder:text-slate-400" />
        <button type="submit" className="min-h-12 shrink-0 rounded-xl bg-navy px-6 font-bold text-white hover:bg-navy-soft">
          検索
        </button>
      </form>
      <div className="mt-4 flex flex-wrap items-center gap-2">
        <span className="text-sm text-sub">よく検索されるキーワード：</span>
        {site.keywords.map((k) => (
          <a key={k} href={`/ja/search/?q=${encodeURIComponent(k)}`} className="rounded-full border border-line bg-white px-3.5 py-1 text-sm text-ink hover:border-navy">
            {k}
          </a>
        ))}
      </div>
      <SearchResults items={items} />
    </div>
  );
}
