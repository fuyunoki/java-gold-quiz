import type { CategoryModule } from '../CategoryModule'

/**
 * 分野: コレクションフレームワーク
 *
 * List / Set / Map の性質、Comparator による整列、便利メソッド
 * （getOrDefault / computeIfAbsent / merge）、不変コレクション、equals/hashCode。
 */
export const collectionsModule: CategoryModule = {
  category: {
    id: 'collections',
    name: 'コレクション',
    description: 'List/Set/Map の性質、Comparator、便利メソッド、不変コレクション、equals/hashCode',
    order: 4,
  },
  questions: [
    {
      id: 'collections-001',
      categoryId: 'collections',
      difficulty: 1,
      prompt: '次のコードの出力を選びなさい。',
      code: `Set<String> set = new HashSet<>();
set.add("a");
set.add("b");
set.add("a");
System.out.println(set.size());`,
      choices: [
        { id: 'a', text: '2' },
        { id: 'b', text: '3' },
        { id: 'c', text: '1' },
        { id: 'd', text: '実行時に例外' },
      ],
      correctChoiceIds: ['a'],
      explanation:
        'Set（集合）は「重複を許さない」コレクションです。\n' +
        '同じ "a" を2回追加しても、2回目は無視される（追加されない）ため、要素は "a" と "b" の2つだけです。\n\n' +
        'したがって size() は 2。\n' +
        '「重複を排除したい」なら Set、「重複や順番も保持したい」なら List、と使い分けます。',
    },
    {
      id: 'collections-002',
      categoryId: 'collections',
      difficulty: 1,
      prompt: '次のコードを実行するとどうなりますか。',
      code: `List<String> list = List.of("a", "b");
list.add("c");`,
      choices: [
        { id: 'a', text: '実行時に UnsupportedOperationException が発生する' },
        { id: 'b', text: '["a", "b", "c"] になる' },
        { id: 'c', text: 'コンパイルエラーになる' },
        { id: 'd', text: '何も起きず list は ["a", "b"] のまま' },
      ],
      correctChoiceIds: ['a'],
      explanation:
        'List.of(...) が作るのは「変更できない（不変）リスト」です。\n' +
        'add や remove など、中身を変えようとするメソッドを呼ぶと実行時に UnsupportedOperationException が発生します。\n\n' +
        'コンパイルは通る（add メソッド自体は存在する）ため、あくまで実行時のエラーである点に注意しましょう。\n' +
        '変更したいリストが欲しいときは new ArrayList<>(List.of("a","b")) のようにコピーして使います。',
    },
    {
      id: 'collections-007',
      categoryId: 'collections',
      difficulty: 1,
      prompt: 'Map 実装の反復（イテレート）順について、正しい説明をすべて選びなさい。',
      choices: [
        { id: 'a', text: 'HashMap はキーの並び順を保証しない' },
        { id: 'b', text: 'LinkedHashMap は挿入した順序を保つ' },
        { id: 'c', text: 'TreeMap はキーが自然順序（ソート順）で並ぶ' },
        { id: 'd', text: 'HashMap は常にキーのアルファベット順で並ぶ' },
      ],
      correctChoiceIds: ['a', 'b', 'c'],
      explanation:
        '3つの Map の「並び順」の違いは頻出です。\n' +
        '・HashMap … 順序の保証なし。取り出す順番は不定と考える（a が正しく、d は誤り）。\n' +
        '・LinkedHashMap … 追加した順番（挿入順）を保持する。\n' +
        '・TreeMap … キーを自然順序（数値なら昇順、文字列なら辞書順）に自動でソートする。\n\n' +
        '「順番を気にしないなら HashMap、入れた順を保ちたいなら LinkedHashMap、ソートしたいなら TreeMap」\n' +
        'と目的で選びます。',
    },
    {
      id: 'collections-003',
      categoryId: 'collections',
      difficulty: 2,
      prompt: '次のコードの出力を選びなさい。',
      code: `List<String> names = new ArrayList<>(
    List.of("bb", "a", "cc", "b"));
names.sort(
    Comparator.comparingInt(String::length)
              .thenComparing(Comparator.naturalOrder()));
System.out.println(names);`,
      choices: [
        { id: 'a', text: '[a, b, bb, cc]' },
        { id: 'b', text: '[bb, cc, a, b]' },
        { id: 'c', text: '[a, b, cc, bb]' },
        { id: 'd', text: '[cc, bb, b, a]' },
      ],
      correctChoiceIds: ['a'],
      explanation:
        'Comparator を「まず長さ順、長さが同じなら辞書順」と2段階で組み立てています。\n' +
        '・comparingInt(String::length) … まず文字数で比較。\n' +
        '・thenComparing(naturalOrder()) … 文字数が同じ要素どうしは、次に自然順序（辞書順）で比較。\n\n' +
        'まず長さで分けると 長さ1: a, b ／ 長さ2: bb, cc。\n' +
        'それぞれの中を辞書順にすると a, b と bb, cc。つなげて [a, b, bb, cc] になります。\n' +
        '「comparing で1つ目のキー、thenComparing で同点時の2つ目のキー」と覚えましょう。',
    },
    {
      id: 'collections-004',
      categoryId: 'collections',
      difficulty: 2,
      prompt: '次のコードの出力を選びなさい。',
      code: `Map<String, Integer> m = new HashMap<>();
m.put("x", 1);
System.out.println(m.getOrDefault("y", 0));
System.out.println(m.getOrDefault("x", 0));`,
      choices: [
        { id: 'a', text: '0 と 1' },
        { id: 'b', text: 'null と 1' },
        { id: 'c', text: '0 と 0' },
        { id: 'd', text: '実行時に NullPointerException' },
      ],
      correctChoiceIds: ['a'],
      explanation:
        'getOrDefault(キー, 既定値) は「キーがあればその値、無ければ既定値」を返すメソッドです。\n\n' +
        '・"y" は Map に無いので、既定値の 0 が返る。\n' +
        '・"x" はあるので、その値 1 が返る。\n\n' +
        '普通の get("y") だと null が返り、そのまま int 変数に代入すると NullPointerException の原因になります。\n' +
        'getOrDefault を使えば「無いとき用の値」を安全に用意できます。',
    },
    {
      id: 'collections-005',
      categoryId: 'collections',
      difficulty: 2,
      prompt: '次のコードの出力を選びなさい。',
      code: `Map<String, List<String>> m = new HashMap<>();
m.computeIfAbsent("fruit", k -> new ArrayList<>()).add("apple");
m.computeIfAbsent("fruit", k -> new ArrayList<>()).add("banana");
System.out.println(m);`,
      choices: [
        { id: 'a', text: '{fruit=[apple, banana]}' },
        { id: 'b', text: '{fruit=[banana]}' },
        { id: 'c', text: '{fruit=[apple]}' },
        { id: 'd', text: '{fruit=[apple], fruit=[banana]}' },
      ],
      correctChoiceIds: ['a'],
      explanation:
        'computeIfAbsent(キー, 生成関数) は「キーが無ければ生成関数で値を作って登録し、その値を返す。あれば既存の値を返す」\n' +
        'という便利メソッドです。「無ければ作る」という定番パターンを1行で書けます。\n\n' +
        '1回目の "fruit" はまだ無いので new ArrayList<>() を作って登録し、そのリストに "apple" を追加。\n' +
        '2回目の "fruit" は既にあるので同じリストが返り、そこに "banana" を追加。\n' +
        '結果、1つのリストに両方入って {fruit=[apple, banana]} になります。',
    },
    {
      id: 'collections-010',
      categoryId: 'collections',
      difficulty: 2,
      prompt: '単語の出現回数を数える次のコードで、count.get("a") の値を選びなさい。',
      code: `Map<String, Integer> count = new HashMap<>();
for (String w : List.of("a", "b", "a", "c", "a")) {
    count.merge(w, 1, Integer::sum);
}
System.out.println(count.get("a"));`,
      choices: [
        { id: 'a', text: '3' },
        { id: 'b', text: '1' },
        { id: 'c', text: '5' },
        { id: 'd', text: '実行時に NullPointerException' },
      ],
      correctChoiceIds: ['a'],
      explanation:
        'merge(キー, 値, 合成関数) は集計の定番メソッドです。動きは次の2通り。\n' +
        '・キーが無い場合 … そのまま「値」を登録する（ここでは 1）。\n' +
        '・キーが既にある場合 … 「既存の値」と「値」を合成関数で計算し直して登録する。\n\n' +
        '"a" は登場するたびに、最初は 1、次からは Integer::sum（既存＋1）で 2→3 と増えます。\n' +
        '"a" は3回出るので最終的に 3。カウント処理を安全・簡潔に書ける（null チェック不要）のが利点です。',
    },
    {
      id: 'collections-006',
      categoryId: 'collections',
      difficulty: 2,
      prompt: '次のコードの出力を選びなさい。',
      code: `Map<String, Integer> m = new TreeMap<>();
m.put("banana", 1);
m.put("apple", 2);
m.put("cherry", 3);
System.out.println(m.keySet());`,
      choices: [
        { id: 'a', text: '[apple, banana, cherry]' },
        { id: 'b', text: '[banana, apple, cherry]' },
        { id: 'c', text: '[cherry, banana, apple]' },
        { id: 'd', text: '毎回順番が変わる' },
      ],
      correctChoiceIds: ['a'],
      explanation:
        'TreeMap はキーを「自然順序」に自動でソートして保持します。文字列の自然順序は辞書順（アルファベット順）です。\n\n' +
        'そのため入れた順番（banana → apple → cherry）に関係なく、キーは apple, banana, cherry の順に並びます。\n' +
        'もし HashMap なら順序は不定、LinkedHashMap なら挿入順（banana, apple, cherry）になります。',
    },
    {
      id: 'collections-008',
      categoryId: 'collections',
      difficulty: 2,
      prompt: '次のコードの出力を選びなさい。',
      code: `List<Integer> nums = new ArrayList<>(List.of(3, 1, 2));
nums.sort(Comparator.reverseOrder());
System.out.println(nums);`,
      choices: [
        { id: 'a', text: '[3, 2, 1]' },
        { id: 'b', text: '[1, 2, 3]' },
        { id: 'c', text: '[2, 1, 3]' },
        { id: 'd', text: 'コンパイルエラー' },
      ],
      correctChoiceIds: ['a'],
      explanation:
        'Comparator.reverseOrder() は「自然順序の逆」を表す Comparator です。数値なら降順になります。\n' +
        'そのため [3, 1, 2] は大きい順に並び替えられて [3, 2, 1] になります。\n\n' +
        '関連メソッドも整理しておきましょう。\n' +
        '・Comparator.naturalOrder() … 自然順序（昇順）。\n' +
        '・既存Comparator.reversed() … その比較を反転する。\n' +
        'なお sort する対象は変更可能なリストである必要があります（List.of の不変リストを直接 sort すると例外）。',
    },
    {
      id: 'collections-009',
      categoryId: 'collections',
      difficulty: 3,
      prompt: '自作クラスのインスタンスを HashSet の要素や HashMap のキーとして正しく扱うために必要なことを選びなさい。',
      choices: [
        { id: 'a', text: 'equals と hashCode の両方を、整合するように適切にオーバーライドする' },
        { id: 'b', text: 'Comparable を実装すれば十分である' },
        { id: 'c', text: 'toString をオーバーライドすれば十分である' },
        { id: 'd', text: '何もしなくても内容が同じなら同一要素として扱われる' },
      ],
      correctChoiceIds: ['a'],
      explanation:
        'HashSet や HashMap は、要素・キーの同一判定に hashCode と equals の両方を使います。\n' +
        '手順はざっくり「まず hashCode でバケツ（格納場所）を決め、その中で equals を使って一致を確認」です。\n\n' +
        'そのため equals だけ、hashCode だけを直すと不整合が起きます。\n' +
        '　→ 「equals が true なら hashCode も必ず同じ」という規約を守るよう、両方セットでオーバーライドします。\n' +
        '何もしないと Object 既定の「参照が同じか（同じインスタンスか）」で判定され、内容が同じ別インスタンスは別物扱いになります。\n\n' +
        '・Comparable（b）は TreeSet/TreeMap の順序付けに使うもので、HashSet の同一判定には使われません。',
    },
  ],
} satisfies CategoryModule
