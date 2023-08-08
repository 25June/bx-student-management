import { format, parse, isValid } from 'date-fns'

const fullDateHyphenFormat = 'dd-MM-yyyy'
const fullDateInputHyphenFormat = 'yyyy-MM-dd'
const DayMonthSlashFormat = 'dd/MM'
const MonthYearSlashFormat = 'MM/yyyy'
const DateMonthYearSlashFormat = 'dd/MM/yyyy'

export const formatDateStoringDB = (date: string) => {
  return format(new Date(date), fullDateHyphenFormat)
}

export const formatDisplayTable = (date: string) => {
  return format(parse(date, fullDateInputHyphenFormat, new Date()), DayMonthSlashFormat)
}

export const formatDisplayInput = (date: string | Date) => {
  if (typeof date === 'string') {
    return format(parse(date, fullDateHyphenFormat, new Date()), fullDateInputHyphenFormat)
  }
  return format(date, fullDateInputHyphenFormat)
}

export const formatDisplayDropdown = (date: string) => {
  return format(parse(date, fullDateInputHyphenFormat, new Date()), MonthYearSlashFormat)
}

export const parseToNumber = (date: string) => {
  return parse(date, fullDateInputHyphenFormat, new Date()).getTime()
}

export const formatYYYMMDDToDDMMYYYY = (date: string) => {
  const parseDate = parse(date, fullDateInputHyphenFormat, new Date())
  if (isValid(parseDate)) {
    return format(parseDate, DateMonthYearSlashFormat)
  }
}
