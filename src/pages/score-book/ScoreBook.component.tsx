import Box from '@mui/material/Box'
import TableComponent from 'modules/Table/Table.component'
import ScoreBookDialogComponent from 'modules/score-book-dialog/ScoreBookDialog.component'
import {
  GroupAssessmentProps,
  groupAssessments,
  renderScoreBookActions,
  ScoreBookColumns,
} from 'modules/Table/helpers'
import { StudentScoreBooks, Student, KeyValueProp, Assessment } from 'models'
import React, { useState, useMemo, useEffect } from 'react'
import { useStudentContext } from 'contexts/StudentContext'
import { useClassContext } from 'contexts/ClassContext'
import { Typography } from '@mui/material'
import { useGetStudentScoreBooks, useSetNewStudentScore1 } from 'services/scorebook'
import SemesterDropdownComponent from 'modules/common/SemesterDropdown.component'
import { SelectChangeEvent } from '@mui/material/Select'
import SearchComponent from 'modules/common/Search.component'
import { toLowerCaseNonAccentVietnamese, useIsMobile } from 'utils/common'
import ScoreBookAccordionComponent from 'modules/score-book/ScoreBookAccordion.component'
import AccordionSummary from '@mui/material/AccordionSummary'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import TableFullNameCellComponent from 'modules/common/TableFullNameCell.component'
import AccordionDetails from '@mui/material/AccordionDetails'
import Accordion from '@mui/material/Accordion'
import DiligentSkeleton from 'modules/diligent/DiligentSkeleton.component'
import { useAssessmentContext } from 'contexts/AssessmentContext'
import AssessmentDropdownComponent from 'modules/common/AssessmentDropdown.component'
import DateDropdownComponent from 'modules/common/DateDropdown.component'
import SingleScoreViewComponent from 'modules/single-score-view/SingleScoreView.component'
import { get } from 'lodash'

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

  const handleChangeSemester = (event: SelectChangeEvent) => {
    setSelectedSemester(event.target.value)
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

  const handleSelectAssessmentType = (value: string) => {
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
  }

  const handleChangeShowScoreDate = (updatedDate?: KeyValueProp) => {
    if (updatedDate) {
      setSelectedAssessmentDate(assessments.find((assessment) => assessment.id === updatedDate.key))
    }
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
          onChangeSemester={handleChangeSemester}
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
          {assessmentDates && (
            <DateDropdownComponent
              dates={assessmentDates}
              onChangeDate={handleChangeShowScoreDate}
            />
          )}
        </Box>
      </Box>
      {!isMobile && filteredStuScoreBooks?.length !== 0 ? (
        <TableComponent
          columns={ScoreBookColumns}
          rows={filteredStuScoreBooks}
          onClickAction={(data: StudentScoreBooks) => setSelectedScoreBook(data)}
          renderActionMenu={renderScoreBookActions}
        />
      ) : isMobile && selectedAssessmentDate && selectedAssessmentType ? (
        <Box>
          {filteredStuScoreBooks.map((row) => (
            <SingleScoreViewComponent
              key={row.id}
              student={row}
              score={get(row, [`${selectedAssessmentType}`, `${selectedAssessmentDate.id}`], 0)}
              assessment={selectedAssessmentDate}
              onChangeData={handleUpdateScore(row.id)(selectedAssessmentType)}
            />
          ))}
        </Box>
      ) : (
        <Box>
          {filteredStuScoreBooks.length === 0 ? (
            <DiligentSkeleton />
          ) : (
            filteredStuScoreBooks.map((row) => (
              <Accordion key={row.id}>
                <AccordionSummary
                  expandIcon={<ExpandMoreIcon />}
                  aria-controls={`scorebook-accordion-content-${row.id}`}
                  id={`scorebook-accordion-header-${row.id}`}
                >
                  <TableFullNameCellComponent
                    avatarPath={row.avatarPath}
                    saintName={row.saintName}
                    lastName={row.lastName}
                    firstName={row.firstName}
                    gender={!!row.gender}
                  />
                </AccordionSummary>
                <AccordionDetails>
                  <ScoreBookAccordionComponent
                    key={row.id}
                    studentScoreBook={row as StudentScoreBooks}
                    groupAssessment={groupAssessment}
                    onChangeScore={handleUpdateScore(row.id)}
                  />
                </AccordionDetails>
              </Accordion>
            ))
          )}
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
