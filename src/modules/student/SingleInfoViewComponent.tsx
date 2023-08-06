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

interface SingleScoreViewComponentProps {
  student: Student
  onClickAction: (student: any, actionType: StudentActionType) => void
}

const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: 'center',
  color: theme.palette.text.secondary,
}))

const SingleInfoViewComponent = ({ student, onClickAction }: SingleScoreViewComponentProps) => {
  return (
    <Item
      sx={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 2,
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
    </Item>
  )
}

export default SingleInfoViewComponent
