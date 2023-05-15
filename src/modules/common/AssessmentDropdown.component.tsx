import React from 'react'
import { Class } from 'models'
import Select, { SelectChangeEvent, SelectProps } from '@mui/material/Select'
import { BaseAssessments } from 'constant/common'
import FormControl from '@mui/material/FormControl'
import InputLabel from '@mui/material/InputLabel'
import MenuItem from '@mui/material/MenuItem'

interface AssessmentDropdownProps {
  assessmentType?: string
  onChangeAssessmentType: (event: SelectChangeEvent) => void
  size?: SelectProps['size']
}

const AssessmentDropdownComponent = ({
  assessmentType = BaseAssessments[0].id,
  onChangeAssessmentType,
  size = 'medium',
}: AssessmentDropdownProps) => {
  return (
    <FormControl fullWidth={true} size={size}>
      <InputLabel>Loại bài kiểm tra</InputLabel>
      <Select value={assessmentType} label="Loại bài kiểm tra" onChange={onChangeAssessmentType}>
        {BaseAssessments.map((c: Class) => (
          <MenuItem value={c.id} key={c.name}>
            {c.name}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  )
}

export default AssessmentDropdownComponent
