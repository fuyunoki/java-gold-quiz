import type { CategoryModule } from '../CategoryModule'

/**
 * 分野: Stream API
 *
 * Java SE 17 Gold の Stream 関連（中間/終端操作、遅延評価、
 * reduce/collect、flatMap、プリミティブストリーム）を扱う。
 */
export const streamsModule: CategoryModule = {
  category: {
    id: 'streams',
    name: 'Stream API',
    description: '中間操作・終端操作、遅延評価、reduce/collect、flatMap、プリミティブストリームなど',
    order: 2,
  },
  questions: [
    {
      id: 'streams-001',
      categoryId: 'streams',
      difficulty: 1,
      prompt: '次のうち「中間操作 (intermediate operation)」であるものをすべて選びなさい。',
      choices: [
        { id: 'a', text: 'filter(Predicate)' },
        { id: 'b', text: 'map(Function)' },
        { id: 'c', text: 'forEach(Consumer)' },
        { id: 'd', text: 'count()' },
        { id: 'e', text: 'peek(Consumer)' },
      ],
      correctChoiceIds: ['a', 'b', 'e'],
      explanation:
        'まず「中間操作」と「終端操作」を見分ける一番簡単なコツは戻り値です。\n' +
        '・中間操作 → 戻り値が Stream。つなげてもまだ実行されない（遅延評価）。\n' +
        '・終端操作 → 戻り値が Stream 以外（値や void）。ここで初めてパイプライン全体が動く。\n\n' +
        'filter・map・peek はどれも Stream を返すので中間操作。forEach は void、count は long を返すので終端操作です。\n' +
        'peek は「途中でのぞき見する（ログ出力などに使う）」操作で、戻り値が Stream なので中間操作である点が引っかけポイントです。',
    },
    {
      id: 'streams-009',
      categoryId: 'streams',
      difficulty: 1,
      prompt: '次のコードの出力を選びなさい。',
      code: `int total = Stream.of("a", "bb", "ccc")
                  .mapToInt(String::length)
                  .sum();
System.out.println(total);`,
      choices: [
        { id: 'a', text: '6' },
        { id: 'b', text: '3' },
        { id: 'c', text: 'コンパイルエラー（Stream に sum がない）' },
        { id: 'd', text: 'abbccc' },
      ],
      correctChoiceIds: ['a'],
      explanation:
        'ポイントは「sum() は Stream<T> には無い」ことです。合計・平均などの数値集計は、\n' +
        'いったん IntStream（プリミティブ型ストリーム）に変換してから使います。\n' +
        'mapToInt は各要素を int に変換して IntStream を作る操作で、ここでは各文字列の長さ 1, 2, 3 になります。\n' +
        'その sum() なので 1 + 2 + 3 = 6。もし普通の map(String::length) だと Stream<Integer> のままで sum() は呼べません。',
    },
    {
      id: 'streams-006',
      categoryId: 'streams',
      difficulty: 1,
      prompt: '次のコードの出力を選びなさい。',
      code: `String r = IntStream.rangeClosed(1, 3)
    .mapToObj(Integer::toString)
    .collect(Collectors.joining("-"));
System.out.println(r);`,
      choices: [
        { id: 'a', text: '1-2-3' },
        { id: 'b', text: '1-2' },
        { id: 'c', text: '123' },
        { id: 'd', text: 'コンパイルエラー（IntStream に collect がない）' },
      ],
      correctChoiceIds: ['a'],
      explanation:
        '2つの range 系メソッドの違いを覚えておきましょう。\n' +
        '・range(1, 3)      → 1, 2（上限 3 を含まない）\n' +
        '・rangeClosed(1, 3) → 1, 2, 3（上限 3 を含む。Closed=閉区間）\n\n' +
        'ここは rangeClosed なので 1,2,3。mapToObj で数値を文字列 Stream に変え、\n' +
        'joining("-") が区切り文字を挟んで連結するので "1-2-3" になります。',
    },
    {
      id: 'streams-003',
      categoryId: 'streams',
      difficulty: 2,
      prompt: '次のコードの出力を選びなさい。',
      code: `int sum = Stream.of(1, 2, 3, 4)
                .reduce(0, (a, b) -> a + b);
System.out.println(sum);`,
      choices: [
        { id: 'a', text: '10' },
        { id: 'b', text: '24' },
        { id: 'c', text: '0' },
        { id: 'd', text: 'コンパイルエラー（Optional を返すため int に代入できない）' },
      ],
      correctChoiceIds: ['a'],
      explanation:
        'reduce は「要素を1つずつたたみ込んで1つの値にまとめる」操作です。ここでは 0 から始めて順に足すので\n' +
        '0+1+2+3+4 = 10 になります。\n\n' +
        '重要なのは reduce に2種類ある点です。\n' +
        '・reduce(初期値, (a,b)->…) … 初期値があるので必ず結果があり、戻り値は素の型（int）。\n' +
        '・reduce((a,b)->…)        … 初期値が無いので「要素ゼロなら結果なし」を表すため Optional<T> を返す。\n\n' +
        'この問題は初期値ありの形なので Optional ではなく int が返り、そのまま int に代入できます。',
    },
    {
      id: 'streams-004',
      categoryId: 'streams',
      difficulty: 2,
      prompt: '入れ子のリストを平らにして全要素を1本のストリームとして扱いたい。空欄に入る適切な操作を選びなさい。',
      code: `List<List<Integer>> data =
    List.of(List.of(1, 2), List.of(3, 4));
List<Integer> flat = data.stream()
    .________(List::stream)
    .collect(Collectors.toList());
// 期待: [1, 2, 3, 4]`,
      choices: [
        { id: 'a', text: 'map' },
        { id: 'b', text: 'flatMap' },
        { id: 'c', text: 'mapToObj' },
        { id: 'd', text: 'peek' },
      ],
      correctChoiceIds: ['b'],
      explanation:
        'map と flatMap の違いがテーマです。\n' +
        '・map(List::stream)     → 各 List を Stream に変換するだけ。結果は Stream<Stream<Integer>>（入れ子のまま）。\n' +
        '・flatMap(List::stream) → 各要素を Stream に変換したうえで、それらを1本につなげて平らにする。\n\n' +
        '「入れ子を1段はがして平らにしたい」ときは flatMap を使う、と覚えてください。結果は [1, 2, 3, 4] になります。',
    },
    {
      id: 'streams-005',
      categoryId: 'streams',
      difficulty: 2,
      prompt: '文字列を長さごとにグループ分けして Map<Integer, List<String>> を得たい。適切なコードを選びなさい。',
      code: `Stream<String> s = Stream.of("a", "bb", "cc", "ddd");
Map<Integer, List<String>> m = s.collect(
    Collectors.__________(String::length));`,
      choices: [
        { id: 'a', text: 'groupingBy' },
        { id: 'b', text: 'partitioningBy' },
        { id: 'c', text: 'toMap' },
        { id: 'd', text: 'mapping' },
      ],
      correctChoiceIds: ['a'],
      explanation:
        'groupingBy は「あるルール（キー）ごとに要素をグループ分けする」集計です。\n' +
        'ここでは String::length をキーにするので、長さ1→[a]、長さ2→[bb, cc]、長さ3→[ddd] のように\n' +
        'Map<Integer, List<String>> ができます。\n\n' +
        '似た名前の partitioningBy は「true / false の2つだけ」に分ける専用（キーは必ず Boolean）で用途が違います。\n' +
        '「3種類以上に分けたい」なら groupingBy、「条件を満たす/満たさないの2択」なら partitioningBy です。',
    },
    {
      id: 'streams-010',
      categoryId: 'streams',
      difficulty: 2,
      prompt: '次のコードの出力を選びなさい。',
      code: `Map<Boolean, List<Integer>> m = Stream.of(1, 2, 3, 4)
    .collect(Collectors.partitioningBy(n -> n % 2 == 0));
System.out.println(m.get(true));`,
      choices: [
        { id: 'a', text: '[2, 4]' },
        { id: 'b', text: '[1, 3]' },
        { id: 'c', text: '[1, 2, 3, 4]' },
        { id: 'd', text: 'null' },
      ],
      correctChoiceIds: ['a'],
      explanation:
        'partitioningBy は条件（Predicate）で要素を true グループと false グループの2つに分けます。\n' +
        '条件は n % 2 == 0（偶数か）なので、true 側 = 偶数 = [2, 4]、false 側 = 奇数 = [1, 3]。\n' +
        'm.get(true) は偶数のリストなので [2, 4] です。\n\n' +
        'なお partitioningBy は必ず true と false 両方のキーを用意します（該当が無くても空リストが入る）。\n' +
        'そのため groupingBy と違って get(true)/get(false) が null になりません。',
    },
    {
      id: 'streams-007',
      categoryId: 'streams',
      difficulty: 2,
      prompt: '次のコードの出力を選びなさい。',
      code: `Optional<String> o = Stream.of("x", "y", "z")
    .filter(s -> s.startsWith("a"))
    .findFirst();
System.out.println(o.orElse("なし"));`,
      choices: [
        { id: 'a', text: 'なし' },
        { id: 'b', text: 'x' },
        { id: 'c', text: 'null' },
        { id: 'd', text: '実行時に NoSuchElementException' },
      ],
      correctChoiceIds: ['a'],
      explanation:
        'findFirst() は「条件を通った最初の1件」を返しますが、1件も無いこともあります。\n' +
        'そこで「値があるかもしれないし、無いかもしれない」を安全に表す Optional<T> が戻り値になっています。\n\n' +
        'ここでは "a" で始まる要素が無いので、中身が空の Optional（Optional.empty）が返ります。\n' +
        'orElse("なし") は「中身が空なら代わりにこの値を使う」メソッドなので "なし" が出力されます。\n' +
        'Optional を使うことで、null チェック忘れによる NullPointerException を防げるのがポイントです。',
    },
    {
      id: 'streams-008',
      categoryId: 'streams',
      difficulty: 3,
      prompt: '次のコードを実行するとどうなりますか。',
      code: `Stream<Integer> s = Stream.of(1, 2, 3);
s.forEach(System.out::println);
long n = s.count();
System.out.println(n);`,
      choices: [
        { id: 'a', text: '1 2 3 と出力した後、count() で実行時例外が発生する' },
        { id: 'b', text: '1 2 3 と 3 が出力される' },
        { id: 'c', text: 'コンパイルエラーになる' },
        { id: 'd', text: '1 2 3 とだけ出力され、count() は 0 を返す' },
      ],
      correctChoiceIds: ['a'],
      explanation:
        'Stream の大原則として「1つの Stream に終端操作は1回だけ」というルールがあります。\n' +
        '一度 forEach（終端操作）で消費した Stream は「使用済み」になり、もう一度 count（別の終端操作）を\n' +
        '呼ぶと IllegalStateException（"stream has already been operated upon or closed"）が発生します。\n\n' +
        'コンパイルは通る（文法的には正しい）ので、あくまで実行時のエラーです。\n' +
        '再度集計したいなら、その都度 Stream を作り直す必要があります。',
    },
    {
      id: 'streams-002',
      categoryId: 'streams',
      difficulty: 3,
      prompt: '次のコードを実行したときの出力として正しいものを選びなさい。',
      code: `List<String> list = List.of("a", "bb", "ccc");
long c = list.stream()
             .filter(s -> s.length() > 1)
             .peek(System.out::println)
             .count();
System.out.println(c);`,
      choices: [
        { id: 'a', text: 'bb / ccc / 2 が出力される' },
        { id: 'b', text: '2 だけが出力される' },
        { id: 'c', text: 'a / bb / ccc / 2 が出力される' },
        { id: 'd', text: 'コンパイルエラーになる' },
      ],
      correctChoiceIds: ['b'],
      explanation:
        'これは知らないと必ず間違える上級の引っかけです。\n' +
        'Stream は「必要な処理しか実行しない」ため、Java 9 以降の count() は「要素数さえ分かればよい」場合、\n' +
        '途中の要素を実際には作らずに件数だけ求める最適化をします。\n\n' +
        'その結果、要素を1件ずつのぞき見する peek(System.out::println) は呼ばれず、\n' +
        '最後の System.out.println(c) による 2 だけが出力されます。\n' +
        '「peek はデバッグ用であり、必ず実行されるとは限らない」ことを示す有名な例です。',
    },
    {
      id: 'streams-011',
      categoryId: 'streams',
      difficulty: 1,
      prompt: '次のコードの出力を選びなさい。',
      code: `List<Integer> r = Stream.of(3, 1, 2, 3, 1)
    .distinct()
    .sorted()
    .collect(Collectors.toList());
System.out.println(r);`,
      choices: [
        { id: 'a', text: '[1, 2, 3]' },
        { id: 'b', text: '[3, 1, 2]' },
        { id: 'c', text: '[1, 1, 2, 3, 3]' },
        { id: 'd', text: '[3, 3, 2, 1, 1]' },
      ],
      correctChoiceIds: ['a'],
      explanation:
        '2つの中間操作を順に適用します。\n' +
        '・distinct() … 重複を取り除く（equals で判定）。[3,1,2,3,1] → [3,1,2]。\n' +
        '・sorted() … 自然順序（昇順）に並べ替える。[3,1,2] → [1,2,3]。\n\n' +
        '結果は [1, 2, 3]。distinct と sorted はどちらも Stream を返す中間操作なので、こうしてつなげられます。',
    },
    {
      id: 'streams-012',
      categoryId: 'streams',
      difficulty: 2,
      prompt: '次のコードの出力を選びなさい。',
      code: `List<Integer> r = IntStream.rangeClosed(1, 10)
    .boxed()
    .skip(2)
    .limit(3)
    .collect(Collectors.toList());
System.out.println(r);`,
      choices: [
        { id: 'a', text: '[3, 4, 5]' },
        { id: 'b', text: '[1, 2, 3]' },
        { id: 'c', text: '[2, 3, 4]' },
        { id: 'd', text: '[3, 4, 5, 6]' },
      ],
      correctChoiceIds: ['a'],
      explanation:
        'skip と limit は「範囲を切り出す」中間操作です。\n' +
        '・boxed() … IntStream（int）を Stream<Integer> に変換（collect(toList) で使うため）。\n' +
        '・skip(2) … 先頭の2要素を飛ばす。1..10 → 3..10。\n' +
        '・limit(3) … 先頭から3要素だけ取る。3,4,5。\n\n' +
        '結果は [3, 4, 5]。「skip で捨ててから limit で取る」順序に注意しましょう。',
    },
    {
      id: 'streams-014',
      categoryId: 'streams',
      difficulty: 2,
      prompt: '次のコードの出力を選びなさい。',
      code: `Map<Integer, Long> m = Stream.of("a", "bb", "cc", "d")
    .collect(Collectors.groupingBy(
        String::length,
        Collectors.counting()));
System.out.println(m);`,
      choices: [
        { id: 'a', text: '{1=2, 2=2}' },
        { id: 'b', text: '{1=[a, d], 2=[bb, cc]}' },
        { id: 'c', text: '{2=2, 1=2}' },
        { id: 'd', text: '{a=1, bb=2, cc=2, d=1}' },
      ],
      correctChoiceIds: ['a'],
      explanation:
        'groupingBy の第2引数に「ダウンストリーム collector」を渡すと、グループ内をさらに集計できます。\n' +
        'ここでは長さでグループ分けし、各グループを Collectors.counting() で「件数」に集約しています。\n\n' +
        '長さ1: a, d → 2件／長さ2: bb, cc → 2件。よって {1=2, 2=2} になります。\n' +
        '第2引数なしの groupingBy なら値は List（{1=[a, d], 2=[bb, cc]}）ですが、counting を渡すと件数（Long）になります。',
    },
    {
      id: 'streams-015',
      categoryId: 'streams',
      difficulty: 2,
      prompt: '次のコードの出力を選びなさい。',
      code: `List<Integer> r = Stream.iterate(1, n -> n * 2)
    .limit(4)
    .collect(Collectors.toList());
System.out.println(r);`,
      choices: [
        { id: 'a', text: '[1, 2, 4, 8]' },
        { id: 'b', text: '[2, 4, 8, 16]' },
        { id: 'c', text: '[1, 2, 3, 4]' },
        { id: 'd', text: '無限ループになる' },
      ],
      correctChoiceIds: ['a'],
      explanation:
        'Stream.iterate(初期値, 更新関数) は「初期値から、関数を繰り返し適用した値」を生成する無限ストリームです。\n' +
        'ここでは 1 から始めて「2倍」を繰り返すので 1, 2, 4, 8, 16, … と続きます。\n\n' +
        '無限ですが、limit(4) で先頭4個に区切るため [1, 2, 4, 8] になります（無限ループにはなりません。d は誤り）。\n' +
        '無限ストリームは必ず limit などで有限に区切って使うのがポイントです。',
    },
    {
      id: 'streams-013',
      categoryId: 'streams',
      difficulty: 3,
      prompt: '次のコードの出力を選びなさい。',
      code: `boolean b = Stream.<Integer>of()   // 空のストリーム
    .allMatch(n -> n > 100);
System.out.println(b);`,
      choices: [
        { id: 'a', text: 'true' },
        { id: 'b', text: 'false' },
        { id: 'c', text: 'コンパイルエラー' },
        { id: 'd', text: '実行時例外' },
      ],
      correctChoiceIds: ['a'],
      explanation:
        '空ストリームに対する判定操作の挙動は、知らないと間違えるひっかけです。\n' +
        '・allMatch … 要素が1つも無ければ true（「反例が無いので全部満たす」とみなす。数学の“空虚な真”）。\n' +
        '・anyMatch … 空なら false（満たす要素が1つも無い）。\n' +
        '・noneMatch … 空なら true（該当が1つも無い）。\n\n' +
        'この例は空ストリームの allMatch なので、条件の内容に関係なく true になります。',
    },
  ],
} satisfies CategoryModule
