import React from 'react'
import { Toolbar, IconButton, Typography, Avatar, Box, AppBar } from '@mui/material'
import MenuIcon from '@mui/icons-material/Menu'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import { SelectChangeEvent } from '@mui/material/Select'
import { AppBarProps as MuiAppBarProps } from '@mui/material/AppBar/AppBar'
import { styled } from '@mui/material/styles'
import ClassDropdownComponent from 'modules/class-dropdown/ClassDropdown.component'
import { useIsMobile } from 'utils/common'
import Logo from 'static/images/logo/logo.svg'
import { useClassContext } from 'contexts/ClassContext'
import { useStudentContext } from 'contexts/StudentContext'
import { useAuthentication } from 'contexts/AuthContext'
import ImageBoxComponent from 'modules/image-box/ImageBox.component'

interface TopBarComponentProps {
  isOpen: boolean
  setOpen: (value: boolean) => void
  openUserDrawer: () => void
}

interface AppBarProps extends MuiAppBarProps {
  open?: boolean
}

const MuiAppBar = styled(AppBar, {
  shouldForwardProp: (prop) => prop !== 'open',
})<AppBarProps>(({ theme }) => ({
  zIndex: theme.zIndex.drawer + 1,
  transition: theme.transitions.create(['width', 'margin'], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
}))

const TopBarComponent = ({ isOpen, setOpen, openUserDrawer }: TopBarComponentProps) => {
  const { classObj, setClassId, classId } = useClassContext()
  const { students } = useStudentContext()
  const { user } = useAuthentication()
  const color = classId.slice(0, 2)
  const isMobile = useIsMobile()
  const handleDrawerOpen = () => {
    setOpen(!isOpen)
  }

  const handleChangeClassId = (event: SelectChangeEvent) => {
    setClassId(event.target.value)
  }

  return (
    <MuiAppBar
      color={color ? (`${color}Background` as any) : 'primary'}
      enableColorOnDark={true}
      position="fixed"
      open={isOpen}
    >
      <Toolbar>
        <IconButton
          color="inherit"
          aria-label="open drawer"
          onClick={handleDrawerOpen}
          edge="start"
          sx={{
            marginRight: isMobile ? 2 : 3,
          }}
        >
          {isOpen ? <ArrowBackIcon /> : <MenuIcon />}
        </IconButton>
        <Box
          sx={{
            width: '100%',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <Box
            sx={{
              width: '100%',
              display: 'flex',
              alignItems: 'center',
            }}
            gap={isMobile ? 1 : 2}
          >
            {isMobile ? (
              <Box
                component={'img'}
                src={Logo}
                alt={'Giao Xu Binh Xuyen'}
                sx={{ height: 40, width: 40 }}
              />
            ) : (
              <Typography
                variant="h6"
                noWrap={true}
                sx={{ fontSize: isMobile ? '1rem' : '1.5rem' }}
              >
                Giáo Lý Bình Xuyên
              </Typography>
            )}

            <Box maxWidth={200}>
              <ClassDropdownComponent
                classObj={classObj}
                onChangeClass={handleChangeClassId}
                size={'small'}
                formVariant={'standard'}
              />
            </Box>
            <Typography
              component={'h6'}
              sx={{ color: '#fff', fontWeight: 500, textAlign: 'right', fontSize: '1rem' }}
            >
              {students && students.length} Em
            </Typography>
          </Box>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            sx={{ paddingRight: 0 }}
            onClick={openUserDrawer}
          >
            <Avatar alt="GLV-avatar">
              <ImageBoxComponent imagePath={user?.avatarPath} isGLV={true} />
            </Avatar>
          </IconButton>
        </Box>
      </Toolbar>
    </MuiAppBar>
  )
}

export default TopBarComponent
