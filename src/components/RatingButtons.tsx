"use client";

import { useEffect, useState } from "react";
import { ThumbsDown, ThumbsUp } from "lucide-react";

// 記事の評価ボタン。押すと /api/rate（Cloudflare Pages Functions）に「役に立った／役に立たなかった」を送る。
// 同じ人が同じ記事で何度も押さないよう、押したことをこのブラウザにだけ覚えておく（個人情報は送らない）
type State = "idle" | "sending" | "done" | "error";

export function RatingButtons({ slug }: { slug: string }) {
  const [state, setState] = useState<State>("idle");
  const key = `rated:${slug}`;

  useEffect(() => {
    try {
      if (localStorage.getItem(key)) setState("done");
    } catch {
      // ブラウザの保存が使えなくても、ボタンはそのまま使える
    }
  }, [key]);

  async function send(value: "up" | "down") {
    setState("sending");
    try {
      const res = await fetch("/api/rate", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ slug, value }),
      });
      if (!res.ok) throw new Error(String(res.status));
      try {
        localStorage.setItem(key, value);
      } catch {}
      setState("done");
    } catch {
      setState("error");
    }
  }

  return (
    <section aria-label="記事の評価" className="mt-10 rounded-2xl border border-slate-100 bg-white p-5 text-center shadow-sm">
      {state === "done" ? (
        <p className="text-sm font-bold text-navy" role="status">
          ご協力ありがとうございました
        </p>
      ) : (
        <>
          <p className="text-sm font-bold">この記事は役に立ちましたか？</p>
          <div className="mt-3 flex justify-center gap-3">
            <button
              type="button"
              disabled={state === "sending"}
              onClick={() => send("up")}
              className="inline-flex min-h-11 items-center gap-2 rounded-full border border-navy px-5 text-sm font-medium text-navy hover:bg-navy hover:text-white disabled:opacity-50"
            >
              <ThumbsUp size={16} aria-hidden="true" /> 役に立った
            </button>
            <button
              type="button"
              disabled={state === "sending"}
              onClick={() => send("down")}
              className="inline-flex min-h-11 items-center gap-2 rounded-full border border-line px-5 text-sm font-medium text-sub hover:border-navy hover:text-navy disabled:opacity-50"
            >
              <ThumbsDown size={16} aria-hidden="true" /> 役に立たなかった
            </button>
          </div>
          {state === "error" && (
            <p className="mt-3 text-xs text-sub" role="status">
              送信できませんでした。時間をおいてもう一度お試しください。
            </p>
          )}
        </>
      )}
    </section>
  );
}
