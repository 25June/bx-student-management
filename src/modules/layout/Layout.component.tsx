import React, { useState, PropsWithChildren } from 'react'
import { Box, CircularProgress } from '@mui/material'
import TopBarComponent from 'modules/topBar/TopBar.component'
import DrawerComponent from '../drawer/Drawer.component'
import { useIsMobile } from 'utils/common'
import SpeedDialComponent from 'modules/speed-dial/SpeedDial.component'
import UserDrawerComponent from 'modules/user-drawer/UserDrawer.component'
// import ChienConBackground from 'static/images/cards/chien-con-no-white-bg.svg'
import { useAuthentication } from 'contexts/AuthContext'

export const drawerWidth = 240
const backgroundURL =
  'https://firebasestorage.googleapis.com/v0/b/bx-management.appspot.com/o/10005181-ai.png?alt=media&token=82881624-ed16-416a-bd0f-64758ce977c2'
const LayoutComponent = ({ children }: PropsWithChildren) => {
  const [isOpen, setOpen] = useState<boolean>(false)
  const [openUserDrawer, setOpenUserDrawer] = useState<boolean>(false)
  const isMobile = useIsMobile()
  const { isSignedIn } = useAuthentication()
  if (!isSignedIn) {
    return (
      <Box
        sx={{
          width: '100vw',
          height: '100vh',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <CircularProgress />
      </Box>
    )
  }
  return (
    <Box sx={{ position: 'relative' }}>
      <Box sx={{ zIndex: 1, display: 'flex', position: 'relative' }}>
        <TopBarComponent
          isOpen={isOpen}
          setOpen={setOpen}
          openUserDrawer={() => setOpenUserDrawer(true)}
        />
        <DrawerComponent isOpen={isOpen} setOpen={setOpen} />
        <UserDrawerComponent open={openUserDrawer} onClose={() => setOpenUserDrawer(false)} />
        <Box
          component="main"
          sx={{
            pt: 8,
            pb: 1,
            width: isMobile ? 'calc(100% - 49px)' : 'calc(100% - 65px)',
            height: 'calc(100% - 64px)',
            pr: 1,
            pl: 1,
            boxSizing: 'border-box',
          }}
        >
          {children}
        </Box>
        <SpeedDialComponent />
      </Box>

      <Box
        component={'img'}
        src={backgroundURL}
        alt={'chien-con-background'}
        sx={{ position: 'fixed', bottom: 8, right: 30, width: 200, height: 200, opacity: 0.75 }}
      />
    </Box>
  )
}

export default LayoutComponent
