import { Assessment, Student, StudentScoreBook } from 'models'
import React, { useEffect, useMemo, useState } from 'react'
import { get } from 'lodash'
import { useLocation, useNavigate } from 'react-router-dom'
import { blueGrey } from '@mui/material/colors'
import { Typography, Box, Button, IconButton } from '@mui/material'
import { setNewStudentScore, useGetStudentScoreBooks } from 'services/scorebook'
import { fetchAssessments } from 'services/assessment'
import { toLowerCaseNonAccentVietnamese, useIsMobile } from 'utils/common'
import { getScoreBookSummary, ScoreBookSummaryResponse } from 'utils/scorebookSummary'
import { AssessmentActionType, AssessmentEnum, BaseAssessments, DialogType } from 'constant/common'
import { useStudentContext } from 'contexts/StudentContext'
import { useClassContext } from 'contexts/ClassContext'
import { useAssessmentContext } from 'contexts/AssessmentContext'
import { useDialogContext } from 'contexts/DialogContext'
import SearchComponent from 'modules/common/Search.component'
import ScoreBookSummaryInfoComponent from 'modules/score-book/ScoreBookSummaryInfo.component'
import ScoreBookDialogComponent from 'modules/score-book-dialog/ScoreBookDialog.component'
// import AssessmentDropdownComponent from 'modules/common/AssessmentDropdown.component'
// import DateDropdownComponent from 'modules/common/DateDropdown.component'
import ScoreBookDisplayComponent, {
  ScoreBookDisplayComponentProps,
} from 'modules/score-book/ScoreBookDisplay.component'
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew'
import { Router } from 'routes'

