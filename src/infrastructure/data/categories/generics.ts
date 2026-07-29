import type { CategoryModule } from '../CategoryModule'

/**
 * 分野: ジェネリクス
 *
 * 型パラメータ、境界ワイルドカード（PECS）、型消去、ジェネリックメソッドなど。
 */
export const genericsModule: CategoryModule = {
  category: {
    id: 'generics',
    name: 'ジェネリクス',
    description: '型パラメータ、境界ワイルドカード(? extends / ? super)、型消去、ジェネリックメソッド',
    order: 3,
  },
  questions: [
    {
      id: 'generics-001',
      categoryId: 'generics',
      difficulty: 1,
      prompt: 'ジェネリッククラスの宣言として正しいものを選びなさい。',
      code: `// value を型パラメータ T で保持する箱クラスを作りたい`,
      choices: [
        { id: 'a', text: 'class Box<T> { private T value; public T get() { return value; } }' },
        { id: 'b', text: 'class Box { private T value; public T get() { return value; } }' },
        { id: 'c', text: 'class Box<T> { private t value; public t get() { return value; } }' },
        { id: 'd', text: 'class <T>Box { private T value; }' },
      ],
      correctChoiceIds: ['a'],
      explanation:
        'ジェネリッククラスは「クラス名の直後」に <T> のように型パラメータを書きます。\n' +
        '・a … class Box<T> の形で、フィールドやメソッドで T を型として使えます。これが正解。\n' +
        '・b … <T> の宣言がないのに T を使っているのでコンパイルエラー。\n' +
        '・c … 型パラメータは大文字1文字（T, E, K, V など）が慣習で、宣言した T と小文字 t は別物扱いになりエラー。\n' +
        '・d … <T> の位置が不正。\n\n' +
        '型パラメータ名は慣習で T(Type), E(Element), K(Key), V(Value) などが使われます。',
    },
    {
      id: 'generics-002',
      categoryId: 'generics',
      difficulty: 1,
      prompt: '次のコードをコンパイルするとどうなりますか。',
      code: `List<String> strings = new ArrayList<>();
List<Object> objects = strings;`,
      choices: [
        { id: 'a', text: '2行目でコンパイルエラーになる' },
        { id: 'b', text: '正常にコンパイルできる' },
        { id: 'c', text: '実行時に ClassCastException が発生する' },
        { id: 'd', text: '警告は出るがコンパイルできる' },
      ],
      correctChoiceIds: ['a'],
      explanation:
        'ここが初学者のつまずきポイントです。String は Object のサブタイプですが、\n' +
        'List<String> は List<Object> のサブタイプではありません（これを「非変」といいます）。\n\n' +
        'もし代入できてしまうと、objects.add(123) のように Integer を入れられてしまい、\n' +
        '元の List<String> の「文字列だけ」という約束が壊れてしまいます。それを防ぐためコンパイルエラーになります。\n' +
        '「異なる型引数のジェネリック型どうしは、たとえ要素型に継承関係があっても代入できない」と覚えましょう。',
    },
    {
      id: 'generics-008',
      categoryId: 'generics',
      difficulty: 1,
      prompt: '次のコード（raw type＝生の型を使用）をコンパイルするとどうなりますか。',
      code: `List list = new ArrayList();  // 型引数なし（raw type）
list.add("hello");
list.add(123);`,
      choices: [
        { id: 'a', text: 'コンパイルは通る（無検査（unchecked）の警告が出ることがある）' },
        { id: 'b', text: 'コンパイルエラーになる' },
        { id: 'c', text: '2行目でエラーになる' },
        { id: 'd', text: '実行時に必ず例外が発生する' },
      ],
      correctChoiceIds: ['a'],
      explanation:
        'List のように型引数を書かない書き方を「raw type（生の型）」と呼びます。\n' +
        'これは Java 5 より前との互換のために残されているもので、コンパイル自体は通ります。\n\n' +
        'ただし型チェックが効かないため、文字列も数値も何でも入ってしまい危険です。\n' +
        'コンパイラは「unchecked（無検査）」の警告で注意を促します。実務では必ず List<String> のように型引数を付けましょう。',
    },
    {
      id: 'generics-003',
      categoryId: 'generics',
      difficulty: 2,
      prompt: '次のコードについて正しい説明をすべて選びなさい。',
      code: `List<? extends Number> list = new ArrayList<Integer>();
// (1) list.add(Integer.valueOf(1));
// (2) Number n = list.get(0);`,
      choices: [
        { id: 'a', text: '(1) の add はコンパイルエラーになる' },
        { id: 'b', text: '(2) の get は Number として取り出せる' },
        { id: 'c', text: '(1) の add は問題なく実行できる' },
        { id: 'd', text: '(2) の get はコンパイルエラーになる' },
      ],
      correctChoiceIds: ['a', 'b'],
      explanation:
        '? extends Number は「Number またはそのサブクラスの、どれか1つの型」を表します。\n' +
        'ただし「どれか分からない」ため、要素の追加（add）は原則できません。\n' +
        '　→ もし相手が List<Double> だったら Integer を足すと型が壊れるため、コンパイラが禁止します。\n\n' +
        '一方、取り出す（get）ぶんには「少なくとも Number ではある」と分かるので、Number 型で受け取れます。\n\n' +
        'これが PECS の "Producer Extends" 側です。「? extends＝読み取り専用（取り出す側）」と覚えましょう。',
    },
    {
      id: 'generics-004',
      categoryId: 'generics',
      difficulty: 2,
      prompt: '次のコードについて正しい説明を選びなさい。',
      code: `List<? super Integer> list = new ArrayList<Number>();
list.add(Integer.valueOf(10));
Object o = list.get(0);`,
      choices: [
        { id: 'a', text: 'add はでき、get の結果は Object 型でしか受け取れない' },
        { id: 'b', text: 'add はコンパイルエラーになる' },
        { id: 'c', text: 'get の結果は Integer 型で受け取れる' },
        { id: 'd', text: 'add も get もコンパイルエラーになる' },
      ],
      correctChoiceIds: ['a'],
      explanation:
        '? super Integer は「Integer またはその親クラスの、どれか1つの型」を表します。\n' +
        'この場合、Integer（およびそのサブクラス）を「追加する（add）」ことは安全にできます。\n' +
        '　→ 相手が List<Number> でも List<Object> でも、Integer は必ず入れられるからです。\n\n' +
        '逆に取り出すと、実際の型が Number か Object か分からないため、共通の親である Object でしか受け取れません。\n\n' +
        'これが PECS の "Consumer Super" 側です。「? super＝書き込み向き（入れる側）」と覚えましょう。',
    },
    {
      id: 'generics-005',
      categoryId: 'generics',
      difficulty: 2,
      prompt: 'ジェネリックメソッドの宣言として正しいものを選びなさい。',
      code: `// リストの先頭要素を返す汎用メソッドを作りたい`,
      choices: [
        { id: 'a', text: 'static <T> T first(List<T> list) { return list.get(0); }' },
        { id: 'b', text: 'static T <T> first(List<T> list) { return list.get(0); }' },
        { id: 'c', text: 'static T first(List<T> list) { return list.get(0); }' },
        { id: 'd', text: 'static <T> first(List<T> list) { return list.get(0); }' },
      ],
      correctChoiceIds: ['a'],
      explanation:
        'ジェネリックメソッドでは、型パラメータ <T> を「戻り値の型の直前」に書きます。\n' +
        '正しい語順は［修飾子］［<T>］［戻り値の型］［メソッド名(...)］です。\n\n' +
        '・a … static <T> T first(...) で、<T> の宣言→戻り値 T、と正しい順序。これが正解。\n' +
        '・b … <T> の位置が戻り値の後ろにあり不正。\n' +
        '・c … <T> の宣言が無いのに T を使っておりエラー。\n' +
        '・d … 戻り値の型が抜けていてエラー。\n\n' +
        'クラス側で <T> を宣言していなくても、メソッド単位で <T> を宣言すればそのメソッド内で使えます。',
    },
    {
      id: 'generics-006',
      categoryId: 'generics',
      difficulty: 2,
      prompt: '2つの引数のうち大きい方を返す汎用メソッドを作るとき、型パラメータに境界を付ける理由として正しいものを選びなさい。',
      code: `static <T extends Comparable<T>> T max(T a, T b) {
    return a.compareTo(b) >= 0 ? a : b;
}`,
      choices: [
        { id: 'a', text: 'compareTo を呼べるようにするため（Comparable を実装した型に限定する）' },
        { id: 'b', text: 'null を渡せないようにするため' },
        { id: 'c', text: 'T を必ず Integer にするため' },
        { id: 'd', text: '実行速度を上げるため' },
      ],
      correctChoiceIds: ['a'],
      explanation:
        '<T extends Comparable<T>> は「T は Comparable<T> を実装した型に限る」という上限境界の指定です。\n\n' +
        '境界を付けないただの <T> だと、T が何の型か分からないため a.compareTo(b) を呼べません（compareTo を持つ保証がない）。\n' +
        '「Comparable を実装した型だけ受け付ける」と制限することで、compareTo を安全に呼べるようになります。\n\n' +
        'extends はクラスの継承だけでなく、このように「インターフェースの実装」も含めた上限指定に使われます。',
    },
    {
      id: 'generics-007',
      categoryId: 'generics',
      difficulty: 3,
      prompt: 'ジェネリクスの型情報は実行時には消える（型消去 / type erasure）。この影響として正しいものをすべて選びなさい。',
      choices: [
        { id: 'a', text: 'new T[10] のように型パラメータで配列を直接生成できない' },
        { id: 'b', text: 'obj instanceof List<String> とは書けない（obj instanceof List<?> なら可）' },
        { id: 'c', text: '実行時には List<String> も List<Integer> も同じ List クラスとして扱われる' },
        { id: 'd', text: '型消去のおかげで List<int> のようにプリミティブ型を型引数にできる' },
      ],
      correctChoiceIds: ['a', 'b', 'c'],
      explanation:
        '型消去とは「コンパイル後、型引数の情報が取り除かれる」仕組みです。実行時には型引数が分かりません。\n' +
        'この結果、次のことが起こります。\n' +
        '・a … 実行時に T が何か分からないので new T[10] は不可（配列は生成時に実際の型が必要）。\n' +
        '・b … 実行時に <String> の情報が無いので instanceof で型引数を確認できない。List<?> なら可。\n' +
        '・c … List<String> も List<Integer> も、実行時にはただの List になる。\n\n' +
        'd は誤りです。型消去とは無関係に、ジェネリクスの型引数には参照型しか使えず、\n' +
        'int などのプリミティブ型は使えません（List<Integer> のようにラッパー型を使います）。',
    },
    {
      id: 'generics-009',
      categoryId: 'generics',
      difficulty: 3,
      prompt: '次の2つのメソッドを同じクラスに書くとどうなりますか。',
      code: `void print(List<String> list) { }
void print(List<Integer> list) { }`,
      choices: [
        { id: 'a', text: 'コンパイルエラーになる（型消去後のシグネチャが同じになるため）' },
        { id: 'b', text: 'オーバーロードとして正常にコンパイルできる' },
        { id: 'c', text: '実行時に例外が発生する' },
        { id: 'd', text: '警告は出るがコンパイルできる' },
      ],
      correctChoiceIds: ['a'],
      explanation:
        'オーバーロード（同名メソッドの共存）は「引数の型が違う」ことで区別します。\n' +
        'しかし型消去により、List<String> も List<Integer> も実行時には同じ List になります。\n\n' +
        'その結果、両方とも print(List) という同一シグネチャになってしまい、区別できずコンパイルエラーになります。\n' +
        '（"name clash: both methods have same erasure" というエラーです。）\n' +
        '型引数の違いだけではオーバーロードできない、という型消去の代表的な副作用です。',
    },
    {
      id: 'generics-010',
      categoryId: 'generics',
      difficulty: 2,
      prompt: '「リストの中身を読み取って合計するだけ（追加はしない）」メソッドの引数型として、最も柔軟で適切なものを選びなさい。',
      code: `static double sum(List<__________> list) {
    double total = 0;
    for (Number n : list) total += n.doubleValue();
    return total;
}`,
      choices: [
        { id: 'a', text: '? extends Number' },
        { id: 'b', text: '? super Number' },
        { id: 'c', text: 'Number' },
        { id: 'd', text: 'Object' },
      ],
      correctChoiceIds: ['a'],
      explanation:
        'このメソッドはリストから要素を「取り出して読むだけ（生産者＝Producer）」です。\n' +
        'PECS の合言葉「Producer Extends」に従い、? extends Number を使います。\n\n' +
        'こうすると List<Integer>、List<Double>、List<Number> など「Number 系」のどのリストも渡せて柔軟です。\n' +
        '・? super Number（b）だと List<Integer> を渡せず柔軟性が落ちます。\n' +
        '・Number（c）だと List<Integer> すら渡せません（非変のため）。\n' +
        '「読むだけなら extends、入れるだけなら super」と対で覚えましょう。',
    },
  ],
} satisfies CategoryModule
