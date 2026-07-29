import type { Category } from '@/domain/entities/Category'
import type { QuestionRepository } from '@/domain/repositories/QuestionRepository'
import { orderCategoriesForLearning } from '@/domain/services/learningOrder'

/**
 * 出題分野の一覧を取得するユースケース。
 * おすすめ学習パス順（Category.order 昇順）に整列して返す。
 */
export class ListCategories {
  constructor(private readonly repository: QuestionRepository) {}

  async execute(): Promise<readonly Category[]> {
    const categories = await this.repository.listCategories()
    return orderCategoriesForLearning(categories)
  }
}
