import { ChevronRight } from "lucide-react";
import { browseItems } from "@/lib/content";
import { SectionIcon } from "./SectionIcon";

// トップの「カテゴリから探す」：アイコン・名前・矢印を3列で並べる（ユーザーの Stitch の画像のとおり）
// 並ぶのは5つ：ボスキャリ／就活タイムライン／求人・就職情報／応募準備／質問対策（src/lib/content.ts の browseItems）
export function CategoryGrid() {
  return (
    <section aria-labelledby="cat-h" className="mx-auto max-w-6xl px-5 py-14 md:py-16">
      <h2 id="cat-h" className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
        <span className="text-3xl font-bold tracking-tight" lang="en">
          Category
        </span>
        <span className="text-xs text-sub">カテゴリーから探す</span>
      </h2>
      <ul className="mt-8 grid sm:grid-cols-2 sm:gap-x-8 lg:grid-cols-3 lg:gap-x-10">
        {browseItems().map((it) => (
          <li key={it.href} className="border-b border-line">
            <a href={it.href} className="group flex min-h-14 items-center gap-3">
              <SectionIcon name={it.icon} size={20} className="shrink-0 text-navy" />
              <span className="min-w-0 flex-1 text-sm group-hover:text-orange">{it.name}</span>
              <ChevronRight size={15} className="shrink-0 text-sub transition group-hover:translate-x-0.5" aria-hidden="true" />
            </a>
          </li>
        ))}
      </ul>
    </section>
  );
}
