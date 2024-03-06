import React, { useState } from 'react'
import { styled, alpha } from '@mui/material/styles'
import SearchIcon from '@mui/icons-material/Search'
import InputBase from '@mui/material/InputBase'
import ClearIcon from '@mui/icons-material/Clear'
import { debounce } from 'lodash'
import IconButton from '@mui/material/IconButton'
import { toLowerCaseNonAccentVietnamese, useIsMobile } from 'utils/common'

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
  display: 'flex',
  [theme.breakpoints.up('sm')]: {
    width: '100%',
  },
}))

const SearchIconWrapper = styled('div')(({ theme }) => ({
  padding: theme.spacing(0, 1),
  height: '100%',
  position: 'relative',
  pointerEvents: 'none',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  minHeight: 40,
  color: alpha(theme.palette.common.black, 0.55),
}))

const ClearIconWrapper = styled('div', { shouldForwardProp: (props) => props !== 'isMobile' })<{
  isMobile: boolean
}>(({ theme, isMobile }) => ({
  padding: isMobile ? theme.spacing(0, 0) : theme.spacing(0, 1),
  height: '100%',
  cursor: 'pointer',
  display: 'inline-block',
  verticalAlign: 'middle',
  color: alpha(theme.palette.common.black, 0.55),
}))

const StyledInputBase = styled(InputBase, { shouldForwardProp: (props) => props !== 'isMobile' })<{
  isMobile: boolean
}>(({ theme, isMobile }) => ({
  color: 'inherit',
  flexGrow: 1,
  '& .MuiInputBase-input': {
    padding: isMobile ? theme.spacing(1, 1, 1, 2) : theme.spacing(0.5, 0.5, 0.5, 1),
    transition: theme.transitions.create('width'),
    width: '100%',
  },
}))

interface SearchComponentProps {
  onChange: (value: string) => void
  label?: string
}

const SearchComponent = ({ onChange, label }: SearchComponentProps) => {
  const [value, setValue] = useState<string>('')
  const isMobile = useIsMobile()
  const handleInputChange = (event: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
    onChange(toLowerCaseNonAccentVietnamese(event.target.value))
    setValue(event.target.value)
  }

  const handleReset = () => {
    onChange('')
    setValue('')
    const searchBar = document.getElementById('search-bar') as HTMLInputElement
    if (searchBar.value) {
      searchBar.value = ''
    }
  }

  return (
    <Search>
      <SearchIconWrapper>
        <SearchIcon />
      </SearchIconWrapper>
      <StyledInputBase
        id={'search-bar'}
        placeholder={label || 'Tìm tên thiếu nhi'}
        inputProps={{ 'aria-label': 'search' }}
        onChange={debounce(handleInputChange, 500)}
        isMobile={isMobile}
      />
      {value && (
        <ClearIconWrapper isMobile={isMobile}>
          <IconButton onClick={handleReset}>
            <ClearIcon />
          </IconButton>
        </ClearIconWrapper>
      )}
    </Search>
  )
}

export default SearchComponent
