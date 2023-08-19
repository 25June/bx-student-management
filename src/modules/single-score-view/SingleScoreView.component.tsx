import React from 'react'
import TableFullNameCellComponent from 'modules/common/TableFullNameCell.component'
import Box from '@mui/material/Box'
import { styled } from '@mui/material/styles'
import Paper from '@mui/material/Paper'
import { Student } from 'models/student'
import ScoreForm from 'modules/common/ScoreForm.component'
import { Assessment } from 'models'

interface SingleScoreViewComponentProps {
  student: Student
  score: number
  assessment: Assessment
  onChangeData: (submittedValue: { score: number }, assessmentId: string) => void
}

const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : 'transparent',
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: 'center',
  color: theme.palette.text.secondary,
}))

const SingleScoreViewComponent = ({
  student,
  score,
  assessment,
  onChangeData,
}: SingleScoreViewComponentProps) => {
  return (
    <Item>
      <TableFullNameCellComponent
        avatarPath={student.avatarPath}
        saintName={student.saintName}
        lastName={student.lastName}
        firstName={student.firstName}
        gender={!!student.gender}
      />
      <Box pt={2}>
        <ScoreForm data={score} assessment={assessment} onChangeData={onChangeData} />
      </Box>
    </Item>
  )
}

export default SingleScoreViewComponent
