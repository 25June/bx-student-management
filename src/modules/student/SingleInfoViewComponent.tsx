import React from 'react'
import TableFullNameCellComponent from 'modules/common/TableFullNameCell.component'
import Box from '@mui/material/Box'
import { styled } from '@mui/material/styles'
import Paper from '@mui/material/Paper'
import IconButton from '@mui/material/IconButton'
import { Student } from 'models/student'
import { StudentActionType } from 'constant'
import RestoreFromTrashIcon from '@mui/icons-material/RestoreFromTrash'
import { restoreStudent } from 'services/student'
import { useClassContext } from 'contexts/ClassContext'
import StudentIcon from 'modules/common/StudentIcon'
import HolyBibleIcon from 'modules/common/HolyBibleIcon'
import HolyGrailIcon from 'modules/common/HolyGrailIcon'

interface SingleScoreViewComponentProps {
  student: Student
  onClickAction: (student: any, actionType: StudentActionType) => void
}

const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : 'transparent',
  backdropFilter: 'blur(2px)',
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: 'center',
  color: theme.palette.text.secondary,
}))

const SingleInfoViewComponent = ({ student, onClickAction }: SingleScoreViewComponentProps) => {
  const { disableUpdate } = useClassContext()
  return (
    <Item
      sx={{
        marginBottom: 2,
      }}
    >
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexDirection: 'column',
          width: '100%',
        }}
      >
        <TableFullNameCellComponent
          avatarPath={student.avatarPath}
          saintName={student.saintName}
          lastName={student.lastName}
          firstName={student.firstName}
          gender={!!student.gender}
        />
        <Box sx={{ display: 'flex', justifyContent: 'space-evenly', gap: 1, width: '100%' }}>
          {!student.isDeleted && (
            <>
              <IconButton
                color={'info'}
                onClick={() => onClickAction(student, StudentActionType.VIEW_SCORE_BOOK)}
                disabled={disableUpdate}
                size="small"
              >
                <HolyBibleIcon color={'info'} />
              </IconButton>
              <IconButton
                color={'info'}
                onClick={() => onClickAction(student, StudentActionType.VIEW_STUDENT)}
                disabled={disableUpdate}
                size="small"
              >
                <StudentIcon color={'info'} />
              </IconButton>
              <IconButton
                color={'info'}
                onClick={() => onClickAction(student, StudentActionType.VIEW_STUDENT_DILIGENT)}
                disabled={disableUpdate}
                size="small"
              >
                <HolyGrailIcon color={'info'} />
              </IconButton>
            </>
          )}
          {student.isDeleted && (
            <IconButton
              onClick={() => restoreStudent(student.id)}
              color="success"
              disabled={disableUpdate}
            >
              <RestoreFromTrashIcon />
            </IconButton>
          )}
        </Box>
      </Box>
      {/*{student.transferHistory && (*/}
      {/*  <Box sx={{ textAlign: 'left' }}>*/}
      {/*    <Chip*/}
      {/*      sx={{*/}
      {/*        height: 'auto',*/}
      {/*        '& .MuiChip-label': {*/}
      {/*          display: 'block',*/}
      {/*          whiteSpace: 'normal',*/}
      {/*        },*/}
      {/*      }}*/}
      {/*      size={'small'}*/}
      {/*      color={transferHistoryContent.color as any}*/}
      {/*      label={transferHistoryContent.label}*/}
      {/*    />*/}
      {/*  </Box>*/}
      {/*)}*/}
    </Item>
  )
}

export default SingleInfoViewComponent
