<script setup lang="ts">
import type {Song} from '@/types/models.ts'

defineProps<{
  currentSong: Song | null
  isPlaying: boolean
  hasNext: boolean
  hasPrev: boolean
  currentTime: number
  duration: number
  progress: number
  trackNumber: number
  totalTracks: number
  isTitleValidated: boolean
  isSingerValidated: boolean
}>()

const emit = defineEmits<{
  'toggle-play': []
  next: []
  prev: []
  seek: [percent: number]
}>()

function formatTime(seconds: number): string {
  if (!Number.isFinite(seconds)) return '0:00'
  const m = Math.floor(seconds / 60)
  const s = Math.floor(seconds % 60)
  return `${m}:${s.toString().padStart(2, '0')}`
}

function handleSeek(event: MouseEvent) {
  const bar = event.currentTarget as HTMLElement
  const rect = bar.getBoundingClientRect()
  const percent = ((event.clientX - rect.left) / rect.width) * 100
  emit('seek', Math.min(100, Math.max(0, percent)))
}
</script>

<template>
  <div class="quiz-music">
    <div class="track-counter">{{ trackNumber }} / {{ totalTracks }}</div>
    <div class="cover">
      <img src="/cover.jpg" alt="Cover Visual"/>
    </div>
    <div class="progress-bar-container">
      <div class="progress-time">
        <span>{{ formatTime(currentTime) }}</span>
        <span>{{ formatTime(duration) }}</span>
      </div>
      <div class="progress-bar" @click="handleSeek">
        <div class="progress-bar-fill" :style="{ width: `${progress}%` }"></div>
      </div>
    </div>
    <div class="actions">
      <button class="prev" :disabled="!hasPrev" @click="emit('prev')">⏮</button>
      <button class="play" :disabled="!currentSong" @click="emit('toggle-play')">
        {{ isPlaying ? '❚❚' : '▶' }}
      </button>
      <button class="next" :disabled="!hasNext" @click="emit('next')">⏭</button>
    </div>
    <div class="result">
      <div class="title">
        <span v-if="!isTitleValidated">....</span>
        <span v-else>{{ currentSong?.title }}</span>
      </div>
      <div class="singer">
        <span v-if="!isSingerValidated">....</span>
        <span v-else>{{ currentSong?.author }}</span>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.quiz-music {
  display: flex;
  flex-direction: column;
  border-radius: 1.5rem;
  border: 1px solid rgb(255 255 255 / 70%);
  background: rgb(255 255 255 / 65%);
  padding: 1.75rem;
  box-shadow: 0 30px 70px rgb(30 50 120 / 18%);
  backdrop-filter: blur(40px);

  .track-counter {
    margin-bottom: 1rem;
    text-align: right;
    font-size: 0.85rem;
    font-weight: 700;
  }

  .cover {
    border-radius: 1rem;
    overflow: hidden;

    img {
      max-height: 36rem;
      display: block;
      width: 100%;
      object-fit: cover;
    }
  }

  .actions {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 1rem;
    margin-top: 2rem;

    button {
      border-radius: 1rem;

      &.next, &.prev {
        background-color: #FFFFFFB3;
        color: var(--color-nightwalker);
        border: 1px solid var(--color-lavender-pearl);
        width: 2.5rem;
        height: 2.5rem;

        &:disabled {
          opacity: 0.3;
          pointer-events: none;
        }
      }

      &.play {
        background-color: var(--color-byzantine-night-blue);
        width: 3.5rem;
        height: 3.5rem;
        color: var(--color-white);
        font-size: 1.125rem;
      }
    }
  }

  .progress-bar-container {
    margin-top: 1rem;

    .progress-bar {
      width: 100%;
      height: 0.5rem;
      background: var(--color-lavender-pearl);
      border-radius: 2rem;
      cursor: pointer;
      position: relative;
      margin-top: 0.25rem;
    }

    .progress-bar-fill {
      height: 100%;
      border-radius: 2rem;
      transition: width 0.1s linear;
      background: linear-gradient(90deg, #5B7CFF, #FF5C8A);
    }

    .progress-time {
      display: flex;
      justify-content: space-between;
      font-size: 0.75rem;
      opacity: 0.7;
    }
  }

  .result {
    padding: 1rem;

    div {
      text-align: center;

      &.title {
        color: var(--color-nightwalker);
        font-weight: 700;
        font-size: 1.5rem;
      }

      &.singer {
        font-size: 0.875rem;
      }
    }
  }
}
</style>