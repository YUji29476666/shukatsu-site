// サイトのデータの形。中身は src/data/ の各ファイルに置き、画面の部品には文章を書かない

export type CategoryId = "bosscari" | "timeline" | "jobs" | "selection";

export type Section = {
  id: string; // カテゴリページ内の見出しのアンカー（#id）
  name: string; // 中カテゴリ名
  articles: string[]; // 記事の slug。この並び順が「前の記事／次の記事」の順番
};

export type Category = {
  id: CategoryId;
  name: string;
  en: string; // タブの横の小さな英字
  tagline: string; // ひとこと
  sections: Section[]; // このカテゴリがホームの記事
  features?: { name: string; articles: string[] }; // ほかのカテゴリの記事の「紹介」（前後の順番には入れない）
};

// 記事の本文は「部品の並び」で持つ（Markdown は使わない）
export type Block =
  | { type: "h2"; id: string; text: string }
  | { type: "h3"; id: string; text: string }
  | { type: "p"; text: string }
  | { type: "note"; text: string }
  | { type: "steps"; items: { title: string; text: string }[] }
  | { type: "ngok"; pairs: { ng: string; ok: string }[] }
  | { type: "example"; title: string; text: string }
  | { type: "checklist"; items: string[] };

export type Source = { id: string; title: string; publisher: string; url: string; checked: string };

export type Article = {
  slug: string;
  title: string;
  category: CategoryId; // ホームのカテゴリ（1つだけ）
  lead?: string; // 導入文
  popular?: number; // よく読まれている記事の順番（小さいほど上）
  related?: string[]; // 関連記事（手で指定。なければ自動）
  lastChecked: string; // 最終確認日（未確認は空）
  updated: string; // 更新日（未確認は空）
  origin?: string; // Ryugaku Wiki のページ名
  sources: Source[];
  blocks?: Block[]; // 本文。ない記事は「準備中」
};
