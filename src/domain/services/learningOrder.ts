import type { Category } from '../entities/Category'
import type { Question } from '../entities/Question'

/**
 * 学習効率の良い出題順を決めるドメインサービス（純粋関数）。
 *
 * 学習履歴がまだ無い前提での「効率の良い順番」を、次の2軸で表現する:
 *  - 分野間: おすすめ学習パス（Category.order 昇順）。土台となる分野を先に。
 *  - 分野内: 難易度 昇順（基礎→標準→応用）。易しい問題で概念を固めてから難問へ。
 *
 * 同じ難易度内では元の定義順を保つ（Array.prototype.sort は安定ソート）。
 */
export function orderQuestionsForLearning(
  questions: readonly Question[],
): readonly Question[] {
  return [...questions].sort((a, b) => a.difficulty - b.difficulty)
}

/**
 * 分野をおすすめ学習パス順に並べる。
 */
export function orderCategoriesForLearning(
  categories: readonly Category[],
): readonly Category[] {
  return [...categories].sort((a, b) => a.order - b.order)
}
