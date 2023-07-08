import * as React from 'react'
import Box from '@mui/material/Box'
import { TopBarComponent } from '../index'
import DrawerComponent from '../drawer/Drawer.component'
import { PropsWithChildren } from 'react'
import { useIsMobile } from 'utils/common'
import SpeedDialComponent from 'modules/speed-dial/SpeedDial.component'
import UserDrawerComponent from 'modules/user-drawer/UserDrawer.component'

export const drawerWidth = 240

const LayoutComponent = ({ children }: PropsWithChildren) => {
  const [isOpen, setOpen] = React.useState<boolean>(false)
  const [openUserDrawer, setOpenUserDrawer] = React.useState<boolean>(false)
  const isMobile = useIsMobile()

  return (
    <Box sx={{ display: 'flex' }}>
      <TopBarComponent
        isOpen={isOpen}
        setOpen={setOpen}
        openUserDrawer={() => setOpenUserDrawer(true)}
      />
      <DrawerComponent isOpen={isOpen} />
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
  )
}

export default LayoutComponent
