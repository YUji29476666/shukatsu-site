import { CheckCircle2, ListOrdered, Quote, XCircle } from "lucide-react";
import type { Block } from "@/data/types";

export type TocItem = { id: string; label: string; level: 2 | 3 };

/** 見出しに番号（1｜、2-1｜）を振り、目次を作る */
export function buildToc(blocks: Block[]): { toc: TocItem[]; numbers: Record<string, string> } {
  const toc: TocItem[] = [];
  const numbers: Record<string, string> = {};
  let h2 = 0;
  let h3 = 0;
  for (const b of blocks) {
    if (b.type === "h2") {
      h2 += 1;
      h3 = 0;
      numbers[b.id] = `${h2}`;
      toc.push({ id: b.id, label: `${h2}｜${b.text}`, level: 2 });
    } else if (b.type === "h3") {
      h3 += 1;
      numbers[b.id] = `${h2}-${h3}`;
      toc.push({ id: b.id, label: `${h2}-${h3}｜${b.text}`, level: 3 });
    }
  }
  return { toc, numbers };
}

export function Toc({ toc, open = true }: { toc: TocItem[]; open?: boolean }) {
  return (
    <details open={open} className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm">
      <summary className="flex cursor-pointer items-center gap-2 font-bold">
        <ListOrdered size={18} aria-hidden="true" /> 目次
      </summary>
      <ol className="mt-3 space-y-1.5 text-sm">
        {toc.map((t) => (
          <li key={t.id} className={t.level === 3 ? "pl-5 text-xs text-sub" : ""}>
            <a href={`#${t.id}`} className="hover:text-orange">
              {t.label}
            </a>
          </li>
        ))}
      </ol>
    </details>
  );
}

export function ArticleBody({ blocks, numbers }: { blocks: Block[]; numbers: Record<string, string> }) {
  return (
    <div className="space-y-5">
      {blocks.map((b, i) => {
        switch (b.type) {
          case "h2":
            return (
              <h2 key={i} id={b.id} className="scroll-mt-24 border-l-4 border-navy pl-3 pt-6 text-xl font-bold tracking-tight">
                {numbers[b.id]}｜{b.text}
              </h2>
            );
          case "h3":
            return (
              <h3 key={i} id={b.id} className="scroll-mt-24 pt-2 text-base font-bold">
                {numbers[b.id]}｜{b.text}
              </h3>
            );
          case "p":
            return (
              <p key={i} className="prose-ja leading-[1.9]">
                {b.text}
              </p>
            );
          case "note":
            return (
              <p key={i} className="rounded-xl bg-amber-soft px-4 py-3 text-sm text-amber-ink">
                {b.text}
              </p>
            );
          case "steps":
            return (
              <ol key={i} className="grid gap-3 sm:grid-cols-3">
                {b.items.map((s, j) => (
                  <li key={j} className="rounded-2xl border border-slate-100 bg-white p-4 shadow-sm">
                    <span className="grid h-7 w-7 place-items-center rounded-full bg-navy text-sm font-bold text-white">{j + 1}</span>
                    <p className="mt-2 font-bold leading-snug">{s.title}</p>
                    <p className="mt-1 text-sm leading-relaxed text-sub">{s.text}</p>
                  </li>
                ))}
              </ol>
            );
          case "ngok":
            return (
              <div key={i} className="space-y-3">
                {b.pairs.map((p, j) => (
                  <div key={j} className="grid gap-3 sm:grid-cols-2">
                    <div className="rounded-2xl bg-red-50 p-4">
                      <p className="flex items-center gap-1.5 text-sm font-bold text-red-700">
                        <XCircle size={16} aria-hidden="true" /> NG
                      </p>
                      <p className="mt-1 text-sm text-red-900">{p.ng}</p>
                    </div>
                    <div className="rounded-2xl bg-emerald-50 p-4">
                      <p className="flex items-center gap-1.5 text-sm font-bold text-emerald-700">
                        <CheckCircle2 size={16} aria-hidden="true" /> こうする
                      </p>
                      <p className="mt-1 text-sm text-emerald-900">{p.ok}</p>
                    </div>
                  </div>
                ))}
              </div>
            );
          case "example":
            return (
              <figure key={i} className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm">
                <figcaption className="flex items-center gap-2 text-sm font-bold">
                  <Quote size={16} className="text-amber" aria-hidden="true" />
                  {b.title}
                </figcaption>
                <blockquote className="mt-3 text-sm leading-[1.9] text-ink">{b.text}</blockquote>
              </figure>
            );
          case "checklist":
            return (
              <ul key={i} className="space-y-2 rounded-2xl border border-slate-100 bg-white p-5 shadow-sm">
                {b.items.map((t, j) => (
                  <li key={j}>
                    <label className="flex cursor-pointer items-start gap-3 text-sm">
                      <input type="checkbox" className="mt-1 h-4 w-4 accent-navy" />
                      <span>{t}</span>
                    </label>
                  </li>
                ))}
              </ul>
            );
        }
      })}
    </div>
  );
}
