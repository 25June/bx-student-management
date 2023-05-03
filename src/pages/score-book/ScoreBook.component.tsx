import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import AssignmentIcon from '@mui/icons-material/Assignment'
import LayoutComponent from 'modules/layout/Layout.component'
import TableComponent from 'modules/Table/Table.component'
import ScoreBookDialogComponent from 'modules/score-book-dialog/ScoreBookDialog.component'
import { ScoreBookActions, ScoreBookColumns } from 'modules/Table/helpers'
import { StudentScoreBooks } from 'models'
import React, { useState } from 'react'
import { useGetStudentScoreBooks } from 'services'
import { useStudentContext } from 'contexts/StudentContext'
import { useIsMobile } from 'utils/common'

const ScoreBookComponent = () => {
  const mobile = useIsMobile()
  const { students } = useStudentContext()
  const { studentScoreBooks: stuScoreBooks } = useGetStudentScoreBooks({ students })
  const [selectedScoreBook, setSelectedScoreBook] = useState<StudentScoreBooks>()

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
            onClick={() => console.log('click on them bai kiem tra')}
            sx={{ marginRight: 2 }}
          >
            Thêm Bài Kiểm Tra
          </Button>
        </Box>
      </Box>
      {stuScoreBooks.length !== 0 && (
        <TableComponent
          columns={ScoreBookColumns}
          rows={stuScoreBooks}
          onClickAction={(data: StudentScoreBooks) => setSelectedScoreBook(data)}
          renderActionMenu={ScoreBookActions}
        />
      )}
      {!!selectedScoreBook && (
        <ScoreBookDialogComponent
          isOpen={!!selectedScoreBook}
          onClose={() => setSelectedScoreBook(undefined)}
          data={selectedScoreBook}
        />
      )}
    </LayoutComponent>
  )
}

export default ScoreBookComponent
