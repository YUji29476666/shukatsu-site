// サイト全体の文言・リンク。未決定のものは仮の値（公開前に差し替える）

export const site = {
  name: "［サイト名］",
  description: "海外留学生の就活情報をまとめたサイト",
  catch: "海外留学生の就活を、ここからはじめよう。",
  lead: "ボスキャリ・選考対策・求人の探し方まで、留学生の就活に必要な情報をまとめたサイト",
  searchPlaceholder: "知りたいことを入力（例：ボスキャリ、SPI、自己PR）",
  keywords: ["ボスキャリ", "ES", "SPI", "自己PR", "ケース面接", "LinkedIn"],
  reportFormUrl: "#report", // 後で Google フォームの URL に差し替える
};

export const events = {
  banner: {
    label: "グロキャリ主催",
    title: "グロキャリのイベント・説明会",
    text: "留学生の就活に役立つイベントを開催しています",
    cta: "イベント情報を見る",
    url: "#", // グロキャリのイベントページの URL（未定）
  },
};

// 写真：Unsplash から選んで public/images/ に置いたら、ここに記録する
// （撮影者名と元 URL。まだ写真がないあいだは、カテゴリの色の「写真（仮）」を表示する）
export const photos: Record<string, { src: string; credit: string; url: string }> = {};

// よく読まれている記事：どの記事を出すかは後で決める（推測で選ばない）。今は空きの枠を6つ表示する
export const popularSlots = 6;
