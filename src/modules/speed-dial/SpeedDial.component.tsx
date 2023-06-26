import * as React from 'react'
import Box from '@mui/material/Box'
import Backdrop from '@mui/material/Backdrop'
import SpeedDial from '@mui/material/SpeedDial'
import SpeedDialIcon from '@mui/material/SpeedDialIcon'
import PermIdentityIcon from '@mui/icons-material/PermIdentity'
import SpeedDialAction from '@mui/material/SpeedDialAction'
import CoPresentIcon from '@mui/icons-material/CoPresent'
import AssignmentIcon from '@mui/icons-material/Assignment'
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth'

const actions = [
  { icon: <CoPresentIcon />, name: 'Điểm danh', type: 'CHECK_ATTENDANCE' },
  { icon: <PermIdentityIcon />, name: 'Thêm thiếu nhi', type: 'ADD_STUDENT' },
  { icon: <AssignmentIcon />, name: 'Thêm bài kiểm tra', type: 'ADD_ASSESSMENT' },
  { icon: <CalendarMonthIcon />, name: 'Thêm ngày học', type: 'ADD_STUDY_DATE' },
]

const SpeedDialComponent = () => {
  const [open, setOpen] = React.useState(false)
  const handleOpen = () => setOpen(true)
  const handleClose = () => setOpen(false)
  const handleOpenDialog = (type: string) => {
    console.log(type)
    setOpen(false)
  }
  return (
    <Box
      sx={{
        height: open ? 'calc(100vh - 56px)' : 56,
        width: open ? 'calc(100vw - 50px)' : 56,
        transform: 'translateZ(0px)',
        flexGrow: 1,
        position: 'fixed',
        right: 0,
        bottom: 0,
        zIndex: 2,
      }}
    >
      <Backdrop open={open} />
      <SpeedDial
        ariaLabel="SpeedDial tooltip example"
        sx={{ position: 'absolute', bottom: 16, right: 16 }}
        icon={<SpeedDialIcon />}
        onClose={handleClose}
        onOpen={handleOpen}
        open={open}
      >
        {actions.map((action) => (
          <SpeedDialAction
            key={action.name}
            icon={action.icon}
            tooltipTitle={action.name}
            tooltipOpen={true}
            onClick={() => handleOpenDialog(action.type)}
            sx={{
              '.MuiSpeedDialAction-staticTooltipLabel': { whiteSpace: 'nowrap' },
            }}
          />
        ))}
      </SpeedDial>
    </Box>
  )
}

export default SpeedDialComponent
