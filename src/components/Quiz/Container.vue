<script setup lang="ts">
import {onMounted} from 'vue'
import QuizTeam from '@/components/Quiz/Team.vue'
import QuizMusic from '@/components/Quiz/Music.vue'
import {useQuizRound} from '@/composables/useQuizRound.ts'
import {useQuizPlayer} from '@/composables/useQuizPlayer.ts'

const {
  teamA, teamB, validateTitle, validateSinger,
  canValidateTitle, canValidateSinger,
  isTitleValidated, isSingerValidated,
  resetRound,
} = useQuizRound()

const {
  currentSong, isPlaying, hasNext, hasPrev,
  currentTime, duration, progress,
  trackNumber, totalTracks,
  loadSongs, togglePlay, next, prev, seek,
  pauseAndReset,
} = useQuizPlayer()

onMounted(loadSongs)

function handleGoodTitle(teamId: 'A' | 'B') {
  validateTitle(teamId)
  pauseAndReset()
}

function handleGoodSinger(teamId: 'A' | 'B') {
  validateSinger(teamId)
  pauseAndReset()
}

function handleNext() {
  next()
  resetRound()
}

function handlePrev() {
  prev()
  resetRound()
}
</script>

<template>
  <div class="quiz-container">
    <div class="quiz-container">
      <QuizTeam color="Bleu" team="Équipe 1" color-team="--color-pan-purple" :team-object="teamA"
                :can-validate-title="canValidateTitle('A')"
                :can-validate-singer="canValidateSinger('A')"
                @good-title="handleGoodTitle('A')" @good-singer="handleGoodSinger('A')"/>
      <QuizMusic :current-song="currentSong" :is-playing="isPlaying"
                 :has-next="hasNext" :has-prev="hasPrev"
                 :current-time="currentTime" :duration="duration" :progress="progress"
                 :track-number="trackNumber" :total-tracks="totalTracks"
                 :is-title-validated="isTitleValidated" :is-singer-validated="isSingerValidated"
                 @toggle-play="togglePlay" @next="handleNext" @prev="handlePrev" @seek="seek"/>
      <QuizTeam color="Rose" team="Équipe 2" color-team="--color-berlin-pink" :team-object="teamB"
                :can-validate-title="canValidateTitle('B')"
                :can-validate-singer="canValidateSinger('B')"
                @good-title="handleGoodTitle('B')" @good-singer="handleGoodSinger('B')"/>
    </div>
  </div>
</template>

<style scoped lang="scss">
.quiz-container {
  display: flex;
  gap: 2rem;
  margin-top: 0.75rem;
  flex: 1;

  > div {
    flex: 1;
  }
}
</style>