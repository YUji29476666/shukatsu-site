import { ArrowUpRight } from "lucide-react";
import { events } from "@/data/site";
import { articleUrl, mustArticle } from "@/lib/content";

// イベント：グロキャリのイベントは外部ページへ、フォーラムはこのサイトの記事へ（日付は載せない）
export function EventSection() {
  const b = events.banner;
  const external = b.url.startsWith("http");
  return (
    <section aria-labelledby="ev-h" className="mx-auto max-w-6xl px-5 py-16">
      <h2 id="ev-h" className="text-2xl font-bold tracking-tight">
        イベント
      </h2>
      <div className="relative mt-8 overflow-hidden rounded-3xl bg-[#1d3653] px-7 py-10 text-white md:px-12 md:py-14">
        <p className="absolute bottom-3 right-4 text-[11px] text-white/50">写真（仮）</p>
        <span className="inline-block rounded-full bg-amber-soft px-3 py-0.5 text-xs font-bold text-amber-ink">{b.label}</span>
        <p className="mt-3 text-2xl font-bold tracking-tight md:text-3xl">{b.title}</p>
        <p className="mt-2 text-sm text-white/85">{b.text}</p>
        <a
          href={b.url}
          {...(external ? { target: "_blank", rel: "noopener" } : {})}
          className="mt-6 inline-flex min-h-11 items-center gap-2 rounded-full bg-white px-5 text-sm font-bold text-navy hover:bg-amber-soft"
        >
          {b.cta}
          <ArrowUpRight size={16} aria-hidden="true" />
          {external && <span className="sr-only">（外部サイトが新しいタブで開きます）</span>}
        </a>
      </div>
      <p className="mt-8 text-sm font-bold">キャリアフォーラムの情報</p>
      <ul className="mt-3 flex flex-wrap gap-2">
        {events.forums.map((f) => (
          <li key={f.slug}>
            <a href={articleUrl(mustArticle(f.slug))} className="inline-flex min-h-11 items-center rounded-full border border-line bg-white px-4 text-sm hover:border-navy hover:text-navy">
              {f.name}
            </a>
          </li>
        ))}
      </ul>
    </section>
  );
}
