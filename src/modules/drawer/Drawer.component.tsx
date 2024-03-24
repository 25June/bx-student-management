import React, { useState, useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import {
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  CSSObject,
  styled,
  Theme,
  Typography,
} from '@mui/material'
import MuiDrawer from '@mui/material/Drawer'
import { drawerWidth } from '../layout/Layout.component'
import { Router } from 'routes'
import { DialogType, SemesterObj } from 'constant/common'
import { useIsMobile } from 'utils/common'
import { blue, grey } from '@mui/material/colors'
import { debounce } from 'lodash'
import SettingsIcon from '@mui/icons-material/Settings'
import { useDialogContext } from 'contexts/DialogContext'
import { useClassContext } from 'contexts/ClassContext'
import HolyGrailIcon from 'modules/common/HolyGrailIcon'
import HolyBibleIcon from 'modules/common/HolyBibleIcon'
import StudentIcon from 'modules/common/StudentIcon'
import RiceIcon from 'modules/common/RiceIcon'
// import ApostlesIcon from 'modules/common/ApostlesIcon'
// import BellIcon from 'modules/common/BellIcon'
import PrayIcon from 'modules/common/PrayIcon'
import CandleIcon from 'modules/common/CandleIcon'
import DashboardIcon from '@mui/icons-material/Dashboard'

interface DrawerComponentProps {
  isOpen: boolean
  setOpen: (value: boolean) => void
}

const Menu = {
  DASHBOARD: {
    text: 'Tổng Quan',
    icon: (isActive: boolean) => <DashboardIcon color={isActive ? 'primary' : undefined} />,
    to: Router.DASHBOARD,
  },
  LIST: {
    text: 'Danh Sách',
    icon: (isActive: boolean) => <StudentIcon color={isActive ? 'primary' : undefined} />,
    to: Router.HOME,
  },
  DILIGENT: {
    text: 'Điểm Chuyên Cần',
    icon: (isActive: boolean) => <HolyGrailIcon color={isActive ? 'primary' : undefined} />,
    to: Router.DILIGENT,
  },
  SCORE: {
    text: 'Điểm Học Tập',
    icon: (isActive: boolean) => <HolyBibleIcon color={isActive ? 'primary' : undefined} />,
    to: Router.SCORE_BOOK,
  },
  ASSESSMENT: {
    text: 'Bài Kiểm Tra',
    icon: (isActive: boolean) => <RiceIcon color={isActive ? 'primary' : undefined} />,
    to: Router.ASSESSMENT,
  },
  IMPORT: {
    text: 'Tổng Kết',
    icon: (isActive: boolean) => <PrayIcon color={isActive ? 'primary' : undefined} />,
    to: Router.REPORT,
  },
  USER: {
    text: 'Giáo Lý Viên',
    icon: (isActive: boolean) => <CandleIcon color={isActive ? 'primary' : undefined} />,
    to: Router.USER,
  },
}

const openedMixin = (theme: Theme): CSSObject => ({
  width: drawerWidth,
  transition: theme.transitions.create('width', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.enteringScreen,
  }),
  height: '100vh',
  overflowX: 'hidden',
})

const closedMixin = (theme: Theme): CSSObject => ({
  transition: theme.transitions.create('width', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  overflowX: 'hidden',
  width: `calc(${theme.spacing(8)} + 1px)`,
  [theme.breakpoints.down('md')]: {
    width: `calc(${theme.spacing(6)} + 1px)`,
  },
})

const Drawer = styled(MuiDrawer, { shouldForwardProp: (prop) => prop !== 'open' })(
  ({ theme, open }) => ({
    width: drawerWidth,
    flexShrink: 0,
    whiteSpace: 'nowrap',
    boxSizing: 'border-box',
    ...(open && {
      ...openedMixin(theme),
      '& .MuiDrawer-paper': openedMixin(theme),
    }),
    ...(!open && {
      ...closedMixin(theme),
      '& .MuiDrawer-paper': closedMixin(theme),
    }),
  })
)

const DrawerComponent = ({ isOpen, setOpen }: DrawerComponentProps) => {
  const { semesterId, schoolYearId } = useClassContext()
  const { openDialog } = useDialogContext()
  const navigate = useNavigate()
  const location = useLocation()
  const isMobile = useIsMobile()
  const [showScroll, setShowScroll] = useState<boolean>(false)
  useEffect(() => {
    const eventHandler = () => {
      if (!showScroll) {
        setShowScroll(window.scrollY > 0)
      }
    }
    window.addEventListener('scroll', debounce(eventHandler, 200))

    return () => window.removeEventListener('scroll', eventHandler)
  }, [showScroll])
  const schoolYearLabel = `${SemesterObj[semesterId]} (${schoolYearId.slice(
    2,
    4
  )} - ${schoolYearId.slice(7, 9)})`
  return (
    <Drawer variant="permanent" open={isOpen}>
      <List sx={{ paddingTop: 8, height: '100vh' }}>
        {Object.values(Menu).map(({ text, icon, to }) => {
          return (
            <ListItem key={text} disablePadding={true}>
              <ListItemButton
                selected={to === location.pathname}
                onClick={() => {
                  setTimeout(() => navigate(to), 100)
                  Promise.resolve().then(() => setOpen(false))
                }}
                sx={{
                  height: 48,
                  justifyContent: isOpen ? 'initial' : 'center',
                  px: isMobile ? 1.5 : 2.5,
                  width: 48,
                }}
              >
                <ListItemIcon
                  sx={{
                    minWidth: 0,
                    mr: isOpen ? 3 : 'auto',
                    justifyContent: 'center',
                  }}
                >
                  {icon(to === location.pathname)}
                </ListItemIcon>
                <ListItemText
                  primary={text}
                  sx={{
                    opacity: isOpen ? 1 : 0,
                    color: to === location.pathname ? blue[500] : '',
                  }}
                />
              </ListItemButton>
            </ListItem>
          )
        })}
        <ListItem disablePadding={true} sx={{ position: 'absolute', bottom: 96 }}>
          <ListItemButton
            // onClick={handleScrollToTop}
            sx={{
              height: 48,
              justifyContent: isOpen ? 'initial' : 'center',
              px: isMobile ? 1.5 : 2.5,
              width: 48,
            }}
          >
            <ListItemText>
              <Typography
                sx={{
                  paddingLeft: isOpen ? 6 : 0,
                  transform: isOpen ? 'rotate(0deg)' : 'rotate(-90deg)',
                  transformOrigin: isOpen ? 'center' : '8% 50%',
                  transition: 'all 0.2s ease-out',
                  color: grey[500],
                  display: 'inline-block',
                }}
              >
                {schoolYearLabel}
              </Typography>
            </ListItemText>
          </ListItemButton>
        </ListItem>

        <ListItem disablePadding={true} sx={{ position: 'absolute', bottom: 16 }}>
          <ListItemButton
            onClick={() => {
              openDialog(DialogType.CONFIG_DIALOG, undefined, undefined)
              setOpen(false)
            }}
            sx={{
              height: 48,
              justifyContent: isOpen ? 'initial' : 'center',
              px: isMobile ? 1.5 : 2.5,
              width: 48,
            }}
          >
            <ListItemIcon
              sx={{
                minWidth: 0,
                mr: isOpen ? 3 : 'auto',
                justifyContent: 'center',
              }}
            >
              <SettingsIcon />
            </ListItemIcon>
            <ListItemText
              primary="Cài Đặt"
              sx={{
                opacity: isOpen ? 1 : 0,
              }}
            />
          </ListItemButton>
        </ListItem>
      </List>
    </Drawer>
  )
}

export default DrawerComponent
