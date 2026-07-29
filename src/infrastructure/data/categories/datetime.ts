import type { CategoryModule } from '../CategoryModule'

/**
 * 分野: 日付・時刻API（java.time）
 *
 * LocalDate/LocalTime/LocalDateTime、不変性、Period と Duration、
 * 月末調整、ChronoUnit、ZonedDateTime。Java Gold SE17 の頻出範囲。
 */
export const datetimeModule: CategoryModule = {
  category: {
    id: 'datetime',
    name: '日付・時刻API（java.time）',
    description: 'LocalDate/Time、不変性、Period/Duration、月末調整、ChronoUnit、タイムゾーン',
    order: 12,
  },
  questions: [
    {
      id: 'datetime-008',
      categoryId: 'datetime',
      difficulty: 1,
      prompt: 'java.time の各クラスの説明として正しい組み合わせをすべて選びなさい。',
      choices: [
        { id: 'a', text: 'LocalDate は「日付のみ」（例: 2024-01-15、時刻やゾーンなし）' },
        { id: 'b', text: 'LocalTime は「時刻のみ」（例: 10:30、日付なし）' },
        { id: 'c', text: 'LocalDateTime は「日付＋時刻」だがタイムゾーンは持たない' },
        { id: 'd', text: 'LocalDate は内部にタイムゾーン情報を持つ' },
      ],
      correctChoiceIds: ['a', 'b', 'c'],
      explanation:
        'java.time は「持っている情報」でクラスが分かれています。\n' +
        '・LocalDate … 日付のみ（年月日）。時刻もゾーンも持たない。\n' +
        '・LocalTime … 時刻のみ（時分秒）。日付を持たない。\n' +
        '・LocalDateTime … 日付＋時刻。ただしタイムゾーンは持たない。\n' +
        '・（ゾーンまで持つのは ZonedDateTime）\n\n' +
        'd は誤りで、Local系はいずれもタイムゾーンを持ちません（"Local" は「特定のゾーンに縛られない」の意）。\n' +
        '必要な情報に応じてクラスを選ぶのがポイントです。',
    },
    {
      id: 'datetime-001',
      categoryId: 'datetime',
      difficulty: 1,
      prompt: 'LocalDate.of(2024, 1, 15) の「月」の指定について、正しい説明を選びなさい。',
      choices: [
        { id: 'a', text: '月は 1 始まり（1 が1月）。この日付は 2024年1月15日を表す' },
        { id: 'b', text: '月は 0 始まり（0 が1月）なので、これは2月を表す' },
        { id: 'c', text: '月は 0 始まりなので、これは2024年2月15日である' },
        { id: 'd', text: 'LocalDate.of は存在しないメソッドである' },
      ],
      correctChoiceIds: ['a'],
      explanation:
        'java.time では月は「1 始まり」で直感どおりです（1=1月 … 12=12月）。\n' +
        'LocalDate.of(2024, 1, 15) は 2024年1月15日を表します。\n\n' +
        'これは旧 API（java.util.Calendar）が月を 0 始まり（0=1月）にしていた紛らわしさを解消したものです。\n' +
        'さらに Month.JANUARY のような enum を使って LocalDate.of(2024, Month.JANUARY, 15) とも書け、より明確にできます。',
    },
    {
      id: 'datetime-004',
      categoryId: 'datetime',
      difficulty: 2,
      prompt: '次のコードの出力を選びなさい。',
      code: `LocalDate d = LocalDate.of(2024, 1, 1);
d.plusDays(10);
System.out.println(d);`,
      choices: [
        { id: 'a', text: '2024-01-01' },
        { id: 'b', text: '2024-01-11' },
        { id: 'c', text: '2024-01-10' },
        { id: 'd', text: 'コンパイルエラー' },
      ],
      correctChoiceIds: ['a'],
      explanation:
        'これは java.time で最も間違えやすい「不変性（イミュータブル）」のワナです。\n' +
        'LocalDate などの java.time クラスは不変で、plusDays などのメソッドは\n' +
        '「元のオブジェクトを変更する」のではなく「新しいオブジェクトを返す」だけです。\n\n' +
        'このコードは d.plusDays(10) の戻り値をどこにも代入していないので、その結果は捨てられ、d 自身は変わりません。\n' +
        '結果、d は元のまま 2024-01-01。\n' +
        '正しくは d = d.plusDays(10); のように「戻り値を受け取る」必要があります。',
    },
    {
      id: 'datetime-006',
      categoryId: 'datetime',
      difficulty: 2,
      prompt: '次のコードの出力を選びなさい。',
      code: `LocalDate d = LocalDate.of(2021, 1, 31);
System.out.println(d.plusMonths(1));`,
      choices: [
        { id: 'a', text: '2021-02-28' },
        { id: 'b', text: '2021-03-03' },
        { id: 'c', text: '2021-02-31' },
        { id: 'd', text: '実行時に例外（2月31日は存在しない）' },
      ],
      correctChoiceIds: ['a'],
      explanation:
        '1月31日に1か月足すと単純には「2月31日」ですが、そんな日付は存在しません。\n' +
        'java.time はこの場合、その月の「有効な最終日」に自動で調整します。2021年2月の末日は28日なので 2021-02-28 になります。\n\n' +
        '例外を投げたり、3月へあふれさせたりはしません（c, d は誤り）。\n' +
        'この「月末調整」の挙動は、月またぎの計算でよく問われるポイントです。',
    },
    {
      id: 'datetime-002',
      categoryId: 'datetime',
      difficulty: 2,
      prompt: '次のコードの出力を選びなさい。',
      code: `Period p = Period.between(
    LocalDate.of(2024, 1, 1),
    LocalDate.of(2024, 3, 15));
System.out.println(p.getMonths() + " " + p.getDays());`,
      choices: [
        { id: 'a', text: '2 14' },
        { id: 'b', text: '2 15' },
        { id: 'c', text: '74 0' },
        { id: 'd', text: '0 74' },
      ],
      correctChoiceIds: ['a'],
      explanation:
        'Period は2つの日付の差を「年・月・日」の組み合わせで表します（日数の合計ではありません）。\n\n' +
        '2024-01-01 から 2024-03-15 までは、まず「2か月」進んで 2024-03-01、そこから「14日」進んで 2024-03-15。\n' +
        'よって getMonths()=2、getDays()=14 で "2 14" です。\n\n' +
        '注意: getMonths / getDays は「その内訳」を返すだけで、合計日数ではありません。\n' +
        '合計日数がほしいときは次問の ChronoUnit.DAYS.between を使います。',
    },
    {
      id: 'datetime-007',
      categoryId: 'datetime',
      difficulty: 2,
      prompt: '2つの日付の「間の日数」を整数で得たい。適切なコードを選びなさい。',
      code: `LocalDate a = LocalDate.of(2024, 1, 1);
LocalDate b = LocalDate.of(2024, 1, 11);
long days = ____________________;`,
      choices: [
        { id: 'a', text: 'ChronoUnit.DAYS.between(a, b)' },
        { id: 'b', text: 'Period.between(a, b).getDays()' },
        { id: 'c', text: 'a.minus(b)' },
        { id: 'd', text: 'Duration.between(a, b).toDays()' },
      ],
      correctChoiceIds: ['a'],
      explanation:
        '「合計で何日か」を知りたいときは ChronoUnit.DAYS.between(開始, 終了) を使います。ここでは 10 を返します。\n\n' +
        '・b の Period.getDays() は年月日の「内訳の日数部分」なので、合計日数とは限らず不適切。\n' +
        '・d の Duration は「時間ベース（秒・ナノ秒）」で、日付のみの LocalDate には使えない（例外/不適切）。\n' +
        '・c のような minus(別のLocalDate) はできません。\n\n' +
        '「合計の単位量なら ChronoUnit.単位.between」と覚えましょう（DAYS 以外に MONTHS, YEARS なども指定できます）。',
    },
    {
      id: 'datetime-003',
      categoryId: 'datetime',
      difficulty: 2,
      prompt: 'Duration の説明として正しいものを選びなさい。',
      code: `Duration d = Duration.ofHours(1).plusMinutes(30);
System.out.println(d.toMinutes());`,
      choices: [
        { id: 'a', text: 'Duration は「時間ベース」の量（時・分・秒・ナノ秒）を表し、この出力は 90' },
        { id: 'b', text: 'Duration は「日付ベース」の量（年・月・日）を表す' },
        { id: 'c', text: 'この出力は 130 である' },
        { id: 'd', text: 'Duration は LocalDate 同士の差にだけ使える' },
      ],
      correctChoiceIds: ['a'],
      explanation:
        'Duration は「時間の長さ（時・分・秒・ナノ秒）」を表します。時刻や Instant の差に使います。\n\n' +
        'Duration.ofHours(1)（60分）に plusMinutes(30) を足すと 90分。toMinutes() は 90 を返します。\n\n' +
        '対になる Period は「年・月・日」の日付ベースの量です（b は Period の説明）。\n' +
        '「Duration＝時間ベース（時分秒）」「Period＝日付ベース（年月日）」の対で覚えましょう。',
    },
    {
      id: 'datetime-005',
      categoryId: 'datetime',
      difficulty: 3,
      prompt: 'Period と Duration の使い分けとして正しいものをすべて選びなさい。',
      choices: [
        { id: 'a', text: 'Period は年・月・日といった「日付ベース」の量を表す（LocalDate 向き）' },
        { id: 'b', text: 'Duration は時・分・秒・ナノ秒といった「時間ベース」の量を表す（LocalTime/Instant 向き）' },
        { id: 'c', text: 'LocalDate の差には Period、時刻や Instant の差には Duration が適している' },
        { id: 'd', text: 'Period と Duration は完全に同じで、どちらを使っても違いはない' },
      ],
      correctChoiceIds: ['a', 'b', 'c'],
      explanation:
        'java.time では「量」を表すクラスが2つあり、対象で使い分けます。\n' +
        '・Period … 年・月・日の日付ベース。LocalDate 同士の差など「カレンダー的な差」に使う。\n' +
        '・Duration … 時・分・秒・ナノ秒の時間ベース。LocalTime や Instant の差など「時間の長さ」に使う。\n\n' +
        'たとえば「3か月後」は Period、「90分後」は Duration が自然です。\n' +
        'd は誤りで、扱う単位も対象クラスも異なります。混同すると型が合わずコンパイルエラーや不適切な結果になります。',
    },
    {
      id: 'datetime-009',
      categoryId: 'datetime',
      difficulty: 3,
      prompt: 'タイムゾーンを考慮した日時を扱いたい。正しい説明を選びなさい。',
      code: `ZonedDateTime z = ZonedDateTime.now(ZoneId.of("Asia/Tokyo"));`,
      choices: [
        {
          id: 'a',
          text: 'ZonedDateTime は日付・時刻に加えてタイムゾーン（ZoneId）を持ち、地域をまたぐ時刻計算に使える',
        },
        { id: 'b', text: 'LocalDateTime はタイムゾーンを持つので、ZonedDateTime は不要である' },
        { id: 'c', text: 'ZoneId は "JST" のような略称でしか指定できない' },
        { id: 'd', text: 'ZonedDateTime は日付を持たず時刻だけを表す' },
      ],
      correctChoiceIds: ['a'],
      explanation:
        'ZonedDateTime は「日付＋時刻＋タイムゾーン」をすべて持つクラスです。\n' +
        '国や地域をまたぐ時刻（サマータイムや時差を含む計算）を正しく扱えます。\n\n' +
        '・b は誤り。LocalDateTime はタイムゾーンを持たないので、ゾーンが必要なら ZonedDateTime を使う。\n' +
        '・c は誤り。ZoneId は "Asia/Tokyo" のような「地域/都市」形式で指定するのが基本（略称より曖昧さが少ない）。\n' +
        '・d は誤り。日付も時刻も持ちます。\n\n' +
        '「ゾーンなしなら LocalDateTime、ゾーンありなら ZonedDateTime」と選びましょう。',
    },
  ],
} satisfies CategoryModule
