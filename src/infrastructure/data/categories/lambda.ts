import type { CategoryModule } from '../CategoryModule'

/**
 * 分野: ラムダ式と関数型インターフェース
 *
 * Stream を理解する土台。主要な関数型インターフェース、メソッド参照、
 * 合成（andThen/compose, and/or/negate）、変数キャプチャ（実質的final）を扱う。
 */
export const lambdaModule: CategoryModule = {
  category: {
    id: 'lambda',
    name: 'ラムダ式と関数型インターフェース',
    description: 'Function / Consumer / Supplier / Predicate、メソッド参照、関数合成、実質的final',
    order: 1,
  },
  questions: [
    {
      id: 'lambda-001',
      categoryId: 'lambda',
      difficulty: 1,
      prompt: '「引数を1つ受け取り boolean を返す」判定に使う標準の関数型インターフェースはどれですか。',
      choices: [
        { id: 'a', text: 'Predicate<T>' },
        { id: 'b', text: 'Function<T, R>' },
        { id: 'c', text: 'Consumer<T>' },
        { id: 'd', text: 'Supplier<T>' },
      ],
      correctChoiceIds: ['a'],
      explanation:
        '標準の関数型インターフェースは「引数」と「戻り値」で覚えると整理できます。\n' +
        '・Predicate<T> … T を受け取り boolean を返す（test）。「〜かどうか」の判定用。\n' +
        '・Function<T,R> … T を受け取り R を返す（apply）。変換用。\n' +
        '・Consumer<T> … T を受け取り何も返さない void（accept）。出力・登録など「消費」用。\n' +
        '・Supplier<T> … 引数なしで T を返す（get）。「供給」用。\n\n' +
        'boolean を返す判定なので Predicate が正解です。filter などで多用します。',
    },
    {
      id: 'lambda-002',
      categoryId: 'lambda',
      difficulty: 1,
      prompt: 'ラムダ式 () -> "hello" を代入できる関数型インターフェースはどれですか。',
      choices: [
        { id: 'a', text: 'Supplier<String>' },
        { id: 'b', text: 'Consumer<String>' },
        { id: 'c', text: 'Function<String, String>' },
        { id: 'd', text: 'Predicate<String>' },
      ],
      correctChoiceIds: ['a'],
      explanation:
        'ラムダ () -> "hello" は「引数なし」で「String を返す」形です。\n' +
        'この形（引数なし・戻り値あり）にあてはまるのは Supplier<String>（get() が String を返す）だけです。\n\n' +
        '・Consumer は戻り値なし（void）なので不可。\n' +
        '・Function や Predicate は引数を1つ取る形なので、引数なしのこのラムダとは形が合いません。\n' +
        'ラムダは「引数の数」と「戻り値の有無/型」で対応するインターフェースを判断します。',
    },
    {
      id: 'lambda-009',
      categoryId: 'lambda',
      difficulty: 1,
      prompt: '@FunctionalInterface アノテーションの説明として正しいものを選びなさい。',
      choices: [
        {
          id: 'a',
          text: '付けると、抽象メソッドがちょうど1つであることをコンパイラが検査してくれる（付けなくても関数型インターフェースにはなり得る）',
        },
        { id: 'b', text: 'これを付けないと、そのインターフェースはラムダで実装できない' },
        { id: 'c', text: 'このアノテーションを付けると抽象メソッドを複数持てるようになる' },
        { id: 'd', text: '実行時にラムダの動作を高速化するための指定である' },
      ],
      correctChoiceIds: ['a'],
      explanation:
        '関数型インターフェースとは「抽象メソッドがちょうど1つ」のインターフェースのことです。\n' +
        '@FunctionalInterface は、その条件を満たしているかをコンパイラにチェックさせるための目印です。\n\n' +
        '大事なのは「任意（付けなくてもよい）」という点です。付けなくても、抽象メソッドが1つならラムダで実装できます。\n' +
        'アノテーションを付ける利点は、うっかり抽象メソッドを2つにしてしまったときにコンパイルエラーで気づけることです。\n' +
        '（default メソッドや static メソッドは何個あっても関数型インターフェースの条件に影響しません。）',
    },
    {
      id: 'lambda-004',
      categoryId: 'lambda',
      difficulty: 2,
      prompt: '次のコードの出力を選びなさい。',
      code: `Function<Integer, Integer> f = x -> x + 1;
Function<Integer, Integer> g = x -> x * 2;
System.out.println(f.andThen(g).apply(3));`,
      choices: [
        { id: 'a', text: '8' },
        { id: 'b', text: '7' },
        { id: 'c', text: '9' },
        { id: 'd', text: '6' },
      ],
      correctChoiceIds: ['a'],
      explanation:
        'andThen と compose は「関数をつなげる順番」が逆なので、そこが問われます。\n' +
        '・f.andThen(g) … 先に f、その結果に g（＝f の後に g）。\n' +
        '・f.compose(g) … 先に g、その結果に f（＝f の前に g）。\n\n' +
        'ここは andThen なので、3 → f で 3+1=4 → g で 4*2=8。答えは 8 です。\n' +
        'もし compose なら 3 → g で 6 → f で 7 になります。「andThen＝あとで」「compose＝まえに」と覚えましょう。',
    },
    {
      id: 'lambda-005',
      categoryId: 'lambda',
      difficulty: 2,
      prompt: '次のコードの出力を選びなさい。',
      code: `Predicate<String> isEmpty = s -> s.isEmpty();
System.out.println(isEmpty.negate().test("abc"));`,
      choices: [
        { id: 'a', text: 'true' },
        { id: 'b', text: 'false' },
        { id: 'c', text: 'コンパイルエラー' },
        { id: 'd', text: '実行時例外' },
      ],
      correctChoiceIds: ['a'],
      explanation:
        'Predicate には判定を組み合わせる default メソッドがあります。\n' +
        '・negate() … 判定結果を反転（not）。\n' +
        '・and(other) … 両方 true なら true。\n' +
        '・or(other) … どちらか true なら true。\n\n' +
        'ここでは "abc" は空文字ではないので isEmpty.test("abc") は false。\n' +
        'それを negate() で反転するので true が出力されます。',
    },
    {
      id: 'lambda-006',
      categoryId: 'lambda',
      difficulty: 2,
      prompt: 'メソッド参照 String::length は、4種類あるメソッド参照のうちどれに当たりますか。',
      choices: [
        { id: 'a', text: '特定の型の「任意のオブジェクト」のインスタンスメソッド参照（例: String::length）' },
        { id: 'b', text: '静的メソッド参照（例: Integer::parseInt）' },
        { id: 'c', text: '特定の「1つのオブジェクト」のインスタンスメソッド参照（例: System.out::println）' },
        { id: 'd', text: 'コンストラクタ参照（例: ArrayList::new）' },
      ],
      correctChoiceIds: ['a'],
      explanation:
        'メソッド参照は4種類に分類できます。\n' +
        '1) 静的メソッド参照 … Integer::parseInt のようにクラスの static メソッド。\n' +
        '2) 特定インスタンスのメソッド参照 … System.out::println のように「あるオブジェクト」に対して。\n' +
        '3) 任意オブジェクトのメソッド参照 … String::length のように「型名::インスタンスメソッド」。呼ばれるとき、\n' +
        '   最初の引数がレシーバ（=length を呼ぶ対象の String）になる。\n' +
        '4) コンストラクタ参照 … ArrayList::new。\n\n' +
        'String::length は「型名::インスタンスメソッド」の形なので 3 の種類です。\n' +
        's -> s.length() と同じ意味になります。',
    },
    {
      id: 'lambda-007',
      categoryId: 'lambda',
      difficulty: 2,
      prompt: 'UnaryOperator<T> と BinaryOperator<T> の説明として正しいものをすべて選びなさい。',
      choices: [
        { id: 'a', text: 'UnaryOperator<T> は Function<T, T>（引数も戻り値も同じ型 T）を特化したもの' },
        { id: 'b', text: 'BinaryOperator<T> は BiFunction<T, T, T>（2つの T を受け取り T を返す）を特化したもの' },
        { id: 'c', text: 'UnaryOperator<T> は引数を2つ取る' },
        { id: 'd', text: 'BinaryOperator<T> は戻り値が boolean である' },
      ],
      correctChoiceIds: ['a', 'b'],
      explanation:
        'Operator 系は「入力と出力の型が同じ」ときに使う便利な特化版です。\n' +
        '・UnaryOperator<T> extends Function<T, T> … T を1つ受け取り、同じ型 T を返す（例: 文字列→大文字の文字列）。\n' +
        '・BinaryOperator<T> extends BiFunction<T, T, T> … 同じ型 T を2つ受け取り、T を返す（例: 2数の合計）。\n\n' +
        'reduce の引数などでよく登場します。c は「引数2つ」なので Unary（単項＝1つ）の説明として誤り、\n' +
        'd は boolean を返すわけではないので誤りです。',
    },
    {
      id: 'lambda-008',
      categoryId: 'lambda',
      difficulty: 3,
      prompt: '次のコードをコンパイルするとどうなりますか。',
      code: `int count = 0;
Runnable r = () -> System.out.println(count);
count = 10;
r.run();`,
      choices: [
        { id: 'a', text: 'ラムダが count を参照している行でコンパイルエラーになる' },
        { id: 'b', text: '正常にコンパイルでき、10 が出力される' },
        { id: 'c', text: '正常にコンパイルでき、0 が出力される' },
        { id: 'd', text: 'count = 10; の行でコンパイルエラーになる' },
      ],
      correctChoiceIds: ['a'],
      explanation:
        'ラムダ（や匿名クラス）がローカル変数を使うとき、その変数は「実質的final」でなければなりません。\n' +
        '実質的finalとは「final を付けていないが、初期化後に一度も再代入していない」状態のことです。\n\n' +
        'このコードは count = 10; で再代入しているため count は実質的finalではなくなり、\n' +
        'それを参照しているラムダの行でコンパイルエラーになります。\n' +
        'ラムダは変数の値をキャプチャ（コピー）するため、あとから変わる変数を安全に扱えないのが理由です。\n' +
        '（エラー報告位置はコンパイラによりますが、原因は「実質的finalでない変数のキャプチャ」です。）',
    },
    {
      id: 'lambda-003',
      categoryId: 'lambda',
      difficulty: 2,
      prompt: '次のコードの出力を選びなさい。',
      code: `BiFunction<Integer, Integer, String> f =
    (a, b) -> "合計=" + (a + b);
System.out.println(f.apply(3, 4));`,
      choices: [
        { id: 'a', text: '合計=7' },
        { id: 'b', text: '合計=34' },
        { id: 'c', text: 'コンパイルエラー' },
        { id: 'd', text: '合計=3, 4' },
      ],
      correctChoiceIds: ['a'],
      explanation:
        'BiFunction<T, U, R> は「引数を2つ（T と U）受け取り R を返す」インターフェースで、メソッドは apply です。\n' +
        'ここでは Integer 2つを受け取り String を返す形です。\n\n' +
        '(a + b) は Integer 同士の足し算なので 3 + 4 = 7（数値の加算）。そのあと "合計=" と文字列連結して "合計=7"。\n' +
        '※ もし "合計=" + a + b のように書くと、先に文字列連結が起きて "合計=34" になります。\n' +
        'ここでは (a + b) を括弧でくくっているので、先に数値加算されて 7 になる点がポイントです。',
    },
    {
      id: 'lambda-010',
      categoryId: 'lambda',
      difficulty: 3,
      prompt: 'IntUnaryOperator など「プリミティブ特化」の関数型インターフェースを使う主な理由として正しいものを選びなさい。',
      choices: [
        { id: 'a', text: 'int をそのまま扱い、ラッパー型 Integer への自動ボクシング/アンボクシングを避けて効率化するため' },
        { id: 'b', text: 'ジェネリクスが使えない古いJavaでも動かすため' },
        { id: 'c', text: 'null を安全に扱えるようにするため' },
        { id: 'd', text: '例外を投げられるようにするため' },
      ],
      correctChoiceIds: ['a'],
      explanation:
        'ジェネリクス（Function<Integer,Integer> など）は参照型しか型引数にできないため、\n' +
        'int を扱うたびに Integer への箱詰め（ボクシング）と取り出し（アンボクシング）が発生し、無駄なオブジェクト生成が起きます。\n\n' +
        'そこで IntUnaryOperator（int→int）、IntPredicate（int→boolean）、ToIntFunction（T→int）などの\n' +
        '「プリミティブ特化」版が用意されており、これらを使うとボクシングを避けて性能・メモリ効率を改善できます。\n' +
        'IntStream などが返す値をそのまま処理する場面で特に有効です。',
    },
    {
      id: 'lambda-011',
      categoryId: 'lambda',
      difficulty: 1,
      prompt: '次のコードの出力を選びなさい。',
      code: `Consumer<String> c1 = s -> System.out.print("A:" + s + " ");
Consumer<String> c2 = s -> System.out.print("B:" + s);
c1.andThen(c2).accept("x");`,
      choices: [
        { id: 'a', text: 'A:x B:x' },
        { id: 'b', text: 'B:x A:x' },
        { id: 'c', text: 'A:x' },
        { id: 'd', text: 'コンパイルエラー' },
      ],
      correctChoiceIds: ['a'],
      explanation:
        'Consumer にも andThen があります。Function の andThen と少し違い、Consumer は値を返さないので\n' +
        '「同じ入力を、2つの Consumer に順番に渡す」動きになります。\n\n' +
        'c1.andThen(c2).accept("x") は、まず c1 に "x" を渡し（"A:x "）、次に c2 に同じ "x" を渡します（"B:x"）。\n' +
        'よって "A:x B:x" の順で出力されます。Function の andThen（前の結果を次に渡す）との違いを意識しましょう。',
    },
    {
      id: 'lambda-012',
      categoryId: 'lambda',
      difficulty: 2,
      prompt: '次のコードの出力を選びなさい。',
      code: `Predicate<Integer> positive = n -> n > 0;
Predicate<Integer> even = n -> n % 2 == 0;
System.out.println(positive.and(even).test(4));
System.out.println(positive.and(even).test(3));`,
      choices: [
        { id: 'a', text: 'true と false' },
        { id: 'b', text: 'true と true' },
        { id: 'c', text: 'false と false' },
        { id: 'd', text: 'コンパイルエラー' },
      ],
      correctChoiceIds: ['a'],
      explanation:
        'Predicate.and(other) は「両方の条件が true のときだけ true」を返す合成です（論理 AND）。\n\n' +
        '・test(4): 4>0（true）かつ 4は偶数（true）→ true\n' +
        '・test(3): 3>0（true）かつ 3は偶数（false）→ false\n\n' +
        '他にも or（どちらか true）、negate（反転）があり、これらを組み合わせて複雑な条件を読みやすく書けます。',
    },
    {
      id: 'lambda-013',
      categoryId: 'lambda',
      difficulty: 2,
      prompt: 'Function.identity() が返す関数の説明として正しいものを選びなさい。',
      code: `Map<String, Integer> m = Stream.of("a", "bb", "ccc")
    .collect(Collectors.toMap(Function.identity(), String::length));`,
      choices: [
        { id: 'a', text: '受け取った引数をそのまま返す関数（x -> x と同じ）' },
        { id: 'b', text: '常に null を返す関数' },
        { id: 'c', text: '引数を大文字にして返す関数' },
        { id: 'd', text: '引数の長さを返す関数' },
      ],
      correctChoiceIds: ['a'],
      explanation:
        'Function.identity() は「受け取ったものをそのまま返す」関数を返します。x -> x と同じ意味です。\n\n' +
        'このコードでは toMap のキー生成に使い、「文字列そのもの」をキー、「その長さ」を値にした Map を作っています\n' +
        '（{a=1, bb=2, ccc=3}）。\n' +
        '「変換せずそのまま使いたい」場面で s -> s と書く代わりに使うと意図が明確になります。',
    },
    {
      id: 'lambda-014',
      categoryId: 'lambda',
      difficulty: 2,
      prompt: '次のコードについて正しい説明を選びなさい。',
      code: `Supplier<List<String>> factory = ArrayList::new;
List<String> list = factory.get();
list.add("hello");`,
      choices: [
        {
          id: 'a',
          text: 'ArrayList::new はコンストラクタ参照で、Supplier の get() が呼ばれるたびに新しい ArrayList を作る',
        },
        { id: 'b', text: 'ArrayList::new はコンパイルエラーになる' },
        { id: 'c', text: 'factory.get() は毎回同じ（共有の）リストを返す' },
        { id: 'd', text: 'コンストラクタ参照は Supplier には代入できない' },
      ],
      correctChoiceIds: ['a'],
      explanation:
        'ClassName::new は「コンストラクタ参照」です。ここでは引数なしの ArrayList() を表し、\n' +
        '「引数なしで値を作る」形なので Supplier<List<String>> に代入できます。\n\n' +
        'factory.get() を呼ぶたびに new ArrayList() が実行され、毎回新しい空リストが返ります（c は誤り）。\n' +
        '() -> new ArrayList<>() と書くのと同じですが、コンストラクタ参照の方が簡潔です。',
    },
    {
      id: 'lambda-015',
      categoryId: 'lambda',
      difficulty: 3,
      prompt: 'ラムダ式が「実質的final」でなくても参照・変更できる変数はどれですか。正しい説明を選びなさい。',
      code: `class Counter {
    private int count = 0;
    Runnable r = () -> count++;   // (1)
}`,
      choices: [
        {
          id: 'a',
          text: 'インスタンスフィールド（count）はラムダから変更できる。実質的finalの制約はローカル変数だけに適用される',
        },
        { id: 'b', text: '(1) はコンパイルエラーになる（count が実質的finalでないため）' },
        { id: 'c', text: 'ラムダはいかなる変数も変更できない' },
        { id: 'd', text: 'static フィールドはラムダから参照できない' },
      ],
      correctChoiceIds: ['a'],
      explanation:
        '「実質的final でなければならない」という制約は、あくまで“ローカル変数”をキャプチャするときの話です。\n\n' +
        'インスタンスフィールドや static フィールドには、この制約は当てはまりません。\n' +
        'なぜなら、フィールドはスタック上のローカル変数と違い、オブジェクト（やクラス）を通して常にアクセスでき、\n' +
        'ラムダはフィールドを「値のコピー」ではなく「その場で参照」するからです。\n\n' +
        'したがって count++ のようにフィールドを変更する処理もラムダ内で書けます（(1) は正しくコンパイルできます）。',
    },
  ],
} satisfies CategoryModule
