# CLAUDE.md：海外留学生の就活情報サイト（モック）

このフォルダで、海外の大学で学ぶ日本人留学生向けの就活情報サイトのモックを作る。

## 最初に読むもの
1. docs/site-design-decisions.md：仕様（構成・ルール・記事の並び順）。**画像と違うところは、この資料を優先する**
2. design/top-pc.png：トップページのデザイン（イベントはバナー＋フォーラムのピル、ヒーローに「初めての方へ →」）
3. design/article-pc.png：記事ページのデザイン（少し前の版。前の記事／次の記事と、関連記事のカードは資料のとおりに作る）
4. 記事の元データ：../glocareer-site/drafts/wiki/*.md（Ryugaku Wiki の原文。読むだけで、書き換えない）

## 技術構成
- Next.js（App Router）＋ React ＋ TypeScript ＋ Tailwind CSS
- next.config で output: "export"（静的書き出し）。サーバー機能・データベース・ログインは作らない
- アイコンは lucide-react。それ以外のライブラリは必要最小限（タブは自前で作る）
- 記事・カテゴリ・イベントの中身は src/data/ の TypeScript ファイルにまとめる。画面の部品に文章を直接書かない
- Markdown は使わない。記事の本文は「部品の並び」（段落・ステップ・NG/こうする・例文カード・チェックリスト・基本情報カード・タイムライン・Q&A）として持つ

## データ
- カテゴリの slug：bosscari（ボスキャリ）／timeline（就活タイムライン）／jobs（求人・就職情報）／selection（応募・面接）
- 記事の slug：drafts/wiki のファイル名と同じ（例：self-pr、spi、tamatebako）。wiki にない「マナー・服装」は manners
- URL：/ja/{カテゴリ}/{記事}/。カテゴリページは /ja/{カテゴリ}/
- 並び順・前後の記事・紹介の扱いは docs/site-design-decisions.md の「記事の並び順」
- 記事ごとに：title、category（ホーム）、section（中カテゴリ）、popular（番号 or なし）、related（slug 3つ）、lastChecked（今は空）、sources（今は空）、origin（wiki のページ名）、blocks（本文）

## 記事の本文の作り方
- **今回のモックで本文まで作るのは「自己PR」だけ**。wiki の原文を部品に置き換える（中身を足さない・変えない）。回答例は「回答例（架空の例）」と見出しに添える
- ほかの記事はタイトルと「この記事は準備中です」だけの仮ページにする（リンク切れを出さないため）
- 原文にない見出し・質問・例文・数字・出典を作らない

## 写真
- Unsplash から選んでダウンロードし public/images/ に保存（外部 URL の直リンクはしない）。撮影者名と元 URL を src/data/photos.ts に記録
- 人物の顔が大きく写るもの、実在の大学や会社が特定できるもの、看板の文字が読めるものは避ける。AI 生成画像は使わない
- 写真をダウンロードできない場合は、無地の色の枠に「写真（仮）」と書いて先に進み、報告する

## 文言のルール
- サイト名は［サイト名］のまま。「公式」「公認」など公的機関だと誤解させる言葉は使わない
- 日付は［日付］、出典は［確認後に入れます］のまま。年・数字を作らない
- English のリンク先は「英語版は準備中です」の仮ページ
- 「初めての方へ →」のリンク先 /ja/about は、見出し（このサイトについて／こんな人に／使い方／情報の確かめ方／運営について）だけの仮ページ。本文は作らない
- イベントのバナーのリンク先は仮（#）。後でグロキャリのイベントページの URL に差し替える
- 「報告する」ボタンのリンク先は仮（#report）。後で Google フォームの URL に差し替える

## 確認
- npm run build（静的書き出し）が通ること
- Playwright で PC（1440px）とスマホ（390px）のスクリーンショットを撮る：トップ、カテゴリページ（selection）、記事ページ（self-pr）
- 確認すること：表示崩れがない／画像が読み込まれる／カテゴリから探すのタブが切り替わる（矢印キーでも）／トップと記事ページのリンクが 404 にならない／自己PR の前後がガクチカと長所短所になっている
- 区切りごとに報告して、確認を待つ。GitHub への push や公開はまだしない

## 現在の状態（2026-11-18、claude.ai の会話で作成済み）
- サイトはひととおり動く状態。トップ／カテゴリ4つ／記事38本（本文は自己PRのみ）／検索／about・contact・privacy・en の仮ページ
- 主なファイル：src/data（categories.ts・articles.ts・articles/self-pr.ts・site.ts）、src/components、src/app/ja
- 動かし方：`npm install` → `npm run dev`（http://localhost:3000/ja/）
- 書き出し：`npm run build`（out/ にできる）
- 確認：`npm run check`（out/ を配信してリンク切れ・タブ・前後の記事・検索を確認し、screenshots/ に撮る。Chrome の場所が違うときは環境変数 CHROME で指定）
- 写真はまだ無い。src/data/site.ts の photos に登録すると「写真（仮）」の枠が写真に変わる
- 次にやること：写真、残りの記事の本文（wiki を部品に置き換え）、サイト名、イベント URL、報告フォーム URL
