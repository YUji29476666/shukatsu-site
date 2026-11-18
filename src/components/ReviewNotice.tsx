"use client";

import { useEffect, useState } from "react";
import { AlertTriangle } from "lucide-react";

// 次の見直し予定日を過ぎていたら「情報が古い可能性」を出す。
// 判定は読む人のブラウザで今日の日付と比べる（サイトを作り直さなくても、予定日が来た日から表示が変わる）
export function ReviewNotice({ next }: { next: string }) {
  const [overdue, setOverdue] = useState(false);
  useEffect(() => {
    const today = new Date().toISOString().slice(0, 10);
    setOverdue(Boolean(next) && today > next);
  }, [next]);
  if (!overdue) return null;
  return (
    <p role="status" className="mt-4 flex items-start gap-2 rounded-xl border border-amber/40 bg-amber-soft px-4 py-3 text-sm text-amber-ink">
      <AlertTriangle size={18} className="mt-0.5 shrink-0" aria-hidden="true" />
      <span>情報が古い可能性があります（見直し予定日 {next} を過ぎています）。最新の情報は出典の公式ページで確認してください。</span>
    </p>
  );
}
