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
import { grey, blue, amber } from '@mui/material/colors'
import UpdateInfoDialogComponent from 'modules/user-dialog/UpdateInfoDialog.component'
import { useState } from 'react'
import { User } from 'models/user'
import { buildImageUrl, useIsMobile } from 'utils/common'
import Chip from '@mui/material/Chip'
import AccountBoxIcon from '@mui/icons-material/AccountBox'
import CroppingImageComponent from 'modules/cropping-image/CroppingImage.component'
import EmailIcon from '@mui/icons-material/Email'
import PhoneIcon from '@mui/icons-material/Phone'
import { formatPhone } from 'utils'
import { BaseClassObj, extendedColorPalettes, UserRoles } from 'constant/common'

interface UserDrawerComponentProps {
  onClose: () => void
  open: boolean
}

const UserDrawerComponent = ({ onClose, open }: UserDrawerComponentProps) => {
  const [isOpenUpdateInfoDialog, openUpdateInfoDialog] = useState<boolean>(false)
  const [currentUser, setCurrentUser] = useState<User>()
  const { user } = useAuthentication()
  const signOut = useSignOut()
  const [isOpenCroppingDialog, setOpenCroppingDialog] = useState<boolean>(false)
  const isMobile = useIsMobile()

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

  const handleCloseCroppingDialog = (refreshData?: boolean) => {
    if (refreshData) {
      getUserInfo(user?.id || '').then((res) => {
        if (res) {
          setCurrentUser(res)
        }
      })
    }
    setOpenCroppingDialog(false)
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
          paddingBottom: 5,
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
        <Box data-id={currentUser.id}>
          <Box textAlign={'center'} margin={0} color={grey[800]}>
            {currentUser.saintName}
          </Box>
          <Box textAlign={'center'} component={'h2'} mt={0} color={grey[800]}>
            {`${currentUser.firstName} ${currentUser.lastName}`}
          </Box>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 1 }}>
            <Box
              textAlign={'center'}
              fontWeight={400}
              fontSize={'0.825rem'}
              color={grey[500]}
            >
              {UserRoles[user.role]?.title || ''}
            </Box>
            <Chip
              size={'small'}
              label={<b>{user.classId ? BaseClassObj[user.classId] : 'Chưa có lớp'}</b>}
              color={(user.classId.slice(0, 2) as extendedColorPalettes) || 'default'}
            />
          </Box>
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'flex-start',
              alignItems: 'flex-start',
              gap: '1rem',
              backgroundColor: blue[50],
              padding: '0.25rem',
              borderRadius: 10,
              marginBottom: 1
            }}
          >
            <EmailIcon color={'info'} fontSize={'small'} />
            <Typography fontSize={'0.75rem'} color={blue[700]} sx={{ wordBreak: 'break-word' }} fontWeight={700}>
              {user.email}
            </Typography>
          </Box>
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'flex-start',
              alignItems: 'flex-start',
              gap: '1rem',
              backgroundColor: amber[50],
              padding: '0.25rem',
              borderRadius: 10
            }}
          >
            <PhoneIcon color={'warning'} fontSize={'small'} />
            <Typography fontSize={'0.75rem'} color={amber[700]} fontWeight={700}>
              {formatPhone(user.phoneNumber)}
            </Typography>
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
          startIcon={<AccountBoxIcon />}
          sx={{ justifyContent: 'flex-start' }}
          variant={'outlined'}
          onClick={() => setOpenCroppingDialog(true)}
          disabled={isMobile}
        >
          <Box sx={{ textAlign: 'left' }}>
            <Typography>Chỉnh avatar</Typography>
            <Typography fontSize={'0.75rem'}>Lên máy tính để chỉnh!</Typography>
          </Box>
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
      {currentUser.avatarPath && (
        <CroppingImageComponent
          avatarPath={currentUser.avatarPath}
          userId={currentUser.id}
          isOpen={isOpenCroppingDialog}
          onClose={handleCloseCroppingDialog}
        />
      )}
    </Drawer>
  )
}

export default UserDrawerComponent
