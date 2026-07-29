import type { CategoryModule } from '../CategoryModule'

/**
 * 分野: 例外処理とアサーション
 *
 * チェック例外/非チェック例外、try-with-resources、マルチキャッチ、
 * catch の順序、finally、抑制例外、assert。
 */
export const exceptionsModule: CategoryModule = {
  category: {
    id: 'exceptions',
    name: '例外処理とアサーション',
    description: 'チェック/非チェック例外、try-with-resources、マルチキャッチ、finally、assert',
    order: 5,
  },
  questions: [
    {
      id: 'exceptions-001',
      categoryId: 'exceptions',
      difficulty: 1,
      prompt: '次のうち「非チェック例外（unchecked exception）」であるものをすべて選びなさい。',
      choices: [
        { id: 'a', text: 'NullPointerException' },
        { id: 'b', text: 'IllegalArgumentException' },
        { id: 'c', text: 'IOException' },
        { id: 'd', text: 'ArrayIndexOutOfBoundsException' },
      ],
      correctChoiceIds: ['a', 'b', 'd'],
      explanation:
        '例外は大きく2種類に分かれます。見分け方は「RuntimeException を継承しているか」です。\n' +
        '・非チェック例外（unchecked）… RuntimeException のサブクラス。try-catch や throws が必須ではない。\n' +
        '　　例: NullPointerException, IllegalArgumentException, ArrayIndexOutOfBoundsException など。\n' +
        '・チェック例外（checked）… Exception のサブクラスで RuntimeException 以外。catch するか throws 宣言が必須。\n' +
        '　　例: IOException, SQLException など。\n\n' +
        'IOException だけがチェック例外なので、それ以外の3つが非チェック例外です。\n' +
        '非チェック例外は多くがプログラムのバグ（null 参照や範囲外アクセス）を表します。',
    },
    {
      id: 'exceptions-002',
      categoryId: 'exceptions',
      difficulty: 1,
      prompt: 'try-with-resources 文で「自動的にクローズ（close）される」ために、リソースのクラスが実装している必要があるインターフェースを選びなさい。',
      choices: [
        { id: 'a', text: 'AutoCloseable（または Closeable）' },
        { id: 'b', text: 'Serializable' },
        { id: 'c', text: 'Comparable' },
        { id: 'd', text: 'Iterable' },
      ],
      correctChoiceIds: ['a'],
      explanation:
        'try-with-resources は try(...) の丸括弧内で用意したリソースを、処理が終わると自動で close() してくれる仕組みです。\n' +
        'このためリソースは AutoCloseable インターフェース（close() を持つ）を実装している必要があります。\n\n' +
        '（Closeable は AutoCloseable のサブインターフェースで、ファイルやストリームなど I/O 系が実装しています。）\n' +
        'この仕組みのおかげで、finally で手動 close する定型コードを書かなくてよくなり、閉じ忘れを防げます。',
    },
    {
      id: 'exceptions-009',
      categoryId: 'exceptions',
      difficulty: 1,
      prompt: '独自のチェック例外を作りたい。正しいクラス定義を選びなさい。',
      choices: [
        { id: 'a', text: 'class MyException extends Exception { }' },
        { id: 'b', text: 'class MyException extends RuntimeException { }' },
        { id: 'c', text: 'class MyException implements Exception { }' },
        { id: 'd', text: 'class MyException extends Error { }' },
      ],
      correctChoiceIds: ['a'],
      explanation:
        'チェック例外は「Exception を継承し、かつ RuntimeException は継承しない」クラスです。\n' +
        '・a … Exception を直接継承しているのでチェック例外。これが正解。使う側は catch か throws が必須になります。\n' +
        '・b … RuntimeException を継承すると非チェック例外になってしまう。\n' +
        '・c … 例外は「継承（extends）」して作るもので、implements では作れない（Exception はクラス）。\n' +
        '・d … Error はシステム的な致命的エラー用で、通常のアプリ例外には使いません。\n\n' +
        '「呼び出し側に対処を強制したい」ならチェック例外（Exception 継承）を選びます。',
    },
    {
      id: 'exceptions-003',
      categoryId: 'exceptions',
      difficulty: 2,
      prompt: '次のメソッドの戻り値を選びなさい。',
      code: `static int test() {
    try {
        return 1;
    } finally {
        return 2;
    }
}`,
      choices: [
        { id: 'a', text: '2' },
        { id: 'b', text: '1' },
        { id: 'c', text: 'コンパイルエラー' },
        { id: 'd', text: '3' },
      ],
      correctChoiceIds: ['a'],
      explanation:
        'finally ブロックは「try や catch を抜ける直前に必ず実行される」部分です。\n' +
        'try の中で return 1; に到達しても、メソッドを抜ける前に finally が実行されます。\n\n' +
        'そしてこの finally の中に return 2; があるため、try の return 1; は上書きされ、最終的な戻り値は 2 になります。\n' +
        'このように finally 内の return は try/catch の return を打ち消してしまうため、\n' +
        '実務では「finally で return しない」のが鉄則です（バグの温床になります）。',
    },
    {
      id: 'exceptions-004',
      categoryId: 'exceptions',
      difficulty: 2,
      prompt: 'マルチキャッチ（1つの catch で複数の例外を受ける）の書き方として正しいものを選びなさい。',
      choices: [
        { id: 'a', text: 'catch (IOException | SQLException e) { }' },
        { id: 'b', text: 'catch (IOException e1, SQLException e2) { }' },
        { id: 'c', text: 'catch (IOException || SQLException e) { }' },
        { id: 'd', text: 'catch (IOException e | SQLException e) { }' },
      ],
      correctChoiceIds: ['a'],
      explanation:
        'マルチキャッチは、複数の例外型を「｜」（パイプ1本）で区切り、変数は1つだけ書きます。\n' +
        '正しい形は catch (型A | 型B e) です。\n\n' +
        '・b … カンマ区切りや変数2つは不可。\n' +
        '・c … ｜｜（2本）は論理和の演算子で、ここでは使いません。\n' +
        '・d … 変数を複数書くのは不可。\n\n' +
        '注意点として、マルチキャッチに指定する例外どうしが「親子（継承）関係」だと書けません\n' +
        '（例: IOException | FileNotFoundException は不可。FileNotFoundException が IOException のサブクラスのため冗長）。',
    },
    {
      id: 'exceptions-005',
      categoryId: 'exceptions',
      difficulty: 2,
      prompt: '次のコードをコンパイルするとどうなりますか。',
      code: `try {
    doSomething();
} catch (Exception e) {
    System.out.println("Exception");
} catch (IOException e) {
    System.out.println("IOException");
}`,
      choices: [
        { id: 'a', text: '2つ目の catch (IOException) の行でコンパイルエラーになる' },
        { id: 'b', text: '正常にコンパイルできる' },
        { id: 'c', text: '1つ目の catch (Exception) の行でコンパイルエラーになる' },
        { id: 'd', text: '警告は出るがコンパイルできる' },
      ],
      correctChoiceIds: ['a'],
      explanation:
        'catch は上から順に試され、最初にマッチしたものだけが実行されます。\n' +
        'IOException は Exception のサブクラスなので、先に catch (Exception e) が書いてあると\n' +
        'IOException もそこで捕まってしまい、後ろの catch (IOException) には絶対に到達しません。\n\n' +
        'この「到達不能な catch」はコンパイルエラーになります。\n' +
        '正しくは「より具体的な例外（サブクラス）を先に、汎用的な例外（スーパークラス）を後に」書きます。\n' +
        'つまり catch (IOException) → catch (Exception) の順にします。',
    },
    {
      id: 'exceptions-006',
      categoryId: 'exceptions',
      difficulty: 2,
      prompt: '次のコードの出力を選びなさい（クラス A, B の close() はそれぞれ自分の名前を出力する）。',
      code: `class A implements AutoCloseable {
    public void close() { System.out.println("close A"); }
}
class B implements AutoCloseable {
    public void close() { System.out.println("close B"); }
}
// 呼び出し側
try (A a = new A(); B b = new B()) {
    System.out.println("body");
}`,
      choices: [
        { id: 'a', text: 'body / close B / close A' },
        { id: 'b', text: 'body / close A / close B' },
        { id: 'c', text: 'close A / close B / body' },
        { id: 'd', text: 'body だけ' },
      ],
      correctChoiceIds: ['a'],
      explanation:
        'try-with-resources では、複数のリソースは「宣言した順の逆」で close されます。\n' +
        'ここでは A→B の順に宣言しているので、閉じるのは B→A の順です。\n\n' +
        'まず try 本体の "body" が出力され、ブロックを抜けるときに close B → close A の順に呼ばれます。\n' +
        '逆順で閉じるのは、後から用意したリソースが先に用意したリソースに依存している可能性があるためです\n' +
        '（後始末は用意と逆順、と覚えましょう）。',
    },
    {
      id: 'exceptions-008',
      categoryId: 'exceptions',
      difficulty: 2,
      prompt: 'assert 文（アサーション）についての説明として正しいものをすべて選びなさい。',
      choices: [
        { id: 'a', text: 'アサーションは既定では無効で、実行時に -ea（-enableassertions）を付けて初めて有効になる' },
        { id: 'b', text: '条件が false のとき AssertionError が投げられる' },
        { id: 'c', text: 'アサーションは、外部入力（メソッド引数）の妥当性チェックとして使うのが推奨される' },
        { id: 'd', text: 'assert は常に有効で、無効化できない' },
      ],
      correctChoiceIds: ['a', 'b'],
      explanation:
        'assert 条件 : メッセージ; は「ここでは条件が必ず成り立つはず」という開発時の確認に使います。\n' +
        '・a … 既定では無効。実行時に java -ea ... と付けたときだけ有効になる（d は誤り）。\n' +
        '・b … 条件が false だと AssertionError（Error のサブクラス）が投げられる。\n\n' +
        'c は誤りです。アサーションは無効化できてしまうため、public メソッドの引数チェックなど\n' +
        '「必ず実行されてほしい検証」には使ってはいけません。そこは if＋例外（IllegalArgumentException 等）で行います。\n' +
        'アサーションは「内部的にありえないはずの状態」の確認に限定して使うのが原則です。',
    },
    {
      id: 'exceptions-007',
      categoryId: 'exceptions',
      difficulty: 3,
      prompt: 'try-with-resources で「本体でも close() でも例外が発生した」場合の挙動として正しいものを選びなさい。',
      choices: [
        {
          id: 'a',
          text: '本体の例外が呼び出し元に伝播し、close() の例外は「抑制された例外(suppressed)」として本体の例外に付加される',
        },
        { id: 'b', text: 'close() の例外が優先され、本体の例外は完全に消える' },
        { id: 'c', text: '両方の例外が別々にそのまま投げられる' },
        { id: 'd', text: '例外は握りつぶされ、何も起きない' },
      ],
      correctChoiceIds: ['a'],
      explanation:
        'try-with-resources では、本体（try ブロック）で例外が起きると、まずリソースの close() が呼ばれます。\n' +
        'このとき close() 自身も例外を投げると、「例外が2つ」ある状態になります。\n\n' +
        'Java はこの場合、本体で起きた例外を「主役」として呼び出し元へ伝え、\n' +
        'close() の例外を「抑制された例外（suppressed exception）」として主役の例外にぶら下げます。\n' +
        '抑制された例外は後から Throwable#getSuppressed() で取り出せます。\n\n' +
        '昔の finally で手動 close する書き方では close の例外が本体の例外を上書きして消してしまう問題がありましたが、\n' +
        'try-with-resources はこの仕組みで両方の情報を失わないようにしています。',
    },
    {
      id: 'exceptions-010',
      categoryId: 'exceptions',
      difficulty: 1,
      prompt: 'キーワード throw と throws の違いとして正しいものを選びなさい。',
      choices: [
        {
          id: 'a',
          text: 'throw は例外インスタンスを実際に投げる文、throws はメソッド宣言で「この例外を投げうる」と宣言する',
        },
        { id: 'b', text: 'throw はメソッド宣言に書き、throws は本体で例外を投げる' },
        { id: 'c', text: 'throw と throws は同じ意味で交換可能' },
        { id: 'd', text: 'throws は例外を握りつぶすためのキーワードである' },
      ],
      correctChoiceIds: ['a'],
      explanation:
        '似ていますが役割は別です。\n' +
        '・throw … 実際に例外を投げる「文」。例: throw new IllegalArgumentException("bad");\n' +
        '・throws … メソッドの宣言に付け、「このメソッドはこの例外を投げる可能性がある」と呼び出し側に知らせる。\n' +
        '　　例: void read() throws IOException { ... }\n\n' +
        'チェック例外を throw する（かもしれない）メソッドは、その例外を catch しない限り throws で宣言する必要があります。',
    },
    {
      id: 'exceptions-014',
      categoryId: 'exceptions',
      difficulty: 2,
      prompt: '次のうち「非チェック例外（RuntimeException 系）」であるものをすべて選びなさい。',
      choices: [
        { id: 'a', text: 'NumberFormatException' },
        { id: 'b', text: 'ClassCastException' },
        { id: 'c', text: 'InterruptedException' },
        { id: 'd', text: 'FileNotFoundException' },
      ],
      correctChoiceIds: ['a', 'b'],
      explanation:
        'RuntimeException を継承していれば非チェック例外です。\n' +
        '・NumberFormatException … 数値変換失敗。IllegalArgumentException のサブクラスで非チェック。\n' +
        '・ClassCastException … 不正なキャスト。非チェック。\n\n' +
        '一方、次はチェック例外（catch か throws が必須）です。\n' +
        '・InterruptedException … スレッド割り込み。Exception 直系のチェック例外。\n' +
        '・FileNotFoundException … IOException のサブクラスでチェック例外。\n\n' +
        '「バグ由来の実行時エラー系＝非チェック」「外部要因（I/O・割り込み）系＝チェック」と大まかに捉えると整理しやすいです。',
    },
    {
      id: 'exceptions-012',
      categoryId: 'exceptions',
      difficulty: 2,
      prompt: '例外の「連鎖（chaining）」についての説明として正しいものを選びなさい。',
      code: `try {
    readFile();               // IOException を投げうる
} catch (IOException e) {
    throw new RuntimeException("読み込み失敗", e);
}`,
      choices: [
        {
          id: 'a',
          text: '元の例外(e)を「原因(cause)」として新しい例外に包んで投げ直す。あとで getCause() で元をたどれる',
        },
        { id: 'b', text: '元の例外 e は完全に失われ、原因はたどれない' },
        { id: 'c', text: 'チェック例外を非チェック例外に包むことはできない' },
        { id: 'd', text: 'この書き方はコンパイルエラーになる' },
      ],
      correctChoiceIds: ['a'],
      explanation:
        '例外連鎖は「低レベルの例外を、より意味のある例外に包んで投げ直す」テクニックです。\n' +
        'new RuntimeException("...", e) のように第2引数に原因（cause）を渡すと、元の例外がぶら下がります。\n\n' +
        'これにより、呼び出し側では扱いやすい例外を受け取りつつ、getCause() で本当の原因（IOException）まで\n' +
        'スタックトレースをたどれます。原因情報を失わずに抽象度を上げられるのが利点です。\n' +
        'チェック例外を非チェック例外で包むこともよく行われます（c は誤り）。',
    },
    {
      id: 'exceptions-011',
      categoryId: 'exceptions',
      difficulty: 2,
      prompt: '次のメソッドをコンパイルするとどうなりますか。（read() は IOException を throws する）',
      code: `void process() {
    read();   // read() throws IOException
}`,
      choices: [
        {
          id: 'a',
          text: 'コンパイルエラー。IOException（チェック例外）を catch するか、process に throws IOException を付ける必要がある',
        },
        { id: 'b', text: '問題なくコンパイルできる' },
        { id: 'c', text: '実行時に初めて IOException が問題になる' },
        { id: 'd', text: '警告は出るがコンパイルできる' },
      ],
      correctChoiceIds: ['a'],
      explanation:
        'IOException はチェック例外なので、「投げうるメソッドを呼ぶ側」は必ず対処しなければなりません。\n' +
        '対処の方法は2つです。\n' +
        '・try-catch で捕まえる。\n' +
        '・自分のメソッドにも throws IOException を付けて、呼び出し元へ処理を委ねる。\n\n' +
        'このコードはどちらもしていないため、コンパイルエラーになります。\n' +
        '（非チェック例外なら、このような対処は義務ではありません。）',
    },
    {
      id: 'exceptions-013',
      categoryId: 'exceptions',
      difficulty: 3,
      prompt: '次のコードを実行すると、最終的に呼び出し元へ伝わる例外はどれですか。',
      code: `try {
    throw new RuntimeException("A");
} finally {
    throw new RuntimeException("B");
}`,
      choices: [
        { id: 'a', text: '"B"（finally で投げた例外が優先され、"A" は失われる）' },
        { id: 'b', text: '"A"（try で投げた例外が優先される）' },
        { id: 'c', text: '"A" と "B" の両方が同時に投げられる' },
        { id: 'd', text: '"A" が主、"B" が抑制例外として付加される' },
      ],
      correctChoiceIds: ['a'],
      explanation:
        'finally は必ず実行され、その中で例外を投げると、try で投げた例外を“上書き”して伝わります。\n' +
        'この例では try の "A" が投げられかけますが、finally の "B" が投げられるため、最終的に伝わるのは "B" で、\n' +
        '"A" は失われてしまいます（例外が消える危険なパターン）。\n\n' +
        '※これは通常の try-finally の話です。似て非なる try-with-resources では、close() で起きた例外は\n' +
        '「抑制例外(suppressed)」として本体の例外に付加され、両方の情報が残ります（d はそちらの挙動）。\n' +
        '「finally で例外を投げない・return しない」のが安全な理由です。',
    },
  ],
} satisfies CategoryModule
