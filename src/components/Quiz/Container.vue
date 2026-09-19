<script setup lang="ts">
import QuizTeam from '@/components/Quiz/Team.vue'
import QuizMusic from '@/components/Quiz/Music.vue'
import {useQuizRound} from '@/composables/useQuizRound.ts'

const {teamA, teamB, validateTitle, validateSinger, canValidateTitle, canValidateSinger} = useQuizRound()
</script>

<template>
  <div class="quiz-container">
    <QuizTeam color="Bleu" team="Équipe 1" color-team="--color-pan-purple" :team-object="teamA"
              :can-validate-title="canValidateTitle('A')"
              :can-validate-singer="canValidateSinger('A')"
              @good-title="validateTitle('A')" @good-singer="validateSinger('A')"/>
    <QuizMusic />
    <QuizTeam color="Rose" team="Équipe 2" color-team="--color-berlin-pink" :team-object="teamB"
              :can-validate-title="canValidateTitle('B')"
              :can-validate-singer="canValidateSinger('B')"
              @good-title="validateTitle('B')" @good-singer="validateSinger('B')"/>
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