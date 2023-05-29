export const getScoreName = (scoreType: string): string => {
  switch (scoreType) {
    case 'KT5':
    case 'score5':
      return "Kiểm Tra 5'"
    case 'KT15':
    case 'score15':
      return "Kiểm Tra 15'"
    case 'KT45':
    case 'score45':
      return "Kiểm Tra 45'"
    case 'KT60':
    case 'score60':
      return "Kiểm Tra 60'"
    default:
      return 'Unknown'
  }
}
