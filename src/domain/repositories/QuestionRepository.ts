import type { Category, CategoryId } from '../entities/Category'
import type { Question } from '../entities/Question'

/**
 * 問題データへのアクセスを抽象化するポート（インターフェース）。
 *
 * アプリケーション層はこのインターフェースにのみ依存し、
 * 具体的なデータソース（TSファイル / API / IndexedDB 等）を知らない。
 * 実装はインフラ層で差し替え可能にする（依存性逆転の原則）。
 */
export interface QuestionRepository {
  /** 全分野を返す */
  listCategories(): Promise<readonly Category[]>

  /** 分野IDから分野を1件取得する。存在しなければ null */
  findCategory(id: CategoryId): Promise<Category | null>

  /** 指定分野に属する問題一覧を返す */
  findQuestionsByCategory(categoryId: CategoryId): Promise<readonly Question[]>
}