const ScoreBookComponent = () => {
  const { search } = useLocation()
  const navigate = useNavigate()

  const { students } = useStudentContext()
  const { classId, schoolYearId, semesterId, disableUpdate } = useClassContext()
  const isMobile = useIsMobile()
  const { assessments, setAssessments } = useAssessmentContext()
  const { openDialog } = useDialogContext()

  const { studentScoreBooks } = useGetStudentScoreBooks()
  const [selectedScoreBook, setSelectedScoreBook] = useState<StudentScoreBook>()
  const [filteredStuScoreBooks, setFilteredStuScoreBooks] = useState<
    StudentScoreBook[] | Student[]
  >([])

  // const [assessmentDates, setAssessmentDates] = useState<KeyValueProp[]>()
  const [selectedAssessmentDate, setSelectedAssessmentDate] = useState<Assessment>()
  const [selectedAssessmentType, setSelectedAssessmentType] = useState<AssessmentEnum>()
  const [scoreBookSummary, setScoreBookSummary] = useState<ScoreBookSummaryResponse>()
  const stuScoreBooks: StudentScoreBook[] | Student[] = useMemo(() => {
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
    if (assessments.length !== 0) {
      const searchParams = new URLSearchParams(search)
      const assessmentId = searchParams.get('assessmentId')
      const type = searchParams.get('type')
      if (type && assessmentId) {
        const assessment = assessments.find((a) => a.id === assessmentId)
        // const formatAssessments = assessments
        //   .filter((assessment) => assessment.type === type)
        //   .map((assessment) => ({ key: assessment.id, value: assessment.bookDate }))
        // setAssessmentDates(sortBy(formatAssessments, 'value'))

        setSelectedAssessmentDate(assessment)
        setSelectedAssessmentType(type as AssessmentEnum)
        searchParams.delete('assessmentId')
        searchParams.delete('type')
      }
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
      setScoreBookSummary(
        getScoreBookSummary({
          assessmentType: selectedAssessmentType,
          assessmentId: selectedAssessmentDate.id,
          studentScoreBooks: stuScoreBooks as StudentScoreBook[],
        })
      )
    }
  }, [stuScoreBooks, selectedAssessmentType, selectedAssessmentDate])

  const callback = (refreshData?: boolean): void => {
    if (refreshData) {
      fetchAssessments(classId, schoolYearId, semesterId).then((res) => {
        setAssessments(res)
      })
    }
  }

  if (!students || !classId || !assessments) {
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

  const handleFilterStudentByGrade = (isBelong?: (score: number) => boolean) => {
    if (!isBelong) {
      return setFilteredStuScoreBooks(stuScoreBooks)
    }
    if (selectedAssessmentType && selectedAssessmentDate) {
      const filteredStu = stuScoreBooks.filter((stu) => {
        const score = get(stu, [`${selectedAssessmentType}`, `${selectedAssessmentDate.id}`], 0)
        return isBelong(score)
      })
      setFilteredStuScoreBooks(filteredStu)
    }
  }

  const handleUpdateScore =
    (studentId: string) => (type: string) => (score: { score: number }, assessmentId: string) => {
      if (studentId) {
        return setNewStudentScore({
          studentId,
          type,
          score: score.score,
          assessmentId,
          classId,
          schoolYearId,
          semesterId,
        })
      }
    }

  const handleSelectAssessmentType = (value: AssessmentEnum) => {
    if (value && assessments) {
      // const formatAssessments = assessments
      //   .filter((assessment) => assessment.type === value)
      //   .map((assessment) => ({ key: assessment.id, value: assessment.bookDate }))
      // setAssessmentDates(sortBy(formatAssessments, 'value'))
      setSelectedAssessmentType(value)
      setSelectedAssessmentDate(undefined)
    }
  }

  // const handleChangeShowScoreDate = (updatedDate?: KeyValueProp) => {
  //   if (updatedDate) {
  //     setSelectedAssessmentDate(assessments.find((assessment) => assessment.id === updatedDate.key))
  //   }
  // }

  const displayProps: ScoreBookDisplayComponentProps = {
    filteredStuScoreBooks,
    selectedAssessmentType,
    setSelectedScoreBook,
    selectedAssessmentDate,
    handleUpdateScore,
  }

  return (
    <Box p={1} sx={{ display: 'flex', flexDirection: 'column', height: 'calc(100vh - 96px)' }}>
      <Box
        sx={{
          display: 'flex',
          gap: 1,
          width: '100%',
          alignItems: 'center',
        }}
      >
        {selectedAssessmentType && selectedAssessmentDate?.bookDate && (
          <IconButton
            onClick={() => {
              setSelectedAssessmentType(undefined)
              setSelectedAssessmentDate(undefined)
              navigate(Router.ASSESSMENT)
            }}
            size="small"
          >
            <ArrowBackIosNewIcon fontSize="inherit" />
          </IconButton>
        )}
        <Typography sx={{ textAlign: 'left', fontSize: '1rem', margin: 0 }} variant={'h1'}>
          Bảng Điểm{' '}
          {selectedAssessmentDate?.bookDate && selectedAssessmentType ? (
            <Typography component={'span'}>
              - {BaseAssessments.find((a) => a.id === selectedAssessmentType)?.name}{' '}
              {selectedAssessmentDate?.bookDate
                ? new Date(selectedAssessmentDate?.bookDate).toLocaleDateString('en-AU')
                : ''}
            </Typography>
          ) : null}
        </Typography>
      </Box>
      {assessments.length !== 0 ? (
        <>
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
            <SearchComponent onChange={handleFilterStudentByName} />
          </Box>
          {scoreBookSummary && (
            <ScoreBookSummaryInfoComponent
              onFilterStudentByGrade={handleFilterStudentByGrade}
              totalStudents={students.length}
              {...scoreBookSummary}
            />
          )}
          <Box sx={{ flexGrow: 1 }}>
            <ScoreBookDisplayComponent {...displayProps} />
          </Box>
        </>
      ) : (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <Typography textTransform={'capitalize'} variant={'caption'} color={blueGrey[700]}>
            <i>Chưa có bài kiểm tra nào, thêm ngay thôi</i>
          </Typography>
          <Box>
            <Button
              disabled={disableUpdate}
              variant={'contained'}
              onClick={() =>
                openDialog(
                  DialogType.ASSESSMENT_DIALOG,
                  AssessmentActionType.ADD_NEW_ASSESSMENT,
                  undefined,
                  callback
                )
              }
            >
              Thêm bài kiểm tra
            </Button>
          </Box>
        </Box>
      )}
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
