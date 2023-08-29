import React from 'react'
import Paper from '@mui/material/Paper'
import Box from '@mui/material/Box'
import IconButton from '@mui/material/IconButton'
import Typography from '@mui/material/Typography'
import { RollCallDate } from 'utils/customHooks'
import { StudentRows } from 'modules/diligent-table/DiligentTable.component'
import TableFullNameCellComponent from 'modules/common/TableFullNameCell.component'
import DiligentFormComponent from 'modules/diligent/DiligentForm.component'
import { AttendanceProps, OnSubmitAttendanceProps } from 'models/diligent'
import { styled } from '@mui/material/styles'
import ShortTextIcon from '@mui/icons-material/ShortText'
import { useDialogContext } from 'contexts/DialogContext'
import { DialogType, RollCallDateActionType } from 'constant/common'
import { grey } from '@mui/material/colors'
import { get } from 'lodash'
import { useClassContext } from 'contexts/ClassContext'

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
  const { disableUpdate } = useClassContext()
  const { openDialog } = useDialogContext()
  const note = get(attendance, [`${rollCallDate.key}`, 'note'], '')
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
        />
        <IconButton
          onClick={() =>
            openDialog(DialogType.STUDY_DATE_DIALOG, RollCallDateActionType.ADD_NOTE, {
              studentId: student.id,
              rollCallDateId: rollCallDate.key,
              note,
            })
          }
          disabled={disableUpdate}
        >
          <ShortTextIcon color={'disabled'} />
        </IconButton>
      </Box>
      {note && (
        <Typography fontSize={'0.5rem'} sx={{ color: grey[600], textAlign: 'left' }}>
          <i>Ghi chú: {note}</i>
        </Typography>
      )}
    </Item>
  )
}

export default SingleDateViewComponent
