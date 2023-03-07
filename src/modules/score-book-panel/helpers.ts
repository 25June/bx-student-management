export const averageScore = (points: number[]) => {
  const sum = points.reduce((acc, cur) => acc + cur, 0)
  return sum / points.length
}
