import React from 'react'
import Select, { SelectChangeEvent, SelectProps } from '@mui/material/Select'
import { BaseClasses } from 'constant/common'
import { Class } from 'models'
import MenuItem from '@mui/material/MenuItem'
import FormControl from '@mui/material/FormControl'
import { ThemeProvider, createTheme } from '@mui/material/styles'

interface Props {
  classObj?: Class
  onChangeClass: (event: SelectChangeEvent) => void
  size?: SelectProps['size']
  useDarkMode?: boolean
  formVariant?: 'standard' | 'outlined' | 'filled'
}

const theme = (useDarkMode: boolean) =>
  createTheme({
    palette: {
      mode: useDarkMode ? 'dark' : 'light',
    } as any,
  })

const ClassDropdownComponent = ({
  classObj = BaseClasses[0],
  onChangeClass,
  size = 'medium',
  useDarkMode = true,
  formVariant = 'outlined',
}: Props) => {
  return (
    <ThemeProvider theme={() => theme(useDarkMode)}>
      <FormControl variant={formVariant} fullWidth={true} size={size} color="primary">
        <Select value={classObj.id} onChange={onChangeClass}>
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
