import React, { useState, useEffect, useCallback } from 'react'
import { Button, Box, ToggleButtonGroup } from '@mui/material'
import { StudentActionType } from 'constant'
import { Student } from 'models'
import TableRowsIcon from '@mui/icons-material/TableRows'
import StyleIcon from '@mui/icons-material/Style'
import ToggleButton from '@mui/material/ToggleButton'
import PersonAddIcon from '@mui/icons-material/PersonAdd'
import { renderStudentActions, studentColumns } from 'modules/Table/helpers'
import {
  InfoPanelComponent,
  TableComponent,
  ScoreBookPanelComponent,
  StudentDialogComponent,
  CardComponent,
  LayoutComponent,
} from 'modules'
import { useStudentContext } from 'contexts/StudentContext'
import { useIsMobile } from 'utils/common'
import { useClassContext } from 'contexts/ClassContext'

const HomeComponent = () => {
  const mobile = useIsMobile()
  const [isOpenStudentDialog, setOpenStudentDialog] = useState<boolean>(false)

  const [actionType, setActionType] = useState<string>('')
  const [isOpenInfoPanel, setOpenInfoPanel] = useState(false)
  const [isOpenScoreBook, setOpenScoreBook] = useState(false)
  const [selectedStudent, setSelectedStudent] = useState<Student>()
  const [displayType, setDisplayType] = React.useState<string | null>('card')
  const { setClassId } = useClassContext()
  const { students } = useStudentContext()

  useEffect(() => {
    setClassId('ts1a')
  }, [setClassId])

  useEffect(() => {
    if (selectedStudent && students) {
      const newData = students.find((student: Student) => student.id === selectedStudent.id)
      if (newData) {
        setSelectedStudent(newData)
      }
    }
  }, [students, selectedStudent])

  const handleChangeDisplay = (
    event: React.MouseEvent<HTMLElement>,
    newDisplayType: string | null
  ) => {
    setDisplayType(newDisplayType)
  }

  const openStudentDialog = (type: string): void => {
    setActionType(type)
    setOpenStudentDialog(true)
  }

  const closeStudentDialog = (): void => {
    setOpenStudentDialog(false)
    setActionType('')
    setSelectedStudent(undefined)
  }

  const handleClickAction = (data: Student, type: string) => {
    if (type === StudentActionType.VIEW_SCORE_BOOK) {
      setSelectedStudent(data)
      setOpenScoreBook(true)
      return
    }
    if (type === StudentActionType.VIEW_STUDENT) {
      setSelectedStudent(data)
      setOpenInfoPanel(true)
      return
    }
    const student = students.find((std: Student) => std.id === data.id)
    if (student) {
      setSelectedStudent({
        ...student,
        fullName: student.lastName + ' ' + student.firstName,
      })
      openStudentDialog(type)
    }
  }

  const handleCloseScoreBook = useCallback(() => {
    setSelectedStudent(undefined)
    setOpenScoreBook(false)
  }, [])

  return (
    <LayoutComponent>
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexDirection: mobile ? 'column' : 'row',
          marginBottom: mobile ? 2 : 1,
        }}
      >
        <Box
          sx={{
            padding: 2,
            display: 'flex',
            alignItems: 'center',
            flexDirection: mobile ? 'column' : 'row',
            gap: mobile ? 2 : 1,
          }}
        >
          <Box component={mobile ? 'h3' : 'h2'} marginBottom={0}>
            Thông Tin Thiếu Nhi
          </Box>
        </Box>

        <Box display={'flex'} sx={{ paddingLeft: 2, paddingRight: 2 }}>
          <Button
            variant="contained"
            startIcon={<PersonAddIcon />}
            onClick={() => openStudentDialog(StudentActionType.ADD_NEW_STUDENT)}
            sx={{ marginRight: 2 }}
          >
            Thêm Thiếu Nhi
          </Button>
          <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
            <ToggleButtonGroup value={displayType} exclusive={true} onChange={handleChangeDisplay}>
              <ToggleButton value="table" aria-label="display-table" size="small">
                <TableRowsIcon />
              </ToggleButton>
              <ToggleButton value="card" aria-label="display-card" size="small">
                <StyleIcon />
              </ToggleButton>
            </ToggleButtonGroup>
          </Box>
        </Box>
      </Box>
      {displayType === 'table' ? (
        <TableComponent
          columns={studentColumns}
          rows={students || []}
          onClickAction={handleClickAction}
          renderActionMenu={renderStudentActions}
        />
      ) : (
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'row',
            flexWrap: 'wrap',
            justifyContent: 'center',
            gap: 5,
            paddingLeft: 1,
            paddingRight: 1,
          }}
        >
          {(students || []).map((student: Student) => (
            <Box key={student.id} sx={{ display: 'flex', columnGap: 16, rowGap: 16 }}>
              <CardComponent student={student} onClickAction={handleClickAction} />
            </Box>
          ))}
          <InfoPanelComponent
            isOpen={isOpenInfoPanel}
            studentInfo={selectedStudent}
            onClose={() => setOpenInfoPanel(false)}
            onClickAction={handleClickAction}
          />
          {isOpenScoreBook && selectedStudent && (
            <ScoreBookPanelComponent
              isOpen={!!selectedStudent}
              onClose={handleCloseScoreBook}
              studentId={selectedStudent.id}
            />
          )}
        </Box>
      )}
      <StudentDialogComponent
        isOpen={isOpenStudentDialog}
        onClose={closeStudentDialog}
        action={actionType}
        student={selectedStudent}
      />
    </LayoutComponent>
  )
}

export default HomeComponent
