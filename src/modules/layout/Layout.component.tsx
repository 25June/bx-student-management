import * as React from 'react'
import Box from '@mui/material/Box'
import { TopBarComponent } from '../index'
import DrawerComponent from '../drawer/Drawer.component'

export const drawerWidth = 240

const LayoutComponent = (props: any) => {
  const [isOpen, setOpen] = React.useState(false)

  return (
    <Box sx={{ display: 'flex' }}>
      <TopBarComponent isOpen={isOpen} setOpen={setOpen} />
      <DrawerComponent isOpen={isOpen} />
      <Box component="main" sx={{ pt: 8, pb: 3, width: 'calc(100% - 65px)' }}>
        {props.children}
      </Box>
    </Box>
  )
}

export default LayoutComponent
