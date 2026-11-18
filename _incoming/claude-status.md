
## 現在の状態（2026-11-18、claude.ai の会話で作成済み）
- サイトはひととおり動く状態。トップ／カテゴリ4つ／記事38本（本文は自己PRのみ）／検索／about・contact・privacy・en の仮ページ
- 主なファイル：src/data（categories.ts・articles.ts・articles/self-pr.ts・site.ts）、src/components、src/app/ja
- 動かし方：`npm install` → `npm run dev`（http://localhost:3000/ja/）
- 書き出し：`npm run build`（out/ にできる）
- 確認：`npm run check`（out/ を配信してリンク切れ・タブ・前後の記事・検索を確認し、screenshots/ に撮る。Chrome の場所が違うときは環境変数 CHROME で指定）
- 写真はまだ無い。src/data/site.ts の photos に登録すると「写真（仮）」の枠が写真に変わる
- 次にやること：写真、残りの記事の本文（wiki を部品に置き換え）、サイト名、イベント URL、報告フォーム URL
