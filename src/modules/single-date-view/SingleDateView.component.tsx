import React from 'react'
import Paper from '@mui/material/Paper'
import Box from '@mui/material/Box'
import IconButton from '@mui/material/IconButton'
import Typography from '@mui/material/Typography'
import { RollCallDate } from 'utils/customHooks'
import { StudentRows } from 'modules/diligent-table/DiligentTable.component'
import TableFullNameCellComponent from 'modules/common/TableFullNameCell.component'
import DiligentFormComponent from 'modules/diligent/DiligentForm.component'
import {
  AttendanceProps,
  OnSubmitAttendanceProps,
} from 'modules/common/AttendanceCheckbox.component'
import { styled } from '@mui/material/styles'
import ShortTextIcon from '@mui/icons-material/ShortText'
import { useDialogContext } from 'contexts/DialogContext'
import { DialogType, RollCallDateActionType } from 'constant/common'
import { grey } from '@mui/material/colors'

interface SingleDateViewComponentProps {
  student: StudentRows
  rollCallDate: RollCallDate
  onSubmitAttendance: (data: OnSubmitAttendanceProps) => void
  attendance: Record<string, AttendanceProps>
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
  const { openDialog } = useDialogContext()

  return (
    <Item>
      <TableFullNameCellComponent
        avatarPath={student.avatarPath}
        saintName={student.saintName}
        lastName={student.lastName}
        firstName={student.firstName}
        gender={!!student.gender}
      />
      <Box pt={2} sx={{ display: 'flex', justifyContent: 'space-between' }}>
        <DiligentFormComponent
          rollCallKey={rollCallDate.key}
          GL={!!(attendance && attendance?.[rollCallDate.key] && attendance[rollCallDate.key].gl)}
          TL={!!(attendance && attendance?.[rollCallDate.key] && attendance[rollCallDate.key].tl)}
          onSubmitAttendance={onSubmitAttendance}
        />
        <IconButton
          onClick={() =>
            openDialog(DialogType.STUDY_DATE_DIALOG, RollCallDateActionType.ADD_NOTE, {
              studentId: student.id,
              rollCallDateId: rollCallDate.key,
              note: attendance[rollCallDate.key].note || '',
            })
          }
        >
          <ShortTextIcon color={'disabled'} />
        </IconButton>
      </Box>
      {attendance && attendance?.[rollCallDate.key].note && (
        <Typography fontSize={'0.5rem'} sx={{ color: grey[600], textAlign: 'left' }}>
          <i>Ghi chú: {attendance[rollCallDate.key].note}</i>
        </Typography>
      )}
    </Item>
  )
}

export default SingleDateViewComponent
