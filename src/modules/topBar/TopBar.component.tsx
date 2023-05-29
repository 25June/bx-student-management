import React from 'react'
import { auth } from '../../firebase'
import { signOut } from 'firebase/auth'
import { useNavigate } from 'react-router-dom'
import { Toolbar, IconButton, Typography } from '@mui/material'
import Box from '@mui/material/Box'
import MenuIcon from '@mui/icons-material/Menu'
import ExitToAppIcon from '@mui/icons-material/ExitToApp'
import { AppBarProps as MuiAppBarProps } from '@mui/material/AppBar/AppBar'
import { styled } from '@mui/material/styles'
import MuiAppBar from '@mui/material/AppBar'
import { Router } from 'routes'
import ClassDropdownComponent from 'modules/common/ClassDropdown.component'
import { useClassContext } from 'contexts/ClassContext'
import { SelectChangeEvent } from '@mui/material/Select'

interface TopBarComponentProps {
  isOpen: boolean
  setOpen: (value: boolean) => void
}

interface AppBarProps extends MuiAppBarProps {
  open?: boolean
}

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== 'open',
})<AppBarProps>(({ theme }) => ({
  zIndex: theme.zIndex.drawer + 1,
  transition: theme.transitions.create(['width', 'margin'], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
}))

const TopBarComponent = ({ isOpen, setOpen }: TopBarComponentProps) => {
  const navigate = useNavigate()
  const { classObj, setClassId } = useClassContext()
  const handleDrawerOpen = () => {
    setOpen(!isOpen)
  }
  const handleSignOut = () => {
    signOut(auth).then(() => {
      console.info('sign out successfully')
      navigate(Router.SIGN_IN)
    })
  }

  const handleChangeClassId = (event: SelectChangeEvent) => {
    setClassId(event.target.value)
  }

  return (
    <AppBar position="fixed" open={isOpen}>
      <Toolbar>
        <IconButton
          color="inherit"
          aria-label="open drawer"
          onClick={handleDrawerOpen}
          edge="start"
          sx={{
            marginRight: 5,
          }}
        >
          <MenuIcon />
        </IconButton>
        <Box
          sx={{
            width: '100%',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <Box
            sx={{
              width: '100%',
              display: 'flex',
              alignItems: 'center',
            }}
            gap={2}
          >
            <Typography variant="h6" noWrap={true}>
              Giáo Lý Bình Xuyên
            </Typography>
            <Box maxWidth={200}>
              <ClassDropdownComponent
                classObj={classObj}
                onChangeClass={handleChangeClassId}
                size={'small'}
              />
            </Box>
          </Box>
          <IconButton color="inherit" aria-label="open drawer" onClick={handleSignOut} edge="start">
            <ExitToAppIcon />
          </IconButton>
        </Box>
      </Toolbar>
    </AppBar>
  )
}

export default TopBarComponent
