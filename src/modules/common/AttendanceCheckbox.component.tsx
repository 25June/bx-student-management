import React, { ChangeEvent } from 'react'
import { Box, Checkbox } from '@mui/material'
import FormControlLabel from '@mui/material/FormControlLabel'
import { RollCallDate } from 'utils/customHooks'
import { useIsMobile } from 'utils/common'

export interface OnSubmitAttendanceProps {
  value: boolean
  rollCallKey: string
  isMissal: boolean
}

interface OnCheckboxChangeProps {
  event: ChangeEvent<HTMLInputElement>
  rollCallKey: string
  isMissal: boolean
}

export interface AttendanceProps {
  tl: boolean
  gl: boolean
}

interface AttendanceCheckboxComponentProps {
  rollCallDates: RollCallDate[]
  attendance: Record<string, AttendanceProps>
  onSubmitAttendance: (data: OnSubmitAttendanceProps) => void
}

const AttendanceCheckboxComponent = ({
  rollCallDates = [],
  attendance,
  onSubmitAttendance,
}: AttendanceCheckboxComponentProps) => {
  const isMobile = useIsMobile()
  const handleChange = ({ event, rollCallKey, isMissal }: OnCheckboxChangeProps) => {
    onSubmitAttendance({ value: event.target.checked, rollCallKey, isMissal })
  }
  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'space-around',
        alignItems: 'center',
        gap: isMobile ? 1 : 2,
      }}
    >
      {rollCallDates.map(({ key }: { key: string; dateAsString: string }) => (
        <Box
          key={`checkbox-date-${key}`}
          sx={{ display: 'flex', gap: 0.5, width: isMobile ? 42 : 84, flexDirection: 'column' }}
        >
          <FormControlLabel
            control={
              <Checkbox
                sx={{ padding: isMobile ? 0.5 : 1, marginRight: isMobile ? 0 : 2 }}
                size={isMobile ? 'small' : 'medium'}
                checked={!!(attendance && attendance?.[key] && attendance[key].tl)}
                onChange={(event) => handleChange({ event, rollCallKey: key, isMissal: true })}
              />
            }
            label="TL"
          />

          <FormControlLabel
            control={
              <Checkbox
                sx={{ padding: isMobile ? 0.5 : 1, marginRight: isMobile ? 0 : 2 }}
                size={isMobile ? 'small' : 'medium'}
                checked={!!(attendance && attendance?.[key] && attendance[key].gl)}
                onChange={(event) => handleChange({ event, rollCallKey: key, isMissal: false })}
              />
            }
            label={'GL'}
          />
        </Box>
      ))}
    </Box>
  )
}

export default AttendanceCheckboxComponent
