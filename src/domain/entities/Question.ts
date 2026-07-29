import type { CategoryId } from './Category'

export type QuestionId = string
export type ChoiceId = string

/**
 * 問題の難易度。学習効率の良い出題順（基礎→応用）を決めるために使う。
 * 1 = 基礎（Silver+αで解ける）／2 = 標準（Goldの典型）／3 = 応用（引っかけ・細かい仕様）
 */
export type Difficulty = 1 | 2 | 3

/**
 * 設問の選択肢。
 */
export interface Choice {
  readonly id: ChoiceId
  /** 選択肢の本文（Markdown等は使わずプレーンテキスト） */
  readonly text: string
}

/**
 * 練習問題を表すエンティティ。
 *
 * Java Gold では「正しいものを2つ選べ」といった複数選択問題があるため、
 * 正解は配列で保持し、`selectCount` で選ぶべき数を表現する。
 */
export interface Question {
  readonly id: QuestionId
  readonly categoryId: CategoryId
  /** 設問文 */
  readonly prompt: string
  /** 設問に付随するJavaコード（任意）。等幅フォントで表示される想定。 */
  readonly code?: string
  readonly choices: readonly Choice[]
  /** 正解の選択肢ID一覧（1つ以上） */
  readonly correctChoiceIds: readonly ChoiceId[]
  /** 難易度。分野内の出題順（基礎→応用）に使う。 */
  readonly difficulty: Difficulty
  /** 解説文 */
  readonly explanation: string
}

/**
 * この設問で選ぶべき選択肢の数。
 * 正解数から導出する（ドメインルール）。
 */
export function requiredSelectionCount(question: Question): number {
  return question.correctChoiceIds.length
}

/**
 * 単一選択問題かどうか。
 */
export function isSingleChoice(question: Question): boolean {
  return requiredSelectionCount(question) === 1
}
