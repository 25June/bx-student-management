import React from 'react'
import Select, { SelectChangeEvent, SelectProps } from '@mui/material/Select'
import FormControl from '@mui/material/FormControl'
import InputLabel from '@mui/material/InputLabel'
import MenuItem from '@mui/material/MenuItem'
import { formatDisplayTable } from 'utils/datetime'
import { KeyValueProp } from 'models'

interface DateDropdownProps {
  dates?: KeyValueProp[]
  selectedDate?: string
  onChangeDate: (date?: KeyValueProp) => void
  size?: SelectProps['size']
}

const DateDropdownComponent = ({
  dates = [],
  onChangeDate,
  selectedDate = '',
  size,
}: DateDropdownProps) => {
  const dateChange = (event: SelectChangeEvent) => {
    onChangeDate(dates.find(({ value }) => value === event.target.value))
  }
  return (
    <FormControl fullWidth={true} size={size || 'small'}>
      <InputLabel>Ngày</InputLabel>
      <Select value={selectedDate} label="Ngày" onChange={dateChange} disabled={dates.length === 0}>
        {dates.map((d: KeyValueProp) => (
          <MenuItem value={d.value} key={d.key}>
            {formatDisplayTable(d.value)}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  )
}

export default DateDropdownComponent
