import FormControlLabel from '@mui/material/FormControlLabel'
import { Checkbox } from '@mui/material'
import React from 'react'
import { OnSubmitAttendanceProps } from 'modules/common/AttendanceCheckbox.component'

interface DiligentFormComponentProps {
  rollCallKey: string
  TL: boolean
  GL: boolean
  onSubmitAttendance: (data: OnSubmitAttendanceProps) => void
}

const DiligentFormComponent = ({
  rollCallKey,
  TL,
  GL,
  onSubmitAttendance,
}: DiligentFormComponentProps) => {
  return (
    <>
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
          />
        }
        label="Thánh Lễ"
        sx={{ margin: 0 }}
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
          />
        }
        label={'Giáo Lý'}
        sx={{ margin: 0 }}
      />
    </>
  )
}

export default DiligentFormComponent
