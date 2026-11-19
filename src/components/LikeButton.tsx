"use client";

import { useEffect, useState } from "react";
import { Heart } from "lucide-react";

// 記事のいいね（♡）。押すと /api/like（Cloudflare Pages Functions → D1）に送る。もう一度押すと取り消せる。
// 同じブラウザからは記事ごとに1件まで。ブラウザごとのランダムな匿名ID を localStorage に持つ（個人情報・Cookie は使わない）
const VISITOR_KEY = "visitor-id";

function visitorId(): string | null {
  try {
    let id = localStorage.getItem(VISITOR_KEY);
    if (!id) {
      id = crypto.randomUUID();
      localStorage.setItem(VISITOR_KEY, id);
    }
    return id;
  } catch {
    return null; // ブラウザの保存が使えないときは、いいねできない
  }
}

export function LikeButton({ slug }: { slug: string }) {
  const [count, setCount] = useState<number | null>(null);
  const [liked, setLiked] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState(false);

  useEffect(() => {
    const visitor = visitorId();
    const q = new URLSearchParams({ slug, ...(visitor ? { visitor } : {}) });
    fetch(`/api/like?${q}`)
      .then((r) => (r.ok ? r.json() : Promise.reject(r.status)))
      .then((d: { count: number; liked: boolean }) => {
        setCount(d.count);
        setLiked(d.liked);
      })
      .catch(() => setCount(null)); // 数を読めないときは、数を出さずにボタンだけ出す
  }, [slug]);

  async function toggle() {
    const visitor = visitorId();
    if (!visitor) {
      setError(true);
      return;
    }
    const next = !liked;
    setBusy(true);
    setError(false);
    try {
      const res = await fetch("/api/like", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ slug, visitor, liked: next }),
      });
      if (!res.ok) throw new Error(String(res.status));
      const d: { count: number; liked: boolean } = await res.json();
      setCount(d.count);
      setLiked(d.liked);
    } catch {
      setError(true);
    } finally {
      setBusy(false);
    }
  }

  return (
    <section aria-label="いいね" className="mt-10 rounded-2xl border border-slate-100 bg-white p-5 text-center shadow-sm">
      <p className="text-sm font-bold">この記事が役に立ったら、いいねを押してください</p>
      <div className="mt-3 flex justify-center">
        <button
          type="button"
          onClick={toggle}
          disabled={busy}
          aria-pressed={liked}
          aria-label={liked ? "いいねを取り消す" : "いいねする"}
          className={`inline-flex min-h-11 items-center gap-2 rounded-full border px-5 text-sm font-medium transition disabled:opacity-50 ${
            liked ? "border-rose-600 bg-rose-50 text-rose-700" : "border-navy text-navy hover:bg-navy hover:text-white"
          }`}
        >
          <Heart size={18} aria-hidden="true" fill={liked ? "currentColor" : "none"} />
          <span>{liked ? "いいね済み" : "いいね"}</span>
          {count !== null && <span className="tabular-nums">{count}</span>}
        </button>
      </div>
      <p className="mt-3 min-h-4 text-xs text-sub" role="status">
        {error ? "送信できませんでした。時間をおいてもう一度お試しください。" : liked ? "ありがとうございます。もう一度押すと取り消せます。" : ""}
      </p>
    </section>
  );
}
