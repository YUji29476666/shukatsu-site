"use client";

import { useEffect, useRef, useState } from "react";
import { ArrowRight, Flag } from "lucide-react";
import { site } from "@/data/site";

// 記事の誤りを報告する枠。「報告する」で入力欄が開き、その場で送れる。
// 送ると /api/report（Cloudflare Pages Functions）が Turnstile で確かめてから D1 に保存し、報告用の非公開リポジトリに Issue を立てる。
// 連絡先・名前は聞かない（ユーザーと決めた）。Turnstile のスクリプトは、入力欄を開いたときだけ読み込む。

type TurnstileApi = {
  render: (el: HTMLElement, opts: { sitekey: string; callback: (t: string) => void; "expired-callback": () => void; language?: string }) => string;
  reset: (id?: string) => void;
};
declare global {
  interface Window {
    turnstile?: TurnstileApi;
  }
}

const SCRIPT = "https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit";

function loadTurnstile(): Promise<TurnstileApi> {
  if (window.turnstile) return Promise.resolve(window.turnstile);
  return new Promise((resolve, reject) => {
    const s = document.createElement("script");
    s.src = SCRIPT;
    s.async = true;
    s.onload = () => (window.turnstile ? resolve(window.turnstile) : reject(new Error("turnstile")));
    s.onerror = () => reject(new Error("turnstile"));
    document.head.appendChild(s);
  });
}

type State = "closed" | "open" | "sending" | "done" | "error";

export function ReportBox({ slug, title, path }: { slug: string; title: string; path: string }) {
  const [state, setState] = useState<State>("closed");
  const [body, setBody] = useState("");
  const [token, setToken] = useState("");
  const [message, setMessage] = useState("");
  const widget = useRef<HTMLDivElement>(null);
  const widgetId = useRef<string | null>(null);
  const ready = Boolean(site.turnstileSiteKey);

  useEffect(() => {
    if (state !== "open" || !ready || widgetId.current || !widget.current) return;
    loadTurnstile()
      .then((t) => {
        if (!widget.current || widgetId.current) return;
        widgetId.current = t.render(widget.current, {
          sitekey: site.turnstileSiteKey,
          callback: setToken,
          "expired-callback": () => setToken(""),
          language: "ja",
        });
      })
      .catch(() => setMessage("確認の仕組みを読み込めませんでした。時間をおいてもう一度お試しください。"));
  }, [state, ready]);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!body.trim()) {
      setMessage("報告の内容を書いてください。");
      return;
    }
    if (!token) {
      setMessage("送信の前に、確認が終わるまでお待ちください。");
      return;
    }
    setState("sending");
    setMessage("");
    try {
      const res = await fetch("/api/report", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ slug, title, path, body, token }),
      });
      if (!res.ok) throw new Error(String(res.status));
      setState("done");
    } catch {
      setState("error");
      setToken("");
      if (widgetId.current) window.turnstile?.reset(widgetId.current);
    }
  }

  return (
    <section aria-labelledby="report-h" className="mt-5 rounded-2xl border border-slate-100 bg-white p-5 shadow-sm">
      <div className="flex flex-wrap items-center gap-4">
        <span className="grid h-10 w-10 place-items-center rounded-full bg-amber-soft text-amber-ink">
          <Flag size={18} aria-hidden="true" />
        </span>
        <div className="min-w-0 flex-1">
          <h2 id="report-h" className="font-bold">
            記事の誤りを報告する
          </h2>
          <p className="text-sm text-sub">内容の誤りや古くなった情報に気づいたら、教えてください。確認して修正します。</p>
        </div>
        {state === "closed" && (
          <button
            type="button"
            onClick={() => setState("open")}
            aria-expanded={false}
            aria-controls="report-form"
            className="inline-flex min-h-11 items-center gap-1.5 rounded-full border border-navy px-5 text-sm font-medium text-navy hover:bg-navy hover:text-white"
          >
            報告する <ArrowRight size={15} aria-hidden="true" />
          </button>
        )}
      </div>

      {state === "done" && (
        <p className="mt-4 rounded-xl bg-sky-soft px-4 py-3 text-sm font-bold text-navy" role="status">
          ありがとうございます。確認して修正します。
        </p>
      )}

      {(state === "open" || state === "sending" || state === "error") &&
        (ready ? (
          <form id="report-form" onSubmit={submit} className="mt-5 space-y-4 border-t border-line pt-5">
            <div>
              <label htmlFor="report-body" className="text-sm font-bold">
                どこが違いますか？<span className="ml-1 text-xs font-normal text-sub">（必須・1,000字まで）</span>
              </label>
              <textarea
                id="report-body"
                required
                maxLength={1000}
                rows={5}
                value={body}
                onChange={(e) => setBody(e.target.value)}
                className="mt-2 w-full rounded-xl border border-line bg-white p-3 text-sm"
              />
              <p className="mt-1 text-right text-xs text-sub tabular-nums">{body.length} / 1000</p>
            </div>
            <div ref={widget} />
            <div className="flex flex-wrap items-center gap-3">
              <button
                type="submit"
                disabled={state === "sending"}
                className="inline-flex min-h-11 items-center rounded-full bg-navy px-6 text-sm font-bold text-white hover:bg-navy-soft disabled:opacity-50"
              >
                {state === "sending" ? "送信中…" : "送信する"}
              </button>
              <button type="button" onClick={() => setState("closed")} className="min-h-11 px-3 text-sm text-sub hover:text-navy">
                閉じる
              </button>
            </div>
            <p className="text-sm text-sub" role="status">
              {state === "error" ? "送信できませんでした。時間をおいてもう一度お試しください。" : message}
            </p>
          </form>
        ) : (
          <p className="mt-4 border-t border-line pt-4 text-sm text-sub" role="status">
            報告フォームは準備中です。
          </p>
        ))}
    </section>
  );
}
