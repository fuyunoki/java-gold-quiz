import { gradeAnswer, type AnswerResult } from '@/domain/entities/AnswerResult'
import type { ChoiceId, Question } from '@/domain/entities/Question'

/**
 * 1問の解答を採点するユースケース。
 *
 * 採点そのものはドメイン層の純粋関数 `gradeAnswer` に委譲する。
 * ユースケースは「アプリとして採点を実行する」という意図を表す入口。
 */
export class GradeQuestion {
  execute(question: Question, selectedChoiceIds: readonly ChoiceId[]): AnswerResult {
    return gradeAnswer(question, selectedChoiceIds)
  }
}
