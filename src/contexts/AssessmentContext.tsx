import {
  useContext,
  createContext,
  PropsWithChildren,
  useMemo,
  useEffect,
  useState,
  useCallback,
} from 'react'
import { fetchAssessments } from 'services/assessment'
import { Assessment } from 'models'
import { useClassContext } from 'contexts/ClassContext'

const AssessmentDefaultValue = {
  assessments: [],
  setAssessments: () => null,
  onFetchAssessments: () => null,
} as {
  assessments: Assessment[]
  setAssessments: (value: any) => void
  onFetchAssessments: (classId: string) => void
}
const AssessmentContext = createContext(AssessmentDefaultValue)

export const AssessmentProvider = ({ children }: PropsWithChildren) => {
  const { classId, schoolYearId, semesterId } = useClassContext()
  const [assessments, setAssessments] = useState<Assessment[]>()

  const handleFetchAssessments = useCallback(
    (selectedClassId: string) => {
      if (selectedClassId) {
        fetchAssessments(selectedClassId, schoolYearId, semesterId).then((res) => {
          setAssessments(res)
        })
      }
    },
    [schoolYearId, semesterId]
  )

  useEffect(() => {
    if (classId) {
      handleFetchAssessments(classId)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [classId])

  const value = useMemo(() => {
    if (assessments) {
      return { assessments, setAssessments, onFetchAssessments: handleFetchAssessments }
    }
    return { assessments: [], setAssessments, onFetchAssessments: handleFetchAssessments }
  }, [assessments, handleFetchAssessments])

  return <AssessmentContext.Provider value={value}>{children}</AssessmentContext.Provider>
}

export const useAssessmentContext = () => {
  const context = useContext(AssessmentContext)
  if (!context) {
    return AssessmentDefaultValue
  }
  return context
}
