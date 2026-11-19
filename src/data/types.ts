// サイトのデータの形。中身は src/data/ の各ファイルに置き、画面の部品には文章を書かない

export type CategoryId = "bosscari" | "timeline" | "jobs" | "selection";

export type SectionIcon = "globe" | "plane" | "clock" | "briefcase" | "calendar" | "smartphone" | "users" | "file" | "message";

export type Section = {
  id: string; // 記事一覧ページの URL（/ja/{カテゴリ}/{id}/）。記事の slug と重ねない
  name: string; // 中カテゴリ名
  icon: SectionIcon; // 一覧で名前の横に出すアイコン（src/components/SectionIcon.tsx）
  articles: string[]; // 記事の slug。この並び順が「前の記事／次の記事」の順番
};

export type Category = {
  id: CategoryId;
  name: string;
  en: string; // タブの横の小さな英字
  tagline: string; // ひとこと
  icon: SectionIcon; // トップの「カテゴリから探す」で名前の横に出すアイコン
  shortName?: string; // 「カテゴリから探す」とサイドバーでだけ使う短い名前（ユーザーの見本のとおり）
  sections: Section[]; // このカテゴリがホームの記事
  sectionPages?: boolean; // true：中の分け方をそれぞれ1つのカテゴリとして扱い、記事一覧ページ（/ja/{カテゴリ}/{id}/）を作る（今は応募・面接だけ。ユーザーの指示）
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
  | { type: "checklist"; items: string[] }
  | { type: "list"; items: string[] } // 箇条書き
  | { type: "table"; rows: [string, string][] } // 2列の表（項目｜内容）
  | { type: "links"; items: { text: string; url: string }[] }; // 外部リンクの一覧

// 本文の中で [S1] と書くと、出典一覧の S1 への小さなリンクになる

// 出典（記事を作るときに登録する）
export type Source = {
  id: string; // S1, S2 …（本文の [S1] と対応）
  title: string; // ページ名
  publisher: string; // 発行元
  url: string;
  supports: string; // この出典で裏付けている内容
  aiOpened: string; // AI がページを開いて内容を照らし合わせた日（YYYY-MM-DD）
  checked: string; // 人が開いて確かめた日。人だけが入れる（未確認は空）
  autoCheck?: boolean; // false＝自動チェックで開かない（自動の読み込みを断るサイト）。見直しの時期に人が確かめる
};

// 見直しの間隔。全記事共通の値は src/data/review.ts（今は1か月）
export type ReviewInterval = "1m" | "3m" | "6m" | "12m";

export type Article = {
  slug: string;
  title: string;
  category: CategoryId; // ホームのカテゴリ（1つだけ）
  lead?: string; // 導入文
  popular?: number; // よく読まれている記事の順番（小さいほど上）
  related?: string[]; // 関連記事（手で指定。なければ自動）
  lastChecked: string; // 最終確認日＝人が記事全体を確かめた日。人だけが入れる（未確認は空）
  reviewBy?: string; // この日（YYYY-MM-DD）を過ぎたら、間隔を待たずに見直しを知らせる（フォーラムの開催日の翌日など。出典で確かめた日付だけ）
  reviewInterval?: ReviewInterval; // 書かなければ全記事共通の間隔（src/data/review.ts）。次の見直し予定日は最終確認日＋間隔で計算する（保存しない）
  updated: string; // 更新日（未確認は空）
  origin?: string; // Ryugaku Wiki のページ名
  sources: Source[];
  blocks?: Block[]; // 本文。ない記事は「準備中」
};
