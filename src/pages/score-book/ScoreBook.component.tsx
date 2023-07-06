import Box from '@mui/material/Box'
import ScoreBookDialogComponent from 'modules/score-book-dialog/ScoreBookDialog.component'
import { GroupAssessmentProps, groupAssessments } from 'modules/Table/helpers'
import { StudentScoreBooks, Student, KeyValueProp, Assessment } from 'models'
import React, { useState, useMemo, useEffect, useCallback } from 'react'
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

const ScoreBookComponent = () => {
  const { students } = useStudentContext()
  const { classId } = useClassContext()
  const isMobile = useIsMobile()
  const { assessments } = useAssessmentContext()
  const setStudentScore = useSetNewStudentScore1()

  const { studentScoreBooks } = useGetStudentScoreBooks({ classId })
  const [selectedScoreBook, setSelectedScoreBook] = useState<StudentScoreBooks>()
  const [selectedSemester, setSelectedSemester] = useState<string>('hk1')
  const [groupAssessment, setGroupAssessments] = useState<GroupAssessmentProps>()
  const [filteredStuScoreBooks, setFilteredStuScoreBooks] = useState<
    StudentScoreBooks[] | Student[]
  >([])

  const [assessmentDates, setAssessmentDates] = useState<KeyValueProp[]>()
  const [selectedAssessmentDate, setSelectedAssessmentDate] = useState<Assessment>()
  const [selectedAssessmentType, setSelectedAssessmentType] = useState<string>()

  const stuScoreBooks: StudentScoreBooks[] | Student[] = useMemo(() => {
    if (students.length !== 0) {
      return students.map((stu) => {
        if (studentScoreBooks?.[stu.id]) {
          return {
            ...stu,
            ...studentScoreBooks[stu.id],
          }
        }
        return stu
      })
    }
    return []
  }, [students, studentScoreBooks])

  useEffect(() => {
    if (assessments.length !== 0) {
      setGroupAssessments(groupAssessments(assessments))
    }
  }, [assessments])

  useEffect(() => {
    if (stuScoreBooks) {
      setFilteredStuScoreBooks(stuScoreBooks)
    }
  }, [stuScoreBooks])

  const handleFilterStudentByName = useCallback(
    (value: string) => {
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
    },
    [stuScoreBooks]
  )

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

  const handleSelectAssessmentType = useCallback(
    (value: string) => {
      if (value && assessments) {
        const formatAssessments = assessments
          .filter((assessment) => assessment.type === value)
          .map((assessment) => ({ key: assessment.id, value: assessment.bookDate }))
        setAssessmentDates(formatAssessments)

        switch (value) {
          case 'KT5':
            setSelectedAssessmentType('score5')
            break
          case 'KT15':
            setSelectedAssessmentType('score15')
            break
          case 'KT45':
            setSelectedAssessmentType('score45')
            break
          case 'KT60':
            setSelectedAssessmentType('score60')
            break
          default:
            alert(value)
            break
        }
      }
    },
    [assessments]
  )

  const handleChangeShowScoreDate = useCallback(
    (updatedDate?: KeyValueProp) => {
      if (updatedDate) {
        setSelectedAssessmentDate(
          assessments.find((assessment) => assessment.id === updatedDate.key)
        )
      }
    },
    [assessments]
  )

  const displayProps: ScoreBookDisplayComponentProps = {
    filteredStuScoreBooks,
    selectedAssessmentType,
    groupAssessment,
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
            size={'small'}
            forSearching={true}
            onChangeAssessmentType={handleSelectAssessmentType}
          />
          <DateDropdownComponent dates={assessmentDates} onChangeDate={handleChangeShowScoreDate} />
        </Box>
      </Box>
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
