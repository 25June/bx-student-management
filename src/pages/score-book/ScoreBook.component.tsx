import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import AssignmentIcon from '@mui/icons-material/Assignment'
import TableComponent from 'modules/Table/Table.component'
import ScoreBookDialogComponent from 'modules/score-book-dialog/ScoreBookDialog.component'
import { renderScoreBookActions, ScoreBookColumns } from 'modules/Table/helpers'
import { StudentScoreBooks, Student } from 'models'
import React, { useState, useMemo, useEffect } from 'react'
import { useStudentContext } from 'contexts/StudentContext'
import AssessmentDialogComponent from 'modules/assessment-dialog/AssessmentDialog.component'
import { AssessmentActionType } from 'constant'
import { useClassContext } from 'contexts/ClassContext'
import { Typography } from '@mui/material'
import { useGetStudentScoreBooks1 } from 'services/scorebook'
import SemesterDropdownComponent from 'modules/common/SemesterDropdown.component'
import { SelectChangeEvent } from '@mui/material/Select'
import SearchComponent from 'modules/common/Search.component'
import { toLowerCaseNonAccentVietnamese } from 'utils/common'

const ScoreBookComponent = () => {
  const { students } = useStudentContext()
  const { classId } = useClassContext()
  const { studentScoreBooks } = useGetStudentScoreBooks1({ classId })
  const [selectedScoreBook, setSelectedScoreBook] = useState<StudentScoreBooks>()
  const [isOpenAssessmentDialog, openAssessmentDialog] = useState<boolean>(false)
  const [selectedSemester, setSelectedSemester] = useState<string>('hk1')

  const stuScoreBooks1: StudentScoreBooks[] | Student[] = useMemo(() => {
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

  const [filteredStuScoreBooks, setFilteredStuScoreBooks] = useState<
    StudentScoreBooks[] | Student[]
  >([])
  useEffect(() => {
    if (stuScoreBooks1) {
      setFilteredStuScoreBooks(stuScoreBooks1)
    }
  }, [stuScoreBooks1])

  const handleChangeSemester = (event: SelectChangeEvent) => {
    setSelectedSemester(event.target.value)
  }

  const handleFilterStudentByName = (value: string) => {
    if (stuScoreBooks1 && stuScoreBooks1.length !== 0) {
      if (!value) {
        setFilteredStuScoreBooks(stuScoreBooks1)
        return
      }

      const filtered = stuScoreBooks1.filter((stu) => {
        const keywordArr = [...stu.lastName.split(' '), ...stu.firstName.split(' ')].map(
          (keyword) => toLowerCaseNonAccentVietnamese(keyword)
        )
        return keywordArr.includes(value.toLowerCase())
      })
      setFilteredStuScoreBooks(filtered)
    }
  }

  return (
    <Box p={2}>
      <Box sx={{ display: 'flex', gap: 2, width: '100%', alignItems: 'center' }}>
        <Typography variant={'h1'}>Bảng Điểm</Typography>
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
          alignItems: 'center',
          marginBottom: 4,
          marginTop: 1,
        }}
      >
        <Box>
          <SearchComponent onChange={handleFilterStudentByName} />
        </Box>
        <Button
          sx={{ width: '100%', maxWidth: 'fit-content' }}
          variant="contained"
          startIcon={<AssignmentIcon />}
          onClick={() => openAssessmentDialog(true)}
        >
          Thêm Bài Kiểm Tra
        </Button>
      </Box>
      {filteredStuScoreBooks && filteredStuScoreBooks.length !== 0 && (
        <TableComponent
          columns={ScoreBookColumns}
          rows={filteredStuScoreBooks}
          onClickAction={(data: StudentScoreBooks) => setSelectedScoreBook(data)}
          renderActionMenu={renderScoreBookActions}
        />
      )}
      {!!selectedScoreBook && (
        <ScoreBookDialogComponent
          isOpen={!!selectedScoreBook}
          onClose={() => setSelectedScoreBook(undefined)}
          data={selectedScoreBook}
        />
      )}
      {isOpenAssessmentDialog && (
        <AssessmentDialogComponent
          key={'new'}
          isOpen={isOpenAssessmentDialog}
          onClose={() => openAssessmentDialog(false)}
          action={AssessmentActionType.ADD_NEW_ASSESSMENT}
          data={null}
        />
      )}
    </Box>
  )
}

export default ScoreBookComponent
