import type { ReviewInterval } from "./types";

// 見直しの間隔（全記事共通）。ユーザーの指示で、全記事1か月ごと。
// 記事ごとに変えたいときだけ、その記事に reviewInterval を書く（書いた方が優先）
export const defaultReviewInterval: ReviewInterval = "1m";
