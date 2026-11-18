import { categories } from "@/data/categories";
import { site } from "@/data/site";
import { categoryUrl } from "@/lib/content";

export function Footer() {
  return (
    <footer className="mt-20 bg-navy text-slate-300">
      <div className="mx-auto grid max-w-6xl gap-10 px-5 py-14 md:grid-cols-[2fr_1fr_1fr]">
        <div>
          <p className="text-lg font-bold text-white">{site.name}</p>
          <p className="mt-2 text-sm">{site.description}</p>
        </div>
        <nav aria-label="カテゴリ（フッター）">
          <p className="text-sm font-bold text-white">カテゴリ</p>
          <ul className="mt-3 space-y-2 text-sm">
            {categories.map((c) => (
              <li key={c.id}>
                <a href={categoryUrl(c.id)} className="hover:text-white">
                  {c.name}
                </a>
              </li>
            ))}
          </ul>
        </nav>
        <nav aria-label="ご案内">
          <p className="text-sm font-bold text-white">ご案内・サポート</p>
          <ul className="mt-3 space-y-2 text-sm">
            <li>
              <a href="#" className="hover:text-white">
                運営者情報
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-white">
                お問い合わせ・誤りの報告
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-white">
                プライバシーポリシー
              </a>
            </li>
          </ul>
        </nav>
      </div>
      <div className="border-t border-white/10">
        <p className="mx-auto max-w-6xl px-5 py-5 text-right text-xs">© {site.name}</p>
      </div>
    </footer>
  );
}
