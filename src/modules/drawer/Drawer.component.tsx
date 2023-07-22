import React, { useState, useEffect, useCallback } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import {
  Box,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  CSSObject,
  styled,
  Theme,
  IconButton,
} from '@mui/material'
import Fade from '@mui/material/Fade'
import AssignmentIcon from '@mui/icons-material/Assignment'
import CoPresentIcon from '@mui/icons-material/CoPresent'
import PermIdentityIcon from '@mui/icons-material/PermIdentity'
import ImportExportIcon from '@mui/icons-material/ImportExport'
import ScoreIcon from '@mui/icons-material/Score'
import SupervisedUserCircleIcon from '@mui/icons-material/SupervisedUserCircle'
import MuiDrawer from '@mui/material/Drawer'
import { drawerWidth } from '../layout/Layout.component'
import { Router } from 'routes'
import { useAuthentication } from 'contexts/AuthContext'
import { Role } from 'constant/common'
import { useIsMobile } from 'utils/common'
import ExpandLessRoundedIcon from '@mui/icons-material/ExpandLessRounded'
import { blue } from '@mui/material/colors'
import { debounce } from 'lodash'

interface DrawerComponentProps {
  isOpen: boolean
  setOpen: (value: boolean) => void
}

const Menu = {
  LIST: {
    text: 'Danh Sách',
    icon: (isActive: boolean) => <PermIdentityIcon color={isActive ? 'primary' : undefined} />,
    to: Router.HOME,
  },
  DILIGENT: {
    text: 'Điểm Chuyên Cần',
    icon: (isActive: boolean) => <CoPresentIcon color={isActive ? 'primary' : undefined} />,
    to: Router.DILIGENT,
  },
  SCORE: {
    text: 'Điểm Học Tập',
    icon: (isActive: boolean) => <ScoreIcon color={isActive ? 'primary' : undefined} />,
    to: Router.SCORE_BOOK,
  },
  ASSESSMENT: {
    text: 'Bài Kiểm Tra',
    icon: (isActive: boolean) => <AssignmentIcon color={isActive ? 'primary' : undefined} />,
    to: Router.ASSESSMENT,
  },
  IMPORT: {
    text: 'Nhập dữ liệu',
    icon: (isActive: boolean) => <ImportExportIcon color={isActive ? 'primary' : undefined} />,
    to: Router.IMPORT,
  },
  USER: {
    text: 'GLV',
    icon: (isActive: boolean) => (
      <SupervisedUserCircleIcon color={isActive ? 'primary' : undefined} />
    ),
    to: Router.USER,
  },
}

const openedMixin = (theme: Theme): CSSObject => ({
  width: drawerWidth,
  transition: theme.transitions.create('width', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.enteringScreen,
  }),
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
  const { user } = useAuthentication()
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

  const handleScrollToTop = useCallback(() => {
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: 'smooth',
    })
    setShowScroll(false)
  }, [])

  return (
    <Drawer variant="permanent" open={isOpen}>
      <Box pt={8} position={'relative'}>
        <List>
          {Object.values(Menu).map(({ text, icon, to }) => {
            if ([Router.USER, Router.IMPORT].includes(to) && user && user.role !== Role.CTO) {
              return null
            }
            return (
              <ListItem key={text} disablePadding={true} sx={{ display: 'block' }}>
                <ListItemButton
                  selected={to === location.pathname}
                  onClick={() => {
                    setTimeout(() => navigate(to), 100)
                    setTimeout(() => setOpen(false), 200)
                  }}
                  sx={{
                    minHeight: 48,
                    justifyContent: isOpen ? 'initial' : 'center',
                    px: isMobile ? 1.5 : 2.5,
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
        </List>
      </Box>
      <Fade in={showScroll}>
        <IconButton
          size={'small'}
          color={'primary'}
          sx={{ position: 'absolute', background: blue[100], bottom: 16, left: 8 }}
          onClick={handleScrollToTop}
        >
          <ExpandLessRoundedIcon />
        </IconButton>
      </Fade>
    </Drawer>
  )
}

export default DrawerComponent
