import React from 'react'
import Paper from '@mui/material/Paper'
import Box from '@mui/material/Box'
import IconButton from '@mui/material/IconButton'
import Typography from '@mui/material/Typography'
import { RollCallDate } from 'models/diligent'
import { StudentRows } from 'modules/diligent-table/DiligentTable.component'
import TableFullNameCellComponent from 'modules/common/TableFullNameCell.component'
import DiligentFormComponent from 'modules/diligent/DiligentForm.component'
import { AttendanceProps, OnSubmitAttendanceProps } from 'models/diligent'
import { styled } from '@mui/material/styles'
import ShortTextIcon from '@mui/icons-material/ShortText'
import { useDialogContext } from 'contexts/DialogContext'
import { DialogType, RollCallDateActionType } from 'constant/common'
import { grey, amber, teal } from '@mui/material/colors'
import { get } from 'lodash'
import { useClassContext } from 'contexts/ClassContext'

interface SingleDateViewComponentProps {
  student: StudentRows
  rollCallDate: RollCallDate
  onSubmitAttendance: (data: OnSubmitAttendanceProps) => void
  attendance: Record<string, AttendanceProps>
}

const Item = styled(Paper)(({ theme }) => ({
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
  const { disableUpdate } = useClassContext()
  const { openDialog } = useDialogContext()
  const note = get(attendance, [`${rollCallDate.key}`, 'note'], '')
  const givingNotice = get(attendance, [`${rollCallDate.key}`, 'givingNotice'], false)
  const adoration = get(attendance, [`${rollCallDate.key}`, 'adoration'], false)
  return (
    <Item
      sx={{
        background: 'transparent',
        backdropFilter: 'blur(4px)',
      }}
    >
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
          GL={!!get(attendance, [`${rollCallDate.key}`, 'gl'], false)}
          TL={!!get(attendance, [`${rollCallDate.key}`, 'tl'], false)}
          onSubmitAttendance={onSubmitAttendance}
          disabled={disableUpdate}
          studentId={student.id}
        />
        <IconButton
          onClick={() =>
            openDialog(DialogType.STUDY_DATE_DIALOG, RollCallDateActionType.ADD_NOTE, {
              studentId: student.id,
              rollCallDateId: rollCallDate.key,
              note,
              givingNotice,
              adoration,
            })
          }
          disabled={disableUpdate}
        >
          <ShortTextIcon color={'disabled'} />
        </IconButton>
      </Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', gap: '0.125rem' }}>
        {note && (
          <Typography fontSize={'0.75rem'} sx={{ color: grey[600], textAlign: 'left' }}>
            <b>Ghi chú:</b> <i>{note}</i>
          </Typography>
        )}
        {givingNotice && (
          <Typography fontSize={'0.75rem'} sx={{ color: amber[800], textAlign: 'left' }}>
            Vắng có phép
          </Typography>
        )}
        {adoration && (
          <Typography fontSize={'0.75rem'} sx={{ color: teal[800], textAlign: 'left' }}>
            Có đi chầu
          </Typography>
        )}
      </Box>
    </Item>
  )
}

export default SingleDateViewComponent
