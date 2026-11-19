import type { Article } from "../types";

// Ryugaku Wiki「ロサンゼルスキャリアフォーラム」（2026-11-05 更新版）の内容を部品に置き換えたもの。
// 中身は足さない。事実の文には出典 [S1] などを付けた。
// 公式ページで確かめられなかった文（出典の印がない文）も、ユーザーの判断で wiki のとおり残している：
// 「毎年4月ごろに」、事前応募者の面接についての2文、2026年のセミナーと参加企業の文、「2026年の開催は終了しています。」
// 直したところ：見出し「基本情報（2026年）」→「基本情報（2027年）」（中の表が2027年の内容のため）
export const losAngelesCareerForum: Article = {
  slug: "los-angeles-career-forum",
  title: "ロサンゼルスキャリアフォーラム",
  category: "jobs",
  origin: "ロサンゼルスキャリアフォーラム",
  lastChecked: "2026-11-18",
  reviewBy: "2027-05-17", // 2027年の開催（5月15〜16日。S1・S2 で確認）の翌日。過ぎたら次の年の日程に直す // ユーザーが確認日として指定（AI は自分では入れない）
  updated: "",
  sources: [
    {
      id: "S1",
      title: "Los Angeles Career Forum FAQ",
      publisher: "CFN（CareerForum.Net）",
      url: "https://careerforum.net/en/event/los/faq",
      supports: "2027年の日程、参加対象、参加費、服装、登録とチェックイン、会場マップ、クローク、履歴書",
      aiOpened: "2026-11-18",
      checked: "2026-11-18",
    },
    {
      id: "S2",
      title: "Los Angeles Career Forum 2027",
      publisher: "Los Angeles Convention Center",
      url: "https://www.laconventioncenter.com/events/detail/los-angeles-career-forum-2027",
      supports: "2027年の日程、会場（Kentia Hall）",
      aiOpened: "2026-11-18",
      checked: "2026-11-18",
      autoCheck: false, // GitHub からの自動の読み込みを断る（406）ため、見直しの時期に人が確かめる
    },
    {
      id: "S3",
      title: "FAQ | CFN (CareerForum.Net)",
      publisher: "CFN（CareerForum.Net）",
      url: "https://careerforum.net/en/contents/bytopics/faq/",
      supports: "CFN の運営会社（ページ下部の「copyright © Career-tasu, Inc.」）",
      aiOpened: "2026-11-18",
      checked: "2026-11-18",
    },
    {
      id: "S4",
      title: "What you need to know about LA Career Forum",
      publisher: "CFN（CareerForum.Net）",
      url: "https://careerforum.net/en/event/los/data/",
      supports: "イベントの終わりまでに内定を得られる可能性があること",
      aiOpened: "2026-11-18",
      checked: "2026-11-18",
    },
  ],
  blocks: [
    { type: "h2", id: "about", text: "ロサンゼルスキャリアフォーラムとは" },
    {
      type: "p",
      text: "ロサンゼルスキャリアフォーラム（通称：ロスキャリ）は、日英バイリンガルの学生や社会人を対象にした就活イベントです。毎年4月ごろにアメリカのロサンゼルスで開催されます。[S1][S2] 運営はCFN（CareerForum.Net、キャリタス）です。[S3]",
    },
    { type: "p", text: "公式FAQでは、次のような特徴が紹介されています。" },
    {
      type: "list",
      items: ["説明会よりも面接が中心で、その場で面接を受けられる[S1]", "企業によっては、事前応募者だけを面接することもある", "参加は無料[S1]"],
    },
    {
      type: "p",
      text: "2026年は、現役社員によるケーススタディワークショップなど、企業参加型のセミナーも行われました。参加企業は年によって変わります。最新の参加企業は、公式の企業一覧で確認してください。",
    },

    { type: "h2", id: "basics", text: "基本情報（2027年）" },
    { type: "p", text: "公式サイトの案内によると、2027年の開催概要は次のとおりです。[S1] 2026年の開催は終了しています。" },
    {
      type: "table",
      rows: [
        ["日程", "2027年5月15日（土）〜16日（日）[S1][S2]"],
        ["会場", "ロサンゼルス・コンベンションセンター Kentia Hall（ロサンゼルス）[S2]"],
        ["対象", "日英バイリンガル（日本語・英語とも初級以上）で、学士以上の学位を持っている（取得見込みを含む）人。CFNへの会員登録が必要[S1]"],
        ["参加費", "無料[S1]"],
        ["服装", "指定なし。面接を受ける場合は、面接にふさわしい服装がおすすめ[S1]"],
      ],
    },
    { type: "p", text: "対象には、次のような人が含まれます。[S1]" },
    {
      type: "list",
      items: [
        "海外の大学・大学院に在籍中の学生や、卒業した人",
        "日本の大学に在籍中で、留学経験がある人",
        "留学経験の有無にかかわらず、海外や英語環境での生活経験がある人",
        "留学や海外勤務の経験がある社会人",
      ],
    },
    { type: "p", text: "卒業まで時間がある人も、インターン探しや企業研究のために参加できます。[S1]" },

    { type: "h2", id: "flow", text: "参加までの流れ" },
    { type: "p", text: "公式FAQをもとにした、ざっくりした流れは次のとおりです。" },
    { type: "note", text: "CFNに登録する → 気になる企業に事前に応募する → イベント当日に面接・ブース訪問 → 内定・次の選考へ[S1][S4]" },
    {
      type: "list",
      items: [
        "当日登録もできますが、事前登録がおすすめです。特に初日は、事前登録をしておくと安心です[S1]",
        "入場の受付（チェックイン）は、CFNアプリまたはMy CFNのページからできます[S1]",
        "企業によっては、事前応募者を優先して面接します。気になる企業には、早めに応募しておきましょう[S1]",
        "面接を予定していなくても、履歴書を印刷して持っていくと安心です[S1]",
        "会場の入口付近に、無料のクロークがあります[S1]",
        "会場マップは、開催の数日前にCFNで公開されます[S1]",
      ],
    },

    { type: "h2", id: "more", text: "詳しく知りたい人へ" },
    { type: "p", text: "このページでは、ロスキャリの基本情報だけを紹介しています。最新の日程や参加企業は、公式サイトで確認してください。" },
    { type: "links", items: [{ text: "ロサンゼルスキャリアフォーラム（CFN公式）", url: "https://careerforum.net/ja/event/los/" }] },
  ],
};
