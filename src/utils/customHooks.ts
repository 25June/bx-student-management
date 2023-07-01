import { useMemo } from 'react'
import { isEmpty, sortBy, groupBy } from 'lodash'
import { formatDisplayDropdown, parseToNumber } from 'utils/datetime'

export const useSortedRollCalls = (rollCall: Record<string, string> = {}) => {
  return useMemo(() => {
    if (isEmpty(rollCall)) {
      return []
    }
    const formatRollCall = Object.keys(rollCall).map((key: string) => ({
      key,
      value: rollCall[key],
      number: parseToNumber(rollCall[key]),
    }))
    return sortBy(formatRollCall, ['number'])
  }, [rollCall])
}

export interface RollCallDate {
  key: string
  dateAsString: string
  dateAsNumber: number
  month: string
}

export const groupRollCallToSortedMonths = (
  rollCall: Record<string, string> = {}
): Record<string, RollCallDate[]> => {
  if (isEmpty(rollCall)) {
    return {}
  }

  const formatRollCall = sortBy(
    Object.keys(rollCall).map((key: string) => ({
      key,
      dateAsString: rollCall[key],
      dateAsNumber: parseToNumber(rollCall[key]),
      month: formatDisplayDropdown(rollCall[key]),
    })),
    ['number']
  )
  return groupBy(formatRollCall, ({ month }) => month)
}
