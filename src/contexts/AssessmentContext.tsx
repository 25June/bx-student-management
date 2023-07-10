import { useContext, createContext, PropsWithChildren, useMemo, useEffect, useState } from 'react'
import { fetchAssessments } from 'services'
import { Assessment } from 'models'
import { useClassContext } from 'contexts/ClassContext'

const AssessmentDefaultValue = {
  assessments: [],
  setAssessments: () => null,
} as { assessments: Assessment[]; setAssessments: (value: any) => void }
const AssessmentContext = createContext(AssessmentDefaultValue)

export const AssessmentProvider = ({ children }: PropsWithChildren) => {
  const { classId } = useClassContext()
  const [assessments, setAssessments] = useState<Assessment[]>()

  useEffect(() => {
    if (classId) {
      fetchAssessments(classId).then((res) => {
        setAssessments(res)
      })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [classId])

  const value = useMemo(() => {
    if (assessments) {
      return { assessments, setAssessments }
    }
    return { assessments: [], setAssessments }
  }, [assessments])

  return <AssessmentContext.Provider value={value}>{children}</AssessmentContext.Provider>
}

export const useAssessmentContext = () => {
  const context = useContext(AssessmentContext)
  if (!context) {
    return AssessmentDefaultValue
  }
  return context
}
