"use client";

import { ArrowRight, Search } from "lucide-react";
import { photos, site } from "@/data/site";

export function Hero() {
  return (
    <section className="relative isolate overflow-hidden bg-navy-soft">
      {/* 写真（仮）：Unsplash の写真が入るまでは紺の地。写真が入ったら暗めの重ねを残して文字を読みやすくする */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={photos.hero.src} alt="" className="absolute inset-0 -z-20 h-full w-full object-cover" />
      <div className="absolute inset-0 -z-10 bg-[#1b2f48]/60" aria-hidden="true" />
      <div className="mx-auto max-w-4xl px-5 py-24 text-center md:py-32">
        <h1 className="text-3xl font-bold tracking-tight text-white md:text-4xl">{site.catch}</h1>
        <p className="mt-4 text-sm text-white/85 md:text-base">{site.lead}</p>
        <form onSubmit={(e) => e.preventDefault()} role="search" className="mx-auto mt-8 flex max-w-2xl items-center gap-2 rounded-2xl bg-white p-2 shadow-lg">
          <label htmlFor="hero-q" className="sr-only">
            キーワードで探す
          </label>
          <Search size={20} className="ml-3 shrink-0 text-sub" aria-hidden="true" />
          <input id="hero-q" name="q" placeholder={site.searchPlaceholder} className="min-h-12 w-full bg-transparent text-base outline-none placeholder:text-slate-400" />
          <button type="button" className="min-h-12 shrink-0 rounded-xl bg-navy px-6 font-bold text-white hover:bg-navy-soft">検索</button>
        </form>
        <div className="mt-5 flex flex-wrap items-center justify-center gap-2">
          <span className="text-sm text-white/80">よく検索されるキーワード：</span>
          {site.keywords.map((k) => (
            <button key={k} type="button" className="rounded-full bg-white px-3.5 py-1 text-sm text-ink hover:bg-amber-soft">
              {k}
            </button>
          ))}
        </div>
        <a href="#" className="mt-6 inline-flex items-center gap-1.5 rounded-full border border-white/70 px-4 py-1.5 text-sm text-white hover:bg-white/10">
          初めての方へ <ArrowRight size={15} aria-hidden="true" />
        </a>
      </div>
    </section>
  );
}
