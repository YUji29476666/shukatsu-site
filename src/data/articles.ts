import type { Article, CategoryId } from "./types";
import { selfPr } from "./articles/self-pr";
import { losAngelesCareerForum } from "./articles/los-angeles-career-forum";

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
  // ボスキャリの応募準備〜直前・当日リマインド（Ryugaku Wiki のボスキャリのページ）。応募・面接の同じ名前の記事とは別の記事（ユーザーの指示）
  stub("application-prep", "応募準備", "bosscari", "応募準備"),
  stub("selection-tests", "選考試験", "bosscari", "選考試験"),
  stub("interview-prep", "面接対策", "bosscari", "面接対策", { popular: 2 }),
  stub("final-check", "直前・当日リマインド", "bosscari", "直前・当日リマインド"),
  // 就活タイムライン
  stub("timeline-art", "アート系の就活タイムライン", "timeline", "就活タイムライン/アート系"),
  stub("timeline-business", "ビジネス系の就活タイムライン", "timeline", "就活タイムライン/ビジネス系", { popular: 3 }),
  stub("timeline-engineering", "工学系の就活タイムライン", "timeline", "就活タイムライン/工学系"),
  // 求人・就職情報
  stub("linkedin-guide", "LinkedIn", "jobs", "就活サイト・アプリ/LinkedIn"),
  stub("job-platforms-by-country", "各国主要プラットフォーム", "jobs", "就活サイト・アプリ/各国主要プラットフォーム", { popular: 4 }),
  stub("domestic-career-forums", "国内開催フォーラム", "jobs", "国内開催フォーラム"),
  losAngelesCareerForum,
  stub("london-career-forum", "ロンドンキャリアフォーラム", "jobs", "ロンキャリ"),
  stub("tkf-global-talent-expo", "TKF", "jobs", "TKF"),
  stub("alpha-adviser", "Alphaアドバイザー", "jobs", "Alphaアドバイザー"),
  stub("career-academy", "キャリアアカデミー", "jobs", "キャリアアカデミー"),
  stub("linkedin-student-club", "LinkedIn Student Club", "jobs", "LinkedIn Student Club"),
  stub("sekaia", "Sekaia", "jobs", "Sekaia"),
  stub("finance-economics-academy", "金融経済アカデミー", "jobs", "金融経済アカデミー"),
  // 応募・面接
  // 応募・面接の応募準備・選考試験・面接対策・直前・当日リマインド：ボスキャリの記事とは別。もとの Wiki のページ名は未確認（origin は空）
  stub("shukatsu-application-prep", "応募準備", "selection", ""),
  stub("self-analysis", "自己分析", "selection", "応募準備/自己分析"),
  stub("entry-sheet", "ES", "selection", "応募準備/ES"),
  stub("resume", "履歴書", "selection", "応募準備/履歴書"),
  stub("shukatsu-selection-tests", "選考試験", "selection", ""),
  stub("spi", "SPI", "selection", "選考試験対策/SPI", { popular: 6 }),
  stub("tamatebako", "玉手箱", "selection", "選考試験対策/玉手箱"),
  stub("tg-web", "TG-WEB", "selection", "選考試験対策/TG-WEB"),
  stub("coding-test", "コーディングテスト", "selection", "選考試験対策/コーディングテスト"),
  stub("shukatsu-interview-prep", "面接対策", "selection", ""),
  stub("star-story", "STARストーリー", "selection", "STARストーリー"),
  stub("self-introduction", "自己紹介", "selection", "自己紹介"),
  stub("gakuchika", "ガクチカ", "selection", "ガクチカ"),
  selfPr,
  stub("strengths-weaknesses", "長所短所", "selection", "長所短所"),
  stub("motivation", "志望動機", "selection", "志望動機"),
  stub("group-discussion", "グループディスカッション", "selection", "グループディスカッション"),
  stub("group-interview", "集団面接", "selection", "集団面接"),
  stub("case-interview", "ケース面接", "selection", "ケース面接"),
  stub("technical-interview", "テクニカル面接", "selection", "テクニカル面接"),
  stub("manners", "マナー・服装", "selection", ""),
  stub("shukatsu-final-check", "直前・当日リマインド", "selection", ""),
];
