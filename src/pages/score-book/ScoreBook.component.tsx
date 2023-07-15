import Box from '@mui/material/Box'
import ScoreBookDialogComponent from 'modules/score-book-dialog/ScoreBookDialog.component'
import { StudentScoreBooks, Student, KeyValueProp, Assessment } from 'models'
import React, { useState, useMemo, useEffect } from 'react'
import { useStudentContext } from 'contexts/StudentContext'
import { useClassContext } from 'contexts/ClassContext'
import { Typography } from '@mui/material'
import { useGetStudentScoreBooks, useSetNewStudentScore1 } from 'services/scorebook'
import SemesterDropdownComponent from 'modules/common/SemesterDropdown.component'
import SearchComponent from 'modules/common/Search.component'
import { toLowerCaseNonAccentVietnamese, useIsMobile } from 'utils/common'
import { useAssessmentContext } from 'contexts/AssessmentContext'
import AssessmentDropdownComponent from 'modules/common/AssessmentDropdown.component'
import DateDropdownComponent from 'modules/common/DateDropdown.component'
import ScoreBookDisplayComponent, {
  ScoreBookDisplayComponentProps,
} from 'modules/score-book/ScoreBookDisplay.component'
import { AssessmentEnum } from 'constant/common'
import { sortBy } from 'lodash'
import { ScoreBookSummaryResponse, getScoreBookSummary } from 'utils/scorebookSummary'
import ScoreBookSummaryInfoComponent from 'modules/score-book/ScoreBookSummaryInfo.component'

const ScoreBookComponent = () => {
  const { students } = useStudentContext()
  const { classId } = useClassContext()
  const isMobile = useIsMobile()
  const { assessments } = useAssessmentContext()
  const setStudentScore = useSetNewStudentScore1()

  const { studentScoreBooks } = useGetStudentScoreBooks({ classId })
  const [selectedScoreBook, setSelectedScoreBook] = useState<StudentScoreBooks>()
  const [selectedSemester, setSelectedSemester] = useState<string>('hk1')
  const [filteredStuScoreBooks, setFilteredStuScoreBooks] = useState<
    StudentScoreBooks[] | Student[]
  >([])

  const [assessmentDates, setAssessmentDates] = useState<KeyValueProp[]>()
  const [selectedAssessmentDate, setSelectedAssessmentDate] = useState<Assessment>()
  const [selectedAssessmentType, setSelectedAssessmentType] = useState<AssessmentEnum>()
  const [scoreBookSummary, setScoreBookSummary] = useState<ScoreBookSummaryResponse>()
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
    if (assessments.length !== 0 && selectedAssessmentType) {
      handleSelectAssessmentType(selectedAssessmentType)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [assessments])

  useEffect(() => {
    if (stuScoreBooks) {
      setFilteredStuScoreBooks(stuScoreBooks)
    }
  }, [stuScoreBooks])

  useEffect(() => {
    if (stuScoreBooks?.length !== 0 && selectedAssessmentType && selectedAssessmentDate) {
      setTimeout(() => {
        setScoreBookSummary(
          getScoreBookSummary({
            assessmentType: selectedAssessmentType,
            assessmentId: selectedAssessmentDate.id,
            studentScoreBooks: stuScoreBooks as StudentScoreBooks[],
          })
        )
      }, 200)
    }
  }, [stuScoreBooks, selectedAssessmentType, selectedAssessmentDate])

  if (!students || !classId || !assessments || !studentScoreBooks) {
    return null
  }

  const handleFilterStudentByName = (value: string) => {
    if (stuScoreBooks && stuScoreBooks.length !== 0) {
      if (!value) {
        setFilteredStuScoreBooks(stuScoreBooks)
        return
      }

      const filtered = stuScoreBooks.filter((stu) => {
        const keywordArr = [...stu.lastName.split(' '), ...stu.firstName.split(' ')].map(
          (keyword) => toLowerCaseNonAccentVietnamese(keyword)
        )
        return keywordArr.includes(value.toLowerCase())
      })
      setFilteredStuScoreBooks(filtered)
    }
  }

  const handleUpdateScore =
    (studentId: string) => (type: string) => (score: { score: number }, assessmentId: string) => {
      if (studentId) {
        return setStudentScore({
          studentId,
          type,
          score: score.score,
          assessmentId,
          classId,
        })
      }
    }

  const handleSelectAssessmentType = (value: AssessmentEnum) => {
    if (value && assessments) {
      const formatAssessments = assessments
        .filter((assessment) => assessment.type === value)
        .map((assessment) => ({ key: assessment.id, value: assessment.bookDate }))
      setAssessmentDates(sortBy(formatAssessments, 'value'))
      setSelectedAssessmentType(value)
      setSelectedAssessmentDate(undefined)
    }
  }

  const handleChangeShowScoreDate = (updatedDate?: KeyValueProp) => {
    if (updatedDate) {
      setTimeout(() => {
        setSelectedAssessmentDate(
          assessments.find((assessment) => assessment.id === updatedDate.key)
        )
      }, 0)
    }
  }

  const displayProps: ScoreBookDisplayComponentProps = {
    filteredStuScoreBooks,
    selectedAssessmentType,
    setSelectedScoreBook,
    selectedAssessmentDate,
    handleUpdateScore,
  }

  return (
    <Box p={isMobile ? 1 : 2}>
      <Box
        sx={{
          display: 'flex',
          gap: isMobile ? 1 : 2,
          width: '100%',
          alignItems: isMobile ? 'flex-start' : 'center',
          flexDirection: isMobile ? 'column' : 'row',
        }}
      >
        <Typography sx={{ textAlign: 'left', fontSize: isMobile ? '1rem' : '2rem' }} variant={'h1'}>
          Bảng Điểm
        </Typography>
        <SemesterDropdownComponent
          selectedSemester={selectedSemester}
          onChangeSemester={(event) => setSelectedSemester(event.target.value)}
          size={'small'}
        />
      </Box>
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          marginBottom: isMobile ? 2 : 4,
          marginTop: 1,
          alignItems: isMobile ? 'flex-start' : 'center',
          flexDirection: isMobile ? 'column' : 'row',
          gap: 2,
        }}
      >
        <Box>
          <SearchComponent onChange={handleFilterStudentByName} />
        </Box>
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            width: '100%',
            gap: 2,
          }}
        >
          <AssessmentDropdownComponent
            assessmentType={selectedAssessmentType}
            size={'small'}
            onChangeAssessmentType={handleSelectAssessmentType}
          />
          <DateDropdownComponent
            selectedDate={selectedAssessmentDate?.bookDate}
            dates={assessmentDates}
            onChangeDate={handleChangeShowScoreDate}
          />
        </Box>
      </Box>
      {scoreBookSummary && (
        <ScoreBookSummaryInfoComponent totalStudents={students.length} {...scoreBookSummary} />
      )}
      <ScoreBookDisplayComponent {...displayProps} />
      {!!selectedScoreBook && (
        <ScoreBookDialogComponent
          isOpen={!!selectedScoreBook}
          onClose={() => setSelectedScoreBook(undefined)}
          data={selectedScoreBook}
        />
      )}
    </Box>
  )
}

export default ScoreBookComponent
