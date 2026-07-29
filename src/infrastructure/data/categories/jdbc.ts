import type { CategoryModule } from '../CategoryModule'

/**
 * 分野: JDBC
 *
 * Connection / Statement / PreparedStatement / ResultSet、
 * executeQuery と executeUpdate、トランザクション、リソース解放。
 */
export const jdbcModule: CategoryModule = {
  category: {
    id: 'jdbc',
    name: 'JDBC',
    description: 'Connection/PreparedStatement/ResultSet、executeQuery/Update、トランザクション、リソース解放',
    order: 10,
  },
  questions: [
    {
      id: 'jdbc-001',
      categoryId: 'jdbc',
      difficulty: 1,
      prompt: 'データベースへの接続（Connection）を取得する標準的な方法を選びなさい。',
      code: `String url = "jdbc:h2:mem:test";
Connection con = __________;`,
      choices: [
        { id: 'a', text: 'DriverManager.getConnection(url, user, password)' },
        { id: 'b', text: 'new Connection(url)' },
        { id: 'c', text: 'Connection.open(url)' },
        { id: 'd', text: 'Statement.connect(url)' },
      ],
      correctChoiceIds: ['a'],
      explanation:
        'Connection はインターフェースなので new では作れません（b は誤り）。\n' +
        '接続の取得には DriverManager.getConnection(URL, ユーザー, パスワード) を使うのが基本です。\n\n' +
        'URL は "jdbc:サブプロトコル:..." の形式で、どの DB に接続するかを表します（例: jdbc:h2:..., jdbc:postgresql:...）。\n' +
        'JDBC 4.0 以降はドライバが自動で読み込まれるため、明示的な Class.forName は通常不要です。',
    },
    {
      id: 'jdbc-004',
      categoryId: 'jdbc',
      difficulty: 1,
      prompt: 'ResultSet から値を取り出すときの「列インデックス」について、正しい説明を選びなさい。',
      code: `ResultSet rs = ...;
while (rs.next()) {
    String name = rs.getString(1);
}`,
      choices: [
        { id: 'a', text: '列インデックスは 1 から始まる（最初の列は 1）' },
        { id: 'b', text: '列インデックスは 0 から始まる（最初の列は 0）' },
        { id: 'c', text: '列インデックスは指定できず、列名のみ使える' },
        { id: 'd', text: '列インデックスは -1 から始まる' },
      ],
      correctChoiceIds: ['a'],
      explanation:
        'JDBC の列インデックスは配列と違って「1 始まり」です。最初の列が 1、次が 2 …となります。\n\n' +
        'rs.getString(1) は1番目の列を文字列として取得します。列名でも rs.getString("name") のように取得できます。\n' +
        '同様に PreparedStatement のパラメータ（後述の ? の番号）も 1 始まりです。\n' +
        '「0 始まりではない」点がプログラマにとって間違えやすいポイントです。',
    },
    {
      id: 'jdbc-002',
      categoryId: 'jdbc',
      difficulty: 2,
      prompt: 'PreparedStatement を Statement より優先して使う理由として正しいものをすべて選びなさい。',
      code: `PreparedStatement ps =
    con.prepareStatement("SELECT * FROM users WHERE name = ?");
ps.setString(1, userInput);
ResultSet rs = ps.executeQuery();`,
      choices: [
        { id: 'a', text: '値を ? のプレースホルダで安全に埋め込むため、SQLインジェクションを防ぎやすい' },
        { id: 'b', text: '同じSQLを繰り返し実行する際に、事前コンパイルされ効率がよいことがある' },
        { id: 'c', text: '文字列連結でSQLを組み立てるより安全でコードも読みやすい' },
        { id: 'd', text: 'PreparedStatement はSQLを実行できない（定義専用である）' },
      ],
      correctChoiceIds: ['a', 'b', 'c'],
      explanation:
        'PreparedStatement は「? の場所に、setString / setInt などで値を後から安全に差し込む」仕組みです。\n' +
        '・a … 値がSQL文の一部ではなく「パラメータ」として渡るため、悪意ある入力でSQLを改ざんされにくい（インジェクション対策）。\n' +
        '・b … 同じ形のSQLを繰り返す場合、DB側で事前コンパイルされ効率的なことがある。\n' +
        '・c … "... WHERE name = \'" + input + "\'" のような危険な文字列連結を避けられる。\n\n' +
        'd は誤りで、executeQuery / executeUpdate で普通にSQLを実行できます。\n' +
        'ユーザー入力を含むSQLでは、原則 PreparedStatement を使います。',
    },
    {
      id: 'jdbc-003',
      categoryId: 'jdbc',
      difficulty: 2,
      prompt: 'ResultSet の next() メソッドについて、正しい説明を選びなさい。',
      code: `ResultSet rs = ps.executeQuery();
while (rs.next()) {
    System.out.println(rs.getString("name"));
}`,
      choices: [
        {
          id: 'a',
          text: 'カーソルを次の行へ進め、行があれば true、無ければ false を返す。最初は先頭行の「手前」を指している',
        },
        { id: 'b', text: 'next() は次の列へ移動するメソッドである' },
        { id: 'c', text: 'ResultSet は取得直後から先頭行を指しているので next() は不要' },
        { id: 'd', text: 'next() は常に true を返す' },
      ],
      correctChoiceIds: ['a'],
      explanation:
        'ResultSet は「結果の行を上から順にたどるカーソル」を持っています。\n' +
        '取得直後、カーソルは「最初の行の手前」を指しています。そのため、まず next() を呼んで先頭行へ進めます。\n\n' +
        'next() は「次の行へ進めて、行があれば true、無ければ false を返す」ので、while (rs.next()) の形で全行を回せます。\n' +
        '「次の列」ではなく「次の行」へ動かす点に注意（b は誤り）。列は getString(1) や getString("name") で指定します。',
    },
    {
      id: 'jdbc-007',
      categoryId: 'jdbc',
      difficulty: 2,
      prompt: 'executeQuery と executeUpdate の使い分けとして正しいものを選びなさい。',
      choices: [
        {
          id: 'a',
          text: 'executeQuery は SELECT 用で ResultSet を返す。executeUpdate は INSERT/UPDATE/DELETE 用で影響行数（int）を返す',
        },
        { id: 'b', text: 'executeQuery は INSERT 用、executeUpdate は SELECT 用である' },
        { id: 'c', text: 'どちらも ResultSet を返す' },
        { id: 'd', text: 'executeUpdate は必ず ResultSet を返す' },
      ],
      correctChoiceIds: ['a'],
      explanation:
        '実行メソッドは「取得系」か「更新系」かで使い分けます。\n' +
        '・executeQuery(sql) … SELECT のように「結果の表」を得る用。戻り値は ResultSet。\n' +
        '・executeUpdate(sql) … INSERT / UPDATE / DELETE のように「行を変更する」用。戻り値は影響を受けた行数（int）。\n\n' +
        '（どちらか分からない汎用の execute(sql) もあり、boolean を返して結果がResultSetか行数かを判別します。）\n' +
        '「SELECT→executeQuery→ResultSet」「変更系→executeUpdate→件数」とセットで覚えましょう。',
    },
    {
      id: 'jdbc-006',
      categoryId: 'jdbc',
      difficulty: 2,
      prompt: 'JDBC のリソース（Connection, Statement, ResultSet）の後始末について、最も適切な方法を選びなさい。',
      choices: [
        {
          id: 'a',
          text: 'これらは AutoCloseable なので try-with-resources で開き、自動的に close させる',
        },
        { id: 'b', text: 'close は不要で、GC が自動的に解放してくれる' },
        { id: 'c', text: 'Connection だけ閉じれば Statement と ResultSet は無視してよい（閉じてはいけない）' },
        { id: 'd', text: 'finally での手動 close は禁止されている' },
      ],
      correctChoiceIds: ['a'],
      explanation:
        'Connection・Statement・PreparedStatement・ResultSet はいずれも AutoCloseable です。\n' +
        'そのため try-with-resources（try (Connection con = ...; PreparedStatement ps = ...) { ... }）で開くと、\n' +
        'ブロックを抜けるときに宣言と逆順で自動 close され、閉じ忘れを防げます。\n\n' +
        'DB接続などの外部リソースは、放置するとコネクション枯渇などの深刻な問題を起こすため、確実に閉じる必要があります\n' +
        '（GC 任せにしてはいけません。b は誤り）。try-with-resources が最も安全で簡潔な方法です。',
    },
    {
      id: 'jdbc-005',
      categoryId: 'jdbc',
      difficulty: 3,
      prompt: '複数の更新を「まとめて成功/失敗」させるトランザクション処理として正しい流れを選びなさい。',
      code: `con.setAutoCommit(false);
try {
    // 複数の executeUpdate ...
    con.commit();
} catch (SQLException e) {
    con.rollback();
}`,
      choices: [
        {
          id: 'a',
          text: 'setAutoCommit(false) で自動コミットを止め、成功時に commit()、失敗時に rollback() する',
        },
        { id: 'b', text: 'setAutoCommit(true) にしてから複数の更新をまとめる' },
        { id: 'c', text: 'commit や rollback を呼ばなくても、まとめて反映される' },
        { id: 'd', text: 'rollback() は変更をすべて確定させるメソッドである' },
      ],
      correctChoiceIds: ['a'],
      explanation:
        'JDBC は既定で「1文ごとに自動コミット（autoCommit=true）」です。これだと複数の更新を「ひとまとまり」にできません。\n\n' +
        'そこで手順は次の通りです。\n' +
        '1. setAutoCommit(false) … 自動コミットを止め、トランザクションを開始する。\n' +
        '2. 複数の更新を実行する。\n' +
        '3. すべて成功したら commit() … 変更を確定する。\n' +
        '4. 途中で失敗したら rollback() … 変更をすべて取り消す（開始前の状態に戻す）。\n\n' +
        'これで「全部成功か、全部無かったことに（All or Nothing）」を実現できます。rollback は確定ではなく取り消しです（d は誤り）。',
    },
    {
      id: 'jdbc-008',
      categoryId: 'jdbc',
      difficulty: 2,
      prompt: '次の PreparedStatement のパラメータ設定について、正しい説明を選びなさい。',
      code: `PreparedStatement ps = con.prepareStatement(
    "INSERT INTO item(name, price) VALUES(?, ?)");
ps.setString(1, "pen");
ps.setInt(2, 100);
ps.executeUpdate();`,
      choices: [
        { id: 'a', text: '? は左から順に 1, 2 …と番号が割り当てられ、setString/setInt でその番号に値を設定する' },
        { id: 'b', text: '? の番号は 0 から始まる' },
        { id: 'c', text: 'setString と setInt は型を自動判別するので番号は不要' },
        { id: 'd', text: 'この INSERT は executeQuery で実行すべきである' },
      ],
      correctChoiceIds: ['a'],
      explanation:
        'PreparedStatement の ? は「パラメータの穴」で、左から順に 1, 2, 3 …と番号が付きます（1 始まり）。\n' +
        'setString(1, "pen") は1つ目の ? に文字列を、setInt(2, 100) は2つ目の ? に整数を設定します。\n\n' +
        '型に応じて setString / setInt / setDouble / setDate などを使い分けます。\n' +
        'また INSERT は「行を変更する」ので executeUpdate を使います（executeQuery は SELECT 用。d は誤り）。',
    },
    {
      id: 'jdbc-009',
      categoryId: 'jdbc',
      difficulty: 1,
      prompt: 'Connection 取得直後の「自動コミット（autoCommit）」の既定状態として正しいものを選びなさい。',
      choices: [
        { id: 'a', text: '既定では true（各SQL文が実行ごとに自動的にコミットされる）' },
        { id: 'b', text: '既定では false（明示的に commit しないと反映されない）' },
        { id: 'c', text: 'Connection には autoCommit の概念はない' },
        { id: 'd', text: '既定は接続先DBによって毎回ランダムに決まる' },
      ],
      correctChoiceIds: ['a'],
      explanation:
        'JDBC の Connection は、既定では autoCommit が true です。\n' +
        'つまり executeUpdate などを実行するたびに、その1文が自動的にコミット（確定）されます。\n\n' +
        '複数の更新を「まとめて成功／失敗」させたい（トランザクションにしたい）ときは、\n' +
        'setAutoCommit(false) にしてから複数実行し、最後に commit()（失敗時は rollback()）します。\n' +
        '「既定は自動コミットON」を押さえておきましょう。',
    },
    {
      id: 'jdbc-011',
      categoryId: 'jdbc',
      difficulty: 2,
      prompt: '同じINSERTを大量に実行するとき、効率化に使う仕組みとして正しいものを選びなさい。',
      code: `PreparedStatement ps = con.prepareStatement(
    "INSERT INTO item(name) VALUES(?)");
for (String n : names) {
    ps.setString(1, n);
    ps.__________;      // (1) バッチに追加
}
ps.__________;          // (2) まとめて実行`,
      choices: [
        { id: 'a', text: '(1) addBatch()  (2) executeBatch()' },
        { id: 'b', text: '(1) executeUpdate()  (2) commit()' },
        { id: 'c', text: '(1) addBatch()  (2) executeUpdate()' },
        { id: 'd', text: '(1) next()  (2) execute()' },
      ],
      correctChoiceIds: ['a'],
      explanation:
        'バッチ更新は「複数のSQL実行をためて、一括でDBに送る」仕組みで、往復回数が減り効率的です。\n' +
        '・addBatch() … 現在のパラメータでの実行を「バッチ（ためておく箱）」に追加する。\n' +
        '・executeBatch() … ためた分をまとめて実行し、各文の更新件数の配列（int[]）を返す。\n\n' +
        'ループ内で毎回 executeUpdate すると1件ずつDBへ往復して遅くなります。\n' +
        '「ループ内で addBatch、ループ後に executeBatch」が定石です。',
    },
    {
      id: 'jdbc-012',
      categoryId: 'jdbc',
      difficulty: 2,
      prompt: 'SQLException についての説明として正しいものをすべて選びなさい。',
      choices: [
        { id: 'a', text: 'SQLException はチェック例外なので、catch するか throws 宣言が必要' },
        { id: 'b', text: 'getSQLState() や getErrorCode() で、DB由来のエラー情報を取得できる' },
        { id: 'c', text: 'JDBC の主要メソッド（executeQuery など）は SQLException を投げうる' },
        { id: 'd', text: 'SQLException は RuntimeException のサブクラスである' },
      ],
      correctChoiceIds: ['a', 'b', 'c'],
      explanation:
        'JDBC の例外処理の基本です。\n' +
        '・a … SQLException は Exception 直系のチェック例外。呼び出し側は catch か throws が必要。\n' +
        '・b … getSQLState()（標準の状態コード）や getErrorCode()（DB固有のコード）で詳細を調べられる。\n' +
        '・c … executeQuery/executeUpdate/getConnection などはいずれも SQLException を throws する。\n\n' +
        'd は誤りで、SQLException は RuntimeException ではなくチェック例外です。\n' +
        'そのため JDBC コードでは例外処理（try-catch や throws）が必須になります。',
    },
    {
      id: 'jdbc-010',
      categoryId: 'jdbc',
      difficulty: 2,
      prompt: '汎用の execute(sql) メソッドの戻り値についての説明として正しいものを選びなさい。',
      choices: [
        {
          id: 'a',
          text: 'boolean を返す。true なら結果が ResultSet（getResultSet で取得）、false なら更新件数（getUpdateCount で取得）',
        },
        { id: 'b', text: 'execute は常に ResultSet を返す' },
        { id: 'c', text: 'execute は常に int（更新件数）を返す' },
        { id: 'd', text: 'execute は void で、結果は取得できない' },
      ],
      correctChoiceIds: ['a'],
      explanation:
        'execute(sql) は「SELECTか更新系か事前に分からない」ときに使える汎用メソッドで、boolean を返します。\n' +
        '・true … 実行結果が ResultSet（＝SELECTなど）。getResultSet() で取り出す。\n' +
        '・false … 結果が更新件数（＝INSERT/UPDATE/DELETEなど）。getUpdateCount() で取り出す。\n\n' +
        '用途が明確なら executeQuery（ResultSet を返す）や executeUpdate（int を返す）の方が簡潔です。\n' +
        'execute は「どちらか不定」の場面向けの選択肢と覚えましょう。',
    },
    {
      id: 'jdbc-013',
      categoryId: 'jdbc',
      difficulty: 3,
      prompt: 'ResultSet で「前の行にも戻れる（双方向スクロール）」ようにしたい。Connection での準備として正しいものを選びなさい。',
      code: `Statement st = con.createStatement(
    ResultSet.__________, ResultSet.CONCUR_READ_ONLY);`,
      choices: [
        { id: 'a', text: 'TYPE_SCROLL_INSENSITIVE（スクロール可能なResultSetを得る。previous() が使える）' },
        { id: 'b', text: 'TYPE_FORWARD_ONLY（前方向のみ。これでも previous() が使える）' },
        { id: 'c', text: 'CONCUR_UPDATABLE（スクロールの種類を指定する）' },
        { id: 'd', text: 'FETCH_FORWARD（スクロール可能になる）' },
      ],
      correctChoiceIds: ['a'],
      explanation:
        'ResultSet は既定では前方向専用（TYPE_FORWARD_ONLY）で、next() で進むだけです。previous() は使えません。\n\n' +
        '前の行にも戻りたい場合は、createStatement 時にスクロール種別を指定します。\n' +
        '・TYPE_SCROLL_INSENSITIVE … スクロール可能。取得後のDB変更を反映しない。previous() や absolute() が使える。\n' +
        '・TYPE_SCROLL_SENSITIVE … スクロール可能で、DBの変更を反映する（対応はドライバ依存）。\n\n' +
        '第2引数の CONCUR_READ_ONLY / CONCUR_UPDATABLE は「更新可能か」の指定で、スクロールの可否とは別軸です（c は誤り）。',
    },
  ],
} satisfies CategoryModule
