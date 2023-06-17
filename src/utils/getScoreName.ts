import { AssessmentEnum, ScoreEnum } from 'constant/common'

export const getScoreName = (scoreType: string): string => {
  switch (scoreType) {
    case AssessmentEnum.KT5:
    case ScoreEnum.SCORE_5:
      return "Kiểm Tra 5'"
    case AssessmentEnum.KT15:
    case ScoreEnum.SCORE_15:
      return "Kiểm Tra 15'"
    case AssessmentEnum.KT45:
    case ScoreEnum.SCORE_45:
      return "Kiểm Tra 45'"
    case AssessmentEnum.KT60:
    case ScoreEnum.SCORE_60:
      return "Kiểm Tra 60'"
    default:
      return 'Unknown'
  }
}
