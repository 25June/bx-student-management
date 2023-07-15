import { AssessmentEnum } from 'constant/common'
import { StudentScoreBooks } from 'models'

interface ScoreBookSummaryProps {
  assessmentType: AssessmentEnum
  assessmentId: string
  studentScoreBooks: StudentScoreBooks[]
}

export interface ScoreBookSummaryResponse {
  /* < 5 */
  needToImprove: number
  /* 5 < x < 6 */
  average: number
  /* 6 <= x < 7 */
  upperAverage: number
  /* 7 <= x < 8 */
  good: number
  /* 8 <= x < 9 */
  wellDome: number
  /* 9 <= x <= 10 */
  excellent: number
}

export const getScoreBookSummary = ({
  assessmentType,
  assessmentId,
  studentScoreBooks,
}: ScoreBookSummaryProps): ScoreBookSummaryResponse => {
  return studentScoreBooks.reduce<ScoreBookSummaryResponse>(
    (acc, cur) => {
      if (cur[assessmentType]) {
        const score = cur[assessmentType][assessmentId]
        if (score) {
          if (score < 5) {
            return {
              ...acc,
              needToImprove: acc.needToImprove + 1,
            }
          }
          if (score >= 5 && score < 6) {
            return {
              ...acc,
              average: acc.average + 1,
            }
          }

          if (score >= 6 && score < 7) {
            return {
              ...acc,
              upperAverage: acc.upperAverage + 1,
            }
          }
          if (score >= 7 && score < 8) {
            return {
              ...acc,
              good: acc.good + 1,
            }
          }
          if (score >= 8 && score < 9) {
            return {
              ...acc,
              wellDome: acc.wellDome + 1,
            }
          }
          if (score >= 9) {
            return {
              ...acc,
              excellent: acc.excellent + 1,
            }
          }
        }
      }
      return acc
    },
    {
      needToImprove: 0,
      average: 0,
      upperAverage: 0,
      good: 0,
      wellDome: 0,
      excellent: 0,
    }
  )
}
