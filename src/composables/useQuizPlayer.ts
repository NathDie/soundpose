import {ref, computed, onUnmounted} from 'vue'
import type {Song} from '@/types/models.ts'

function shuffle<T>(array: T[]): T[] {
    const result = [...array]
    for (let i = result.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1))
        const temp = result[i]!
        result[i] = result[j]!
        result[j] = temp
    }
    return result
}

export function useQuizPlayer() {
    const songs = ref<Song[]>([])
    const currentIndex = ref(0)
    const isPlaying = ref(false)
    const isLoading = ref(false)
    const error = ref<string | null>(null)

    const currentTime = ref(0)
    const duration = ref(0)

    const audio = new Audio()
    audio.addEventListener('ended', () => {
        isPlaying.value = false
    })
    audio.addEventListener('timeupdate', () => {
        currentTime.value = audio.currentTime
    })
    audio.addEventListener('loadedmetadata', () => {
        duration.value = audio.duration
    })
    audio.addEventListener('playing', () => {
        isPlaying.value = true
    })
    audio.addEventListener('pause', () => {
        isPlaying.value = false
    })

    const currentSong = computed<Song | null>(() => songs.value[currentIndex.value] ?? null)
    const hasNext = computed(() => currentIndex.value < songs.value.length - 1)
    const hasPrev = computed(() => currentIndex.value > 0)
    const progress = computed(() => duration.value > 0 ? (currentTime.value / duration.value) * 100 : 0)
    const trackNumber = computed(() => songs.value.length > 0 ? currentIndex.value + 1 : 0)
    const totalTracks = computed(() => songs.value.length)

    async function loadSongs() {
        isLoading.value = true
        error.value = null
        try {
            const response = await fetch('/quiz/song.json')
            if (!response.ok) throw new Error('Impossible de charger la playlist')
            songs.value = shuffle(await response.json())
            currentIndex.value = 0
            loadCurrentTrack()
        } catch (e) {
            error.value = (e as Error).message
        } finally {
            isLoading.value = false
        }
    }

    function loadCurrentTrack() {
        const song = currentSong.value
        if (!song) return
        audio.pause()
        audio.src = `/quiz/songs/piste-${song.id}.mp4`
        audio.currentTime = 0
        currentTime.value = 0
        duration.value = 0
    }

    function play() {
        if (!currentSong.value) return
        audio.play()
    }

    function pause() {
        audio.pause()
    }

    function togglePlay() {
        isPlaying.value ? pause() : play()
    }

    function seek(percent: number) {
        if (!duration.value) return
        audio.currentTime = (percent / 100) * duration.value
        currentTime.value = audio.currentTime
    }

    function next() {
        if (!hasNext.value) return
        currentIndex.value++
        loadCurrentTrack()
    }

    function prev() {
        if (!hasPrev.value) return
        currentIndex.value--
        loadCurrentTrack()
    }

    function pauseAndReset() {
        audio.pause()
        audio.currentTime = 0
        currentTime.value = 0
    }

    onUnmounted(() => {
        audio.pause()
        audio.src = ''
    })

    return {
        songs, currentSong, isPlaying, isLoading, error, hasNext, hasPrev,
        currentTime, duration, progress,
        trackNumber, totalTracks,
        loadSongs, togglePlay, next, prev, seek,
        pauseAndReset,
    }
}