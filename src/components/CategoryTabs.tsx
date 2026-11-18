import { ArrowRight, ChevronRight } from "lucide-react";
import { categories } from "@/data/categories";
import { articleUrl, categoryUrl, dateOrPlaceholder, panelArticles } from "@/lib/content";
import { Photo } from "./Photo";
import { labelColor } from "./ArticleCard";

// 「カテゴリから探す」：タブで記事一覧が切り替わる
// 全カテゴリのパネルを HTML に出し、小さなスクリプトで表示を切り替える（JS が動かなくても最初のカテゴリは見える）
const script = `
(() => {
  // クリックとキー操作は document で受ける（画面が組み立て直されても動き続けるように）
  const tabs = () => [...document.querySelectorAll('#cat-tabs [role="tab"]')];
  const show = (i, focus) => {
    const all = tabs();
    all.forEach((t, j) => {
      const on = i === j;
      t.setAttribute('aria-selected', on ? 'true' : 'false');
      t.tabIndex = on ? 0 : -1;
      t.dataset.on = on ? '1' : '0';
      document.getElementById(t.getAttribute('aria-controls')).hidden = !on;
      document.querySelectorAll('#cat-tabs [data-more="' + t.dataset.cat + '"]').forEach((m) => (m.hidden = !on));
    });
    if (focus) all[i].focus();
  };
  document.addEventListener('click', (e) => {
    const t = e.target.closest && e.target.closest('#cat-tabs [role="tab"]');
    if (t) show(tabs().indexOf(t));
  });
  document.addEventListener('keydown', (e) => {
    const t = e.target.closest && e.target.closest('#cat-tabs [role="tab"]');
    if (!t) return;
    const all = tabs(), i = all.indexOf(t), n = all.length, k = e.key;
    let j = -1;
    if (k === 'ArrowDown' || k === 'ArrowRight') j = (i + 1) % n;
    if (k === 'ArrowUp' || k === 'ArrowLeft') j = (i - 1 + n) % n;
    if (k === 'Home') j = 0;
    if (k === 'End') j = n - 1;
    if (j >= 0) { e.preventDefault(); show(j, true); }
  });
})();
`;

export function CategoryTabs() {
  return (
    <section aria-labelledby="cat-h" className="mx-auto max-w-6xl px-5 py-16">
      <h2 id="cat-h" className="text-2xl font-bold tracking-tight">
        カテゴリから探す
      </h2>
      <div id="cat-tabs" className="mt-8 grid grid-cols-[minmax(0,1fr)] gap-0 md:grid-cols-[260px_minmax(0,1fr)]">
        <div className="min-w-0">
          <div role="tablist" aria-label="カテゴリ" aria-orientation="vertical" className="no-scrollbar flex gap-2 overflow-x-auto pb-3 md:flex-col md:gap-1 md:overflow-visible md:pb-0">
            {categories.map((c, i) => (
              <button
                key={c.id}
                type="button"
                role="tab"
                id={`tab-${c.id}`}
                aria-controls={`panel-${c.id}`}
                aria-selected={i === 0}
                tabIndex={i === 0 ? 0 : -1}
                data-cat={c.id}
                data-on={i === 0 ? "1" : "0"}
                className="group flex min-h-11 shrink-0 items-center gap-2 rounded-full border border-line bg-white px-4 text-left text-sm text-sub transition data-[on=1]:border-orange data-[on=1]:bg-orange data-[on=1]:text-white md:rounded-l-full md:rounded-r-none md:border-0 md:bg-transparent md:py-4 md:pl-5 md:data-[on=1]:bg-beige md:data-[on=1]:font-bold md:data-[on=1]:text-orange"
              >
                <span className="hidden h-1.5 w-1.5 rounded-full bg-transparent md:inline-block md:group-data-[on=1]:bg-orange" />
                <span className="whitespace-nowrap">{c.name}</span>
                <span className="hidden text-[10px] tracking-wider opacity-70 md:inline">— {c.en}</span>
                <ChevronRight size={16} className="ml-auto hidden md:block" aria-hidden="true" />
              </button>
            ))}
          </div>
          {categories.map((c, i) => (
            <a
              key={c.id}
              data-more={c.id}
              hidden={i !== 0}
              href={categoryUrl(c.id)}
              className="mt-8 hidden w-fit items-center gap-1.5 whitespace-nowrap rounded-full border border-navy px-4 py-2.5 text-[13px] font-medium text-navy hover:bg-navy hover:text-white md:inline-flex [&[hidden]]:hidden"
            >
              {c.name}の記事をもっと見る <ArrowRight size={16} aria-hidden="true" />
            </a>
          ))}
        </div>

        {categories.map((c, i) => (
          <div
            key={c.id}
            role="tabpanel"
            id={`panel-${c.id}`}
            aria-labelledby={`tab-${c.id}`}
            hidden={i !== 0}
            className="rounded-3xl bg-beige p-5 md:rounded-l-none md:p-8"
          >
            <ul>
              {panelArticles(c).map((a) => (
                <li key={a.slug} className="border-b border-dashed border-[#dccbb5] last:border-0">
                  <a href={articleUrl(a)} className="group flex items-center gap-4 py-4 md:gap-6">
                    <div className="aspect-[4/3] w-24 shrink-0 md:w-36">
                      <Photo id={a.slug} category={a.category} rounded="rounded-lg" small />
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs text-sub">最終確認日：{dateOrPlaceholder(a.lastChecked)}</p>
                      <p className="mt-0.5 text-base font-bold leading-snug group-hover:text-navy md:text-lg">{a.title}</p>
                      <p className="mt-2 flex flex-wrap gap-1.5">
                        <span className={`rounded px-2 py-0.5 text-[11px] font-bold ${labelColor[c.id]}`}>{c.name}</span>
                        <span className="rounded border border-[#e5d9c8] bg-white px-2 py-0.5 text-[11px] text-sub">{a.title}</span>
                      </p>
                    </div>
                  </a>
                </li>
              ))}
            </ul>
            <a href={categoryUrl(c.id)} className="mt-4 inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-full border border-navy text-sm font-medium text-navy md:hidden">
              {c.name}の記事をもっと見る <ArrowRight size={16} aria-hidden="true" />
            </a>
          </div>
        ))}
      </div>
      <script dangerouslySetInnerHTML={{ __html: script }} />
    </section>
  );
}
