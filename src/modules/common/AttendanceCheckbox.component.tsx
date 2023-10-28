import React, { ChangeEvent } from 'react'
import { get } from 'lodash'
import { Box, Checkbox, Typography, FormControlLabel } from '@mui/material'
import { RollCallDate } from 'utils/customHooks'
import { useIsMobile } from 'utils/common'
import { AttendanceProps, OnSubmitAttendanceProps } from 'models/diligent'
import { grey, amber, teal } from '@mui/material/colors'

interface OnCheckboxChangeProps {
  event: ChangeEvent<HTMLInputElement>
  rollCallKey: string
  isMissal: boolean
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
                width: 120,
                rowGap: '0.25rem',
              }}
            >
              <FormControlLabel
                control={
                  <Checkbox
                    sx={{ padding: 1 }}
                    size={isMobile ? 'small' : 'medium'}
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
                    size={isMobile ? 'small' : 'medium'}
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
                gap: '0.125rem',
                width: '100%',
              }}
            >
              {givingNotice && (
                <Typography fontSize={'0.75rem'} sx={{ color: amber[800], textAlign: 'left' }}>
                  Có phép
                </Typography>
              )}
              {adoration && (
                <Typography fontSize={'0.75rem'} sx={{ color: teal[800], textAlign: 'left' }}>
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
