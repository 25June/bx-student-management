import React from 'react'
import { Class } from 'models'
import Select, { SelectChangeEvent, SelectProps } from '@mui/material/Select'
import { AssessmentEnum, BaseAssessments } from 'constant/common'
import FormControl from '@mui/material/FormControl'
import InputLabel from '@mui/material/InputLabel'
import MenuItem from '@mui/material/MenuItem'

interface AssessmentDropdownProps {
  assessmentType?: AssessmentEnum
  onChangeAssessmentType: (value: AssessmentEnum) => void
  size?: SelectProps['size']
  forSearching?: boolean
}

const defaultValue = {
  id: 'all',
  name: 'Tất cả',
}

const AssessmentDropdownComponent = ({
  assessmentType,
  onChangeAssessmentType,
  size = 'medium',
  forSearching = false,
}: AssessmentDropdownProps) => {
  const changeAssessmentType = (event: SelectChangeEvent) => {
    onChangeAssessmentType(event.target.value as AssessmentEnum)
  }
  return (
    <FormControl fullWidth={true} size={size}>
      <InputLabel>Bài kiểm tra</InputLabel>
      <Select value={assessmentType || ''} label="Bài kiểm tra" onChange={changeAssessmentType}>
        {forSearching && (
          <MenuItem value={defaultValue.id} key={defaultValue.id}>
            {defaultValue.name}
          </MenuItem>
        )}
        {BaseAssessments.map((c: Class) => (
          <MenuItem value={c.id} key={c.id}>
            {c.name}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  )
}

export default AssessmentDropdownComponent
