# Claude Code用：実装指示ドキュメント（HHKB Color Simulator）V2

## 0. プロジェクトの全体方針
* **技術構成:** Laravel 13, React, Inertia.js, Tailwind CSS, TypeScript.
* **設計思想:** 「レイアウト（座標定義）」と「ユーザー配色設定（State）」を分離する。
* **フェーズ1目標:** US配列の描画、6色のパレットでの色塗り、LocalStorageへの保存・読み込み・削除機能。

---

## 1. 開発ステップ（指示単位）

### Step 1: プロジェクト基盤とレイアウト定義の作成
> 1. `resources/js/types/keyboard.ts` を作成し、キーの型定義（id, label, x, y, w）を定義してください。
> 2. `resources/js/constants/layouts/us-hhkb.ts` を参照し、HHKB US配列の座標データをエクスポートしてください。
> 3. 各キーの単位は 1u = 40px〜50px 程度の相対座標で設計し、Returnキー (2.25u) や Spaceキー (6u) などの特殊サイズも正確に反映してください。
> 4. `resources/js/app.tsx` を作成し、Inertia.js (React + TypeScript) のエントリーポイントとして設定してください。
> 5. `routes/web.php` を編集し、ルートパス (/) にアクセスした際に Editor ページを表示するように設定してください。
> 6. `resources/js/Pages/Editor.tsx` を新規作成し、ここをメインのシミュレーター画面とします。

### Step 2: 共通カラー定数と状態管理の作成
> 1. 指定の6色（雪, TANPOPO, 桜, 山葵, 藤, 青空）を `resources/js/constants/colors.ts` に定義してください。
> 2. 黄色のキーは、変数名・キー名を **`TANPOPO`** としてください。
> 3. エディタの現在の配色状態（Key IDとColorのマップ）を保持するためのカスタムフック `useKeyboardState` を作成してください。

### Step 3: キーボード描画コンポーネントの実装
> 1. `resources/js/Components/Key.tsx` を作成。Propsとして `label`, `width`, `color`, `onClick` を受け取り、HHKBらしい角丸と陰影のあるデザイン（Tailwind CSS）を適用してください。
> 2. `resources/js/Components/KeyboardCanvas.tsx` を作成し、レイアウトデータを使って `absolute` 配置でキーを並べてください。
> 3. 親コンポーネントから選択中の色でキーの色を塗り替えるロジックを実装してください。

### Step 4: カラーパレットUIの実装
> 1. 画面下部に、6色のパレットを選択する `ColorPicker.tsx` を作成してください。
> 2. 現在選択されている色（Active Color）を視覚的に強調するUIにしてください。

### Step 5: LocalStorageへの保存・一覧機能の実装
> 1. `resources/js/utils/storage.ts` を作成し、配色データに名前をつけて保存、取得、個別削除する機能を実装してください。
> 2. トップページに保存用モーダル（または入力欄）を配置し、一覧ページ（`resources/js/Pages/History.tsx`）から過去のデザインを呼び出せるようにしてください。

---

## 2. 実装上の重要なルール

* **TypeScript:** `any` を禁止し、すべてのPropsとStateに厳格な型定義を行うこと。
* **レイアウト拡張性:** 将来のJIS配列対応を見据え、キーの配置データは外部JSON/オブジェクトから注入する形式を維持すること。

---

## 3. カラーパレット定義（コピー用）

このコードをそのまま定数ファイルに使用するよう指示してください。

```typescript
export const HHKB_PALETTE = {
  YUKI: '#FDFDFD',
  TANPOPO: '#FCEBB6',
  SAKURA: '#FCDDE1',
  WASABI: '#C1DEB7',
  FUJI: '#D1C4E9',
  SORA: '#B3E5FC',
} as const;
```
