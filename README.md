# お天気アプリ 🌤️

過去3ヶ月から1週間後までの気温を折れ線グラフで表示するWebアプリ。

## 機能

- 📊 **気温グラフ表示**: 最低気温、最高気温、現在気温を折れ線グラフで可視化
- 📍 **都道府県選択**: 日本全国47都道府県対応
- 🌙 **ダークモード**: 目に優しいダークテーマ
- 📱 **レスポンシブ**: PC・スマホ両対応

## 技術スタック

- **フレームワーク**: Vite + React + TypeScript
- **グラフ**: Recharts
- **天気API**: Open-Meteo (無料・API key不要)
- **デプロイ**: GitHub Pages

## プロジェクト構成

```
src/
├── api/              # 天気APIラッパー
│   ├── weatherInterface.ts  # 共通インターフェース
│   ├── openmeteo.ts         # Open-Meteo実装
│   └── index.ts
├── components/       # Reactコンポーネント
│   ├── WeatherChart.tsx
│   └── PrefectureSelector.tsx
├── data/            # 静的データ
│   └── prefectures.ts
└── App.tsx
```

## 開発

```bash
# 依存パッケージインストール
npm install

# 開発サーバー起動
npm run dev

# ビルド
npm run build
```

## デプロイ

mainブランチにpushすると、GitHub Actionsが自動的にビルド＆デプロイします。

公開URL: https://koteitan.github.io/otenki

## API切り替え

`src/api/` 配下の実装を差し替えることで、別の天気APIに簡単に移行できます。

## 作成者

- **API担当**: かってちゃん 🐳
- **UI担当**: めいちゃん 🪄
