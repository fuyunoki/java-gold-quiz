import type { CategoryModule } from '../CategoryModule'

/**
 * 分野: モジュールシステム（JPMS / Java Platform Module System）
 *
 * module-info.java、requires / exports / opens / requires transitive、
 * サービス（provides/uses）、自動モジュール。Java Gold SE17 の頻出範囲。
 */
export const modulesModule: CategoryModule = {
  category: {
    id: 'modules',
    name: 'モジュールシステム（JPMS）',
    description: 'module-info、requires/exports/opens、requires transitive、サービス、自動モジュール',
    order: 9,
  },
  questions: [
    {
      id: 'modules-006',
      categoryId: 'modules',
      difficulty: 1,
      prompt: 'モジュール宣言を書くファイル名と置き場所として正しいものを選びなさい。',
      choices: [
        { id: 'a', text: 'module-info.java を、モジュールのソースのルート（最上位）に置く' },
        { id: 'b', text: 'package-info.java を各パッケージに置く' },
        { id: 'c', text: 'module.xml をプロジェクト直下に置く' },
        { id: 'd', text: 'MANIFEST.MF にモジュール定義を書く' },
      ],
      correctChoiceIds: ['a'],
      explanation:
        'JPMS（モジュールシステム）では、モジュールの定義を module-info.java という特別なファイルに書きます。\n' +
        'このファイルはモジュールのソースの「ルート（最上位）」に1つだけ置きます。\n\n' +
        '中身は module 名 { requires ...; exports ...; } のような宣言です。\n' +
        'package-info.java（パッケージの説明用）や MANIFEST.MF とは役割が別なので混同しないようにしましょう。',
    },
    {
      id: 'modules-001',
      categoryId: 'modules',
      difficulty: 1,
      prompt: '次の module-info.java の各行の意味として正しい組み合わせを選びなさい。',
      code: `module com.example.app {
    requires java.sql;
    exports com.example.app.api;
}`,
      choices: [
        {
          id: 'a',
          text: 'requires は「このモジュールが java.sql に依存する」、exports は「api パッケージを他モジュールに公開する」',
        },
        { id: 'b', text: 'requires は「api パッケージを公開する」、exports は「依存を宣言する」' },
        { id: 'c', text: 'requires も exports も、どちらも依存の宣言である' },
        { id: 'd', text: 'exports を書くと、そのパッケージは他モジュールから見えなくなる' },
      ],
      correctChoiceIds: ['a'],
      explanation:
        'module-info.java の2大キーワードの向きを押さえましょう。\n' +
        '・requires 名前; … 「自分が他のモジュールに依存する（使う）」宣言。ここでは java.sql を使う。\n' +
        '・exports パッケージ; … 「自分のパッケージを他モジュールに公開する（使わせる）」宣言。\n\n' +
        '重要なのは、モジュールでは「exports していないパッケージは、たとえ public クラスでも外部から使えない」点です。\n' +
        'つまり公開範囲をモジュール単位で厳密に制御できます。',
    },
    {
      id: 'modules-004',
      categoryId: 'modules',
      difficulty: 2,
      prompt: 'モジュール A の中にある public クラスを、別モジュール B から使いたい。A 側で必要な設定を選びなさい。',
      choices: [
        { id: 'a', text: 'そのクラスが属するパッケージを A の module-info で exports する' },
        { id: 'b', text: 'クラスを public にすれば、exports しなくても他モジュールから使える' },
        { id: 'c', text: 'B 側で requires するだけでよく、A 側の設定は不要' },
        { id: 'd', text: 'A のすべてのパッケージは自動的に公開されるので何もしなくてよい' },
      ],
      correctChoiceIds: ['a'],
      explanation:
        'モジュールシステムの大原則は「デフォルトでは何も外に見せない（強いカプセル化）」です。\n' +
        'クラスを public にしても、そのパッケージを exports していなければ他モジュールからは使えません（b, d は誤り）。\n\n' +
        '他モジュールに使わせるには、A 側で該当パッケージを exports する必要があります。\n' +
        'そのうえで B 側が requires A する、という「公開する側（exports）」と「依存する側（requires）」の両方が揃って初めて使えます。',
    },
    {
      id: 'modules-002',
      categoryId: 'modules',
      difficulty: 2,
      prompt: 'exports と opens の違いとして正しいものを選びなさい。',
      choices: [
        {
          id: 'a',
          text: 'exports はコンパイル時・実行時の通常アクセスを許可し、opens は実行時のリフレクションによるアクセス（private含む）を許可する',
        },
        { id: 'b', text: 'exports と opens はまったく同じ意味である' },
        { id: 'c', text: 'opens はコンパイルを速くするための指定である' },
        { id: 'd', text: 'exports を書くと自動的に opens も有効になる' },
      ],
      correctChoiceIds: ['a'],
      explanation:
        'どちらもパッケージを外に見せる指定ですが、「見せ方」が違います。\n' +
        '・exports … 通常のアクセス（public メンバへのコンパイル時・実行時アクセス）を許可する。\n' +
        '・opens … 実行時の「リフレクション」によるアクセスを許可する。private メンバにも届く。\n\n' +
        'フレームワーク（DI や JPA、JSON ライブラリなど）はリフレクションで内部にアクセスするため、\n' +
        'そうしたライブラリに渡すパッケージは opens が必要になることがあります。\n' +
        'exports と opens は独立しており、片方を書いてももう片方は自動では有効になりません（d は誤り）。',
    },
    {
      id: 'modules-003',
      categoryId: 'modules',
      difficulty: 2,
      prompt: 'requires transitive の効果として正しいものを選びなさい。',
      code: `module com.example.core {
    requires transitive java.sql;
}
// com.example.app が requires com.example.core した場合`,
      choices: [
        {
          id: 'a',
          text: 'core に依存するモジュール（app）は、明示的に requires しなくても java.sql を読めるようになる',
        },
        { id: 'b', text: 'transitive を付けると java.sql への依存が無効になる' },
        { id: 'c', text: 'app 側で必ず requires java.sql を別途書かないとコンパイルできない' },
        { id: 'd', text: 'transitive は実行時のみ有効で、コンパイル時には影響しない' },
      ],
      correctChoiceIds: ['a'],
      explanation:
        'requires transitive は「依存を、自分を使う相手にも引き継がせる（推移的にする）」指定です。\n\n' +
        'core が requires transitive java.sql と書くと、core を requires するモジュール（app）は\n' +
        'java.sql を明示的に requires しなくても使えるようになります（依存が自動的に伝わる）。\n\n' +
        'これは、core の公開 API のメソッド引数や戻り値に java.sql の型が出てくる場合などに有用です\n' +
        '（app はその型を扱うために java.sql が見える必要があるため）。',
    },
    {
      id: 'modules-008',
      categoryId: 'modules',
      difficulty: 2,
      prompt: 'module-info.java を持たない普通の JAR を「モジュールパス」に置いたとき、どう扱われますか。',
      choices: [
        {
          id: 'a',
          text: '自動モジュール（automatic module）として扱われ、全パッケージを公開し、他の全モジュールを読める',
        },
        { id: 'b', text: 'コンパイルエラーになり、モジュールパスには置けない' },
        { id: 'c', text: '無名モジュール（unnamed module）として扱われ、他モジュールからは一切参照できない' },
        { id: 'd', text: 'その JAR は自動的に module-info.java が生成されて書き換えられる' },
      ],
      correctChoiceIds: ['a'],
      explanation:
        'module-info を持たない既存 JAR を「モジュールパス」に置くと、「自動モジュール」になります。\n' +
        '自動モジュールは移行を助けるための仕組みで、次の特徴があります。\n' +
        '・すべてのパッケージが exports されている（全公開）。\n' +
        '・他のすべてのモジュールを読める（requires が自動）。\n' +
        '・モジュール名は JAR の Automatic-Module-Name（MANIFEST）か、無ければファイル名から推測される。\n\n' +
        '（参考: 同じ JAR を「クラスパス」に置いた場合は「無名モジュール」という別の扱いになります。）',
    },
    {
      id: 'modules-007',
      categoryId: 'modules',
      difficulty: 2,
      prompt: 'requires（transitive なし）についての説明として正しいものを選びなさい。',
      choices: [
        { id: 'a', text: 'そのモジュールへの依存を宣言し、コンパイル時にも実行時にも必要になる' },
        { id: 'b', text: 'コンパイル時のみ必要で、実行時には不要になる' },
        { id: 'c', text: '実行時のみ必要で、コンパイル時には不要になる' },
        { id: 'd', text: '依存先のすべてのパッケージを自分が公開することを意味する' },
      ],
      correctChoiceIds: ['a'],
      explanation:
        'requires 名前; は「自分がそのモジュールに依存する」という宣言で、コンパイル時・実行時の両方でその依存が必要になります。\n\n' +
        '関連する修飾子も整理しておきましょう。\n' +
        '・requires transitive … 依存を、自分を使う相手にも引き継ぐ。\n' +
        '・requires static … コンパイル時は必要だが実行時は任意（オプション依存）。\n\n' +
        'd は exports の説明であり、requires とは向きが逆（requires は「使う側」）なので誤りです。',
    },
    {
      id: 'modules-005',
      categoryId: 'modules',
      difficulty: 3,
      prompt: 'サービス（ServiceLoader の仕組み）を使うとき、提供側と利用側の module-info の書き方として正しい組み合わせを選びなさい。',
      code: `// サービスインターフェース: com.example.spi.Codec`,
      choices: [
        {
          id: 'a',
          text: '提供側: provides com.example.spi.Codec with com.example.impl.JsonCodec; 利用側: uses com.example.spi.Codec;',
        },
        { id: 'b', text: '提供側: uses ...; 利用側: provides ... with ...;' },
        { id: 'c', text: '提供側・利用側とも provides ... with ...; を書く' },
        { id: 'd', text: 'ServiceLoader を使う場合、module-info には何も書かなくてよい' },
      ],
      correctChoiceIds: ['a'],
      explanation:
        'ServiceLoader は「インターフェースだけ知っていれば、実装をプラグインのように差し込める」仕組みです。\n' +
        'module-info での宣言は、提供側と利用側で向きが逆になります。\n' +
        '・提供側（実装を用意する）… provides インターフェース with 実装クラス;\n' +
        '・利用側（実装を探して使う）… uses インターフェース;\n\n' +
        '利用側は ServiceLoader.load(Codec.class) で実装を取得します。\n' +
        '「provides ... with ...（出す側）」「uses（使う側）」の対応を覚えましょう（b, c は向きが誤り）。',
    },
    {
      id: 'modules-009',
      categoryId: 'modules',
      difficulty: 3,
      prompt: '限定公開（qualified exports）の記述 exports com.example.internal to com.example.test; の意味として正しいものを選びなさい。',
      choices: [
        {
          id: 'a',
          text: 'internal パッケージを、指定した com.example.test モジュールにだけ公開し、他のモジュールには見せない',
        },
        { id: 'b', text: 'internal パッケージをすべてのモジュールに公開する' },
        { id: 'c', text: 'com.example.test モジュールを requires する宣言である' },
        { id: 'd', text: 'internal パッケージを完全に非公開にする（誰も使えない）' },
      ],
      correctChoiceIds: ['a'],
      explanation:
        'exports ... to ...; は「限定公開（qualified exports）」で、公開先を特定のモジュールに絞る書き方です。\n\n' +
        'exports com.example.internal to com.example.test; は、internal パッケージを\n' +
        'com.example.test モジュールにだけ見せ、それ以外のモジュールからは隠します。\n\n' +
        'テスト用モジュールや、信頼できる特定モジュールにだけ内部 API を使わせたいときに使います。\n' +
        '「to」を付けない普通の exports は全モジュールに公開、「to」付きは指定先だけ、という違いです。',
    },
  ],
} satisfies CategoryModule
