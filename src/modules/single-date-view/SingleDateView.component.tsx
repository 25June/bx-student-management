import React from 'react'
import Paper from '@mui/material/Paper'
import Box from '@mui/material/Box'
import { RollCallDate } from 'utils/customHooks'
import { StudentRows } from 'modules/diligent-table/DiligentTable.component'
import TableFullNameCellComponent from 'modules/common/TableFullNameCell.component'
import DiligentFormComponent from 'modules/diligent/DiligentForm.component'
import { OnSubmitAttendanceProps } from 'modules/common/AttendanceCheckbox.component'
import { styled } from '@mui/material/styles'

interface SingleDateViewComponentProps {
  student: StudentRows
  rollCallDate: RollCallDate
  onSubmitAttendance: (data: OnSubmitAttendanceProps) => void
  attendance: any
}

const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: 'center',
  color: theme.palette.text.secondary,
}))

const SingleDateViewComponent = ({
  student,
  rollCallDate,
  onSubmitAttendance,
  attendance,
}: SingleDateViewComponentProps) => {
  return (
    <Item>
      <TableFullNameCellComponent
        avatarPath={student.avatarPath}
        saintName={student.saintName}
        lastName={student.lastName}
        firstName={student.firstName}
        gender={!!student.gender}
      />
      <Box pt={2} sx={{ display: 'flex', justifyContent: 'space-evenly' }}>
        <DiligentFormComponent
          rollCallKey={rollCallDate.key}
          GL={!!(attendance && attendance?.[rollCallDate.key] && attendance[rollCallDate.key].gl)}
          TL={!!(attendance && attendance?.[rollCallDate.key] && attendance[rollCallDate.key].tl)}
          onSubmitAttendance={onSubmitAttendance}
        />
      </Box>
    </Item>
  )
}

export default SingleDateViewComponent
