import { useContext, createContext, PropsWithChildren, useMemo } from 'react'
import { useGetAssessments } from 'services'
import { Assessment } from 'models'
import { useClassContext } from 'contexts/ClassContext'

const AssessmentDefaultValue = { assessments: [] } as { assessments: Assessment[] }
const AssessmentContext = createContext(AssessmentDefaultValue)

export const AssessmentProvider = ({ children }: PropsWithChildren) => {
  const { classId } = useClassContext()
  const { assessments } = useGetAssessments(classId)
  const value = useMemo(() => {
    if (assessments) {
      return { assessments }
    }
    return { assessments: [] }
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
