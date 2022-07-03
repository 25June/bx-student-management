export const convertStringToDate = (date: string) => {
  const [day, month, year] = date.split('.')
  return new Date(Number(year), Number(month), Number(day))
}
