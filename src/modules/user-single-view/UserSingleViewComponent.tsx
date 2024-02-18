import React, { useState } from 'react'
// import List from '@mui/material/List'
import { Box } from '@mui/material'
import { User } from 'models/user'
import ListItem from '@mui/material/ListItem'
import IconButton from '@mui/material/IconButton'
import ListItemAvatar from '@mui/material/ListItemAvatar'
import Avatar from '@mui/material/Avatar'
import { BaseClassObj, extendedColorPalettes, UserAction, UserRoles } from 'constant/common'
import Typography from '@mui/material/Typography'
import ListItemText from '@mui/material/ListItemText'
import Divider from '@mui/material/Divider'
import MoreVertIcon from '@mui/icons-material/MoreVert'
import { buildImageUrl } from 'utils/common'
import Chip from '@mui/material/Chip'
import Menu from '@mui/material/Menu'
import MenuItem from '@mui/material/MenuItem'
import EditIcon from '@mui/icons-material/Edit'
import PasswordIcon from '@mui/icons-material/Password'
import SwitchAccessShortcutIcon from '@mui/icons-material/SwitchAccessShortcut'
import { useAuthentication } from 'contexts/AuthContext'
import { Role } from 'constant/common'
import { grey } from '@mui/material/colors'

import { FixedSizeList } from 'react-window'
import AutoSizer from 'react-virtualized-auto-sizer'

interface PrimaryTextProps {
  saintName: string
  firstName: string
  lastName: string
}

const PrimaryText = ({ saintName, firstName, lastName }: PrimaryTextProps) => {
  return <Typography>{`${saintName} ${firstName} ${lastName}`}</Typography>
}

interface SecondaryTextProps {
  role: number
  classId: string
}

const SecondaryText = ({ role, classId }: SecondaryTextProps) => {
  return (
    <Box sx={{ display: 'flex', gap: 0.25, justifyContent: 'space-between', alignItems: 'center' }}>
      <Box fontWeight={500} fontSize={'0.825rem'} component={'span'} color={grey[700]}>
        {UserRoles[role]?.title || ''}
      </Box>
      <Chip
        size={'small'}
        label={<b>{classId ? BaseClassObj[classId] : 'Chưa có lớp'}</b>}
        color={(classId.slice(0, 2) as extendedColorPalettes) || 'default'}
      />
    </Box>
  )
}

const UserItem = ({
  user,
  onClickMenu,
  onClickAction,
}: {
  user: User
  onClickMenu: (event: any, user: User) => void
  onClickAction: (action: string, selectedRow: User) => void
}) => {
  return (
    <Box
      sx={{
        background: 'transparent',
        backdropFilter: 'blur(2px)',
      }}
    >
      <ListItem
        disableGutters={true}
        secondaryAction={
          <IconButton
            aria-label={'Menu'}
            onClick={(e) => onClickMenu(e, user)}
            size={'small'}
            color={'primary'}
          >
            <MoreVertIcon fontSize={'small'} />
          </IconButton>
        }
      >
        <ListItemAvatar onClick={() => onClickAction(UserAction.VIEW_PROFILE, user)}>
          <Avatar src={buildImageUrl(user.avatarPath, false, true)} sx={{ boxShadow: 2 }} />
        </ListItemAvatar>
        <ListItemText
          onClick={() => onClickAction(UserAction.VIEW_PROFILE, user)}
          primary={
            <PrimaryText saintName={''} firstName={user.firstName} lastName={user.lastName} />
          }
          disableTypography={true}
          secondary={<SecondaryText classId={user.classId || ''} role={user.role} />}
        />
      </ListItem>
      <Divider variant="middle" />
    </Box>
  )
}

interface UserSingleViewComponentProps {
  users: User[]
  onClickAction: (action: string, selectedRow: User) => void
}

const UserSingleViewComponent = ({ users, onClickAction }: UserSingleViewComponentProps) => {
  const [selectedRow, setSelectedRow] = useState<User>()
  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null)
  const { user: currentUser } = useAuthentication()
  const handleClickMenu = (e: React.MouseEvent<HTMLButtonElement>, row: User) => {
    setAnchorEl(e.currentTarget)
    setSelectedRow(row)
  }

  const handleClickAction = (type: any) => {
    if (selectedRow) {
      onClickAction(type, selectedRow)
      setTimeout(() => {
        setSelectedRow(undefined)
      }, 0)
    }
  }

  return (
    <Box>
      <Box
        sx={{
          background: 'transparent',
          backdropFilter: 'blur(4px)',
          height: 'calc(100vh - 272px)',
          WebkitMask: 'linear-gradient(0deg,#0000,#000 5% 95%,#0000)',
        }}
      >
        <AutoSizer>
          {({ height, width }: any) => (
            <FixedSizeList
              height={height}
              itemCount={(users || []).length}
              itemSize={80}
              width={width}
            >
              {({ index, style }) => (
                <div style={style}>
                  <UserItem
                    key={users[index].id}
                    user={users[index]}
                    onClickAction={onClickAction}
                    onClickMenu={handleClickMenu}
                  />
                </div>
              )}
            </FixedSizeList>
          )}
        </AutoSizer>
      </Box>
      {selectedRow && currentUser?.role === Role.CTO && (
        <Menu open={!!selectedRow} anchorEl={anchorEl} onClose={() => setSelectedRow(undefined)}>
          <MenuItem onClick={() => handleClickAction(UserAction.UPDATE_INFO)}>
            <Box display={'flex'} alignItems={'center'} gap={2}>
              <EditIcon fontSize="small" color={'info'} />
              <Typography fontSize={'0.875rem'}>Cập nhật thông tin</Typography>
            </Box>
          </MenuItem>
          <MenuItem onClick={() => handleClickAction(UserAction.CHANGE_PASSWORD)}>
            <Box display={'flex'} alignItems={'center'} gap={2}>
              <PasswordIcon fontSize="small" color={'info'} />
              <Typography fontSize={'0.875rem'}>Thay đổi mật khẩu</Typography>
            </Box>
          </MenuItem>
          <MenuItem onClick={() => handleClickAction(UserAction.RESET_PASSWORD)}>
            <Box display={'flex'} alignItems={'center'} gap={2}>
              <PasswordIcon fontSize="small" color={'info'} />
              <Typography fontSize={'0.875rem'}>Reset mật khẩu</Typography>
            </Box>
          </MenuItem>
          <MenuItem onClick={() => handleClickAction(UserAction.GRANT_PERMISSION)}>
            <Box display={'flex'} alignItems={'center'} gap={2}>
              <SwitchAccessShortcutIcon fontSize="small" color={'info'} />
              <Typography fontSize={'0.875rem'}>Cấp quyền</Typography>
            </Box>
          </MenuItem>
        </Menu>
      )}
    </Box>
  )
}

export default UserSingleViewComponent
