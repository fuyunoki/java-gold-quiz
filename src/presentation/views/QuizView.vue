<script setup lang="ts">
import { onMounted, watch } from 'vue'
import { useRouter } from 'vue-router'
import QuestionCard from '@/presentation/components/QuestionCard.vue'
import { useQuiz } from '@/presentation/composables/useQuiz'

const props = defineProps<{ categoryId: string }>()
const router = useRouter()

const quiz = useQuiz()

onMounted(() => quiz.load(props.categoryId))
watch(
  () => props.categoryId,
  (id) => quiz.load(id),
)

function goHome(): void {
  router.push({ name: 'home' })
}
</script>

<template>
  <div class="quiz">
    <p v-if="quiz.loading.value" class="status">読み込み中…</p>

    <p v-else-if="quiz.errorMessage.value" class="status status--error">
      {{ quiz.errorMessage.value }}
    </p>

    <template v-else-if="quiz.currentQuestion.value">
      <header class="bar">
        <span class="bar__cat">{{ quiz.session.value?.category.name }}</span>
        <span class="bar__progress">
          {{ quiz.currentIndex.value + 1 }} / {{ quiz.totalCount.value }}
        </span>
      </header>

      <div class="progressbar">
        <div
          class="progressbar__fill"
          :style="{ width: `${((quiz.currentIndex.value + 1) / quiz.totalCount.value) * 100}%` }"
        />
      </div>

      <QuestionCard
        :question="quiz.currentQuestion.value"
        :selected-ids="quiz.selectedIds.value"
        :result="quiz.currentResult.value"
        :is-single-choice="quiz.isSingleChoice.value"
        :required-count="quiz.requiredCount.value"
        @toggle="quiz.toggleChoice"
      />

      <div class="actions">
        <button
          v-if="!quiz.isAnswered.value"
          type="button"
          class="btn btn--primary"
          :disabled="!quiz.canSubmit.value"
          @click="quiz.submit"
        >
          解答する
        </button>

        <template v-else>
          <button
            type="button"
            class="btn"
            :disabled="quiz.currentIndex.value === 0"
            @click="quiz.previous"
          >
            前へ
          </button>
          <button
            v-if="!quiz.isLastQuestion.value"
            type="button"
            class="btn btn--primary"
            @click="quiz.next"
          >
            次へ
          </button>
          <span v-else class="done">
            正解 {{ quiz.correctCount.value }} / {{ quiz.totalCount.value }}
          </span>
        </template>
      </div>

      <button type="button" class="link" @click="goHome">分野一覧へ戻る</button>
    </template>
  </div>
</template>

<style scoped>
.quiz {
  padding: 12px 16px calc(24px + env(safe-area-inset-bottom, 0px));
}
.status {
  text-align: center;
  color: var(--muted);
  padding: 40px 0;
}
.status--error {
  color: var(--ng);
}
.bar {
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  margin-bottom: 8px;
}
.bar__cat {
  font-size: 13px;
  font-weight: 700;
  color: var(--accent);
}
.bar__progress {
  font-size: 13px;
  color: var(--muted);
  font-variant-numeric: tabular-nums;
}
.progressbar {
  height: 4px;
  border-radius: 2px;
  background: var(--border);
  overflow: hidden;
  margin-bottom: 16px;
}
.progressbar__fill {
  height: 100%;
  background: var(--accent);
  transition: width 0.25s ease;
}
.actions {
  display: flex;
  gap: 10px;
  align-items: center;
  margin-top: 18px;
}
.btn {
  flex: 1 1 0;
  padding: 14px;
  border-radius: 12px;
  border: 1.5px solid var(--border-strong);
  background: var(--surface);
  color: var(--text);
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  -webkit-tap-highlight-color: transparent;
}
.btn:disabled {
  opacity: 0.45;
  cursor: default;
}
.btn--primary {
  background: var(--accent);
  border-color: var(--accent);
  color: #fff;
}
.done {
  flex: 1 1 0;
  text-align: center;
  font-weight: 700;
  color: var(--ok);
}
.link {
  display: block;
  margin: 20px auto 0;
  padding: 8px;
  background: none;
  border: none;
  color: var(--muted);
  font-size: 14px;
  text-decoration: underline;
  cursor: pointer;
}
</style>
