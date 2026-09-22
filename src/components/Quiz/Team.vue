<script setup lang="ts">
import type {Team} from '@/types/models.ts'
import {POINTS} from '@/composables/useQuizRound.ts'

defineProps<{
  team: string
  color: string
  colorTeam: string
  teamObject: Team
  canValidateTitle: boolean
  canValidateSinger: boolean
}>()

const emit = defineEmits<{
  'good-singer': [points: number]
  'good-title': [points: number]
}>()
</script>

<template>
  <div class="team-card" :style="{ '--color-team': `var(${colorTeam})` }">
    <div class="header">
      <span class="title"> {{ team }}</span>
      <span class="subtitle">
        {{ color }} - {{ teamObject.good_answers }} bonne réponse(s)
      </span>
    </div>
    <div class="actions">
      <button :disabled="teamObject.title_validated || !canValidateTitle" @click="emit('good-title', POINTS.TITLE)">
        <span class="title">Valider le titre</span>
        <span class="checker">✓</span>
        <span class="point">
          <span v-if="teamObject.title_validated">Point accordé</span>
          <span v-else-if="!canValidateTitle">Déjà pris par l'autre équipe</span>
          <span v-else>+{{ POINTS.TITLE }} point(s) pour cette équipe</span>
        </span>
      </button>
      <button :disabled="teamObject.singer_validated || !canValidateSinger" @click="emit('good-singer', POINTS.SINGER)">
        <span class="title">Valider l’artiste</span>
        <span class="checker">✓</span>
        <span class="point">
          <span v-if="teamObject.singer_validated">Point accordé</span>
          <span v-else-if="!canValidateSinger">Déjà pris par l'autre équipe</span>
          <span v-else>+{{ POINTS.SINGER }} point(s) pour cette équipe</span>
        </span>
      </button>
    </div>
    <div class="result">
      <span class="label">Score</span>
      <span class="counter">{{ teamObject.score }}</span>
    </div>
  </div>
</template>

<style scoped lang="scss">
.team-card {
  display: flex;
  flex-direction: column;
  border-radius: 1.5rem;
  border: 1px solid rgba(255, 255, 255, 0.7);
  background: rgba(255, 255, 255, 0.30);
  padding: 1.5rem;
  box-shadow: 0 20px 50px rgba(30, 50, 120, 0.14);
  backdrop-filter: blur(40px);

  .header {
    position: relative;

    span {
      display: block;

      &.title {
        font-size: 2rem;
        font-weight: 700;
      }

      &.subtitle {
        color: var(--color-nightwalker);
        font-size: 1rem;
        margin-top: 0.25rem;
        font-family: Roboto, sans-serif;
      }
    }

    &:after {
      content: ' ';
      position: absolute;
      background: var(--color-team);
      width: 0.5rem;
      height: 0.5rem;
      border-radius: 1rem;
      top: 0;
      right: 0;
    }
  }

  .actions {
    display: flex;
    flex-direction: column;
    gap: 2rem;
    margin-top: 2rem;

    button {
      border: 1px solid var(--color-team);
      background-color: var(--color-white);
      border-radius: 1rem;
      display: block;
      text-align: start;
      padding: 1rem;
      position: relative;

      &:disabled {
        opacity: .5;
        cursor: none;
      }

      span {
        &.title {
          font-size: 1rem;
          font-weight: 600;
          font-family: Space Grotesk,sans-serif;
        }

        &.checker {
          position: absolute;
          top: 0.75rem;
          right: 0.75rem;
          background-color: var(--color-team);
          color: var(--color-white);
          border-radius: 2rem;
          width: 1.75rem;
          height: 1.75rem;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        &.point {
          display: block;
          color: color-mix(in oklab, var(--color-nightwalker) 50%, transparent);
        }
      }
    }
  }

  .result {
    margin-top: auto;

    span {
      display: block;

      &.label {
        text-transform: uppercase;
        color: var(--color-nightwalker);
        font-size: 0.75rem;
        font-family: Roboto, sans-serif;
      }

      &.counter {
        color: var(--color-team);
        font-size: 3rem;
        line-height: 1;
        font-weight: 700;
      }
    }
  }
}
</style>