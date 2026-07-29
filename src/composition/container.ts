import { GradeQuestion } from '@/application/usecases/GradeQuestion'
import { ListCategories } from '@/application/usecases/ListCategories'
import { StartQuizSession } from '@/application/usecases/StartQuizSession'
import type { QuestionRepository } from '@/domain/repositories/QuestionRepository'
import { InMemoryQuestionRepository } from '@/infrastructure/repositories/InMemoryQuestionRepository'

/**
 * コンポジションルート。
 *
 * 具体的な実装（リポジトリ）をここでのみ生成し、ユースケースへ注入する。
 * プレゼンテーション層はこの container 経由でユースケースだけを受け取り、
 * インフラ層の存在を意識しない。テスト時は createContainer に
 * モックのリポジトリを渡せば差し替えられる。
 */
export interface AppContainer {
  readonly listCategories: ListCategories
  readonly startQuizSession: StartQuizSession
  readonly gradeQuestion: GradeQuestion
}

export function createContainer(
  repository: QuestionRepository = new InMemoryQuestionRepository(),
): AppContainer {
  return {
    listCategories: new ListCategories(repository),
    startQuizSession: new StartQuizSession(repository),
    gradeQuestion: new GradeQuestion(),
  }
}

/** アプリ本体で使う既定のコンテナ（シングルトン） */
export const container: AppContainer = createContainer()
