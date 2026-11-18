import { Breadcrumb } from "./Breadcrumb";

/** 中身がまだない仮ページ（見出しだけ。本文は作らない） */
export function SimplePage({ title, headings, note }: { title: string; headings?: { id?: string; text: string }[]; note?: string }) {
  return (
    <div className="mx-auto max-w-3xl px-5">
      <Breadcrumb items={[{ name: title }]} />
      <h1 className="pt-4 text-3xl font-bold tracking-tight">{title}</h1>
      <p className="mt-4 rounded-2xl border border-dashed border-line bg-white p-5 text-sub">{note ?? "このページは準備中です。"}</p>
      {headings?.map((h) => (
        <section key={h.text} id={h.id} className="scroll-mt-24 pt-8">
          <h2 className="border-l-4 border-navy pl-3 text-xl font-bold">{h.text}</h2>
          <p className="mt-3 text-sub">［準備中］</p>
        </section>
      ))}
    </div>
  );
}
