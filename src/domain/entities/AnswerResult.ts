import type { ChoiceId, Question } from './Question'

/**
 * 採点結果を表す値オブジェクト。
 */
export interface AnswerResult {
  readonly question: Question
  /** ユーザーが選択した選択肢ID */
  readonly selectedChoiceIds: readonly ChoiceId[]
  /** 全問正解か */
  readonly isCorrect: boolean
  /** 選ぶべきだったのに選ばなかった選択肢ID */
  readonly missedChoiceIds: readonly ChoiceId[]
  /** 選んではいけなかったのに選んだ選択肢ID */
  readonly extraChoiceIds: readonly ChoiceId[]
}

/**
 * 採点ロジック（純粋なドメインルール）。
 *
 * 正解集合と選択集合を突き合わせ、過不足を算出する。
 * UIやデータソースに依存しないため、単体テストしやすい。
 */
export function gradeAnswer(
  question: Question,
  selectedChoiceIds: readonly ChoiceId[],
): AnswerResult {
  const selected = new Set(selectedChoiceIds)
  const correct = new Set(question.correctChoiceIds)

  const missedChoiceIds = [...correct].filter((id) => !selected.has(id))
  const extraChoiceIds = [...selected].filter((id) => !correct.has(id))
  const isCorrect = missedChoiceIds.length === 0 && extraChoiceIds.length === 0

  return {
    question,
    selectedChoiceIds: [...selected],
    isCorrect,
    missedChoiceIds,
    extraChoiceIds,
  }
}
