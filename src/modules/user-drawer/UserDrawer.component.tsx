import React, { useEffect } from 'react'
import Drawer from '@mui/material/Drawer'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Typography from '@mui/material/Typography'
import Avatar from '@mui/material/Avatar'
import ExitToAppIcon from '@mui/icons-material/ExitToApp'
import EditIcon from '@mui/icons-material/Edit'
import { getUserInfo, useSignOut } from 'services/user'
import KeyboardBackspaceIcon from '@mui/icons-material/KeyboardBackspace'
import { useAuthentication } from 'contexts/AuthContext'
import { grey } from '@mui/material/colors'
import UpdateInfoDialogComponent from 'modules/user-dialog/UpdateInfoDialog.component'
import { useState } from 'react'
import { User } from 'models/user'
import { buildImageUrl } from 'utils/common'
import Chip from '@mui/material/Chip'

interface UserDrawerComponentProps {
  onClose: () => void
  open: boolean
}

const UserDrawerComponent = ({ onClose, open }: UserDrawerComponentProps) => {
  const [isOpenUpdateInfoDialog, openUpdateInfoDialog] = useState<boolean>(false)
  const [currentUser, setCurrentUser] = useState<User>()
  const { user } = useAuthentication()
  const signOut = useSignOut()

  useEffect(() => {
    if (user && user.id) {
      getUserInfo(user.id).then((res) => {
        if (res) {
          setCurrentUser(res)
        }
      })
    }
  }, [user])

  const handleSignOut = () => {
    signOut()
  }

  const handleCloseUpdateDialog = (refreshData?: boolean) => {
    if (refreshData && user && user.id) {
      getUserInfo(user.id).then((res) => {
        if (res) {
          setCurrentUser(res)
        }
      })
    }
    openUpdateInfoDialog(false)
  }

  if (!user || !currentUser) {
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
          <Chip
            color={'default'}
            size={'small'}
            icon={<KeyboardBackspaceIcon />}
            onClick={onClose}
            label="Trở về"
            variant="outlined"
          />
        </Box>
        <Box sx={{ textAlign: 'center', '.MuiAvatar-root': { margin: '0 auto' } }}>
          <Avatar
            src={buildImageUrl(currentUser.avatarPath, false, true)}
            sx={{ width: 200, height: 200, objectPosition: 'contain' }}
            variant={'rounded'}
          />
        </Box>
        <Box>
          <Box textAlign={'center'} margin={0} color={grey[800]}>
            {currentUser.saintName}
          </Box>
          <Box textAlign={'center'} component={'h2'} mt={0} color={grey[800]}>
            {`${currentUser.firstName} ${currentUser.lastName}`}
          </Box>
          <Typography fontSize={'0.825rem'}>{currentUser.email}</Typography>
          <Typography fontSize={'0.825rem'}>{currentUser.phoneNumber}</Typography>
        </Box>
        <Button
          startIcon={<EditIcon />}
          sx={{ justifyContent: 'flex-start' }}
          variant={'outlined'}
          onClick={() => openUpdateInfoDialog(true)}
        >
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
      {currentUser && (
        <UpdateInfoDialogComponent
          onClose={handleCloseUpdateDialog}
          isOpen={isOpenUpdateInfoDialog}
          user={currentUser}
        />
      )}
    </Drawer>
  )
}

export default UserDrawerComponent
