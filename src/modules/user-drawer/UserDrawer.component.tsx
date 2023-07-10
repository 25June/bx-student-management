import React, { useEffect } from 'react'
import Drawer from '@mui/material/Drawer'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import ExitToAppIcon from '@mui/icons-material/ExitToApp'
import EditIcon from '@mui/icons-material/Edit'
import { getUserInfo, useSignOut } from 'services/user'
import KeyboardBackspaceIcon from '@mui/icons-material/KeyboardBackspace'
import { useAuthentication } from 'contexts/AuthContext'
import { blue } from '@mui/material/colors'
import UpdateInfoDialogComponent from 'modules/user-dialog/UpdateInfoDialog.component'
import { useState } from 'react'
import { User } from 'models/user'
import { ImageBoxComponent } from 'modules/index'

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
          console.log(res)
          setCurrentUser(res)
        }
      })
    }
  }, [user])

  const handleSignOut = () => {
    signOut()
  }

  const handleCloseUpdateDialog = (refreshData?: boolean) => {
    openUpdateInfoDialog(false)
    if (refreshData) {
      // fetchUsers()
      console.log(refreshData)
    }
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
          <ImageBoxComponent imagePath={user.avatarPath} isGLV={true} maxWidth={200} />
        </Box>
        <Box>
          <Box textAlign={'center'} margin={0} color={blue[800]}>
            {user.email}
          </Box>
          <Box textAlign={'center'} component={'h1'} mt={0} color={blue[800]}>
            {`${user.firstName} ${user.lastName}`}
          </Box>
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
