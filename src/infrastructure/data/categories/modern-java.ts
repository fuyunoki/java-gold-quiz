import type { CategoryModule } from '../CategoryModule'

/**
 * 分野: モダンJava（SE17の新機能）
 *
 * record、sealed クラス、switch 式、instanceof のパターンマッチング、
 * テキストブロック、var による型推論。
 */
export const modernJavaModule: CategoryModule = {
  category: {
    id: 'modern-java',
    name: 'モダンJava（record / sealed / switch式）',
    description: 'record、sealedクラス、switch式、instanceofパターンマッチング、テキストブロック、var',
    order: 6,
  },
  questions: [
    {
      id: 'modern-001',
      categoryId: 'modern-java',
      difficulty: 1,
      prompt: '次のコードの出力を選びなさい。',
      code: `record Point(int x, int y) {}

Point p = new Point(1, 2);
System.out.println(p);`,
      choices: [
        { id: 'a', text: 'Point[x=1, y=2]' },
        { id: 'b', text: 'Point@1b6d3586' },
        { id: 'c', text: '(1, 2)' },
        { id: 'd', text: 'Point{1, 2}' },
      ],
      correctChoiceIds: ['a'],
      explanation:
        'record（レコード）は「データを持つだけの不変クラス」を短く書くための仕組みです。\n' +
        'record Point(int x, int y) と書くだけで、コンパイラが toString を自動生成してくれます。\n\n' +
        'その toString の形式は 型名[フィールド名=値, ...] で、ここでは Point[x=1, y=2] になります。\n' +
        '普通のクラスだと toString を書かない限り Point@ハッシュ値 のような表示になりますが、record は自動で読みやすい形にしてくれます。',
    },
    {
      id: 'modern-007',
      categoryId: 'modern-java',
      difficulty: 1,
      prompt: 'var（ローカル変数の型推論）についての説明として正しいものをすべて選びなさい。',
      choices: [
        { id: 'a', text: 'ローカル変数にのみ使え、初期化子（代入する値）が必須である' },
        { id: 'b', text: 'var x; のように初期化なしでは使えない' },
        { id: 'c', text: 'クラスのフィールド（インスタンス変数）の型として使える' },
        { id: 'd', text: 'var を使うと変数は動的型付けになり、あとから別の型を代入できる' },
      ],
      correctChoiceIds: ['a', 'b'],
      explanation:
        'var は「右辺の値から型をコンパイラが推論してくれる」書き方です。あくまで型を省略しているだけで、型は固定されます。\n' +
        '・a, b … ローカル変数専用で、初期化子が必須（var x; はエラー。推論する材料が無いため）。\n' +
        '・c … フィールドやメソッドの引数・戻り値には使えない（ローカル変数限定）。誤り。\n' +
        '・d … var は動的型付けではない。var s = "hi"; とすると s は String に確定し、後から数値は代入できない。誤り。\n\n' +
        '「var＝型を書く手間を省くだけで、中身は普通の静的型」と理解しましょう。',
    },
    {
      id: 'modern-003',
      categoryId: 'modern-java',
      difficulty: 2,
      prompt: '次のコードの出力を選びなさい。',
      code: `int day = 3;
String type = switch (day) {
    case 1, 2, 3, 4, 5 -> "weekday";
    case 6, 7 -> "weekend";
    default -> "unknown";
};
System.out.println(type);`,
      choices: [
        { id: 'a', text: 'weekday' },
        { id: 'b', text: 'weekend' },
        { id: 'c', text: 'unknown' },
        { id: 'd', text: 'コンパイルエラー' },
      ],
      correctChoiceIds: ['a'],
      explanation:
        'switch「式」は、従来の switch「文」と違って値を返せます（変数に代入できる）。\n' +
        'アロー（->）を使う形では、各 case は break を書かなくても次の case に落ちません（フォールスルーしない）。\n' +
        'また 1 つの case にカンマ区切りで複数の値をまとめられます。\n\n' +
        'day は 3 なので case 1,2,3,4,5 にマッチし "weekday" が返ります。\n' +
        '従来の switch 文のような break 忘れによるバグが起きにくいのが switch 式の利点です。',
    },
    {
      id: 'modern-004',
      categoryId: 'modern-java',
      difficulty: 2,
      prompt: '次のコードの出力を選びなさい。',
      code: `Object obj = "hello";
if (obj instanceof String s) {
    System.out.println(s.length());
} else {
    System.out.println("not a string");
}`,
      choices: [
        { id: 'a', text: '5' },
        { id: 'b', text: 'not a string' },
        { id: 'c', text: 'コンパイルエラー（obj は Object 型なので length は呼べない）' },
        { id: 'd', text: 'hello' },
      ],
      correctChoiceIds: ['a'],
      explanation:
        'これは instanceof の「パターンマッチング」です。\n' +
        'obj instanceof String s と書くと、型が String なら判定が true になると同時に、\n' +
        'その値を String 型の変数 s に自動で代入してくれます（キャスト不要）。\n\n' +
        '従来は if (obj instanceof String) { String s = (String) obj; ... } と、判定とキャストの二度手間でした。\n' +
        'ここでは obj は "hello"（String）なので s に代入され、s.length() で 5 が出力されます。\n' +
        '変数 s が使えるのは、条件が真だと分かっている範囲（この if ブロック内）に限られます。',
    },
    {
      id: 'modern-005',
      categoryId: 'modern-java',
      difficulty: 2,
      prompt: 'sealed（封印）クラス／インターフェースの宣言として正しいものを選びなさい。',
      code: `// Shape を継承できる型を Circle と Square だけに限定したい`,
      choices: [
        { id: 'a', text: 'sealed interface Shape permits Circle, Square { }' },
        { id: 'b', text: 'sealed interface Shape allows Circle, Square { }' },
        { id: 'c', text: 'sealed interface Shape { } のみ（permits 不要で任意の型が継承可能）' },
        { id: 'd', text: 'final interface Shape permits Circle, Square { }' },
      ],
      correctChoiceIds: ['a'],
      explanation:
        'sealed は「継承できる型を、許可したものだけに制限する」仕組みです。\n' +
        '許可する型は permits キーワードで列挙します（allows ではありません。b は誤り）。\n\n' +
        '・a … sealed interface Shape permits Circle, Square。Shape を実装できるのは Circle と Square だけ。正解。\n' +
        '・c … sealed を付けたら原則 permits で許可先を明示します（同一ファイル内などの条件下では省略可の場合もありますが、\n' +
        '　　　「任意の型が継承可能」になるわけではありません）。\n' +
        '・d … final は「継承禁止」で、permits と一緒には使えません（矛盾）。\n\n' +
        'sealed により「取りうる種類」が閉じるので、switch のパターンマッチングと相性がよく、抜け漏れを検査しやすくなります。',
    },
    {
      id: 'modern-006',
      categoryId: 'modern-java',
      difficulty: 2,
      prompt: 'record の「コンパクトコンストラクタ」を使った次のコードについて、正しい説明を選びなさい。',
      code: `record Range(int lo, int hi) {
    Range {
        if (lo > hi) {
            throw new IllegalArgumentException("lo > hi");
        }
    }
}
// new Range(5, 1) を実行すると？`,
      choices: [
        { id: 'a', text: '引数の検証を行える。new Range(5, 1) は IllegalArgumentException になる' },
        { id: 'b', text: 'record にコンストラクタは書けないのでコンパイルエラー' },
        { id: 'c', text: 'Range { ... } は引数リストが無いのでコンパイルエラー' },
        { id: 'd', text: 'new Range(5, 1) は正常に生成される（検証は無視される）' },
      ],
      correctChoiceIds: ['a'],
      explanation:
        'record は通常コンストラクタを自動生成しますが、「コンパクトコンストラクタ」を書くと\n' +
        '生成処理に検証や補正を差し込めます。書き方は Range { ... } のように引数リストを省略した形です\n' +
        '（引数は自動的に受け取られるので書きません。c は誤り）。\n\n' +
        'ここでは lo > hi のとき例外を投げているので、new Range(5, 1) は IllegalArgumentException になります。\n' +
        '「不正な値の record を作らせない」ためのよくあるパターンです。フィールドへの代入は最後に自動で行われます。',
    },
    {
      id: 'modern-009',
      categoryId: 'modern-java',
      difficulty: 2,
      prompt: 'record が「自動で生成してくれるもの」をすべて選びなさい。',
      choices: [
        { id: 'a', text: '全フィールドを引数に取る正準（canonical）コンストラクタ' },
        { id: 'b', text: '各フィールドのアクセサ（x(), y() のように、フィールド名と同じ名前のメソッド）' },
        { id: 'c', text: 'equals / hashCode / toString' },
        { id: 'd', text: '各フィールドのセッター（setX() など）' },
      ],
      correctChoiceIds: ['a', 'b', 'c'],
      explanation:
        'record はデータ運搬用のクラスを短く書くため、次を自動生成します。\n' +
        '・a … 全フィールドを受け取る正準コンストラクタ。\n' +
        '・b … アクセサ。名前が getX() ではなく x() である点が普通のJavaBeansと違うので注意。\n' +
        '・c … 中身（フィールド）に基づく equals / hashCode / toString。\n\n' +
        'd のセッターは生成されません。record のフィールドは final で、生成後は変更できない（不変）ためです。\n' +
        '「値を持って比較・表示するだけの不変オブジェクト」を作るのが record の狙いです。',
    },
    {
      id: 'modern-002',
      categoryId: 'modern-java',
      difficulty: 1,
      prompt: 'テキストブロック（"""）についての説明として正しいものを選びなさい。',
      code: `String s = """
        Hello
        World""";`,
      choices: [
        { id: 'a', text: '複数行の文字列を、改行やインデントを見たまま書ける（この s は "Hello\\nWorld"）' },
        { id: 'b', text: 'テキストブロックは実行時に自動でトリム（前後の空白除去）されるだけの機能である' },
        { id: 'c', text: '1行の文字列にしか使えない' },
        { id: 'd', text: 'エスケープが一切使えない' },
      ],
      correctChoiceIds: ['a'],
      explanation:
        'テキストブロックは """ で囲んで複数行の文字列を書ける機能です。\n' +
        '改行はそのまま改行文字になり、共通の先頭インデント（各行に共通する左の余白）は自動で取り除かれます。\n\n' +
        'この例では Hello と World が改行で区切られ、共通インデントが除かれるので、s は "Hello\\nWorld" になります。\n' +
        'JSON や SQL、HTML などを埋め込むときに、\\n や + での連結を書かずに済むのが利点です。\n' +
        '（必要なら \\n などのエスケープも従来どおり使えます。d は誤り。）',
    },
    {
      id: 'modern-008',
      categoryId: 'modern-java',
      difficulty: 3,
      prompt: '次のコードの出力を選びなさい。',
      code: `int x = 2;
int result = switch (x) {
    case 1 -> 10;
    case 2 -> {
        int base = 5;
        yield base * 2;
    }
    default -> 0;
};
System.out.println(result);`,
      choices: [
        { id: 'a', text: '10' },
        { id: 'b', text: '2' },
        { id: 'c', text: '5' },
        { id: 'd', text: 'コンパイルエラー（case の中でブロックは書けない）' },
      ],
      correctChoiceIds: ['a'],
      explanation:
        'switch 式のアロー（->）の右側には、単一の値だけでなく { } のブロックも書けます。\n' +
        'ただしブロックから「値を返す」には、return ではなく yield を使う必要があります。\n\n' +
        'x は 2 なので case 2 のブロックが実行され、base = 5、yield base * 2 = 10 を返します。\n' +
        'したがって result は 10。\n' +
        'ポイントは「switch 式のブロックで値を返すのは yield」という点で、return と混同しないようにしましょう。',
    },
    {
      id: 'modern-010',
      categoryId: 'modern-java',
      difficulty: 3,
      prompt: 'sealed クラスから継承する「許可されたサブクラス（permits に列挙された型）」が満たすべき条件として正しいものを選びなさい。',
      choices: [
        {
          id: 'a',
          text: 'final・sealed・non-sealed のいずれかを付けて、「継承をさらに広げるか閉じるか」を明示しなければならない',
        },
        { id: 'b', text: '必ず final にしなければならない' },
        { id: 'c', text: '修飾子は自由で、何も付けなくてよい' },
        { id: 'd', text: '必ず abstract にしなければならない' },
      ],
      correctChoiceIds: ['a'],
      explanation:
        'sealed で継承先を制限したら、その「許可されたサブクラス」側も、継承をどう扱うかを必ず宣言します。\n' +
        '選べるのは次の3つのいずれかです。\n' +
        '・final … これ以上継承させない（そこで打ち止め）。\n' +
        '・sealed … さらに permits で継承先を限定して制限を続ける。\n' +
        '・non-sealed … ここで封印を解き、誰でも継承できるように戻す。\n\n' +
        'このいずれも付けないとコンパイルエラーになります（b・c・d のように一律固定/自由ではない）。\n' +
        'こうして「継承の広がりを設計者が完全に管理できる」のが sealed の目的です。',
    },
  ],
} satisfies CategoryModule
