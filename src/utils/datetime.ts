import { format, parse } from 'date-fns'

const fullDateHyphenFormat = 'dd-MM-yyyy'
const fullDateInputHyphenFormat = 'yyyy-MM-dd'
const DayMonthSlashFormat = 'dd/MM'

export const formatDateStoringDB = (date: string) => {
  return format(new Date(date), fullDateHyphenFormat)
}

export const formatDisplayTable = (date: string) => {
  return format(parse(date, fullDateHyphenFormat, new Date()), DayMonthSlashFormat)
}

export const formatDisplayInput = (date: string) => {
  return format(parse(date, fullDateHyphenFormat, new Date()), fullDateInputHyphenFormat)
}
