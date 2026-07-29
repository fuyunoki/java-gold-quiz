# Java Gold SE17 復習アプリ

Java SE 17 Gold の練習問題を **分野ごと** に復習するフロントエンドのみのアプリ。
iPhone の Safari（ホーム画面追加でのPWA利用）を主対象にしています。

- Vue 3 + Composition API (`<script setup>`) + TypeScript + Vite
- クリーンアーキテクチャ（依存の向きを内側＝ドメインへ固定）
- PWA 対応（オフラインでも復習可能 / ホーム画面に追加）
- 問題データは分野ごとの TS ファイルとして管理

## セットアップ

```bash
npm install
npm run dev        # 開発サーバ（http://localhost:5173）
npm run build      # 型チェック + 本番ビルド（dist/）
npm run preview    # ビルド結果をローカル確認
npm run type-check # 型チェックのみ
```

### iPhone で使う

同じ Wi-Fi 上で `npm run dev -- --host` を起動し、表示される `Network` の
URL（例 `http://192.168.x.x:5173/`）を iPhone の Safari で開きます。
本番運用は `npm run build` の `dist/` を任意の静的ホスティング（GitHub Pages,
Netlify, Vercel 等）に配置し、Safari の共有メニューから「ホーム画面に追加」で
PWA として使えます。

## アーキテクチャ

依存は常に外側 → 内側（`presentation → application → domain`）。
`domain` は Vue にもデータ形式にも一切依存しません。

```
src/
├─ domain/                     # 業務ルールの中核（フレームワーク非依存）
│  ├─ entities/
│  │  ├─ Category.ts           # 分野
│  │  ├─ Question.ts           # 問題・選択肢・「選ぶ数」ルール
│  │  └─ AnswerResult.ts       # 採点結果と純粋な採点関数 gradeAnswer()
│  └─ repositories/
│     └─ QuestionRepository.ts # データ取得の抽象（ポート）
├─ application/                # ユースケース（何をするか）
│  └─ usecases/
│     ├─ ListCategories.ts
│     ├─ StartQuizSession.ts   # 分野の存在確認＋出題（任意でシャッフル）
│     └─ GradeQuestion.ts
├─ infrastructure/            # 実装の詳細（どう用意するか）
│  ├─ data/
│  │  ├─ CategoryModule.ts     # 分野1つ分のデータ型
│  │  ├─ categories/
│  │  │  └─ streams.ts         # ← 分野ごとの問題データ
│  │  └─ index.ts              # 全分野の登録簿
│  └─ repositories/
│     └─ InMemoryQuestionRepository.ts  # ポートの具体実装
├─ composition/
│  └─ container.ts            # コンポジションルート（DIの結線）
├─ presentation/              # Vue（見た目・操作）
│  ├─ composables/useQuiz.ts  # クイズ進行の状態管理
│  ├─ components/QuestionCard.vue
│  ├─ views/HomeView.vue, QuizView.vue
│  └─ router/index.ts
├─ App.vue
└─ main.ts
```

### なぜこの構成か

- **採点・出題ロジックが UI から独立**しているため、テストや仕様変更に強い。
- **データソースを差し替え可能**（今は TS ファイル。将来 API / IndexedDB に
  変えても `InMemoryQuestionRepository` を置き換えるだけ）。
- 画面はユースケースだけを呼ぶので、Vue 側が肥大化しない。

## 問題（分野）の追加方法

1. `src/infrastructure/data/categories/xxx.ts` を作成し、
   `streams.ts` と同じ形で `export const xxxModule: CategoryModule = { ... }`
   を書く。`... satisfies CategoryModule` を付けると型で守られます。
2. `src/infrastructure/data/index.ts` の `categoryModules` 配列に import して
   1 行追加する。

これだけで分野一覧と出題に反映されます（他コードの変更は不要）。

### 問題データの形

```ts
{
  id: 'streams-007',              // 一意なID
  categoryId: 'streams',
  prompt: '設問文',
  code: 'Java コード（任意）',       // あれば等幅で表示
  choices: [{ id: 'a', text: '...' }, /* ... */],
  correctChoiceIds: ['a', 'c'],   // 複数正解も可。個数が「選ぶ数」になる
  explanation: '解説',
}
```

`correctChoiceIds` の要素数が 1 なら単一選択（ラジオ相当）、2 以上なら
複数選択（チェックボックス相当）として UI が自動で切り替わります。

## 出題順について（効率の良い順番）

学習履歴の永続化はまだ無いため、「効率の良い順番」を次の2軸で実装しています。

- **分野の並び**（一覧画面）= おすすめ学習パス順（`Category.order` 昇順）。
  土台になる分野から順に積み上げられます。
- **分野内の並び**（出題）= 難易度 昇順（基礎 → 標準 → 応用）。
  易しい問題で概念を固めてから難問へ進みます（`Question.difficulty` 1〜3）。

ロジックはドメイン層の純粋関数
[`learningOrder.ts`](src/domain/services/learningOrder.ts) にあり、
`StartQuizSession`（既定で難易度順・`shuffle: true` でランダム）と
`ListCategories`（学習パス順）から使われます。

## 収録済み分野（学習パス順・計 57 問）

| 順 | 分野 | 問題数 |
|----|------|--------|
| 1 | ラムダ式と関数型インターフェース | 10 |
| 2 | Stream API | 10 |
| 3 | ジェネリクス | 10 |
| 4 | コレクション | 10 |
| 5 | 例外処理とアサーション | 9 |
| 6 | モダンJava（record / sealed / switch式） | 10 |

各問は難易度（基礎／標準／応用）付きで、解説は Java Silver 取得者向けに
「なぜそうなるか」を噛み砕いて記述しています。

> 今後 並行処理 / NIO.2 / モジュールシステム(JPMS) / JDBC /
> ローカライゼーション / アノテーション 等を同じ形式で追加できます。
```
