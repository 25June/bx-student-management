import { AssessmentEnum } from 'constant/common'
import { Assessment } from 'models'

export const initDefaultScoreBook = (assessments: Assessment[]) => {
  return assessments.reduce(
    (acc, cur) => {
      if (cur.type === AssessmentEnum.KT5) {
        return {
          ...acc,
          score5: {
            ...acc.score5,
            [cur.id]: 0,
          },
        }
      }
      if (cur.type === AssessmentEnum.KT15) {
        return {
          ...acc,
          score15: {
            ...acc.score15,
            [cur.id]: 0,
          },
        }
      }
      if (cur.type === AssessmentEnum.KT45) {
        return {
          ...acc,
          score45: {
            ...acc.score45,
            [cur.id]: 0,
          },
        }
      }
      if (cur.type === AssessmentEnum.KT60) {
        return {
          ...acc,
          score60: {
            ...acc.score60,
            [cur.id]: 0,
          },
        }
      }
      return acc
    },
    {
      score5: {},
      score15: {},
      score45: {},
      score60: {},
    }
  )
}
