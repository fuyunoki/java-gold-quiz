/**
 * 出題分野を表すエンティティ。
 * Java Gold SE17 の試験範囲を分野単位で表現する。
 */
export interface Category {
  /** 分野を一意に識別するID（例: 'streams'） */
  readonly id: CategoryId
  /** 画面に表示する分野名（例: 'Stream API'） */
  readonly name: string
  /** 分野の概要説明 */
  readonly description: string
  /**
   * おすすめ学習パス上の順序（小さいほど先に学ぶべき土台的な分野）。
   * 分野一覧はこの昇順で並べ、効率よく積み上げられるようにする。
   */
  readonly order: number
}

export type CategoryId = string
