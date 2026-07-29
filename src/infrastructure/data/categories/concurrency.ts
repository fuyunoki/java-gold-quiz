import type { CategoryModule } from '../CategoryModule'

/**
 * 分野: 並行処理（Concurrency）
 *
 * スレッド、ExecutorService/Callable/Future、同期、Atomic、並行コレクション、
 * CompletableFuture、並列ストリーム。Java Gold SE17 の頻出範囲。
 */
export const concurrencyModule: CategoryModule = {
  category: {
    id: 'concurrency',
    name: '並行処理',
    description: 'Thread、ExecutorService/Callable/Future、synchronized、Atomic、並行コレクション、CompletableFuture',
    order: 7,
  },
  questions: [
    {
      id: 'concurrency-009',
      categoryId: 'concurrency',
      difficulty: 1,
      prompt: '次のコードを実行するとどうなりますか。',
      code: `Thread t = new Thread(() ->
    System.out.println(Thread.currentThread().getName()));
t.run();`,
      choices: [
        { id: 'a', text: '新しいスレッドは作られず、main スレッド上で実行され "main" が出力される' },
        { id: 'b', text: '新しいスレッドが作られ、その名前が出力される' },
        { id: 'c', text: 'コンパイルエラー' },
        { id: 'd', text: '何も出力されない' },
      ],
      correctChoiceIds: ['a'],
      explanation:
        'スレッドを実際に「別スレッドで」動かすには start() を呼びます。start() が新しいスレッドを起こし、その中で run() を実行します。\n\n' +
        'ここでは t.run() と直接 run() を呼んでいます。これはただのメソッド呼び出しなので、新しいスレッドは作られず、\n' +
        '呼び出した側（main スレッド）でそのまま実行されます。結果、現在のスレッド名は "main" と出力されます。\n\n' +
        '「run() を直接呼んでも別スレッドにならない。別スレッドにしたいなら start()」が頻出のひっかけです。',
    },
    {
      id: 'concurrency-001',
      categoryId: 'concurrency',
      difficulty: 2,
      prompt: 'Runnable と Callable<V> の違いとして正しいものをすべて選びなさい。',
      choices: [
        { id: 'a', text: 'Callable の call() は値（V）を返せるが、Runnable の run() は戻り値がない（void）' },
        { id: 'b', text: 'Callable の call() はチェック例外を throws できるが、Runnable の run() はできない' },
        { id: 'c', text: 'Runnable は ExecutorService に submit できない' },
        { id: 'd', text: 'Callable はラムダ式で書けない' },
      ],
      correctChoiceIds: ['a', 'b'],
      explanation:
        'どちらも「別スレッドで実行する処理」を表しますが、次の2点が違います。\n' +
        '・戻り値: Callable<V> の call() は V を返せる。Runnable の run() は void（返せない）。\n' +
        '・例外: call() はチェック例外を throws 宣言できる。run() はできない（非チェック例外のみ）。\n\n' +
        '「実行結果を受け取りたい」「チェック例外を投げたい」なら Callable を使います。\n' +
        'c は誤り（Runnable も Callable も submit 可能）、d も誤り（どちらも関数型インターフェースなのでラムダで書けます）。',
    },
    {
      id: 'concurrency-002',
      categoryId: 'concurrency',
      difficulty: 2,
      prompt: '次のコードの出力を選びなさい。',
      code: `ExecutorService es = Executors.newSingleThreadExecutor();
Future<Integer> f = es.submit(() -> 1 + 2);
System.out.println(f.get());
es.shutdown();`,
      choices: [
        { id: 'a', text: '3' },
        { id: 'b', text: 'すぐに null が出力される' },
        { id: 'c', text: 'コンパイルエラー' },
        { id: 'd', text: 'デッドロックして止まる' },
      ],
      correctChoiceIds: ['a'],
      explanation:
        'ExecutorService は「スレッドプールに処理を投げて実行してもらう」仕組みです。\n' +
        'submit(Callable) は、その処理の結果を後で受け取るための Future を返します。\n\n' +
        'Future.get() は「結果が出るまで待って（ブロックして）から返す」メソッドです。\n' +
        'ここでは 1 + 2 の結果 3 が出るまで待ち、3 を返します。最後に shutdown() でプールを終了します。\n' +
        '「submit した結果は Future.get() で受け取る。get() は完了まで待つ」が基本形です。',
    },
    {
      id: 'concurrency-005',
      categoryId: 'concurrency',
      difficulty: 2,
      prompt: '次のコードの出力を選びなさい。',
      code: `AtomicInteger ai = new AtomicInteger(0);
ai.incrementAndGet();
ai.addAndGet(5);
System.out.println(ai.get());`,
      choices: [
        { id: 'a', text: '6' },
        { id: 'b', text: '5' },
        { id: 'c', text: '1' },
        { id: 'd', text: '0' },
      ],
      correctChoiceIds: ['a'],
      explanation:
        'AtomicInteger は「複数スレッドから同時に更新しても壊れない整数」です。内部でロック相当の仕組みを持ち、\n' +
        '増減をアトミック（不可分＝途中で割り込まれない）に行います。\n\n' +
        '・incrementAndGet() … 1 増やしてから値を返す（0→1）。\n' +
        '・addAndGet(5) … 5 足してから値を返す（1→6）。\n\n' +
        'よって get() は 6。普通の int を複数スレッドで count++ すると値が壊れる（競合）ため、\n' +
        'カウンタなどには AtomicInteger を使う、という典型例です。',
    },
    {
      id: 'concurrency-006',
      categoryId: 'concurrency',
      difficulty: 2,
      prompt: 'マルチスレッド環境で共有する Map の選び方について、正しい説明をすべて選びなさい。',
      choices: [
        { id: 'a', text: '通常の HashMap は複数スレッドから同時に更新すると壊れる恐れがあり、スレッドセーフではない' },
        { id: 'b', text: 'ConcurrentHashMap はスレッドセーフで、複数スレッドからの並行アクセスを想定している' },
        { id: 'c', text: 'HashMap を反復処理中に別の要素を追加すると ConcurrentModificationException が起きうる' },
        { id: 'd', text: 'ConcurrentHashMap は null をキーや値にできる' },
      ],
      correctChoiceIds: ['a', 'b', 'c'],
      explanation:
        'スレッド間で共有する Map の選択は Gold の頻出テーマです。\n' +
        '・a … HashMap はスレッドセーフではなく、同時更新でデータ構造が壊れることがある。\n' +
        '・b … ConcurrentHashMap は並行アクセス向けに設計されたスレッドセーフな Map。\n' +
        '・c … HashMap は「反復中の構造変更」を検知すると ConcurrentModificationException を投げる（単一スレッドでも起きる）。\n\n' +
        'd は誤りです。ConcurrentHashMap は null のキーも値も許可しません\n' +
        '（並行処理では「値が無い」のか「null が入っている」のか区別できず危険なため）。',
    },
    {
      id: 'concurrency-004',
      categoryId: 'concurrency',
      difficulty: 2,
      prompt: 'synchronized キーワードの役割として正しいものを選びなさい。',
      choices: [
        {
          id: 'a',
          text: '同じロック対象に対して、一度に1つのスレッドしかブロックに入れないようにし（相互排他）、変更の可視性も保証する',
        },
        { id: 'b', text: 'スレッドの実行速度を上げる' },
        { id: 'c', text: 'スレッドを新しく生成する' },
        { id: 'd', text: '例外を自動的に握りつぶす' },
      ],
      correctChoiceIds: ['a'],
      explanation:
        'synchronized は「同時に触られると困る処理」を保護するための仕組みです。\n' +
        '同じロック（モニタ）に対しては、一度に1つのスレッドしか synchronized ブロック/メソッドに入れません（相互排他）。\n\n' +
        'これにより、複数スレッドが同じデータを同時に書き換えて壊す「競合状態」を防げます。\n' +
        'さらに、あるスレッドの変更が他スレッドから正しく見える「可視性」も保証されます。\n' +
        '速度を上げるものではなく（むしろ待ちが発生しうる）、正しさを守るための仕組みです。',
    },
    {
      id: 'concurrency-007',
      categoryId: 'concurrency',
      difficulty: 3,
      prompt: '次のコードの出力を選びなさい。',
      code: `CompletableFuture<Integer> cf =
    CompletableFuture.supplyAsync(() -> 2)
                     .thenApply(x -> x * 3)
                     .thenApply(x -> x + 1);
System.out.println(cf.get());`,
      choices: [
        { id: 'a', text: '7' },
        { id: 'b', text: '6' },
        { id: 'c', text: '9' },
        { id: 'd', text: '2' },
      ],
      correctChoiceIds: ['a'],
      explanation:
        'CompletableFuture は「非同期処理を、あとに続く処理でつなげていく」ための仕組みです。\n' +
        '・supplyAsync(() -> 2) … 別スレッドで 2 を生成。\n' +
        '・thenApply(x -> x * 3) … その結果 2 を受け取り 3 倍 → 6。\n' +
        '・thenApply(x -> x + 1) … さらに 6 を受け取り +1 → 7。\n\n' +
        '各 thenApply は「前の結果を受け取って変換し、次に渡す」ので、2 → 6 → 7 と流れます。\n' +
        'get() で最終結果 7 を取り出します（Stream の map をつなぐ感覚に似ています）。',
    },
    {
      id: 'concurrency-008',
      categoryId: 'concurrency',
      difficulty: 3,
      prompt: '並列ストリーム（parallelStream）で reduce を使うときの注意点として正しいものを選びなさい。',
      code: `int sum = List.of(1, 2, 3, 4).parallelStream()
                 .reduce(0, (a, b) -> a + b);`,
      choices: [
        {
          id: 'a',
          text: '合成に使う演算は結合的（associative）である必要がある。加算は結合的なので並列でも正しい結果になる',
        },
        { id: 'b', text: '並列ストリームでは reduce は使えない' },
        { id: 'c', text: '並列ストリームは常に逐次ストリームより速い' },
        { id: 'd', text: 'reduce の初期値は必ず 1 にしなければならない' },
      ],
      correctChoiceIds: ['a'],
      explanation:
        '並列ストリームはデータを分割し、複数スレッドで部分計算してから結合します。\n' +
        'このとき合成演算が「結合的（(a op b) op c == a op (b op c)）」でないと、分割のしかたによって結果が変わってしまいます。\n\n' +
        '加算は結合的なので、どう分割・合成しても合計は同じ 10 になり、並列でも安全です。\n' +
        '・c は誤り。並列化にはスレッド分割の overhead があり、小さいデータではむしろ遅くなることも多いです。\n' +
        '・初期値（identity）は演算の単位元（加算なら 0）にする必要があり、常に 1 ではありません（d は誤り）。',
    },
    {
      id: 'concurrency-010',
      categoryId: 'concurrency',
      difficulty: 3,
      prompt: 'ExecutorService の shutdown() と shutdownNow() の違いとして正しいものを選びなさい。',
      choices: [
        {
          id: 'a',
          text: 'shutdown() は新規受付を止め、実行中・キュー済みのタスクは完了させる。shutdownNow() は実行中タスクの中断を試み、未実行タスクの一覧を返す',
        },
        { id: 'b', text: 'どちらも即座にすべてのタスクを強制終了する点で同じ' },
        { id: 'c', text: 'shutdown() を呼ぶと、それ以降 submit 済みのタスクもすべて破棄される' },
        { id: 'd', text: 'shutdownNow() を呼ぶとプールは再利用できる状態に戻る' },
      ],
      correctChoiceIds: ['a'],
      explanation:
        'ExecutorService は使い終わったら必ず終了させます（そうしないとスレッドが残りアプリが終了しないことも）。\n' +
        '・shutdown() … 「おだやかな終了」。新しいタスクは受け付けないが、すでに実行中・キューにあるタスクは最後までやり切る。\n' +
        '・shutdownNow() … 「急ぎの終了」。実行中タスクへ割り込み（interrupt）で中断を試み、まだ実行されていないタスクの一覧を返す。\n\n' +
        '実際の完了を待ちたいときは、shutdown() の後に awaitTermination(タイムアウト) で待ちます。\n' +
        'いずれも一度終了させたプールは再利用できません（d は誤り）。',
    },
    {
      id: 'concurrency-003',
      categoryId: 'concurrency',
      difficulty: 1,
      prompt: 'Executors.newFixedThreadPool(2) で作ったプールに5つのタスクを submit したときの挙動として正しいものを選びなさい。',
      choices: [
        {
          id: 'a',
          text: '同時に実行されるのは最大2つ。残りはキューで待ち、スレッドが空くと順次実行される',
        },
        { id: 'b', text: '5つのタスクがすべて同時に実行される' },
        { id: 'c', text: '3つ目以降の submit は例外になる' },
        { id: 'd', text: 'タスクは1つずつしか実行されない' },
      ],
      correctChoiceIds: ['a'],
      explanation:
        'newFixedThreadPool(2) は「スレッドを最大2本」に固定したプールです。\n' +
        '同時に走れるのは2タスクまでで、それを超えた分は内部のキューで待機します。\n\n' +
        '実行中のタスクが終わってスレッドが空くと、キューの先頭から次のタスクが実行されます。\n' +
        'submit した時点で例外にはならず（c は誤り）、スレッド数を固定することで同時実行数（＝負荷）を制御できるのが利点です。',
    },
    {
      id: 'concurrency-011',
      categoryId: 'concurrency',
      difficulty: 2,
      prompt: 'volatile 修飾子の効果として正しいものを選びなさい。',
      choices: [
        {
          id: 'a',
          text: '変数の変更が他スレッドから即座に見えるようにする（可視性を保証）。ただし count++ のような複合操作の原子性は保証しない',
        },
        { id: 'b', text: 'count++ のような操作もアトミックにしてくれる' },
        { id: 'c', text: 'volatile を付けると自動的にロックが取得される' },
        { id: 'd', text: 'volatile はメソッドに付ける修飾子である' },
      ],
      correctChoiceIds: ['a'],
      explanation:
        'volatile はフィールドに付ける修飾子で、「可視性」を保証します。\n' +
        'あるスレッドの書き込みが、他スレッドからすぐ見えるようになります（各スレッドのキャッシュに古い値が残らない）。\n\n' +
        'ただし保証するのは可視性だけで、原子性（不可分性）は保証しません。\n' +
        'count++ は「読み→加算→書き」の複合操作なので、volatile でも競合で値が壊れることがあります。\n' +
        'そうしたカウンタには AtomicInteger や synchronized を使います。「volatile＝可視性、Atomic/synchronized＝原子性」です。',
    },
    {
      id: 'concurrency-012',
      categoryId: 'concurrency',
      difficulty: 2,
      prompt: 'ローカル変数とスレッド安全性について、正しい説明を選びなさい。',
      choices: [
        {
          id: 'a',
          text: 'メソッド内のローカル変数（プリミティブや、そのメソッド内だけに閉じたオブジェクト）は各スレッドのスタックに独立して存在するため、共有されずスレッドセーフである',
        },
        { id: 'b', text: 'ローカル変数も複数スレッドで共有されるため危険である' },
        { id: 'c', text: 'ローカル変数を使うと必ず synchronized が必要になる' },
        { id: 'd', text: 'ローカル変数はヒープに置かれ、全スレッドで共有される' },
      ],
      correctChoiceIds: ['a'],
      explanation:
        'スレッド安全性の基本は「共有される状態があるか」です。\n' +
        'メソッドのローカル変数は各スレッドが持つ「スタック」上に、そのスレッド専用に作られます。\n' +
        '別スレッドから触られないため、そもそも競合が起きず、スレッドセーフです。\n\n' +
        '危険なのは複数スレッドで共有される状態、つまりインスタンスフィールドや static フィールドです。\n' +
        '（ただしローカル変数でも、参照するオブジェクトが外部と共有されている場合は、その共有オブジェクトの操作には注意が必要です。）',
    },
    {
      id: 'concurrency-013',
      categoryId: 'concurrency',
      difficulty: 2,
      prompt: 'Future.get(long timeout, TimeUnit unit) の挙動として正しいものを選びなさい。',
      choices: [
        {
          id: 'a',
          text: '指定時間内に結果が得られなければ TimeoutException を投げる（タスク自体は動き続ける）',
        },
        { id: 'b', text: 'タイムアウトすると自動的にタスクをキャンセルする' },
        { id: 'c', text: 'タイムアウトすると null を返す' },
        { id: 'd', text: 'timeout 付き get は存在しない' },
      ],
      correctChoiceIds: ['a'],
      explanation:
        'Future.get() は結果が出るまで待ち続けますが、タイムアウト付きの get(timeout, unit) は\n' +
        '「指定時間だけ待って、それでも終わらなければ TimeoutException を投げる」形になります。\n\n' +
        '重要なのは、TimeoutException が出てもタスク自体は裏で動き続ける点です（自動キャンセルはしない。b は誤り）。\n' +
        '止めたい場合は別途 future.cancel(true) を呼びます。無限に待ちたくない処理でタイムアウト付き get が有効です。',
    },
    {
      id: 'concurrency-014',
      categoryId: 'concurrency',
      difficulty: 3,
      prompt: 'デッドロックが起こる典型的な状況として正しいものを選びなさい。',
      choices: [
        {
          id: 'a',
          text: '2つのスレッドが2つのロックを逆の順序で取得しようとし、互いに相手が持つロックの解放を待ち続ける',
        },
        { id: 'b', text: '1つのスレッドが1つのロックだけを使う場合' },
        { id: 'c', text: 'すべてのスレッドが同じ順序でロックを取得する場合' },
        { id: 'd', text: 'ロックを一切使わない場合' },
      ],
      correctChoiceIds: ['a'],
      explanation:
        'デッドロックは「互いに相手の持つ資源を待ち合って、どちらも進めなくなる」状態です。\n\n' +
        '典型例は、スレッド1が「ロックA→ロックB」、スレッド2が「ロックB→ロックA」の順で取ろうとするケース。\n' +
        'スレッド1がAを、スレッド2がBを持った時点で、互いに相手のロック解放を永遠に待ちます。\n\n' +
        '有効な対策は「すべてのスレッドでロックの取得順序を統一する」ことです（c のようにすればデッドロックを避けられる）。\n' +
        'ロックを1つしか使わない・順序が揃っている状況ではデッドロックは起きません。',
    },
  ],
} satisfies CategoryModule
