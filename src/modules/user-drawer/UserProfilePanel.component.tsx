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
import { formatPhone } from 'utils/formatDataForTable'
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
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: 1,
          }}
        >
          <Box textAlign={'center'} fontWeight={400} fontSize={'0.825rem'} color={grey[500]}>
            {UserRoles[profile.role]?.title || ''}
          </Box>
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
            backgroundColor: blue[50],
            padding: '0.25rem',
            borderRadius: 10,
            marginBottom: 1,
          }}
        >
          <EmailIcon color={'info'} fontSize={'small'} />
          <Typography
            fontSize={'0.75rem'}
            color={blue[700]}
            sx={{ wordBreak: 'break-word' }}
            fontWeight={700}
          >
            {profile.email}
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
            borderRadius: 10,
          }}
        >
          <PhoneIcon color={'warning'} fontSize={'small'} />
          <Typography fontSize={'0.75rem'} color={amber[700]} fontWeight={700}>
            {formatPhone(profile.phoneNumber)}
          </Typography>
        </Box>
      </Box>
    </Box>
  )
}

export default UserProfilePanelComponent
