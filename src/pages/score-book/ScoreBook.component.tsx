import Box from '@mui/material/Box'
import { Button } from '@mui/material'
import AssignmentIcon from '@mui/icons-material/Assignment'
import useMediaQuery from '@mui/material/useMediaQuery'
import { ScoreBookActionType } from 'constant'
import { LayoutComponent, ScoreBookDialogComponent, TableComponent } from 'modules'
import { renderScoreBookActions, ScoreBookColumns } from 'modules/Table/helpers'
import { StudentScoreBooks } from 'models'
import React, { useEffect, useState, useCallback } from 'react'
import { useGetStudentScoreBooks } from 'services'
import { useStudentContext } from 'contexts/StudentContext'

const ScoreBookComponent = () => {
  const mobile = useMediaQuery('(max-width:900px)')
  const [isOpenScoreBookDialog, setOpenScoreBookDialog] = useState<boolean>(false)
  const [actionData, setActionData] = useState<StudentScoreBooks | null>()
  const [selectedScoreBook, setSelectedScoreBook] = useState<StudentScoreBooks>()

  const { students } = useStudentContext()
  const { studentScoreBooks } = useGetStudentScoreBooks({ students })

  const closeScoreBookDialog = useCallback((): void => {
    setOpenScoreBookDialog(false)
    setActionData(null)
  }, [])

  const handleClickAction = (data: StudentScoreBooks, type: string) => {
    if (type === ScoreBookActionType.VIEW_SCORE_BOOK) {
      setSelectedScoreBook(data)
      return
    }
    const student = (studentScoreBooks || []).find((std: StudentScoreBooks) => std.id === data.id)
    if (student) {
      setActionData(student)
      setOpenScoreBookDialog(true)
    }
  }

  useEffect(() => {
    if (selectedScoreBook && studentScoreBooks) {
      const newData = studentScoreBooks.find(
        (student: StudentScoreBooks) => student.id === selectedScoreBook.id
      )
      if (newData) {
        setSelectedScoreBook(newData)
      }
    }
  }, [studentScoreBooks, setSelectedScoreBook, selectedScoreBook])

  return (
    <LayoutComponent>
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexDirection: mobile ? 'column' : 'row',
        }}
      >
        <Box component={mobile ? 'h3' : 'h1'} sx={{ paddingLeft: 2, paddingRight: 2 }}>
          Bảng Điểm
        </Box>
        <Box display={'flex'} sx={{ paddingLeft: 2, paddingRight: 2 }}>
          <Button
            variant="contained"
            startIcon={<AssignmentIcon />}
            onClick={() => setOpenScoreBookDialog(true)}
            sx={{ marginRight: 2 }}
          >
            Thêm Bài Kiểm Tra
          </Button>
        </Box>
      </Box>
      {studentScoreBooks && (
        <TableComponent
          columns={ScoreBookColumns}
          rows={studentScoreBooks}
          onClickAction={handleClickAction}
          renderActionMenu={renderScoreBookActions}
        />
      )}
      {isOpenScoreBookDialog && (
        <ScoreBookDialogComponent
          isOpen={isOpenScoreBookDialog}
          onClose={() => closeScoreBookDialog()}
          data={actionData}
        />
      )}
    </LayoutComponent>
  )
}

export default ScoreBookComponent
