import { Menu, Search } from "lucide-react";
import { categories } from "@/data/categories";
import { site } from "@/data/site";
import { categoryUrl } from "@/lib/content";

export function Header() {
  return (
    <header className="sticky top-0 z-40 border-b border-line bg-white/95 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-6xl items-center gap-6 px-5">
        <a href="/ja/" className="text-lg font-bold tracking-tight text-navy">
          {site.name}
        </a>
        <nav aria-label="カテゴリ" className="mx-auto hidden md:block">
          <ul className="flex gap-8 text-sm font-medium text-ink">
            {categories.map((c) => (
              <li key={c.id}>
                <a href={categoryUrl(c.id)} className="hover:text-orange">
                  {c.name}
                </a>
              </li>
            ))}
          </ul>
        </nav>
        <div className="ml-auto flex items-center gap-1 sm:gap-3 md:ml-0">
          <a href="#" aria-label="サイト内を検索" className="grid h-11 w-11 place-items-center rounded-full text-ink hover:bg-page">
            <Search size={20} aria-hidden="true" />
          </a>
          <div className="flex shrink-0 whitespace-nowrap rounded-full border border-line p-0.5 text-xs">
            <a href="/ja/" aria-current="page" className="rounded-full bg-navy px-2.5 py-1.5 sm:px-3 font-medium text-white">
              日本語
            </a>
            <a href="#" lang="en" className="rounded-full px-2.5 py-1.5 text-sub sm:px-3 hover:text-navy">
              English
            </a>
          </div>
          <details className="relative md:hidden">
            <summary aria-label="メニュー" className="grid h-11 w-11 cursor-pointer place-items-center rounded-full hover:bg-page">
              <Menu size={22} aria-hidden="true" />
            </summary>
            <nav aria-label="カテゴリ（スマホ）" className="absolute right-0 mt-2 w-56 rounded-2xl border border-line bg-white p-2 shadow-lg">
              {categories.map((c) => (
                <a key={c.id} href={categoryUrl(c.id)} className="block rounded-xl px-4 py-3 text-sm hover:bg-page">
                  {c.name}
                </a>
              ))}
            </nav>
          </details>
        </div>
      </div>
    </header>
  );
}
