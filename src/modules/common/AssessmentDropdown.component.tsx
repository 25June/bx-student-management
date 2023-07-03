import React, { useEffect, useState } from 'react'
import { Class } from 'models'
import Select, { SelectChangeEvent, SelectProps } from '@mui/material/Select'
import { BaseAssessments } from 'constant/common'
import FormControl from '@mui/material/FormControl'
import InputLabel from '@mui/material/InputLabel'
import MenuItem from '@mui/material/MenuItem'

interface AssessmentDropdownProps {
  assessmentType?: string
  onChangeAssessmentType: (value: string) => void
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
  const [selectedAssessmentType, setAssessmentType] = useState<string>(
    assessmentType || BaseAssessments[0].id
  )
  useEffect(() => {
    if (forSearching) {
      setAssessmentType(defaultValue.id)
    }
  }, [forSearching])

  const changeAssessmentType = (event: SelectChangeEvent) => {
    setAssessmentType(event.target.value)
    onChangeAssessmentType(event.target.value)
  }
  return (
    <FormControl fullWidth={true} size={size}>
      <InputLabel>Bài kiểm tra</InputLabel>
      <Select value={selectedAssessmentType} label="Bài kiểm tra" onChange={changeAssessmentType}>
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
