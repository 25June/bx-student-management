export const averageScore = (points: number[]) => {
  if (points.length === 0) {
    return 0
  }
  const sum = points.reduce((acc, cur) => acc + cur, 0)
  return (sum / points.length).toFixed(2)
}
