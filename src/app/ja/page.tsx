import { CategoryGrid } from "@/components/CategoryGrid";
import { Hero } from "@/components/Hero";
import { Photo } from "@/components/Photo";
import { popularSlots } from "@/data/site";

export default function Home() {
  return (
    <>
      <Hero />
      <CategoryGrid />
      <section aria-labelledby="pop-h" className="mx-auto max-w-6xl px-5 py-16">
        <h2 id="pop-h" className="text-2xl font-bold tracking-tight">
          よく読まれている記事
        </h2>
        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: popularSlots }, (_, i) => (
            <a
              key={i}
              href="#"
              className="group flex flex-col overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
            >
              <div className="aspect-video">
                <Photo id={`popular-${i + 1}`} rounded="rounded-none" />
              </div>
              <div className="flex flex-1 flex-col gap-2 p-5">
                <span className="w-fit rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-bold text-sub">［カテゴリ］</span>
                <p className="text-base font-bold leading-snug tracking-tight">［後で記入］</p>
                <p className="mt-auto pt-2 text-xs text-sub">最終確認日：［日付］</p>
              </div>
            </a>
          ))}
        </div>
      </section>
    </>
  );
}
