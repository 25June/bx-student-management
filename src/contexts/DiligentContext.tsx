import React, {
  createContext,
  PropsWithChildren,
  useState,
  useContext,
  useMemo,
  useCallback,
} from 'react'
import { Attendances, useGetAttendanceByClassId, fetchRollCallDates } from 'services/diligent'

interface FetchRollCallDatesProps {
  classId: string
  schoolYearId: string
  semesterId: string
}

interface DiligentContextProps {
  attendances?: Attendances | null
  rollCallDates: Record<string, string>
  fetchRollCallDates: ({
    classId,
    schoolYearId,
    semesterId,
  }: FetchRollCallDatesProps) => Promise<Record<string, string> | null>
}

const DiligentContextDefaultValue = {
  attendances: null,
  rollCallDates: {},
  fetchRollCallDates: () => Promise.resolve({}),
} as DiligentContextProps

const DiligentContext = createContext(DiligentContextDefaultValue)

export const DiligentProvider = ({ children }: PropsWithChildren) => {
  const { attendances } = useGetAttendanceByClassId()
  const [rollCallDates, setRollCallDates] = useState<Record<string, string>>({})

  const handleFetchRollCallDates = useCallback(
    ({
      classId,
      schoolYearId,
      semesterId,
    }: {
      classId: string
      schoolYearId: string
      semesterId: string
    }) => {
      return fetchRollCallDates({ classId, schoolYearId, semesterId }).then((res) => {
        setRollCallDates(res)
        return res
      })
    },
    []
  )

  const value = useMemo(() => {
    return {
      fetchRollCallDates: handleFetchRollCallDates,
      rollCallDates,
      attendances,
    }
  }, [rollCallDates, attendances, handleFetchRollCallDates])

  return <DiligentContext.Provider value={value}>{children}</DiligentContext.Provider>
}

export const useDiligentContext = () => {
  const context = useContext(DiligentContext)
  if (!context) {
    return DiligentContextDefaultValue
  }
  return context
}
