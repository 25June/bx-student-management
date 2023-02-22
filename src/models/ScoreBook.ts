export interface Score {
  updatedDate: number
  score: number
}

export interface ScoreBook {
  score5: Record<string, Score>
  score15: Record<string, Score>
  score45: Record<string, Score>
  score60: Record<string, Score>
}
