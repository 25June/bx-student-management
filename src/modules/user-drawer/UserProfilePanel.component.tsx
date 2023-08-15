import { User } from 'models/user'
import Box from '@mui/material/Box'
import Chip from '@mui/material/Chip'
import KeyboardBackspaceIcon from '@mui/icons-material/KeyboardBackspace'
import Avatar from '@mui/material/Avatar'
import { buildImageUrl } from 'utils/common'
import { grey, blue, amber } from '@mui/material/colors'
import Typography from '@mui/material/Typography'
import React from 'react'
import EmailIcon from '@mui/icons-material/Email'
import PhoneIcon from '@mui/icons-material/Phone'
import { formatPhone } from 'utils'
import { BaseClassObj, extendedColorPalettes, UserRoles } from 'constant/common'

interface UserProfilePanelComponentProps {
  profile: User
  onClose: () => void
}

const UserProfilePanelComponent = ({ profile, onClose }: UserProfilePanelComponentProps) => {
  return (
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
          src={buildImageUrl(profile.avatarPath, false, true)}
          sx={{ width: 200, height: 200, objectPosition: 'contain', boxShadow: 3 }}
          variant={'rounded'}
        />
      </Box>
      <Box>
        <Box textAlign={'center'} margin={0} color={grey[800]}>
          {profile.saintName}
        </Box>
        <Box textAlign={'center'} component={'h2'} mt={0} color={grey[800]}>
          {`${profile.firstName} ${profile.lastName}`}
        </Box>
        <Box
          textAlign={'center'}
          fontWeight={400}
          fontSize={'0.825rem'}
          color={grey[500]}
          sx={{ marginBottom: 1 }}
        >
          {UserRoles[profile.role]?.title || ''}
        </Box>
        <Box sx={{ display: 'flex', justifyContent: 'center', marginBottom: 2 }}>
          <Chip
            size={'small'}
            label={<b>{profile.classId ? BaseClassObj[profile.classId] : 'Chưa có lớp'}</b>}
            color={(profile.classId.slice(0, 2) as extendedColorPalettes) || 'default'}
          />
        </Box>
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'flex-start',
            alignItems: 'flex-start',
            gap: '1rem',
          }}
        >
          <EmailIcon color={'info'} />
          <Typography fontSize={'1rem'} color={blue[700]} sx={{ wordBreak: 'break-word' }}>
            {profile.email}
          </Typography>
        </Box>
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'flex-start',
            alignItems: 'flex-start',
            gap: '1rem',
          }}
        >
          <PhoneIcon color={'warning'} />
          <Typography fontSize={'1rem'} color={amber[700]}>
            {formatPhone(profile.phoneNumber)}
          </Typography>
        </Box>
      </Box>
    </Box>
  )
}

export default UserProfilePanelComponent
