import {reactive, ref} from 'vue'
import type {Team} from '@/types/models.ts'

export const POINTS = {
    TITLE: 10,
    SINGER: 5,
} as const

export type TeamId = 'A' | 'B'

function createTeam(): Team {
    return {score: 0, good_answers: 0, title_validated: false, singer_validated: false}
}

export function useQuizRound() {
    const teamA = reactive<Team>(createTeam())
    const teamB = reactive<Team>(createTeam())

    const titleValidatedBy = ref<TeamId | null>(null)
    const singerValidatedBy = ref<TeamId | null>(null)

    function getTeam(teamId: TeamId): Team {
        return teamId === 'A' ? teamA : teamB
    }

    function validate(
        teamId: TeamId,
        field: 'title_validated' | 'singer_validated',
        lock: typeof titleValidatedBy,
        points: number
    ) {
        const team = getTeam(teamId)
        if (team[field]) return
        if (lock.value !== null && lock.value !== teamId) return

        lock.value = teamId
        team[field] = true
        team.score += points
        checkGoodAnswer(team)
    }

    function validateTitle(teamId: TeamId) {
        validate(teamId, 'title_validated', titleValidatedBy, POINTS.TITLE)
    }

    function validateSinger(teamId: TeamId) {
        validate(teamId, 'singer_validated', singerValidatedBy, POINTS.SINGER)
    }

    function checkGoodAnswer(team: Team) {
        if (team.title_validated && team.singer_validated) {
            team.good_answers++
        }
    }

    function canValidate(lock: typeof titleValidatedBy, teamId: TeamId) {
        return lock.value === null || lock.value === teamId
    }

    function resetRound() {
        teamA.title_validated = false
        teamA.singer_validated = false
        teamB.title_validated = false
        teamB.singer_validated = false
        titleValidatedBy.value = null
        singerValidatedBy.value = null
    }

    return {
        teamA, teamB,
        validateTitle, validateSinger, resetRound,
        canValidateTitle: (teamId: TeamId) => canValidate(titleValidatedBy, teamId),
        canValidateSinger: (teamId: TeamId) => canValidate(singerValidatedBy, teamId),
    }
}