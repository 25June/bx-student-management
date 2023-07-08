import * as React from 'react'
import Drawer from '@mui/material/Drawer'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import ExitToAppIcon from '@mui/icons-material/ExitToApp'
import EditIcon from '@mui/icons-material/Edit'
import { useSignOut } from 'services/user'
import KeyboardBackspaceIcon from '@mui/icons-material/KeyboardBackspace'
import { useAuthentication } from 'contexts/AuthContext'
import GLVLogo from 'static/images/cards/glv.png'
import { red } from '@mui/material/colors'

interface UserDrawerComponentProps {
  onClose: () => void
  open: boolean
}

const UserDrawerComponent = ({ onClose, open }: UserDrawerComponentProps) => {
  const { user } = useAuthentication()
  const signOut = useSignOut()

  const handleSignOut = () => {
    signOut()
  }
  if (!user) {
    return null
  }

  return (
    <Drawer anchor={'right'} open={open} onClose={onClose}>
      <Box
        sx={{
          boxSizing: 'border-box',
          width: 250,
          paddingTop: 8,
          paddingLeft: 2,
          paddingRight: 2,
          display: 'flex',
          flexDirection: 'column',
          gap: 2,
        }}
      >
        <Box display={'flex'} alignItems={'center'}>
          <Button color={'primary'} onClick={onClose} startIcon={<KeyboardBackspaceIcon />}>
            Back
          </Button>
        </Box>
        <Box display={'flex'}>
          <Box
            component={'img'}
            src={user.avatarPath || GLVLogo}
            alt={'GLV-avatar'}
            sx={{
              width: '100%',
              maxWidth: 200,
              aspectRatio: '1/1',
              objectFit: 'cover',
              margin: '0 auto',
            }}
          />
        </Box>
        <Box>
          <Box textAlign={'center'} margin={0} color={red.A200}>
            {user.email}
          </Box>
          <Box textAlign={'center'} component={'h1'} mt={0} color={red.A200}>
            {`${user.lastName} ${user.firstName}`}
          </Box>
        </Box>
        <Button startIcon={<EditIcon />} sx={{ justifyContent: 'flex-start' }} variant={'outlined'}>
          Cập nhật thông tin
        </Button>
        <Button
          startIcon={<ExitToAppIcon />}
          sx={{ justifyContent: 'flex-start' }}
          onClick={handleSignOut}
          variant={'outlined'}
        >
          Thoát ra
        </Button>
      </Box>
    </Drawer>
  )
}

export default UserDrawerComponent
