import type { CategoryId, Category } from '@/domain/entities/Category'
import type { Question } from '@/domain/entities/Question'
import type { QuestionRepository } from '@/domain/repositories/QuestionRepository'
import { orderQuestionsForLearning } from '@/domain/services/learningOrder'

export interface QuizSession {
  readonly category: Category
  readonly questions: readonly Question[]
}

/**
 * 指定分野の復習セッションを開始するユースケース。
 *
 * 分野の存在確認と問題の取得をまとめて行い、
 * プレゼンテーション層が扱いやすい形（QuizSession）で返す。
 */
export class StartQuizSession {
  constructor(private readonly repository: QuestionRepository) {}

  async execute(categoryId: CategoryId, options: StartQuizOptions = {}): Promise<QuizSession> {
    const category = await this.repository.findCategory(categoryId)
    if (category === null) {
      throw new CategoryNotFoundError(categoryId)
    }

    const fetched = await this.repository.findQuestionsByCategory(categoryId)
    // 既定は学習効率の良い順（難易度 基礎→応用）。shuffle 指定時のみランダム。
    const questions = options.shuffle
      ? shuffle(fetched)
      : orderQuestionsForLearning(fetched)

    return { category, questions }
  }
}

export interface StartQuizOptions {
  /** 出題順をシャッフルするか */
  readonly shuffle?: boolean
}

export class CategoryNotFoundError extends Error {
  constructor(public readonly categoryId: CategoryId) {
    super(`分野が見つかりません: ${categoryId}`)
    this.name = 'CategoryNotFoundError'
  }
}

/** Fisher–Yates シャッフル（元配列を破壊しない） */
function shuffle<T>(items: readonly T[]): T[] {
  const result = [...items]
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[result[i], result[j]] = [result[j], result[i]]
  }
  return result
}
