import React, { useState } from 'react'
import { styled, alpha } from '@mui/material/styles'
import SearchIcon from '@mui/icons-material/Search'
import InputBase from '@mui/material/InputBase'
import ClearIcon from '@mui/icons-material/Clear'
import { debounce } from 'lodash'
import IconButton from '@mui/material/IconButton'

const Search = styled('div')(({ theme }) => ({
  position: 'relative',
  borderRadius: theme.shape.borderRadius,
  boxShadow: 'rgba(0, 0, 0, 0.16) 0px 1px 4px',
  borderWidth: '1px',
  borderStyle: 'solid',
  borderColor: alpha(theme.palette.common.black, 0.15),
  '&:hover': {
    borderColor: alpha(theme.palette.common.black, 0.25),
  },
  marginLeft: 0,
  width: '100%',
  [theme.breakpoints.up('sm')]: {
    width: 'auto',
  },
}))

const SearchIconWrapper = styled('div')(({ theme }) => ({
  padding: theme.spacing(0, 1),
  height: '100%',
  position: 'absolute',
  pointerEvents: 'none',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  color: alpha(theme.palette.common.black, 0.55),
}))

const ClearIconWrapper = styled('div')(({ theme }) => ({
  padding: theme.spacing(0, 1),
  height: '100%',
  cursor: 'pointer',
  display: 'inline-block',
  verticalAlign: 'middle',
  color: alpha(theme.palette.common.black, 0.55),
}))

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: 'inherit',
  '& .MuiInputBase-input': {
    padding: theme.spacing(1, 1, 1, 0),
    // vertical padding + font size from searchIcon
    paddingLeft: `calc(1em + ${theme.spacing(4)})`,
    transition: theme.transitions.create('width'),
    width: '30ch',
    [theme.breakpoints.up('sm')]: {
      width: '15ch',
      '&:focus': {
        width: '25ch',
      },
    },
  },
}))

interface SearchComponentProps {
  onChange: (value: string) => void
}

const SearchComponent = ({ onChange }: SearchComponentProps) => {
  const [value, setValue] = useState<string>('')
  const handleInputChange = debounce(
    (event: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
      onChange(event.target.value)
    },
    700
  )

  const handleReset = () => {
    onChange('')
    setValue('')
  }

  return (
    <Search>
      <SearchIconWrapper>
        <SearchIcon />
      </SearchIconWrapper>
      <StyledInputBase
        placeholder={'Tìm tên thiếu nhi'}
        inputProps={{ 'aria-label': 'search' }}
        onChange={(event) => {
          handleInputChange(event)
          setValue(event.target.value)
        }}
        value={value}
      />
      {value && (
        <ClearIconWrapper>
          <IconButton onClick={handleReset}>
            <ClearIcon />
          </IconButton>
        </ClearIconWrapper>
      )}
    </Search>
  )
}

export default SearchComponent
