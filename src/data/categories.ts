import type { Category } from "./types";

// カテゴリと記事の並び順（docs/site-design-decisions.md の「記事の並び順」）
// 記事を足すときは、入れたい位置に slug を1行足すだけ
export const categories: Category[] = [
  {
    id: "bosscari",
    name: "ボスキャリ",
    en: "BOSTON",
    tagline: "学生から人気なページ",
    sections: [{ id: "bosscari", name: "ボスキャリ", articles: ["boston-career-forum", "growth-mindset"] }],
    features: {
      name: "人気のページ",
      articles: ["growth-mindset", "application-prep", "selection-tests", "interview-prep", "final-check"],
    },
  },
  {
    id: "timeline",
    name: "就活タイムライン",
    en: "TIMELINE",
    tagline: "「今」何をすべきかがわかる",
    sections: [{ id: "by-industry", name: "業界別", articles: ["timeline-art", "timeline-business", "timeline-engineering"] }],
  },
  {
    id: "jobs",
    name: "求人・就職情報",
    en: "JOBS",
    tagline: "どのサイトで探せばいい？を解決",
    sections: [
      { id: "job-sites", name: "就活サイト・アプリ", articles: ["linkedin-guide", "job-platforms-by-country"] },
      {
        id: "career-forums",
        name: "キャリアフォーラム",
        articles: ["domestic-career-forums", "los-angeles-career-forum", "london-career-forum", "tkf-global-talent-expo"],
      },
      {
        id: "communities",
        name: "就活サポート コミュニティ",
        articles: ["alpha-adviser", "career-academy", "linkedin-student-club", "sekaia", "finance-economics-academy"],
      },
    ],
  },
  {
    id: "selection",
    name: "応募・面接",
    en: "INTERVIEW",
    tagline: "ES・SPI・面接、不安を解消",
    sections: [
      { id: "application", name: "応募準備", articles: ["application-prep", "self-analysis", "entry-sheet", "resume"] },
      { id: "tests", name: "選考試験対策", articles: ["selection-tests", "spi", "tamatebako", "tg-web", "coding-test"] },
      {
        id: "questions",
        name: "質問対策",
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
      { id: "manners", name: "マナー・服装", articles: ["manners"] },
      { id: "final-check", name: "直前・当日リマインド", articles: ["final-check"] },
    ],
  },
];
