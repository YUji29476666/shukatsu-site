import { ChevronRight } from "lucide-react";

export function Breadcrumb({ items }: { items: { name: string; href?: string }[] }) {
  return (
    <nav aria-label="パンくずリスト" className="py-4 text-xs text-sub">
      <ol className="flex flex-wrap items-center gap-1">
        <li>
          <a href="/ja/" className="hover:text-navy">
            ホーム
          </a>
        </li>
        {items.map((it, i) => (
          <li key={i} className="flex items-center gap-1">
            <ChevronRight size={12} aria-hidden="true" />
            {it.href ? (
              <a href={it.href} className="hover:text-navy">
                {it.name}
              </a>
            ) : (
              <span aria-current="page">{it.name}</span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}
