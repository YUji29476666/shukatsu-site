"use client";

import { useEffect, useState } from "react";
import type { CategoryId } from "@/data/types";
import { labelColor } from "./ArticleCard";
import { Photo } from "./Photo";

export type SearchItem = {
  slug: string;
  title: string;
  url: string;
  category: CategoryId;
  categoryName: string;
  lastChecked: string;
  text: string; // 検索の対象になる文字列
};

const norm = (s: string) => s.normalize("NFKC").toLowerCase();

// 検索結果。静的サイトなので、URL の ?q= を読み込み後に読み、全記事の中から合うものを表示する
export function SearchResults({ items }: { items: SearchItem[] }) {
  const [q, setQ] = useState<string | null>(null);

  useEffect(() => {
    const value = new URLSearchParams(window.location.search).get("q") ?? "";
    setQ(value);
    const input = document.getElementById("search-q") as HTMLInputElement | null;
    if (input && !input.value) input.value = value;
  }, []);

  if (q === null) return null; // 読み込み中

  const words = norm(q).split(/\s+/).filter(Boolean);
  if (words.length === 0) {
    return <p className="mt-10 text-sm text-sub">キーワードを入れて「検索」を押してください。</p>;
  }

  const hits = items.filter((it) => {
    const t = norm(it.text);
    return words.every((w) => t.includes(w));
  });

  return (
    <>
      <p aria-live="polite" className="mt-10 text-sm font-bold">
        「{q}」の検索結果：{hits.length}件
      </p>
      {hits.length === 0 ? (
        <p className="mt-4 rounded-2xl bg-white p-6 text-sm text-sub">見つかりませんでした。ほかのキーワードで探してみてください。</p>
      ) : (
        <ul className="mt-4 space-y-3">
          {hits.map((a) => (
            <li key={a.slug}>
              <a href={a.url} className="group flex items-center gap-4 rounded-2xl border border-slate-100 bg-white p-3 shadow-sm hover:shadow-md md:gap-6">
                <div className="aspect-[4/3] w-24 shrink-0 md:w-32">
                  <Photo id={a.slug} category={a.category} rounded="rounded-lg" small />
                </div>
                <div className="min-w-0">
                  <span className={`rounded px-2 py-0.5 text-[11px] font-bold ${labelColor[a.category]}`}>{a.categoryName}</span>
                  <p className="mt-1.5 text-base font-bold leading-snug group-hover:text-navy">{a.title}</p>
                  <p className="mt-1 text-xs text-sub">最終確認日：{a.lastChecked || "［日付］"}</p>
                </div>
              </a>
            </li>
          ))}
        </ul>
      )}
    </>
  );
}
