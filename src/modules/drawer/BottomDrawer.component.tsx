import {
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  SwipeableDrawer,
} from '@mui/material'
import { UserAction } from 'constant/common'
import EditIcon from '@mui/icons-material/Edit'
import PasswordIcon from '@mui/icons-material/Password'
import SwitchAccessShortcutIcon from '@mui/icons-material/SwitchAccessShortcut'

const Menu = {
  LIST: {
    text: 'Cập nhật thông tin',
    icon: () => <EditIcon color="primary" />,
    onClick: (action: (actionType: UserAction) => void) => action(UserAction.UPDATE_INFO),
  },
  DILIGENT: {
    text: 'Thay đổi mật khẩu',
    icon: () => <PasswordIcon color="primary" />,
    onClick: (action: (actionType: UserAction) => void) => action(UserAction.CHANGE_PASSWORD),
  },
  SCORE: {
    text: 'Reset mật khẩu',
    icon: () => <PasswordIcon color="primary" />,
    onClick: (action: (actionType: UserAction) => void) => action(UserAction.RESET_PASSWORD),
  },
  ASSESSMENT: {
    text: 'Cấp quyền',
    icon: () => <SwitchAccessShortcutIcon color="primary" />,
    onClick: (action: (actionType: UserAction) => void) => action(UserAction.RESET_PASSWORD),
  },
}

interface Props {
  onClickAction: (actionType: UserAction) => void
  open: boolean
  onClose: () => void
}

const BottomDrawer = ({ onClickAction, open, onClose }: Props) => {
  return (
    <SwipeableDrawer
      disableBackdropTransition={true}
      variant="temporary"
      open={open}
      anchor="bottom"
      onClose={() => onClose()}
      onOpen={() => {}}
    >
      <List>
        {Object.values(Menu).map(({ text, icon, onClick }) => {
          return (
            <ListItem key={text} disablePadding={true}>
              <ListItemButton
                onClick={() => {
                  onClick(onClickAction)
                  onClose()
                }}
              >
                <ListItemIcon>{icon()}</ListItemIcon>
                <ListItemText color="primary" primary={text} />
              </ListItemButton>
            </ListItem>
          )
        })}
      </List>
    </SwipeableDrawer>
  )
}

export default BottomDrawer
