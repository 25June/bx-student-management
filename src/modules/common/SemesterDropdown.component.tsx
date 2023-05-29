import React from 'react'
import FormControl from '@mui/material/FormControl'
import InputLabel from '@mui/material/InputLabel'
import Select, { SelectChangeEvent, SelectProps } from '@mui/material/Select'
import MenuItem from '@mui/material/MenuItem'

interface SemesterDropdownComponentProps {
  selectedSemester: string
  onChangeSemester: (event: SelectChangeEvent) => void
  size?: SelectProps['size']
}

const Semesters = [
  {
    key: 'hk1',
    label: 'Học Kỳ 1',
  },
  {
    key: 'hk2',
    label: 'Học Kỳ 2',
  },
]

const SemesterDropdownComponent = ({
  selectedSemester,
  onChangeSemester,
  size = 'medium',
}: SemesterDropdownComponentProps) => {
  return (
    <FormControl fullWidth={true} size={size} sx={{ maxWidth: '150px' }}>
      <InputLabel shrink={true}>Học kỳ</InputLabel>
      <Select value={selectedSemester} label="Học kỳ" onChange={onChangeSemester}>
        {Semesters.map(({ key, label }) => (
          <MenuItem value={key} key={key}>
            {label}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  )
}

export default SemesterDropdownComponent
