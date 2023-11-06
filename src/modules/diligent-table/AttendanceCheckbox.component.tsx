import React, { ChangeEvent } from 'react'
import { get } from 'lodash'
import { Box, Checkbox, Typography, IconButton, FormControlLabel } from '@mui/material'
import { RollCallDate } from 'models/diligent'
import { AttendanceProps, OnSubmitAttendanceProps } from 'models/diligent'
import { amber, teal } from '@mui/material/colors'
import { useDialogContext } from 'contexts/DialogContext'
import { DialogType, RollCallDateActionType } from 'constant/common'
import { useClassContext } from 'contexts/ClassContext'
import ShortTextIcon from '@mui/icons-material/ShortText'

interface OnCheckboxChangeProps {
  event: ChangeEvent<HTMLInputElement>
  rollCallKey: string
  isMissal: boolean
}

interface Props {
  studentId: string
  rollCallDates: RollCallDate[]
  attendance: Record<string, AttendanceProps>
  onSubmitAttendance: (data: OnSubmitAttendanceProps) => void
}

const AttendanceCheckboxComponent = ({
  rollCallDates = [],
  attendance,
  onSubmitAttendance,
  studentId,
}: Props) => {
  const { openDialog } = useDialogContext()
  const { disableUpdate } = useClassContext()

  const handleChange = ({ event, rollCallKey, isMissal }: OnCheckboxChangeProps) => {
    onSubmitAttendance({ value: event.target.checked, rollCallKey, isMissal })
  }

  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'space-around',
        alignItems: 'center',
        gap: 2,
      }}
    >
      {rollCallDates.map(({ key }: { key: string; dateAsString: string }) => {
        const note = get(attendance, [`${key}`, 'note'], '')
        const givingNotice = get(attendance, [`${key}`, 'givingNotice'], false)
        const adoration = get(attendance, [`${key}`, 'adoration'], false)

        return (
          <Box key={`checkbox-date-${key}`}>
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'space-between',
                gap: '1rem',
                width: 135,
                rowGap: '0.25rem',
              }}
            >
              <FormControlLabel
                control={
                  <Checkbox
                    sx={{ padding: 1 }}
                    size={'medium'}
                    checked={!!(attendance && attendance?.[key] && attendance[key].tl)}
                    onChange={(event) => handleChange({ event, rollCallKey: key, isMissal: true })}
                  />
                }
                sx={{ marginRight: 0 }}
                label="TL"
              />

              <FormControlLabel
                control={
                  <Checkbox
                    sx={{ padding: 1 }}
                    size={'medium'}
                    checked={!!(attendance && attendance?.[key] && attendance[key].gl)}
                    onChange={(event) => handleChange({ event, rollCallKey: key, isMissal: false })}
                  />
                }
                label={'GL'}
                sx={{ marginRight: 0 }}
              />
            </Box>
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                gap: '0.125rem',
                width: '100%',
              }}
            >
              <IconButton
                onClick={() =>
                  openDialog(DialogType.STUDY_DATE_DIALOG, RollCallDateActionType.ADD_NOTE, {
                    studentId,
                    rollCallDateId: key,
                    note,
                    givingNotice,
                    adoration,
                  })
                }
                disabled={disableUpdate}
                sx={{ padding: 0 }}
              >
                <ShortTextIcon color={'disabled'} />
              </IconButton>
              {givingNotice && (
                <Typography fontSize={'0.625rem'} sx={{ color: amber[800], textAlign: 'left' }}>
                  Có phép
                </Typography>
              )}
              {adoration && (
                <Typography fontSize={'0.625rem'} sx={{ color: teal[800], textAlign: 'left' }}>
                  Có chầu
                </Typography>
              )}
            </Box>
          </Box>
        )
      })}
    </Box>
  )
}

export default AttendanceCheckboxComponent
