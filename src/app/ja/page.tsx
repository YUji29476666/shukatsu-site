import { CategoryTabs } from "@/components/CategoryTabs";
import { EventSection } from "@/components/EventSection";
import { Hero } from "@/components/Hero";
import { ArticleCard } from "@/components/ArticleCard";
import { popularArticles } from "@/lib/content";

export default function Home() {
  return (
    <>
      <Hero />
      <CategoryTabs />
      <div className="border-y border-line bg-white">
        <EventSection />
      </div>
      <section aria-labelledby="pop-h" className="mx-auto max-w-6xl px-5 py-16">
        <h2 id="pop-h" className="text-2xl font-bold tracking-tight">
          よく読まれている記事
        </h2>
        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {popularArticles(6).map((a) => (
            <ArticleCard key={a.slug} a={a} />
          ))}
        </div>
      </section>
    </>
  );
}
