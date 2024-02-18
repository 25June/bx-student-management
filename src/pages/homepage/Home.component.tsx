import React, { useCallback, useEffect, useState } from 'react'
import { Box, ToggleButtonGroup, Typography, ToggleButton, IconButton } from '@mui/material'
import { green, red } from '@mui/material/colors'
import { Student } from 'models/student'
import { toLowerCaseNonAccentVietnamese, useIsMobile } from 'utils/common'
import { useDialogContext } from 'contexts/DialogContext'
import { useStudentContext } from 'contexts/StudentContext'
import { useClassContext } from 'contexts/ClassContext'
import { DialogType, ScoreBookActionType, StudentActionType } from 'constant/common'
import TableRowsIcon from '@mui/icons-material/TableRows'
import StyleIcon from '@mui/icons-material/Style'
import PlaylistAddCheckIcon from '@mui/icons-material/PlaylistAddCheck'
import PlaylistRemoveIcon from '@mui/icons-material/PlaylistRemove'
import { renderStudentActions, studentColumns } from 'modules/Table/helpers'
import SearchComponent from 'modules/common/Search.component'
import CardComponent from 'modules/card/Card.component'
import InfoPanelComponent from 'modules/info-panel/InfoPanel.component'
import ScoreBookPanelComponent from 'modules/score-book-panel/ScoreBookPanel.component'
import TableComponent from 'modules/Table/Table.component'
import SingleInfoViewComponent from 'modules/student/SingleInfoViewComponent'
import DiligentPanelComponent from 'modules/diligent/DiligentPanel.component'

import { FixedSizeList } from 'react-window'
import AutoSizer from 'react-virtualized-auto-sizer'

enum DisplayType {
  CARD = 'card',
  TABLE = 'table',
}

const HomeComponent = () => {
  const [isOpenInfoPanel, setIsOpenInfoPanel] = useState<boolean>(false)
  const [isOpenScoreBook, setIsOpenScoreBook] = useState<boolean>(false)
  const [isOpenDiligentPanel, setIsOpenDiligentPanel] = useState<boolean>(false)
  const [viewDeletedStudent, setViewDeletedStudent] = useState<boolean>(false)
  const [selectedStudent, setSelectedStudent] = useState<Student>()
  const [displayType, setDisplayType] = React.useState<DisplayType>(DisplayType.TABLE)
  const { students, deletedStudents } = useStudentContext()
  const isMobile = useIsMobile()
  const { openDialog } = useDialogContext()
  const { classId, disableUpdate } = useClassContext()

  const [filteredStudents, setFilteredStudents] = useState<Student[]>([])
  useEffect(() => {
    if (students) {
      setFilteredStudents(students)
      setViewDeletedStudent(false)
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
    newDisplayType: DisplayType | null
  ) => {
    if (newDisplayType) {
      setDisplayType(newDisplayType)
    }
  }

  const openStudentDialog = (type: StudentActionType, student: Student): void => {
    openDialog(DialogType.STUDENT_DIALOG, type, student)
  }

  const handleClickAction = (data: Student, type: StudentActionType | ScoreBookActionType) => {
    if (disableUpdate) {
      return
    }
    if (type === StudentActionType.VIEW_SCORE_BOOK) {
      setSelectedStudent(data)
      setIsOpenScoreBook(true)
      return
    }
    if (type === StudentActionType.VIEW_STUDENT) {
      setSelectedStudent(data)
      setIsOpenInfoPanel(true)
      return
    }

    if (type === StudentActionType.VIEW_STUDENT_DILIGENT) {
      setSelectedStudent(data)
      setIsOpenDiligentPanel(true)
      return
    }
    const student = students.find((std: Student) => std.id === data.id)
    if (student) {
      openStudentDialog(type as StudentActionType, student)
    }
  }

  const handleCloseScoreBook = useCallback(() => {
    setSelectedStudent(undefined)
    setIsOpenScoreBook(false)
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

  const handleSwitchStudentViewMode = (isDeleted: boolean) => {
    setViewDeletedStudent(isDeleted)
    if (isDeleted) {
      setFilteredStudents(deletedStudents)
    } else {
      setFilteredStudents(students)
    }
  }

  return (
    <Box p={1}>
      <Typography variant={'h1'} sx={{ textAlign: 'left', fontSize: '1rem' }}>
        Thông Tin Thiếu Nhi
      </Typography>
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: 4,
          marginTop: 1,
          flexWrap: 'wrap',
          gap: 1,
        }}
      >
        <Box sx={{ width: '100%' }}>
          <SearchComponent onChange={handleFilterStudentByName} key={classId} />
        </Box>
        <Box
          sx={{
            width: '100%',
            display: 'flex',
            justifyContent: 'space-between',
            gap: 1,
          }}
        >
          <ToggleButtonGroup
            color={'info'}
            value={displayType}
            exclusive={true}
            onChange={handleChangeDisplay}
          >
            <ToggleButton value={DisplayType.TABLE} size="small">
              <TableRowsIcon />
            </ToggleButton>
            <ToggleButton value={DisplayType.CARD} size="small">
              <StyleIcon />
            </ToggleButton>
          </ToggleButtonGroup>
          <IconButton
            onClick={() => handleSwitchStudentViewMode(!viewDeletedStudent)}
            color={viewDeletedStudent ? 'success' : 'error'}
            sx={{ background: viewDeletedStudent ? green[100] : red[100] }}
          >
            {viewDeletedStudent ? <PlaylistAddCheckIcon /> : <PlaylistRemoveIcon />}
          </IconButton>
        </Box>
      </Box>
      {displayType === 'table' ? (
        <>
          {isMobile ? (
            <Box
              sx={{
                background: 'transparent',
                backdropFilter: 'blur(4px)',
                height: 'calc(100vh - 272px)',
                WebkitMask: 'linear-gradient(0deg,#0000,#000 5% 95%,#0000)',
              }}
            >
              <AutoSizer>
                {({ height, width }: any) => (
                  <FixedSizeList
                    height={height}
                    itemCount={(filteredStudents || []).length}
                    itemSize={125}
                    width={width}
                  >
                    {({ index, style }) => (
                      <div style={style}>
                        <SingleInfoViewComponent
                          key={students[index].id}
                          student={students[index]}
                          onClickAction={handleClickAction}
                        />
                      </div>
                    )}
                  </FixedSizeList>
                )}
              </AutoSizer>
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
            gap: 2.5,
            paddingLeft: 1,
            paddingRight: 1,
          }}
        >
          {(filteredStudents || []).map((student: Student) => (
            <Box key={student.id} sx={{ display: 'flex', columnGap: 8, rowGap: 8 }}>
              <CardComponent student={student} onClickAction={handleClickAction} />
            </Box>
          ))}
        </Box>
      )}
      <ScoreBookPanelComponent
        isOpen={!!(selectedStudent?.id && isOpenScoreBook)}
        onClose={handleCloseScoreBook}
        studentId={selectedStudent?.id ?? ''}
      />
      <InfoPanelComponent
        isOpen={!!(selectedStudent?.id && isOpenInfoPanel)}
        student={selectedStudent}
        onClose={() => setIsOpenInfoPanel(false)}
        onClickAction={handleClickAction}
      />
      <DiligentPanelComponent
        open={isOpenDiligentPanel}
        onClose={() => setIsOpenDiligentPanel(false)}
        student={selectedStudent}
      />
    </Box>
  )
}

export default HomeComponent
