import type { Article } from "@/data/types";
import { articleUrl, dateOrPlaceholder, getCategory } from "@/lib/content";
import { Photo } from "./Photo";

export const labelColor: Record<string, string> = {
  bosscari: "bg-amber-soft text-amber-ink",
  timeline: "bg-emerald-50 text-emerald-800",
  jobs: "bg-sky-ink-50 text-sky-ink-800",
  selection: "bg-navy text-white",
};

export function CategoryLabel({ category }: { category: string }) {
  const c = getCategory(category);
  return <span className={`w-fit self-start rounded-full px-2.5 py-0.5 text-xs font-bold ${labelColor[category]}`}>{c?.name}</span>;
}

/** トップページ・関連記事などで使う記事カード */
export function ArticleCard({ a }: { a: Article }) {
  return (
    <a
      href={articleUrl(a)}
      className="group flex flex-col overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
    >
      <div className="aspect-video">
        <Photo id={a.slug} category={a.category} rounded="rounded-none" />
      </div>
      <div className="flex flex-1 flex-col gap-2 p-5">
        <CategoryLabel category={a.category} />
        <p className="text-base font-bold leading-snug tracking-tight group-hover:text-navy">{a.title}</p>
        <p className="mt-auto pt-2 text-xs text-sub">最終確認日：{dateOrPlaceholder(a.lastChecked)}</p>
      </div>
    </a>
  );
}
