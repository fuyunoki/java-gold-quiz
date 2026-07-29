import type { CategoryModule } from '../CategoryModule'

/**
 * 分野: NIO.2（java.nio.file）
 *
 * Path の操作（resolve/normalize/relativize）、Files のユーティリティ、
 * ディレクトリ走査。Java Gold SE17 の頻出範囲。
 */
export const nio2Module: CategoryModule = {
  category: {
    id: 'nio2',
    name: 'NIO.2（ファイルAPI）',
    description: 'Path（resolve/normalize/relativize）、Files ユーティリティ、ディレクトリ走査',
    order: 8,
  },
  questions: [
    {
      id: 'nio2-001',
      categoryId: 'nio2',
      difficulty: 1,
      prompt: 'ファイルパスを表す Path オブジェクトを作る方法として正しいものをすべて選びなさい。',
      choices: [
        { id: 'a', text: 'Path.of("data", "file.txt")' },
        { id: 'b', text: 'Paths.get("data/file.txt")' },
        { id: 'c', text: 'new Path("data/file.txt")' },
        { id: 'd', text: 'new File("data/file.txt").toPath()' },
      ],
      correctChoiceIds: ['a', 'b', 'd'],
      explanation:
        'Path はインターフェースなので new Path(...) では作れません（c は誤り）。生成にはファクトリメソッドを使います。\n' +
        '・Path.of(...) … Java 11 以降の標準的な作り方。複数の文字列を渡すと区切り文字で連結してくれる。\n' +
        '・Paths.get(...) … 従来からある作り方。Path.of と実質同じ。\n' +
        '・new File(...).toPath() … 旧 API の File から Path へ変換する方法。\n\n' +
        '現在は Path.of が推奨です。区切り文字（/ か \\\\）は環境依存なので、複数引数版で組み立てると移植性が高まります。',
    },
    {
      id: 'nio2-008',
      categoryId: 'nio2',
      difficulty: 1,
      prompt: '次のコードの出力を選びなさい（区切り文字は環境に合わせて表示されるものとする）。',
      code: `Path p = Path.of("/home/user/report.txt");
System.out.println(p.getFileName());
System.out.println(p.getParent());`,
      choices: [
        { id: 'a', text: 'report.txt と /home/user' },
        { id: 'b', text: '/home/user/report.txt と report.txt' },
        { id: 'c', text: 'report.txt と /home' },
        { id: 'd', text: 'txt と /home/user' },
      ],
      correctChoiceIds: ['a'],
      explanation:
        'Path はパスを「名前の並び」として扱い、部分を取り出すメソッドがあります。\n' +
        '・getFileName() … 末尾の要素（ファイル名部分）。ここでは report.txt。\n' +
        '・getParent() … 末尾を除いた親ディレクトリ。ここでは /home/user。\n\n' +
        'その他 getName(index) で各要素、getNameCount() で要素数も取れます。\n' +
        '注意: これらは「文字列としての分解」であり、実際にファイルが存在するかどうかは確認しません。',
    },
    {
      id: 'nio2-003',
      categoryId: 'nio2',
      difficulty: 2,
      prompt: 'Path の resolve メソッドについて、正しい説明をすべて選びなさい。',
      code: `Path base = Path.of("/home/user");
System.out.println(base.resolve("docs/a.txt"));
System.out.println(base.resolve("/etc/config"));`,
      choices: [
        { id: 'a', text: '相対パスを渡すと、base の下に連結する（1つ目は /home/user/docs/a.txt）' },
        { id: 'b', text: '絶対パスを渡すと、その絶対パスがそのまま結果になる（2つ目は /etc/config）' },
        { id: 'c', text: 'resolve は常に base の下に連結し、絶対パスでも /home/user/etc/config になる' },
        { id: 'd', text: 'resolve は実際にファイルを作成する' },
      ],
      correctChoiceIds: ['a', 'b'],
      explanation:
        'resolve は「基準パスに別のパスをつなげる」メソッドですが、引数が絶対パスか相対パスかで動きが変わります。\n' +
        '・相対パスのとき … base の後ろに連結する（/home/user + docs/a.txt = /home/user/docs/a.txt）。\n' +
        '・絶対パスのとき … 連結せず、その絶対パスをそのまま返す（/etc/config）。\n' +
        '　　→ 「絶対パスは、それ自体で位置が確定しているから」と考えると自然です。\n\n' +
        'したがって c は誤り。また resolve は文字列上の計算だけで、ファイル作成などは一切行いません（d も誤り）。',
    },
    {
      id: 'nio2-004',
      categoryId: 'nio2',
      difficulty: 2,
      prompt: '次のコードの normalize() の結果として正しいものを選びなさい（区切り文字は環境依存）。',
      code: `Path p = Path.of("/a/b/../c/./d");
System.out.println(p.normalize());`,
      choices: [
        { id: 'a', text: '/a/c/d' },
        { id: 'b', text: '/a/b/c/d' },
        { id: 'c', text: '/a/b/../c/./d（変化しない）' },
        { id: 'd', text: '/c/d' },
      ],
      correctChoiceIds: ['a'],
      explanation:
        'normalize() はパスの中の "." と ".." を整理して、意味的に同じ「素直なパス」に直します。\n' +
        '・"." … 現在のディレクトリ（意味がないので取り除かれる）。\n' +
        '・".." … 1つ上のディレクトリ（直前の要素を打ち消す）。\n\n' +
        '/a/b/../c/./d を整理すると、b は直後の .. で打ち消され、. は消え、/a/c/d になります。\n' +
        'これも文字列上の計算で、実ファイルの存在確認はしません。シンボリックリンクを解決したい場合は toRealPath() を使います。',
    },
    {
      id: 'nio2-007',
      categoryId: 'nio2',
      difficulty: 2,
      prompt: '次のコードの出力を選びなさい。',
      code: `Path base = Path.of("/a/b");
Path target = Path.of("/a/b/c/d");
System.out.println(base.relativize(target));`,
      choices: [
        { id: 'a', text: 'c/d' },
        { id: 'b', text: '/a/b/c/d' },
        { id: 'c', text: '/c/d' },
        { id: 'd', text: '../../c/d' },
      ],
      correctChoiceIds: ['a'],
      explanation:
        'relativize は resolve の逆の操作です。「base から target へ行くための相対パス」を計算します。\n\n' +
        '/a/b から /a/b/c/d へ行くには、c に入って d に入ればよいので、相対パスは c/d です。\n' +
        '（もし逆に /a/b/c/d から /a/b へなら ../.. のように上に戻る形になります。）\n\n' +
        'base.resolve(base.relativize(target)) が target に戻る、という関係で覚えると理解しやすいです。',
    },
    {
      id: 'nio2-002',
      categoryId: 'nio2',
      difficulty: 2,
      prompt: 'テキストファイルの全行を読み込み List<String> として得たい。適切な Files のメソッドを選びなさい。',
      code: `Path p = Path.of("data.txt");
List<String> lines = Files.__________(p);`,
      choices: [
        { id: 'a', text: 'readAllLines' },
        { id: 'b', text: 'readString' },
        { id: 'c', text: 'lines' },
        { id: 'd', text: 'newBufferedReader' },
      ],
      correctChoiceIds: ['a'],
      explanation:
        'Files には読み書きの便利メソッドが揃っています。用途で使い分けます。\n' +
        '・readAllLines(path) … 全行を List<String> として一度に読み込む。これが正解。\n' +
        '・readString(path) … ファイル全体を1つの String として読む（改行込み）。\n' +
        '・lines(path) … 各行を Stream<String> として遅延的に読む（大きなファイル向け。try-with-resources 推奨）。\n' +
        '・newBufferedReader(path) … BufferedReader を返す（自分で readLine ループする低レベル寄り）。\n\n' +
        '「List で一括」なら readAllLines、「巨大ファイルを1行ずつ流す」なら lines、と選びます。',
    },
    {
      id: 'nio2-005',
      categoryId: 'nio2',
      difficulty: 2,
      prompt: 'Files.createDirectory と Files.createDirectories の違いとして正しいものを選びなさい。',
      choices: [
        {
          id: 'a',
          text: 'createDirectories は途中の親ディレクトリも含めてまとめて作る。createDirectory は親が存在しないと例外になる',
        },
        { id: 'b', text: 'どちらも同じで、親が無くても作れる' },
        { id: 'c', text: 'createDirectory の方が親ディレクトリもまとめて作れる' },
        { id: 'd', text: 'createDirectories は既存でも必ず例外を投げる' },
      ],
      correctChoiceIds: ['a'],
      explanation:
        '名前が似ていますが「親をまとめて作るか」が違います。\n' +
        '・createDirectory(path) … 指定した1階層だけ作る。親ディレクトリが無いと NoSuchFileException などで失敗する。\n' +
        '・createDirectories(path) … /a/b/c のように途中の親（/a, /a/b）も含めて必要な階層をすべて作る。\n' +
        '　　しかも、すでに存在していてもエラーにならない（mkdir -p のような挙動）。\n\n' +
        '「深い階層をまとめて用意したい」なら createDirectories が安全です。',
    },
    {
      id: 'nio2-009',
      categoryId: 'nio2',
      difficulty: 2,
      prompt: '次のコードの空欄に入れるべき記述として、最も適切なものを選びなさい。',
      code: `Path p = Path.of("data.txt");
______ (BufferedReader br = Files.newBufferedReader(p)) {
    System.out.println(br.readLine());
}`,
      choices: [
        { id: 'a', text: 'try  （try-with-resources にして自動で close する）' },
        { id: 'b', text: 'if' },
        { id: 'c', text: 'while' },
        { id: 'd', text: 'synchronized' },
      ],
      correctChoiceIds: ['a'],
      explanation:
        'ファイルを開いたら必ず閉じる必要があります。BufferedReader は AutoCloseable なので、\n' +
        'try-with-resources（try (リソース) { ... }）で開くと、ブロックを抜けるときに自動で close() されます。\n\n' +
        'これにより「閉じ忘れによるリソースリーク」を防げます。\n' +
        'Files.newBufferedReader / newBufferedWriter / newInputStream などで得たリソースは、\n' +
        'この形で扱うのが定石です。',
    },
    {
      id: 'nio2-006',
      categoryId: 'nio2',
      difficulty: 3,
      prompt: 'Files.walk(path) について、正しい説明をすべて選びなさい。',
      code: `try (Stream<Path> s = Files.walk(Path.of("."))) {
    s.filter(Files::isRegularFile).forEach(System.out::println);
}`,
      choices: [
        { id: 'a', text: 'ディレクトリ配下を再帰的にたどり、Stream<Path> を返す' },
        { id: 'b', text: '返された Stream は open なリソースを保持するため、try-with-resources で閉じるべき' },
        { id: 'c', text: 'Files.list と違い、サブディレクトリの中まで再帰的にたどる' },
        { id: 'd', text: 'Files.walk は List<Path> を返すので Stream にする必要はない' },
      ],
      correctChoiceIds: ['a', 'b', 'c'],
      explanation:
        'ディレクトリ走査は Gold の頻出です。\n' +
        '・a, c … Files.walk は指定ディレクトリの下を「再帰的に」たどって Stream<Path> を返す。\n' +
        '　　一方 Files.list は直下の1階層だけ（再帰しない）。\n' +
        '・b … この Stream は内部でディレクトリを開いたままにするため、try-with-resources で確実に閉じる必要がある。\n' +
        '　　閉じないとファイルハンドルのリークにつながる。\n\n' +
        'd は誤りで、戻り値は List ではなく Stream<Path> です。\n' +
        '「walk＝再帰、list＝直下のみ、どちらも Stream なので閉じる」と押さえましょう。',
    },
  ],
} satisfies CategoryModule
