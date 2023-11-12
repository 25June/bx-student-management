import React from 'react'
import {
  Select,
  SelectChangeEvent,
  SelectProps,
  FormControl,
  InputLabel,
  MenuItem,
} from '@mui/material'
import { formatDisplayDDMM } from 'utils/datetime'
import { KeyValueProp } from 'models/common'

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
            {formatDisplayDDMM(d.value)}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  )
}

export default DateDropdownComponent
