# Re Relation 会員サイト

現在運用しているRe Relation会員サイトのフロントを基準にした会員サイトです。

## 画面

- `index.html`: Re Relationログイン
- `dashboard.html`: 会員ホーム
- `lectures.html`: 動画講義・ワーク
- `my_works.html`: 提出したワーク
- `checkin.html`: チェックイン
- `daily_report.html`: 幸せ日記
- `diary.html`: 心の自由帳
- `monthly_report.html`: 月次レポート
- `admin.html`: 管理画面
- `onboarding.html`: 初回登録
- `brand-hero.png`: ログイン画面背景

## ローカル確認

静的HTMLサイトなので、ローカルサーバーで確認できます。

```bash
python3 -m http.server 3000
```

その後、`http://localhost:3000/` を開きます。

## データ

認証とデータ保存にはSupabaseを使用しています。本サイトを別商品向けに本稼働させる前に、既存環境と分離したSupabase設定へ切り替えます。
