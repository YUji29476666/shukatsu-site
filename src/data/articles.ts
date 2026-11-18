import type { Article, CategoryId } from "./types";
import { selfPr } from "./articles/self-pr";

// 記事の一覧。本文（blocks）がない記事は「準備中」のページになる
// 日付・出典は確認するまで空のまま（画面では［日付］［確認後に入れます］と表示）
const stub = (slug: string, title: string, category: CategoryId, origin: string, extra: Partial<Article> = {}): Article => ({
  slug,
  title,
  category,
  origin,
  lastChecked: "",
  updated: "",
  sources: [],
  ...extra,
});

export const articles: Article[] = [
  // ボスキャリ
  stub("boston-career-forum", "ボストンキャリアフォーラム", "bosscari", "ボストンキャリアフォーラム"),
  stub("growth-mindset", "Growth Mind Set", "bosscari", "Growth Mind Set", { popular: 1 }),
  // 就活タイムライン
  stub("timeline-art", "アート系の就活タイムライン", "timeline", "就活タイムライン/アート系"),
  stub("timeline-business", "ビジネス系の就活タイムライン", "timeline", "就活タイムライン/ビジネス系", { popular: 3 }),
  stub("timeline-engineering", "工学系の就活タイムライン", "timeline", "就活タイムライン/工学系"),
  // 求人・就職情報
  stub("linkedin-guide", "LinkedIn", "jobs", "就活サイト・アプリ/LinkedIn"),
  stub("job-platforms-by-country", "各国主要プラットフォーム", "jobs", "就活サイト・アプリ/各国主要プラットフォーム", { popular: 4 }),
  stub("domestic-career-forums", "国内開催フォーラム", "jobs", "国内開催フォーラム"),
  stub("los-angeles-career-forum", "ロサンゼルスキャリアフォーラム", "jobs", "ロサンゼルスキャリアフォーラム"),
  stub("london-career-forum", "ロンドンキャリアフォーラム", "jobs", "ロンキャリ"),
  stub("tkf-global-talent-expo", "TKF", "jobs", "TKF"),
  stub("alpha-adviser", "Alphaアドバイザー", "jobs", "Alphaアドバイザー"),
  stub("career-academy", "キャリアアカデミー", "jobs", "キャリアアカデミー"),
  stub("linkedin-student-club", "LinkedIn Student Club", "jobs", "LinkedIn Student Club"),
  stub("sekaia", "Sekaia", "jobs", "Sekaia"),
  stub("finance-economics-academy", "金融経済アカデミー", "jobs", "金融経済アカデミー"),
  // 応募準備・選考試験対策・面接対策・マナー・服装・直前・当日リマインド（もとの「応募・面接」）
  stub("application-prep", "応募準備", "application", "応募準備"),
  stub("self-analysis", "自己分析", "application", "応募準備/自己分析"),
  stub("entry-sheet", "ES", "application", "応募準備/ES"),
  stub("resume", "履歴書", "application", "応募準備/履歴書"),
  stub("selection-tests", "選考試験", "tests", "選考試験"),
  stub("spi", "SPI", "tests", "選考試験対策/SPI", { popular: 6 }),
  stub("tamatebako", "玉手箱", "tests", "選考試験対策/玉手箱"),
  stub("tg-web", "TG-WEB", "tests", "選考試験対策/TG-WEB"),
  stub("coding-test", "コーディングテスト", "tests", "選考試験対策/コーディングテスト"),
  stub("interview-prep", "面接対策", "interview", "面接対策", { popular: 2 }),
  stub("star-story", "STARストーリー", "interview", "STARストーリー"),
  stub("self-introduction", "自己紹介", "interview", "自己紹介"),
  stub("gakuchika", "ガクチカ", "interview", "ガクチカ"),
  selfPr,
  stub("strengths-weaknesses", "長所短所", "interview", "長所短所"),
  stub("motivation", "志望動機", "interview", "志望動機"),
  stub("group-discussion", "グループディスカッション", "interview", "グループディスカッション"),
  stub("group-interview", "集団面接", "interview", "集団面接"),
  stub("case-interview", "ケース面接", "interview", "ケース面接"),
  stub("technical-interview", "テクニカル面接", "interview", "テクニカル面接"),
  stub("manners", "マナー・服装", "manners", ""),
  stub("final-check", "直前・当日リマインド", "final-check", "直前・当日リマインド"),
];
