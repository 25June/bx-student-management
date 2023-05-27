import React, { ChangeEvent } from 'react'
import { Box, Checkbox } from '@mui/material'
import FormControlLabel from '@mui/material/FormControlLabel'

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
  rollCall: Record<string, string>
  attendance: Record<string, AttendanceProps>
  onSubmitAttendance: (data: OnSubmitAttendanceProps) => void
}

const AttendanceCheckboxComponent = ({
  rollCall,
  attendance,
  onSubmitAttendance,
}: AttendanceCheckboxComponentProps) => {
  const handleChange = ({ event, rollCallKey, isMissal }: OnCheckboxChangeProps) => {
    onSubmitAttendance({ value: event.target.checked, rollCallKey, isMissal })
  }
  return (
    <Box sx={{ display: 'flex', justifyContent: 'space-around', alignItems: 'center', gap: 2 }}>
      {rollCall
        ? Object.keys(rollCall).map((key: string) => (
            <Box
              key={`checkbox-date-${key}-${rollCall[key]}`}
              sx={{ display: 'flex', gap: 0.5, width: '84px', flexDirection: 'column' }}
            >
              <FormControlLabel
                control={
                  <Checkbox
                    checked={!!(attendance && attendance?.[key] && attendance[key].tl)}
                    onChange={(event) => handleChange({ event, rollCallKey: key, isMissal: true })}
                  />
                }
                label="TL"
              />

              <FormControlLabel
                control={
                  <Checkbox
                    checked={!!(attendance && attendance?.[key] && attendance[key].gl)}
                    onChange={(event) => handleChange({ event, rollCallKey: key, isMissal: false })}
                  />
                }
                label={'GL'}
              />
            </Box>
          ))
        : null}
    </Box>
  )
}

export default AttendanceCheckboxComponent
