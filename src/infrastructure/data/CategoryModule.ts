import type { Category } from '@/domain/entities/Category'
import type { Question } from '@/domain/entities/Question'

/**
 * 1分野分のデータをまとめた単位。
 *
 * 分野ごとに1ファイル作成し、この形でエクスポートする。
 * 新しい分野を追加するときは、同じ形のファイルを作って
 * `index.ts` の `categoryModules` に登録するだけでよい。
 */
export interface CategoryModule {
  readonly category: Category
  readonly questions: readonly Question[]
}
