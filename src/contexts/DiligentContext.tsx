import React, {
  createContext,
  PropsWithChildren,
  useState,
  useContext,
  useMemo,
  useCallback,
} from 'react'
import { Attendances, useGetAttendanceByClassId, fetchRollCallDates } from 'services/diligent'
import { useClassContext } from 'contexts/ClassContext'

interface FetchRollCallDatesProps {
  classId: string
}

interface DiligentContextProps {
  attendances?: Attendances | null
  rollCallDates: Record<string, string>
  fetchRollCallDates:
    | (({ classId }: FetchRollCallDatesProps) => Promise<Record<string, string> | null>)
    | null
}

const DiligentContextDefaultValue = {
  attendances: null,
  rollCallDates: {},
  fetchRollCallDates: null,
} as DiligentContextProps

const DiligentContext = createContext(DiligentContextDefaultValue)

export const DiligentProvider = ({ children }: PropsWithChildren) => {
  const { classId: classIdFromContext } = useClassContext()
  const { attendances } = useGetAttendanceByClassId({ classId: classIdFromContext })
  const [rollCallDates, setRollCallDates] = useState<Record<string, string>>({})

  const handleFetchRollCallDates = useCallback(({ classId }: { classId: string }) => {
    return fetchRollCallDates({ classId }).then((res) => {
      setRollCallDates(res)
      return res
    })
  }, [])

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
