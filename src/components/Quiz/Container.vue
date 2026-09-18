<script setup lang="ts">
import QuizTeam from '@/components/Quiz/Team.vue';
import QuizMusic from '@/components/Quiz/Music.vue';

</script>

<template>
  <div class="quiz-container">
    <QuizTeam :color="'Bleu'" :team="'Équipe 1'" :color-team="'--color-pan-purple'" />
    <QuizMusic />
    <QuizTeam :color="'Rose'" :team="'Équipe 2'" :color-team="'--color-berlin-pink'" />
  </div>
</template>

<style scoped lang="scss">
.quiz-container {
  display: flex;
  gap: 2rem;
  margin-top: 2rem;
  flex: 1;

  > div {
    flex: 1;
  }
}
</style>