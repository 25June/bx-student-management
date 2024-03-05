import React, { useState } from 'react'
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
import { grey } from '@mui/material/colors'
import { FixedSizeList } from 'react-window'
import AutoSizer from 'react-virtualized-auto-sizer'
import BottomDrawer from 'modules/drawer/BottomDrawer.component'

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
  const handleClickMenu = (e: React.MouseEvent<HTMLButtonElement>, row: User) => {
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
    <>
      <Box
        sx={{
          background: 'transparent',
          backdropFilter: 'blur(4px)',
          height: '100%',
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
      <BottomDrawer
        open={!!selectedRow}
        onClose={() => setSelectedRow(undefined)}
        onClickAction={handleClickAction}
      />
    </>
  )
}

export default UserSingleViewComponent
