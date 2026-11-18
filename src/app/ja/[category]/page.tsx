import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ChevronRight } from "lucide-react";
import { ArticleRows, ListLayout } from "@/components/ListLayout";
import { SectionIcon } from "@/components/SectionIcon";
import { categories } from "@/data/categories";
import { getCategory, mustArticle, sectionUrl } from "@/lib/content";

// カテゴリページ（/ja/{カテゴリ}/）
// - sectionPages のカテゴリ（応募・面接）：分け方の一覧（アイコン・名前・記事数）。押すと分け方ごとの記事一覧ページへ
// - ほか：記事の一覧（分け方が2つ以上なら、分け方ごとの見出しをつける）
export const dynamicParams = false;
export function generateStaticParams() {
  return categories.map((c) => ({ category: c.id }));
}

type Params = Promise<{ category: string }>;

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  return { title: getCategory((await params).category)?.name };
}

export default async function CategoryPage({ params }: { params: Params }) {
  const c = getCategory((await params).category);
  if (!c) notFound();
  const total = c.sections.reduce((n, s) => n + s.articles.length, 0);

  if (!c.sectionPages) {
    const many = c.sections.length > 1;
    return (
      <ListLayout crumbs={[{ name: c.shortName ?? c.name }]} title={`${c.shortName ?? c.name}の記事一覧`} count={total} current={c.id} icon={<SectionIcon name={c.icon} size={30} />}>
        {c.sections.map((s) => (
          <section key={s.id} id={s.id} aria-label={s.name} className="scroll-mt-24">
            {many && (
              <h2 className="mt-10 flex items-center gap-2 text-lg font-bold">
                <SectionIcon name={s.icon} size={20} className="text-sky" />
                {s.name}
              </h2>
            )}
            <ArticleRows items={s.articles.map(mustArticle)} />
          </section>
        ))}
      </ListLayout>
    );
  }

  return (
    <ListLayout crumbs={[{ name: c.name }]} title={c.name} count={total} icon={<SectionIcon name={c.icon} size={30} />}>
      <ul className="mt-2 grid md:grid-cols-2 md:gap-x-10">
        {c.sections.map((s) => (
          <li key={s.id} className="border-b border-line">
            <a href={sectionUrl(c, s)} className="group flex min-h-20 items-center gap-4">
              <SectionIcon name={s.icon} size={26} className="shrink-0 text-sky" />
              <span className="min-w-0 flex-1">
                <span className="block font-bold group-hover:text-navy">{s.name}</span>
                <span className="text-xs text-sub">{s.articles.length}記事</span>
              </span>
              <ChevronRight size={18} className="shrink-0 text-sub transition group-hover:translate-x-0.5" aria-hidden="true" />
            </a>
          </li>
        ))}
      </ul>
    </ListLayout>
  );
}
