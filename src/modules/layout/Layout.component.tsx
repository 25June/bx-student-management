import React, { useState } from 'react'
import Box from '@mui/material/Box'
import { TopBarComponent } from '../index'
import DrawerComponent from '../drawer/Drawer.component'
import CircularProgress from '@mui/material/CircularProgress'
import { PropsWithChildren } from 'react'
import { useIsMobile } from 'utils/common'
import SpeedDialComponent from 'modules/speed-dial/SpeedDial.component'
import UserDrawerComponent from 'modules/user-drawer/UserDrawer.component'
// import ChienConBackground from 'static/images/cards/chien-con-no-white-bg.svg'
import { useAuthentication } from 'contexts/AuthContext'

export const drawerWidth = 240
const backgroundURL =
  'https://firebasestorage.googleapis.com/v0/b/bx-management.appspot.com/o/email-images%2Fchristmas-tree-bg.png?alt=media&token=c45f52a4-d2d1-4eff-ad60-2b8695e9f4c7'

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
            pb: isMobile ? 10 : 3,
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
