<script setup lang="ts">
import { computed } from 'vue'
import type { AnswerResult } from '@/domain/entities/AnswerResult'
import type { ChoiceId, Question } from '@/domain/entities/Question'

const props = defineProps<{
  question: Question
  selectedIds: Set<ChoiceId>
  result: AnswerResult | null
  isSingleChoice: boolean
  requiredCount: number
}>()

const emit = defineEmits<{
  (e: 'toggle', choiceId: ChoiceId): void
}>()

const answered = computed(() => props.result !== null)
const correctSet = computed(() => new Set(props.question.correctChoiceIds))

type ChoiceState = 'idle' | 'selected' | 'correct' | 'wrong' | 'missed'

function choiceState(choiceId: ChoiceId): ChoiceState {
  const selected = props.selectedIds.has(choiceId)
  if (!answered.value) return selected ? 'selected' : 'idle'
  const isCorrect = correctSet.value.has(choiceId)
  if (isCorrect && selected) return 'correct'
  if (isCorrect && !selected) return 'missed'
  if (!isCorrect && selected) return 'wrong'
  return 'idle'
}

function markLabel(state: ChoiceState): string {
  switch (state) {
    case 'correct':
      return '✓'
    case 'wrong':
      return '✕'
    case 'missed':
      return '←正解'
    default:
      return ''
  }
}

const difficultyLabel = computed(
  () => ({ 1: '基礎', 2: '標準', 3: '応用' })[props.question.difficulty],
)

</script>

<template>
  <section class="card">
    <p class="hint">
      <span class="badge" :class="`badge--d${question.difficulty}`">{{ difficultyLabel }}</span>
      <span>{{ isSingleChoice ? '1つ選択' : `${requiredCount}つ選択` }}</span>
    </p>
    <h2 class="prompt">{{ question.prompt }}</h2>

    <pre v-if="question.code" class="code"><code>{{ question.code }}</code></pre>

    <ul class="choices">
      <li v-for="choice in question.choices" :key="choice.id">
        <button
          type="button"
          class="choice"
          :class="`choice--${choiceState(choice.id)}`"
          :disabled="answered"
          @click="emit('toggle', choice.id)"
        >
          <span class="choice__box" :class="{ 'choice__box--radio': isSingleChoice }">
            <span v-if="selectedIds.has(choice.id)" class="choice__check">●</span>
          </span>
          <span class="choice__text">{{ choice.text }}</span>
          <span class="choice__mark">{{ markLabel(choiceState(choice.id)) }}</span>
        </button>
      </li>
    </ul>

    <div v-if="result" class="feedback" :class="result.isCorrect ? 'feedback--ok' : 'feedback--ng'">
      <p class="feedback__title">
        {{ result.isCorrect ? '正解！' : '不正解' }}
      </p>
      <p class="feedback__explanation">{{ question.explanation }}</p>
    </div>
  </section>
</template>

<style scoped>
.card {
  background: var(--surface);
  border-radius: 16px;
  padding: 20px 18px calc(20px + env(safe-area-inset-bottom, 0px));
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.08);
}
.hint {
  margin: 0 0 6px;
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 12px;
  font-weight: 600;
  color: var(--accent);
}
.badge {
  display: inline-block;
  padding: 2px 8px;
  border-radius: 999px;
  font-size: 11px;
  color: #fff;
}
.badge--d1 {
  background: #2f9e44;
}
.badge--d2 {
  background: #f08c00;
}
.badge--d3 {
  background: #e03131;
}
.prompt {
  margin: 0 0 14px;
  font-size: 17px;
  line-height: 1.6;
  font-weight: 600;
}
.code {
  margin: 0 0 16px;
  padding: 14px;
  background: var(--code-bg);
  color: var(--code-fg);
  border-radius: 10px;
  overflow-x: auto;
  font-size: 13px;
  line-height: 1.55;
  font-family: 'SF Mono', ui-monospace, Menlo, Consolas, monospace;
  -webkit-overflow-scrolling: touch;
}
.choices {
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 10px;
}
.choice {
  width: 100%;
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 14px 14px;
  border: 1.5px solid var(--border);
  border-radius: 12px;
  background: var(--surface);
  font-size: 15px;
  line-height: 1.5;
  text-align: left;
  color: inherit;
  cursor: pointer;
  transition: border-color 0.15s, background 0.15s;
  -webkit-tap-highlight-color: transparent;
}
.choice:disabled {
  cursor: default;
}
.choice--selected {
  border-color: var(--accent);
  background: var(--accent-weak);
}
.choice--correct {
  border-color: var(--ok);
  background: var(--ok-weak);
}
.choice--wrong {
  border-color: var(--ng);
  background: var(--ng-weak);
}
.choice--missed {
  border-color: var(--ok);
  border-style: dashed;
}
.choice__box {
  flex: 0 0 auto;
  width: 22px;
  height: 22px;
  border: 1.5px solid var(--border-strong);
  border-radius: 6px;
  display: grid;
  place-items: center;
  font-size: 12px;
  color: var(--accent);
}
.choice__box--radio {
  border-radius: 50%;
}
.choice__text {
  flex: 1 1 auto;
  font-family: 'SF Mono', ui-monospace, Menlo, Consolas, monospace;
}
.choice__mark {
  flex: 0 0 auto;
  font-size: 13px;
  font-weight: 700;
  color: var(--muted);
}
.feedback {
  margin-top: 16px;
  padding: 14px;
  border-radius: 12px;
  font-size: 14px;
  line-height: 1.7;
}
.feedback--ok {
  background: var(--ok-weak);
}
.feedback--ng {
  background: var(--ng-weak);
}
.feedback__title {
  margin: 0 0 6px;
  font-weight: 700;
}
.feedback__explanation {
  margin: 0;
  color: var(--text);
  white-space: pre-line;
}
</style>
