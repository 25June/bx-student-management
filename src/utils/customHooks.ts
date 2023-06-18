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

export interface RollCallDates {
  key: string
  value: string
  number: number
  month: string
}

export const useGroupRollCallToSortedMonths = (rollCall: Record<string, string> = {}) => {
  return useMemo(() => {
    if (isEmpty(rollCall)) {
      return []
    }

    const formatRollCall = sortBy(
      Object.keys(rollCall).map((key: string) => ({
        key,
        value: rollCall[key],
        number: parseToNumber(rollCall[key]),
        month: formatDisplayDropdown(rollCall[key]),
      })),
      ['number']
    )
    return groupBy(formatRollCall, ({ month }) => month)
  }, [rollCall])
}
