import React from 'react'
import FormControl from '@mui/material/FormControl'
import InputLabel from '@mui/material/InputLabel'
import Select, { SelectChangeEvent, SelectProps } from '@mui/material/Select'
import MenuItem from '@mui/material/MenuItem'

interface MonthDropdownComponentProps {
  selectedMonth: string
  dates: string[]
  onChangeMonth: (event: SelectChangeEvent | string) => void
  size?: SelectProps['size']
}

const MonthDropdownComponent = ({
  selectedMonth,
  dates,
  onChangeMonth,
  size = 'small',
}: MonthDropdownComponentProps) => {
  return (
    <FormControl fullWidth={true} size={size} sx={{ maxWidth: '150px' }}>
      <InputLabel shrink={true}>Thời điểm</InputLabel>
      <Select value={selectedMonth} label="Thời điểm" onChange={onChangeMonth}>
        {dates.map((date: string) => (
          <MenuItem value={date} key={date}>
            {date}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  )
}

export default MonthDropdownComponent
