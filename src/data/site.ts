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

// 写真：Unsplash の無料写真（Unsplash License）を images.unsplash.com から直接表示している。credit は撮影者、url は写真のページ
// 写真がない id は、カテゴリの色の「写真（仮）」を表示する
export const photos: Record<string, { src: string; credit: string; url: string }> = {
  "hero": { src: "https://images.unsplash.com/photo-1729040270328-e6fe63597dac?auto=format&fit=crop&q=70&w=2000", credit: "Austin", url: "https://unsplash.com/photos/81Dvbf3e7so" },
  "event": { src: "https://images.unsplash.com/photo-1626855428287-7ae49119eda6?auto=format&fit=crop&q=70&w=2000", credit: "Wei Zeng", url: "https://unsplash.com/photos/e_6kPuccYvk" },
  "growth-mindset": { src: "https://images.unsplash.com/photo-1762890515866-3b1b34e13133?auto=format&fit=crop&q=70&w=600", credit: "Austin Phillips", url: "https://unsplash.com/photos/Ek9x7Nav3Fw" },
  "application-prep": { src: "https://images.unsplash.com/photo-1654267288787-a571aecf0505?auto=format&fit=crop&q=70&w=600", credit: "Rui Silvestre", url: "https://unsplash.com/photos/9vxJQmZmTYU" },
  "selection-tests": { src: "https://images.unsplash.com/photo-1727109369808-fbab005cca4b?auto=format&fit=crop&q=70&w=600", credit: "C Cai", url: "https://unsplash.com/photos/nkgAw4SFsWM" },
  "interview-prep": { src: "https://images.unsplash.com/photo-1627618998627-70a92a874cc2?auto=format&fit=crop&q=70&w=600", credit: "Mediamodifier", url: "https://unsplash.com/photos/ehI8qokwP7s" },
};

// よく読まれている記事：どの記事を出すかは後で決める（推測で選ばない）。今は空きの枠を6つ表示する
export const popularSlots = 6;
