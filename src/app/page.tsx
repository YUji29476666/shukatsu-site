// サイトの入口（/）は日本語版（/ja/）へ移動する
export default function Root() {
  return (
    <>
      <meta httpEquiv="refresh" content="0; url=/ja/" />
      <p className="p-10">
        <a href="/ja/">日本語版へ移動します</a>
      </p>
    </>
  );
}
