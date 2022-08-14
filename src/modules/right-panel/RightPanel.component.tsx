import React from 'react'
import { Box } from '@mui/material'
import MuiDrawer from '@mui/material/Drawer'

interface RightPanelComponentProps {
  isOpen: boolean
  data: any
  onClose: () => void
}

const RightPanelComponent = ({ isOpen, data, onClose }: RightPanelComponentProps) => {
  if (!data) {
    return null
  }

  return (
    <MuiDrawer
      variant="temporary"
      anchor={'right'}
      open={isOpen}
      onClose={onClose}
      onKeyDown={onClose}
    >
      <Box pt={8} sx={{ width: 400 }}>
        {data.id}
        {data.firstName}
        {data.birthday}
        {data.phone1}
        {data.phone2}
      </Box>
    </MuiDrawer>
  )
}

export default RightPanelComponent
