# Selector Collector (Chrome Extension)

## これは何（What's this?）

「Selector Collector」は、Web ページ上でクリックした要素の **テキスト内容** をクリック順に収集し、ワンクリックでクリップボードへコピーできる **Google Chrome 拡張機能** です。

## 前提条件（Prerequisites）

- **Google Chrome 115 以上**（Manifest V3 対応版）
- デスクトップ環境（Windows / macOS / Linux）
- 拡張機能の「デベロッパーモード」を有効化できる権限（後述）
  )

## 必要なライブラリ（Required Libraries）

本拡張は HTML / CSS / JavaScript で構成されているため、追加ライブラリのインストールは不要です。

---

# 使い方（How to Use）

## 1. 準備（Preparation）

### リポジトリのクローンまたはダウンロード

```bash
git clone https://github.com/yourname/selector-collector-extension.git
```

### 拡張機能の読み込み（Load unpacked）

1. `chrome://extensions` を開く。
2. 右上の **Developer mode** をオンにする。
3. **Load unpacked** をクリックし、プロジェクトのルートフォルダを選択。

   - フォルダ構成は次の通り：

     ```text
     selector-collector-extension/
     ├── manifest.json
     ├── popup/
     ├── src/
     └── assets/
     ```

> **アイコン差し替え**：`assets/icons/` 内の `png` を任意の PNG に置き換えてください。

---

## 2. 実行する（Run the Extension）

読み込み後、ツールバーにハサミのアイコン ✂️ が表示されます。クリックでポップアップを開きます。

---

## 3. 拡張機能の操作（Extension Operation）

### 3.1 セレクタ収集モードの開始

- **Start Selecting** ボタンを押すと、ページ上でマウスカーソルが十字に変わります。
- 取得したい要素を順番にクリックしてください（赤いフラッシュでフィードバック）。

### 3.2 キュー確認

- クリック済みのセレクタはポップアップのリストにリアルタイムで追加されます。

### 3.3 コピー & 終了

- **Stop & Copy** を押すと選択モードが終了し、セレクタ一覧が改行区切りでクリップボードへコピーされます。
- そのまま Ctrl+V / Cmd+V でテキストエディタやスプレッドシートに貼り付け可能です。

### 3.4 キューのクリア

- **Clear** ボタンで現在のセレクタキューを初期化できます。

---

## 注意点（Notes）

- Shadow DOM やクロスオリジン iframe 内の要素には未対応です。
- 動的に変化するクラス名・インデックスが含まれる要素では、取得セレクタが時間と共に変わる場合があります。安定した属性（id / data-\*）を持つ要素を推奨します。
- クリップボード API はユーザー操作（ボタン押下）に紐づく必要があるため、自動コピーは行っていません。
- 本拡張はオープンソース（MIT License）です。

---
