import React from 'react'
import { auth } from '../../firebase'
import { signOut } from 'firebase/auth'
import { useNavigate } from 'react-router-dom'
import { Toolbar, IconButton, Typography } from '@mui/material'
import MenuIcon from '@mui/icons-material/Menu'
import ExitToAppIcon from '@mui/icons-material/ExitToApp'
import { AppBarProps as MuiAppBarProps } from '@mui/material/AppBar/AppBar'
import { styled } from '@mui/material/styles'
import MuiAppBar from '@mui/material/AppBar'
import { drawerWidth } from '../layout/Layout.component'
import { Router } from '../../routes'

interface TopBarComponentProps {
  isOpen: boolean
  setOpen: (value: boolean) => void
}

interface AppBarProps extends MuiAppBarProps {
  open?: boolean
}

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== 'open',
})<AppBarProps>(({ theme, open }) => ({
  zIndex: theme.zIndex.drawer + 1,
  transition: theme.transitions.create(['width', 'margin'], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  ...(open && {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  }),
}))

const TopBarComponent = ({ isOpen, setOpen }: TopBarComponentProps) => {
  const navigate = useNavigate()
  const handleDrawerOpen = () => {
    setOpen(!isOpen)
  }
  const handleSignOut = () => {
    signOut(auth).then(() => {
      console.info('sign out successfully')
      navigate(Router.SIGN_IN)
    })
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
        <Typography variant="h6" noWrap={true} component="div">
          Giáo Lý Bình Xuyên
        </Typography>
        <IconButton
          color="inherit"
          aria-label="open drawer"
          onClick={handleSignOut}
          edge="start"
          sx={{
            marginRight: 5,
          }}
        >
          <ExitToAppIcon />
        </IconButton>
      </Toolbar>
    </AppBar>
  )
}

export default TopBarComponent
