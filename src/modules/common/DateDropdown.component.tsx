import React, { useState, useEffect } from 'react'
import Select, { SelectChangeEvent, SelectProps } from '@mui/material/Select'
import FormControl from '@mui/material/FormControl'
import InputLabel from '@mui/material/InputLabel'
import MenuItem from '@mui/material/MenuItem'
import { formatDisplayTable } from 'utils/datetime'

interface DateDropdownProps {
  dates: string[]
  onChangeDate: (value: string) => void
  size?: SelectProps['size']
}

const defaultSelectItem = {
  key: 'all',
  value: 'Tất cả',
}

const DateDropdownComponent = ({ dates, onChangeDate, size }: DateDropdownProps) => {
  const [date, setDate] = useState<string>(defaultSelectItem.value)
  const dateChange = (event: SelectChangeEvent) => {
    setDate(event.target.value)
    onChangeDate(event.target.value)
  }
  useEffect(() => {
    if (!dates.includes(date)) {
      setDate(defaultSelectItem.value)
    }
  }, [dates, date])
  return (
    <FormControl fullWidth={true} size={size || 'small'}>
      <InputLabel>Ngày</InputLabel>
      <Select value={date} label="Ngày" onChange={dateChange}>
        <MenuItem value={defaultSelectItem.value} key={defaultSelectItem.key}>
          {defaultSelectItem.value}
        </MenuItem>
        {dates.map((d: string) => (
          <MenuItem value={d} key={d}>
            {formatDisplayTable(d)}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  )
}

export default DateDropdownComponent
