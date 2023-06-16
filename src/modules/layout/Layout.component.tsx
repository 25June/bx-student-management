import * as React from 'react'
import Box from '@mui/material/Box'
import { TopBarComponent } from '../index'
import DrawerComponent from '../drawer/Drawer.component'
import { PropsWithChildren } from 'react'
import { useIsMobile } from 'utils/common'

export const drawerWidth = 240

const LayoutComponent = ({ children }: PropsWithChildren) => {
  const [isOpen, setOpen] = React.useState(false)
  const isMobile = useIsMobile()

  return (
    <Box sx={{ display: 'flex' }}>
      <TopBarComponent isOpen={isOpen} setOpen={setOpen} />
      <DrawerComponent isOpen={isOpen} />
      <Box
        component="main"
        sx={{
          pt: 8,
          pb: 3,
          width: isMobile ? 'calc(100% - 49px)' : 'calc(100% - 65px)',
          height: 'calc(100% - 64px)',
          pr: 1,
          pl: 1,
          boxSizing: 'border-box',
        }}
      >
        {children}
      </Box>
    </Box>
  )
}

export default LayoutComponent
