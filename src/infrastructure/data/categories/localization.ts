import type { CategoryModule } from '../CategoryModule'

/**
 * 分野: ローカライゼーション（国際化 / i18n）
 *
 * Locale、ResourceBundle とフォールバック、NumberFormat、通貨・数値の書式化。
 */
export const localizationModule: CategoryModule = {
  category: {
    id: 'localization',
    name: 'ローカライゼーション',
    description: 'Locale、ResourceBundle とフォールバック、NumberFormat、通貨・数値の書式化',
    order: 11,
  },
  questions: [
    {
      id: 'localization-001',
      categoryId: 'localization',
      difficulty: 1,
      prompt: '日本（言語=ja, 国=JP）を表す Locale の作り方として正しいものをすべて選びなさい。',
      choices: [
        { id: 'a', text: 'Locale.JAPAN' },
        { id: 'b', text: 'new Locale("ja", "JP")' },
        { id: 'c', text: 'Locale.forLanguageTag("ja-JP")' },
        { id: 'd', text: 'Locale.of("Japanese")' },
      ],
      correctChoiceIds: ['a', 'b', 'c'],
      explanation:
        'Locale は「言語＋国（地域）」の組み合わせを表し、複数の作り方があります。\n' +
        '・Locale.JAPAN … よく使う組み合わせは定数で用意されている（言語 ja・国 JP）。\n' +
        '・new Locale("ja", "JP") … 言語コードと国コードを指定して作る従来の方法。\n' +
        '・Locale.forLanguageTag("ja-JP") … IETF言語タグ（ハイフン区切り）から作る。\n\n' +
        'd は誤りです。Locale は "Japanese" のような言語名ではなく、"ja"（言語コード）や "JP"（国コード）で指定します。\n' +
        '言語コードは小文字、国コードは大文字が慣習です。',
    },
    {
      id: 'localization-007',
      categoryId: 'localization',
      difficulty: 1,
      prompt: 'Locale.getDefault() の説明として正しいものを選びなさい。',
      choices: [
        { id: 'a', text: '実行環境（JVM）の既定ロケールを返す。多くは OS の地域設定に基づく' },
        { id: 'b', text: '常に Locale.US を返す' },
        { id: 'c', text: '常に英語ロケールを返す' },
        { id: 'd', text: 'ロケールを削除するメソッドである' },
      ],
      correctChoiceIds: ['a'],
      explanation:
        'Locale.getDefault() は、その JVM の「既定ロケール」を返します。通常は OS の地域・言語設定に基づいて決まります。\n\n' +
        'NumberFormat.getInstance() など、ロケールを引数に取らないメソッドは、この既定ロケールを使います。\n' +
        'そのため「明示的にロケールを渡さないと、実行環境によって結果（数値や日付の書式）が変わる」点に注意が必要です。\n' +
        '再現性が必要な場面では、常にロケールを明示的に渡すのが安全です。',
    },
    {
      id: 'localization-002',
      categoryId: 'localization',
      difficulty: 2,
      prompt: 'ResourceBundle.getBundle("Messages", locale) が探すプロパティファイルの「フォールバック（探索）順」として正しいものを選びなさい。（locale = ja_JP の場合）',
      choices: [
        { id: 'a', text: 'Messages_ja_JP → Messages_ja → Messages（基底）の順に探し、見つかったものを使う' },
        { id: 'b', text: 'Messages → Messages_ja → Messages_ja_JP の順' },
        { id: 'c', text: 'Messages_ja_JP のみを探し、無ければ例外' },
        { id: 'd', text: 'Messages_JP → Messages_ja の順' },
      ],
      correctChoiceIds: ['a'],
      explanation:
        'ResourceBundle は「より具体的なものから、より一般的なものへ」フォールバックします。\n' +
        'locale が ja_JP のとき、次の順で探します。\n' +
        '1. Messages_ja_JP.properties（言語＋国で最も具体的）\n' +
        '2. Messages_ja.properties（言語のみ）\n' +
        '3. Messages.properties（基底＝どのロケールでも使う既定）\n\n' +
        'あるキーが具体的なファイルに無くても、基底ファイルにあればそちらが使われます。\n' +
        'この仕組みにより「共通の文言は基底に、言語ごとの違いだけを個別ファイルに」書けます。',
    },
    {
      id: 'localization-003',
      categoryId: 'localization',
      difficulty: 2,
      prompt: '次のコードの出力として最も適切なものを選びなさい。',
      code: `NumberFormat nf =
    NumberFormat.getCurrencyInstance(Locale.US);
System.out.println(nf.format(1234.5));`,
      choices: [
        { id: 'a', text: '$1,234.50' },
        { id: 'b', text: '1234.5' },
        { id: 'c', text: '1,234.50 USD' },
        { id: 'd', text: '¥1,235' },
      ],
      correctChoiceIds: ['a'],
      explanation:
        'NumberFormat.getCurrencyInstance(locale) は、そのロケールの「通貨表示」に整形するフォーマッタを返します。\n\n' +
        'Locale.US なので、通貨記号 $、3桁ごとのカンマ区切り、小数2桁で表示され "$1,234.50" になります。\n' +
        '同じ数値でも Locale.JAPAN なら "￥1,235"（円は小数なし）のように、ロケールで書式が変わります。\n\n' +
        'このように「数値そのもの」と「表示のしかた」を分離できるのが国際化 API の利点です。',
    },
    {
      id: 'localization-006',
      categoryId: 'localization',
      difficulty: 2,
      prompt: 'NumberFormat の format と parse の関係として正しいものを選びなさい。',
      code: `NumberFormat nf = NumberFormat.getInstance(Locale.US);
String s = nf.format(1234.5);      // (1)
Number n = nf.parse("2,000.75");   // (2)`,
      choices: [
        {
          id: 'a',
          text: 'format は数値→文字列（"1,234.5"）、parse は文字列→数値（Number）で、互いに逆の変換',
        },
        { id: 'b', text: 'format も parse も数値を返す' },
        { id: 'c', text: 'parse は例外を投げないので throws 宣言は不要' },
        { id: 'd', text: 'format は文字列を数値に変換するメソッドである' },
      ],
      correctChoiceIds: ['a'],
      explanation:
        'format と parse は逆向きの変換です。\n' +
        '・format(数値) … 数値を、ロケールに合わせた「文字列」にする（例: 1234.5 → "1,234.5"）。\n' +
        '・parse(文字列) … "2,000.75" のような文字列を「数値（Number）」に戻す。\n\n' +
        'parse は入力が数値として解釈できないと ParseException（チェック例外）を投げるため、\n' +
        'catch するか throws 宣言が必要です（c は誤り）。\n' +
        '「format＝出力用（数値→文字列）」「parse＝入力用（文字列→数値）」と覚えましょう。',
    },
    {
      id: 'localization-004',
      categoryId: 'localization',
      difficulty: 2,
      prompt: 'ResourceBundle 用のプロパティファイルについて、正しい説明をすべて選びなさい。',
      choices: [
        { id: 'a', text: 'キー=値 の形式で記述する（例: greeting=こんにちは）' },
        { id: 'b', text: 'ファイル名は「基底名_言語_国.properties」の規則に従う' },
        { id: 'c', text: '基底ファイル（Messages.properties）はどのロケールでも最後のよりどころになる' },
        { id: 'd', text: 'プロパティファイルは1つの言語につき必ず全キーを重複して持たなければならない' },
      ],
      correctChoiceIds: ['a', 'b', 'c'],
      explanation:
        'プロパティファイルは国際化のメッセージ置き場です。\n' +
        '・a … 中身は key=value の1行ずつ。コードからは bundle.getString("greeting") で取り出す。\n' +
        '・b … ファイル名は Messages_ja_JP.properties のように「基底名＋ロケール」で命名する。\n' +
        '・c … 基底ファイルは、具体的なファイルに該当キーが無いときの最終フォールバック先になる。\n\n' +
        'd は誤りです。共通の値は基底ファイルに書けばよく、各言語ファイルは「その言語で変える分だけ」書けば十分です。\n' +
        '全キーを毎回重複させる必要はありません。',
    },
    {
      id: 'localization-008',
      categoryId: 'localization',
      difficulty: 2,
      prompt: '同じ数値 1000000 を、あるロケールでは "1,000,000"、別のロケールでは "1.000.000" のように区切りたい。適切な方法を選びなさい。',
      choices: [
        {
          id: 'a',
          text: 'NumberFormat.getInstance(locale) を使い、ロケールごとに区切り文字を自動で切り替える',
        },
        { id: 'b', text: '自分で String.replace を使い、手動でカンマやピリオドを挿入する' },
        { id: 'c', text: 'Integer.toString を使えばロケールに応じて自動整形される' },
        { id: 'd', text: '区切り文字はどのロケールでも必ずカンマなので、切り替えは不要' },
      ],
      correctChoiceIds: ['a'],
      explanation:
        '桁区切りの記号はロケールによって異なります（英語圏はカンマ、一部欧州言語はピリオドなど）。\n\n' +
        'NumberFormat.getInstance(locale).format(1000000) を使えば、そのロケールに応じた区切り文字で自動整形されます。\n' +
        '手動での文字列操作（b）はロケール差を自分で管理することになり、間違いやすく国際化の意味がありません。\n' +
        'Integer.toString（c）は区切りを入れませんし、区切りが常にカンマとは限りません（d は誤り）。\n\n' +
        '「書式はロケールに任せる」のが国際化 API の基本方針です。',
    },
    {
      id: 'localization-005',
      categoryId: 'localization',
      difficulty: 1,
      prompt: '次のコードの出力を選びなさい。',
      code: `Locale l = Locale.JAPAN;
System.out.println(l.getLanguage() + "_" + l.getCountry());`,
      choices: [
        { id: 'a', text: 'ja_JP' },
        { id: 'b', text: 'JP_ja' },
        { id: 'c', text: 'Japanese_Japan' },
        { id: 'd', text: 'jp_JA' },
      ],
      correctChoiceIds: ['a'],
      explanation:
        'Locale は言語コードと国コードを持ちます。\n' +
        '・getLanguage() … 言語コード（小文字）。日本語は "ja"。\n' +
        '・getCountry() … 国コード（大文字）。日本は "JP"。\n\n' +
        'よって出力は "ja_JP"。言語コードは小文字・国コードは大文字という慣習を覚えておきましょう\n' +
        '（"Japanese" や "Japan" のような名称ではなくコードで表されます）。',
    },
    {
      id: 'localization-009',
      categoryId: 'localization',
      difficulty: 1,
      prompt: 'ResourceBundle.getString(key) で、指定したキーがどのプロパティファイルにも存在しない場合の挙動として正しいものを選びなさい。',
      choices: [
        { id: 'a', text: 'MissingResourceException（非チェック例外）が投げられる' },
        { id: 'b', text: 'null が返る' },
        { id: 'c', text: '空文字 "" が返る' },
        { id: 'd', text: 'キーの名前がそのまま返る' },
      ],
      correctChoiceIds: ['a'],
      explanation:
        'ResourceBundle.getString(key) は、基底ファイルまで探してもキーが見つからない場合、\n' +
        'MissingResourceException を投げます（null や空文字は返しません）。\n\n' +
        'これは RuntimeException のサブクラス（非チェック例外）なので catch は必須ではありませんが、\n' +
        'キーの打ち間違いや翻訳漏れを実行時に検知できます。\n' +
        '「無いキーは例外」という挙動を押さえ、キー名は定数化するなどして間違いを防ぐとよいでしょう。',
    },
    {
      id: 'localization-010',
      categoryId: 'localization',
      difficulty: 2,
      prompt: '次のコードの出力として最も適切なものを選びなさい。',
      code: `NumberFormat nf =
    NumberFormat.getPercentInstance(Locale.US);
System.out.println(nf.format(0.25));`,
      choices: [
        { id: 'a', text: '25%' },
        { id: 'b', text: '0.25%' },
        { id: 'c', text: '0.25' },
        { id: 'd', text: '2500%' },
      ],
      correctChoiceIds: ['a'],
      explanation:
        'NumberFormat.getPercentInstance(locale) は「パーセント表示」用のフォーマッタです。\n' +
        '渡した数値を100倍し、% 記号を付けて表示します。\n\n' +
        '0.25 は「割合（＝25%）」として扱われ、format すると "25%" になります。\n' +
        '「0.25 のまま % を付ける」のではなく「×100して % を付ける」点がポイントです。\n' +
        'getCurrencyInstance（通貨）、getInstance（一般数値）などと同じ系統のメソッドです。',
    },
    {
      id: 'localization-011',
      categoryId: 'localization',
      difficulty: 2,
      prompt: 'ResourceBundle.getBundle("Messages", locale) で、指定ロケール用のファイルが1つも見つからない場合の挙動として正しいものを選びなさい。',
      choices: [
        {
          id: 'a',
          text: '指定ロケールのファイルが無ければ、既定ロケール用のファイル、さらに基底ファイル（Messages.properties）へとフォールバックする',
        },
        { id: 'b', text: '見つからなければ即座に必ず例外になり、フォールバックは行われない' },
        { id: 'c', text: '基底ファイル（Messages.properties）は探索対象に含まれない' },
        { id: 'd', text: '指定ロケール以外は一切探さない' },
      ],
      correctChoiceIds: ['a'],
      explanation:
        'getBundle は「より具体的なものから、より一般的なものへ」段階的に探します。\n' +
        '指定ロケール（言語_国 → 言語）で見つからない場合、既定ロケール（Locale.getDefault()）用も試み、\n' +
        '最終的に基底ファイル Messages.properties へフォールバックします。\n\n' +
        'そのため、基底ファイルさえ用意しておけば、未対応ロケールでも既定文言で動作します。\n' +
        '基底ファイルも含めて本当に何も見つからないときに初めて MissingResourceException になります。',
    },
    {
      id: 'localization-012',
      categoryId: 'localization',
      difficulty: 2,
      prompt: '日付を「ロケールに応じた月名（例: 英語なら March、日本語なら 3月）」で表示したい。適切な方法を選びなさい。',
      choices: [
        {
          id: 'a',
          text: 'DateTimeFormatter.ofLocalizedDate(...) や ofPattern(...).withLocale(locale) を使い、ロケールを指定して整形する',
        },
        { id: 'b', text: '月の数値を自分で if 文で英語名・日本語名に変換する' },
        { id: 'c', text: 'LocalDate.toString() を使えばロケールに応じて自動で月名になる' },
        { id: 'd', text: '月名のローカライズは Java では不可能である' },
      ],
      correctChoiceIds: ['a'],
      explanation:
        '日付・時刻の言語依存の整形は DateTimeFormatter にロケールを与えて行います。\n' +
        '・ofLocalizedDate(FormatStyle) … ロケール標準の書式で整形。\n' +
        '・ofPattern("MMMM").withLocale(locale) … パターン＋ロケール指定で月名などを言語化。\n\n' +
        'こうすると同じ日付でも locale に応じて "March" / "3月" のように切り替わります。\n' +
        '自前の if 変換（b）は保守が大変で国際化の意味がなく、toString()（c）は ISO 形式（2024-03-15）で月名にはなりません。',
    },
  ],
} satisfies CategoryModule
