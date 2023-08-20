import React from 'react'
import TableFullNameCellComponent from 'modules/common/TableFullNameCell.component'
import Box from '@mui/material/Box'
import { styled } from '@mui/material/styles'
import Paper from '@mui/material/Paper'
import IconButton from '@mui/material/IconButton'
import { Student } from 'models/student'
import ScoreIcon from '@mui/icons-material/Score'
import PermIdentityIcon from '@mui/icons-material/PermIdentity'
import { StudentActionType } from 'constant'
import Chip from '@mui/material/Chip'

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
  const transferHistoryContent =
    student.transferHistory && student.transferHistory[0] !== 'new'
      ? { label: `Chuyển từ ${student.transferHistory[0]}`, color: 'info' }
      : { label: 'Thiếu nhi mới', color: 'success' }
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
        }}
      >
        <TableFullNameCellComponent
          avatarPath={student.avatarPath}
          saintName={student.saintName}
          lastName={student.lastName}
          firstName={student.firstName}
          gender={!!student.gender}
        />
        <Box sx={{ display: 'flex', gap: 1 }}>
          <IconButton
            color={'info'}
            onClick={() => onClickAction(student, StudentActionType.VIEW_SCORE_BOOK)}
          >
            <ScoreIcon />
          </IconButton>
          <IconButton
            color={'info'}
            onClick={() => onClickAction(student, StudentActionType.VIEW_STUDENT)}
          >
            <PermIdentityIcon />
          </IconButton>
        </Box>
      </Box>
      {student.transferHistory && (
        <Box sx={{ textAlign: 'left' }}>
          <Chip
            sx={{
              height: 'auto',
              '& .MuiChip-label': {
                display: 'block',
                whiteSpace: 'normal',
              },
            }}
            size={'small'}
            color={transferHistoryContent.color as any}
            label={transferHistoryContent.label}
          />
        </Box>
      )}
    </Item>
  )
}

export default SingleInfoViewComponent
