import { Score } from 'models'

export const averageScore = (points: Score[]) => {
  const sum = points.reduce((acc, cur) => acc + cur.point, 0)
  return sum / points.length
}
