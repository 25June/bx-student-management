import React from 'react'
import InputLabel from '@mui/material/InputLabel'
import Select, { SelectChangeEvent, SelectProps } from '@mui/material/Select'
import { BaseClasses } from 'constant/common'
import { Class } from 'models'
import MenuItem from '@mui/material/MenuItem'
import FormControl from '@mui/material/FormControl'
import { ThemeProvider, createTheme } from '@mui/material/styles';

interface ClassDropdownProps {
  classObj?: Class
  onChangeClass: (event: SelectChangeEvent) => void
  size?: SelectProps['size']
  useDarkMode?: boolean
}

const theme = (useDarkMode: boolean) => createTheme({
  palette: {
    mode: useDarkMode ? 'dark' : 'light',
  } as any,
});

const ClassDropdownComponent = ({
  classObj = BaseClasses[0],
  onChangeClass,
  size = 'medium',
  useDarkMode = true
}: ClassDropdownProps) => {
  return (
    <ThemeProvider theme={() => theme(useDarkMode)}>
      <FormControl fullWidth={true} size={size} color='primary'>
        <InputLabel>Lớp</InputLabel>
        <Select value={classObj.id} label="Lớp" onChange={onChangeClass}>
          {BaseClasses.map((c: Class) => (
            <MenuItem value={c.id} key={c.name}>
              {c.name}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </ThemeProvider>
  )
}

export default ClassDropdownComponent
