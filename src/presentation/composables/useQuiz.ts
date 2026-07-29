import { computed, ref, shallowRef } from 'vue'
import type { AnswerResult } from '@/domain/entities/AnswerResult'
import type { CategoryId } from '@/domain/entities/Category'
import type { ChoiceId, Question } from '@/domain/entities/Question'
import { requiredSelectionCount } from '@/domain/entities/Question'
import type { QuizSession } from '@/application/usecases/StartQuizSession'
import { container } from '@/composition/container'

/**
 * クイズ画面の状態とふるまいをまとめたコンポーザブル。
 *
 * Vueに閉じた「表示のための状態管理」を担い、
 * 業務ロジック（採点・出題）はユースケース経由で呼ぶだけにする。
 */
export function useQuiz() {
  const session = shallowRef<QuizSession | null>(null)
  const loading = ref(false)
  const errorMessage = ref<string | null>(null)

  const currentIndex = ref(0)
  const selectedIds = ref<Set<ChoiceId>>(new Set())
  /** 各問の採点結果（index -> AnswerResult）。未解答の問は未登録。 */
  const results = ref<Map<number, AnswerResult>>(new Map())

  const questions = computed<readonly Question[]>(() => session.value?.questions ?? [])
  const totalCount = computed(() => questions.value.length)
  const currentQuestion = computed<Question | null>(
    () => questions.value[currentIndex.value] ?? null,
  )
  const currentResult = computed<AnswerResult | null>(
    () => results.value.get(currentIndex.value) ?? null,
  )
  const isAnswered = computed(() => currentResult.value !== null)
  const isLastQuestion = computed(() => currentIndex.value === totalCount.value - 1)
  const isFinished = computed(
    () => totalCount.value > 0 && results.value.size === totalCount.value,
  )

  /** この問題で選ぶべき数（単一選択なら1）。UIの選択方式切り替えに使う。 */
  const requiredCount = computed(() =>
    currentQuestion.value ? requiredSelectionCount(currentQuestion.value) : 1,
  )
  const isSingleChoice = computed(() => requiredCount.value === 1)

  const correctCount = computed(
    () => [...results.value.values()].filter((r) => r.isCorrect).length,
  )

  async function load(categoryId: CategoryId, shuffle = false): Promise<void> {
    loading.value = true
    errorMessage.value = null
    try {
      session.value = await container.startQuizSession.execute(categoryId, { shuffle })
      reset()
    } catch (e) {
      errorMessage.value = e instanceof Error ? e.message : String(e)
      session.value = null
    } finally {
      loading.value = false
    }
  }

  function reset(): void {
    currentIndex.value = 0
    selectedIds.value = new Set()
    results.value = new Map()
  }

  function isSelected(choiceId: ChoiceId): boolean {
    return selectedIds.value.has(choiceId)
  }

  /** 選択肢のトグル。単一選択の問題では既存選択をクリアしてから選ぶ。 */
  function toggleChoice(choiceId: ChoiceId): void {
    if (isAnswered.value) return
    const next = new Set(isSingleChoice.value ? [] : selectedIds.value)
    if (next.has(choiceId)) {
      next.delete(choiceId)
    } else {
      next.add(choiceId)
    }
    selectedIds.value = next
  }

  const canSubmit = computed(() => !isAnswered.value && selectedIds.value.size > 0)

  function submit(): void {
    const question = currentQuestion.value
    if (!question || isAnswered.value || selectedIds.value.size === 0) return
    const result = container.gradeQuestion.execute(question, [...selectedIds.value])
    const nextResults = new Map(results.value)
    nextResults.set(currentIndex.value, result)
    results.value = nextResults
  }

  function next(): void {
    if (isLastQuestion.value) return
    currentIndex.value += 1
    selectedIds.value = new Set(
      results.value.get(currentIndex.value)?.selectedChoiceIds ?? [],
    )
  }

  function previous(): void {
    if (currentIndex.value === 0) return
    currentIndex.value -= 1
    selectedIds.value = new Set(
      results.value.get(currentIndex.value)?.selectedChoiceIds ?? [],
    )
  }

  return {
    // state
    session,
    loading,
    errorMessage,
    currentIndex,
    selectedIds,
    // derived
    questions,
    totalCount,
    currentQuestion,
    currentResult,
    isAnswered,
    isLastQuestion,
    isFinished,
    requiredCount,
    isSingleChoice,
    correctCount,
    canSubmit,
    // actions
    load,
    reset,
    isSelected,
    toggleChoice,
    submit,
    next,
    previous,
  }
}
