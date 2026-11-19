import type { ReviewInterval } from "./types";

// 見直しの間隔（ユーザーと決めた分け方）
// 目的：読む人が、古い日程・締切・条件・制度のせいで損をしないようにする。だから情報が変わる速さで間隔を変える
// - 日程があるもの：1か月（さらに記事の reviewBy の日を過ぎたら、1か月を待たずに知らせる）
// - サービス・試験の形式：3か月
// - 書き方・考え方：6か月（下の2つに入っていない記事はすべてこれ）
// 記事を足したら、日程があるもの・サービス／試験の形式なら下のリストに slug を足す。記事に reviewInterval を書けば、そちらが優先
export const reviewTiers: { interval: ReviewInterval; name: string; slugs: string[] }[] = [
  {
    interval: "1m",
    name: "日程があるもの",
    slugs: [
      "boston-career-forum",
      "los-angeles-career-forum",
      "london-career-forum",
      "tkf-global-talent-expo",
      "domestic-career-forums",
      "timeline-art",
      "timeline-business",
      "timeline-engineering",
      "final-check", // ボスキャリの直前・当日リマインド（ボスキャリの日程に合わせた内容のため。Claude の判断。違えば移す）
    ],
  },
  {
    interval: "3m",
    name: "サービス・試験の形式",
    slugs: [
      "linkedin-guide",
      "job-platforms-by-country",
      "alpha-adviser",
      "career-academy",
      "linkedin-student-club",
      "sekaia",
      "finance-economics-academy",
      "selection-tests", // ボスキャリの選考試験
      "shukatsu-selection-tests", // 応募・面接の選考試験
      "spi",
      "tamatebako",
      "tg-web",
      "coding-test",
    ],
  },
];

export const defaultReviewInterval: ReviewInterval = "6m"; // 書き方・考え方

/** 記事の見直しの間隔：記事に書いた reviewInterval → 上の分け方 → 6か月 */
export function intervalFor(a: { slug: string; reviewInterval?: ReviewInterval }): ReviewInterval {
  return a.reviewInterval ?? reviewTiers.find((t) => t.slugs.includes(a.slug))?.interval ?? defaultReviewInterval;
}
