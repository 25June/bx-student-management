import {
  Box,
  Typography,
  Divider,
  List,
  ListItem,
  ListItemAvatar,
  Avatar,
  ListItemText,
} from '@mui/material'
import { get } from 'lodash'
import { useMemo, useState, useEffect } from 'react'
import { useAssessmentContext } from 'contexts/AssessmentContext'
import { useStudentContext } from 'contexts/StudentContext'
import { useGetStudentScoreBooks } from 'services/scorebook'
import { Student } from 'models/student'
import { StudentScoreBooks } from 'models/ScoreBook'
import ScoreBookSummaryInfoComponent from 'modules/score-book/ScoreBookSummaryInfo.component'
import { getScoreBookSummary, ScoreBookSummaryResponse } from 'utils/scorebookSummary'
import { AssessmentEnum } from 'constant/common'
import { Assessment } from 'models/assessment'

const ScoreBookReport = () => {
  const { students } = useStudentContext()
  const { assessments } = useAssessmentContext()
  const { studentScoreBooks } = useGetStudentScoreBooks()
  const [scoreBookSummary, setScoreBookSummary] = useState<ScoreBookSummaryResponse>()
  const [selectedAssessmentType, setSelectedAssessmentType] = useState<AssessmentEnum>()
  const [selectedAssessmentDate, setSelectedAssessmentDate] = useState<Assessment>()
  console.log({ assessments, studentScoreBooks })

  const stuScoreBooks: StudentScoreBooks[] | Student[] = useMemo(() => {
    return (students || []).map((stu) => {
      if (studentScoreBooks?.[stu.id]) {
        return {
          ...stu,
          ...studentScoreBooks[stu.id],
        }
      }
      return stu
    })
  }, [students, studentScoreBooks])

  useEffect(() => {
    if (stuScoreBooks?.length !== 0 && selectedAssessmentType && selectedAssessmentDate) {
      setScoreBookSummary(
        getScoreBookSummary({
          assessmentType: selectedAssessmentType,
          assessmentId: selectedAssessmentDate.id,
          studentScoreBooks: stuScoreBooks as StudentScoreBooks[],
        })
      )
    }
  }, [stuScoreBooks, selectedAssessmentType, selectedAssessmentDate])

  const handleFilterStudentByGrade = (isBelong?: (score: number) => boolean) => {
    if (!isBelong) {
      return
    }
    if (selectedAssessmentType && selectedAssessmentDate) {
      const filteredStu = stuScoreBooks.filter((stu) => {
        const score = get(stu, [`${selectedAssessmentType}`, `${selectedAssessmentDate.id}`], 0)
        return isBelong(score)
      })
      console.log({ filteredStu })
    }
  }

  return (
    <Box>
      <Typography sx={{ marginTop: '1rem' }}>Tổng kết Bảng Điểm</Typography>
      <List
        disablePadding={true}
        sx={{
          width: '100%',
          maxWidth: 360,
          background: 'transparent',
          backdropFilter: 'blur(2px)',
        }}
      >
        {/* {data.map((data) => (
          <DiligentReportItem key={data.date.key} data={data} />
        ))} */}
        {scoreBookSummary && (
          <>
            <ScoreBookSummaryInfoComponent
              onFilterStudentByGrade={handleFilterStudentByGrade}
              totalStudents={students.length}
              {...scoreBookSummary}
            />
          </>
        )}
      </List>
    </Box>
  )
}

export default ScoreBookReport
