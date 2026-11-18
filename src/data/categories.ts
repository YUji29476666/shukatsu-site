import type { Category } from "./types";

// カテゴリと記事の並び順（docs/site-design-decisions.md の「記事の並び順」）
// 記事を足すときは、入れたい位置に slug を1行足すだけ
// 中の分け方（sections）が2つ以上あるカテゴリは、分け方ごとに記事一覧ページ（/ja/{カテゴリ}/{id}/）ができる。id は記事の slug と重ねない
export const categories: Category[] = [
  {
    id: "bosscari",
    name: "ボスキャリ",
    en: "BOSTON",
    tagline: "学生から人気なページ",
    icon: "globe",
    // ボスキャリの記事一覧に並ぶ6記事（ユーザーの指示）。応募準備・選考試験・面接対策・直前・当日リマインドは
    // 応募・面接にある記事で、ボスキャリの一覧にも出す（記事の URL は応募・面接のまま）
    sections: [
      {
        id: "bosscari",
        name: "ボスキャリ",
        icon: "plane",
        articles: ["boston-career-forum", "growth-mindset", "application-prep", "selection-tests", "interview-prep", "final-check"],
      },
    ],
  },
  {
    id: "timeline",
    name: "就活タイムライン",
    en: "TIMELINE",
    tagline: "「今」何をすべきかがわかる",
    icon: "clock",
    sections: [{ id: "by-industry", name: "業界別", icon: "clock", articles: ["timeline-art", "timeline-business", "timeline-engineering"] }],
  },
  {
    id: "jobs",
    name: "求人・就職情報",
    en: "JOBS",
    tagline: "どのサイトで探せばいい？を解決",
    icon: "briefcase",
    shortName: "求人・就職",
    sections: [
      { id: "job-sites", name: "就活サイト・アプリ", icon: "smartphone", articles: ["linkedin-guide", "job-platforms-by-country"] },
      {
        id: "career-forums",
        name: "キャリアフォーラム",
        icon: "calendar",
        articles: ["domestic-career-forums", "los-angeles-career-forum", "london-career-forum", "tkf-global-talent-expo"],
      },
      {
        id: "communities",
        name: "就活サポート コミュニティ",
        icon: "users",
        articles: ["alpha-adviser", "career-academy", "linkedin-student-club", "sekaia", "finance-economics-academy"],
      },
    ],
  },
  {
    id: "selection",
    name: "応募・面接",
    en: "INTERVIEW",
    tagline: "ES・SPI・面接、不安を解消",
    icon: "message",
    sectionPages: true,
    sections: [
      {
        id: "application",
        name: "応募準備",
        icon: "file",
        // ユーザーの指示で、応募準備・選考試験対策・マナー・服装・直前・当日リマインドを1つにまとめた
        articles: [
          "application-prep",
          "self-analysis",
          "entry-sheet",
          "resume",
          "selection-tests",
          "spi",
          "tamatebako",
          "tg-web",
          "coding-test",
          "manners",
          "final-check",
        ],
      },
      {
        id: "questions",
        name: "質問対策",
        icon: "message",
        articles: [
          "interview-prep",
          "star-story",
          "self-introduction",
          "gakuchika",
          "self-pr",
          "strengths-weaknesses",
          "motivation",
          "group-discussion",
          "group-interview",
          "case-interview",
          "technical-interview",
        ],
      },
    ],
  },
];

// トップの「カテゴリから探す」とサイドバーの並び順（ユーザーの見本のとおり）。カテゴリの id か、応募・面接の分け方の id
// PC の3列では、縦に「ボスキャリ・就活タイムライン」「応募準備・質問対策」「求人・就職」と並ぶ
export const browseOrder = ["bosscari", "timeline", "application", "questions", "jobs"];
