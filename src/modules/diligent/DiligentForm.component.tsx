import FormControlLabel from '@mui/material/FormControlLabel'
import { Checkbox, Box } from '@mui/material'
import React from 'react'
import { OnSubmitAttendanceProps } from 'models/diligent'

interface DiligentFormComponentProps {
  rollCallKey: string
  TL: boolean
  GL: boolean
  onSubmitAttendance: (data: OnSubmitAttendanceProps) => void
  disabled: boolean
  studentId: string
}

const DiligentFormComponent = ({
  rollCallKey,
  TL,
  GL,
  onSubmitAttendance,
  disabled,
  studentId,
}: DiligentFormComponentProps) => {
  return (
    <Box sx={{ display: 'flex', justifyContent: 'space-evenly', flexGrow: 2, gap: 1.5 }}>
      <FormControlLabel
        control={
          <Checkbox
            sx={{ padding: 0.5 }}
            size={'small'}
            checked={TL}
            onChange={(event) =>
              onSubmitAttendance({
                value: event.target.checked,
                rollCallKey,
                isMissal: true,
              })
            }
            disabled={disabled}
            id={`TL-${studentId}-${rollCallKey}`}
          />
        }
        label="Thánh Lễ"
        sx={{ margin: 0 }}
        htmlFor={`TL-${studentId}-${rollCallKey}`}
      />

      <FormControlLabel
        control={
          <Checkbox
            sx={{ padding: 0.5 }}
            size={'small'}
            checked={GL}
            onChange={(event) =>
              onSubmitAttendance({
                value: event.target.checked,
                rollCallKey,
                isMissal: false,
              })
            }
            disabled={disabled}
            id={`GL-${studentId}-${rollCallKey}`}
          />
        }
        label={'Giáo Lý'}
        htmlFor={`GL-${studentId}-${rollCallKey}`}
        sx={{ margin: 0 }}
      />
    </Box>
  )
}

export default DiligentFormComponent
