import React, { useCallback, useEffect, useState } from 'react'
import { Box, ToggleButtonGroup, Typography } from '@mui/material'
import { ScoreBookActionType, StudentActionType } from 'constant'
import { Student } from 'models'
import TableRowsIcon from '@mui/icons-material/TableRows'
import StyleIcon from '@mui/icons-material/Style'
import ToggleButton from '@mui/material/ToggleButton'
import { renderStudentActions, studentColumns } from 'modules/Table/helpers'
import { CardComponent, InfoPanelComponent, ScoreBookPanelComponent, TableComponent } from 'modules'
import { useStudentContext } from 'contexts/StudentContext'
import SearchComponent from 'modules/common/Search.component'
import { toLowerCaseNonAccentVietnamese, useIsMobile } from 'utils/common'
import { useDialogContext } from 'contexts/DialogContext'
import { DialogType } from 'constant/common'
import SingleInfoViewComponent from 'modules/student/SingleInfoViewComponent'

const HomeComponent = () => {
  const [isOpenInfoPanel, setOpenInfoPanel] = useState(false)
  const [isOpenScoreBook, setOpenScoreBook] = useState(false)
  const [selectedStudent, setSelectedStudent] = useState<Student>()
  const [displayType, setDisplayType] = React.useState<string | null>('card')
  const { students } = useStudentContext()
  const isMobile = useIsMobile()
  const { openDialog } = useDialogContext()

  const [filteredStudents, setFilteredStudents] = useState<Student[]>([])
  useEffect(() => {
    if (students) {
      setFilteredStudents(students)
    }
  }, [students])
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

  const openStudentDialog = (type: StudentActionType, student: Student): void => {
    openDialog(DialogType.STUDENT_DIALOG, type, student)
  }

  const handleClickAction = (data: Student, type: StudentActionType | ScoreBookActionType) => {
    if (type === StudentActionType.VIEW_SCORE_BOOK) {
      setTimeout(() => {
        setSelectedStudent(data)
        setOpenScoreBook(true)
      }, 100)
      return
    }
    if (type === StudentActionType.VIEW_STUDENT) {
      setTimeout(() => {
        setSelectedStudent(data)
        setOpenInfoPanel(true)
      }, 100)
      return
    }
    const student = students.find((std: Student) => std.id === data.id)
    if (student) {
      openStudentDialog(type as StudentActionType, student)
    }
  }

  const handleCloseScoreBook = useCallback(() => {
    setSelectedStudent(undefined)
    setOpenScoreBook(false)
  }, [])

  const handleFilterStudentByName = (value: string) => {
    if (students && students.length !== 0) {
      if (!value) {
        setFilteredStudents(students)
        return
      }

      const filtered = students.filter((stu) => {
        const keywordArr = [...stu.lastName.split(' '), ...stu.firstName.split(' ')].map(
          (keyword) => toLowerCaseNonAccentVietnamese(keyword)
        )
        return keywordArr.includes(value.toLowerCase())
      })
      setFilteredStudents(filtered)
    }
  }

  return (
    <Box>
      <Box p={isMobile ? 1 : 2}>
        <Typography variant={'h1'} sx={{ textAlign: 'left', fontSize: isMobile ? '1rem' : '2rem' }}>
          Thông Tin Thiếu Nhi
        </Typography>
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: 4,
            marginTop: 1,
            flexWrap: isMobile ? 'wrap' : 'nowrap',
            gap: isMobile ? 1 : 2,
          }}
        >
          <Box>
            <SearchComponent onChange={handleFilterStudentByName} />
          </Box>
          <Box display={'flex'} sx={{ gap: isMobile ? 1 : 2 }}>
            <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
              <ToggleButtonGroup
                color={'info'}
                value={displayType}
                exclusive={true}
                onChange={handleChangeDisplay}
              >
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
          <>
            {isMobile ? (
              <Box>
                {(filteredStudents || []).map((student) => (
                  <SingleInfoViewComponent
                    key={student.id}
                    student={student}
                    onClickAction={handleClickAction}
                  />
                ))}
              </Box>
            ) : (
              <TableComponent
                columns={studentColumns}
                rows={filteredStudents || []}
                onClickAction={handleClickAction}
                renderActionMenu={renderStudentActions}
              />
            )}
          </>
        ) : (
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'row',
              flexWrap: 'wrap',
              justifyContent: 'center',
              gap: isMobile ? 2.5 : 5,
              paddingLeft: 1,
              paddingRight: 1,
            }}
          >
            {(filteredStudents || []).map((student: Student) => (
              <Box
                key={student.id}
                sx={{ display: 'flex', columnGap: isMobile ? 8 : 16, rowGap: isMobile ? 8 : 16 }}
              >
                <CardComponent student={student} onClickAction={handleClickAction} />
              </Box>
            ))}
          </Box>
        )}
        <ScoreBookPanelComponent
          isOpen={!!(selectedStudent?.id && isOpenScoreBook)}
          onClose={handleCloseScoreBook}
          studentId={selectedStudent?.id || ''}
        />
        <InfoPanelComponent
          isOpen={!!(selectedStudent?.id && isOpenInfoPanel)}
          studentInfo={selectedStudent}
          onClose={() => setOpenInfoPanel(false)}
          onClickAction={handleClickAction}
        />
      </Box>
    </Box>
  )
}

export default HomeComponent
