import React, { useState, useEffect } from 'react'
import Select, { SelectChangeEvent, SelectProps } from '@mui/material/Select'
import FormControl from '@mui/material/FormControl'
import InputLabel from '@mui/material/InputLabel'
import MenuItem from '@mui/material/MenuItem'
import { formatDisplayTable } from 'utils/datetime'
import { KeyValueProp } from 'models'

interface DateDropdownProps {
  dates?: KeyValueProp[]
  onChangeDate: (date?: KeyValueProp) => void
  size?: SelectProps['size']
}

const defaultSelectItem: KeyValueProp = {
  key: 'all',
  value: 'Tất cả',
}

const DateDropdownComponent = ({ dates = [], onChangeDate, size }: DateDropdownProps) => {
  const [date, setDate] = useState<string>(defaultSelectItem.value)
  const dateChange = (event: SelectChangeEvent) => {
    setDate(event.target.value)
    onChangeDate(dates.find(({ value }) => value === event.target.value))
  }
  useEffect(() => {
    if (!dates.find(({ value }) => value === date)) {
      setDate(defaultSelectItem.value)
    }
  }, [dates, date])
  return (
    <FormControl fullWidth={true} size={size || 'small'}>
      <InputLabel>Ngày</InputLabel>
      <Select value={date} label="Ngày" onChange={dateChange} disabled={dates.length === 0}>
        <MenuItem value={defaultSelectItem.value} key={defaultSelectItem.key}>
          {defaultSelectItem.value}
        </MenuItem>
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
