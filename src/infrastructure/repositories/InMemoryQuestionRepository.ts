import type { Category, CategoryId } from '@/domain/entities/Category'
import type { Question } from '@/domain/entities/Question'
import type { QuestionRepository } from '@/domain/repositories/QuestionRepository'
import type { CategoryModule } from '../data/CategoryModule'
import { categoryModules } from '../data'

/**
 * TSファイルに定義された問題データを供給する QuestionRepository 実装。
 *
 * データはビルド時にバンドルされるため、オフライン（PWA）でも動作する。
 * 将来 API や IndexedDB に差し替える場合も、このクラスを置き換えるだけで
 * アプリケーション層・プレゼンテーション層には影響しない。
 */
export class InMemoryQuestionRepository implements QuestionRepository {
  private readonly categories: readonly Category[]
  private readonly questionsByCategory: ReadonlyMap<CategoryId, readonly Question[]>

  constructor(modules: readonly CategoryModule[] = categoryModules) {
    this.categories = modules.map((m) => m.category)
    this.questionsByCategory = new Map(
      modules.map((m) => [m.category.id, m.questions] as const),
    )
  }

  listCategories(): Promise<readonly Category[]> {
    return Promise.resolve(this.categories)
  }

  findCategory(id: CategoryId): Promise<Category | null> {
    return Promise.resolve(this.categories.find((c) => c.id === id) ?? null)
  }

  findQuestionsByCategory(categoryId: CategoryId): Promise<readonly Question[]> {
    return Promise.resolve(this.questionsByCategory.get(categoryId) ?? [])
  }
}
