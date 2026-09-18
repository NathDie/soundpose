<script setup lang="ts">
defineProps<{
  team: string
  color: string
  colorTeam: string
}>()
</script>

<template>
  <div class="team-card" :style="{ '--color-team': `var(${colorTeam})` }">
    <div class="header">
      <span class="title">{{ team }}</span>
      <span class="color">{{ color }}</span>
    </div>
    <div class="actions"></div>
    <div class="result">
      <span class="label">Score</span>
      <span class="counter">0</span>
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
        font-size: 0.875rem;
        font-weight: 600;
      }

      &.color {
        color: var(--color-nightwalker);
        font-size: 0.75rem;
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