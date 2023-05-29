import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import AssignmentIcon from '@mui/icons-material/Assignment'
import TableComponent from 'modules/Table/Table.component'
import ScoreBookDialogComponent from 'modules/score-book-dialog/ScoreBookDialog.component'
import { renderScoreBookActions, ScoreBookColumns } from 'modules/Table/helpers'
import { StudentScoreBooks } from 'models'
import React, { useState, useMemo } from 'react'
import { useStudentContext } from 'contexts/StudentContext'
import AssessmentDialogComponent from 'modules/assessment-dialog/AssessmentDialog.component'
import { AssessmentActionType } from 'constant'
import { useClassContext } from 'contexts/ClassContext'
import { Typography } from '@mui/material'
import { useGetStudentScoreBooks1 } from 'services/scorebook'
import SemesterDropdownComponent from 'modules/common/SemesterDropdown.component'
import { SelectChangeEvent } from '@mui/material/Select'

const ScoreBookComponent = () => {
  const { students } = useStudentContext()
  const { classId } = useClassContext()
  const { studentScoreBooks } = useGetStudentScoreBooks1({ classId })
  const [selectedScoreBook, setSelectedScoreBook] = useState<StudentScoreBooks>()
  const [isOpenAssessmentDialog, openAssessmentDialog] = useState<boolean>(false)
  const [selectedSemester, setSelectedSemester] = useState<string>('hk1')

  const stuScoreBooks1 = useMemo(() => {
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
  const handleChangeSemester = (event: SelectChangeEvent) => {
    setSelectedSemester(event.target.value)
  }

  return (
    <Box p={2}>
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: 4,
          marginTop: 2,
        }}
      >
        <Box sx={{ display: 'flex', gap: 2, width: '100%', alignItems: 'center' }}>
          <Typography variant={'h1'}>Bảng Điểm</Typography>
          <SemesterDropdownComponent
            selectedSemester={selectedSemester}
            onChangeSemester={handleChangeSemester}
            size={'small'}
          />
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
      {stuScoreBooks1 && stuScoreBooks1.length !== 0 && (
        <TableComponent
          columns={ScoreBookColumns}
          rows={stuScoreBooks1}
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
