import React, { useState } from 'react'
import TableContainer from '@mui/material/TableContainer'
import Paper from '@mui/material/Paper'
import Table from '@mui/material/Table'
import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'
import TableCell from '@mui/material/TableCell'
import TableBody from '@mui/material/TableBody'
import Avatar from '@mui/material/Avatar'
import { Box, Tooltip, Typography } from '@mui/material'
import IconButton from '@mui/material/IconButton'
import MoreVertIcon from '@mui/icons-material/MoreVert'
import { User } from 'models/user'
import Menu from '@mui/material/Menu'
import MenuItem from '@mui/material/MenuItem'
import EditIcon from '@mui/icons-material/Edit'
import PasswordIcon from '@mui/icons-material/Password'
import SwitchAccessShortcutIcon from '@mui/icons-material/SwitchAccessShortcut'
import { BaseClassObj, extendedColorPalettes, Role, UserAction, UserRoles } from 'constant/common'
import { useIsMobile } from 'utils/common'
import { grey } from '@mui/material/colors'
import Chip from '@mui/material/Chip'
import { useAuthentication } from 'contexts/AuthContext'
import { buildImageUrl } from 'utils/common'

interface UserTableComponentProps {
  rows: User[]
  onClickAction: (action: string, selectedRow: User) => void
}

const UserTableComponent = ({ rows, onClickAction }: UserTableComponentProps) => {
  const isMobile = useIsMobile()
  const { user } = useAuthentication()

  const [selectedRow, setSelectedRow] = useState<User>()
  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null)

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

  const tableBodyClass = isMobile
    ? {
      '&:before': { content: `attr(data-cell)`, fontWeight: 500 },
      display: 'grid',
      gridTemplateColumns: '10ch auto',
      borderBottom: 0,
    }
    : {}

  return (
    <TableContainer component={Paper} sx={{ boxShadow: 3, border: `1px solid ${grey[300]}` }}>
      <Table stickyHeader={true} sx={{ minWidth: isMobile ? 0 : 650 }} aria-label="simple table">
        <TableHead>
          <TableRow sx={{ display: isMobile ? 'none' : '' }}>
            <TableCell key={'avatarPath'}>Ảnh</TableCell>
            <TableCell key={'saintName'}>Tên Thánh</TableCell>
            <TableCell key={'lastName'}>Họ và</TableCell>
            <TableCell key={'firstName'}>Tên</TableCell>
            <TableCell key={'classId'}>Lớp</TableCell>
            <TableCell key={'role'}>Chức vụ</TableCell>
            {user?.role === Role.CTO && <TableCell key={'action'} />}
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map((row, index) => (
            <TableRow
              key={row.email}
              sx={{
                '&:last-child td, &:last-child th': { border: 0 },
                background: index % 2 === 0 ? '#fff' : grey[50],
              }}
            >
              <TableCell
                data-cell={'Ảnh'}
                sx={{
                  paddingTop: 1,
                  paddingBottom: 1,
                  ...tableBodyClass,
                }}
              >
                <Avatar
                  src={buildImageUrl(row.avatarPath, false, true)}
                  sx={{ width: 32, height: 32, objectPosition: 'contain', boxShadow: 3 }}
                  variant={'rounded'}
                />
              </TableCell>
              <TableCell
                data-cell={'Tên Thánh'}
                sx={{
                  paddingTop: 1,
                  paddingBottom: 1,
                  ...tableBodyClass,
                }}
              >
                {row.saintName}
              </TableCell>
              <TableCell
                data-cell={'Họ và'}
                sx={{
                  paddingTop: 1,
                  paddingBottom: 1,
                  ...tableBodyClass,
                }}
              >
                {row.lastName}
              </TableCell>
              <TableCell
                data-cell={'Tên'}
                sx={{
                  paddingTop: 1,
                  paddingBottom: 1,
                  ...tableBodyClass,
                }}
              >
                {row.firstName}
              </TableCell>
              <TableCell
                data-cell={'Email'}
                sx={{
                  paddingTop: 1,
                  paddingBottom: 1,
                  ...tableBodyClass,
                }}
              >
                {row.email}
              </TableCell>
              <TableCell
                data-cell={'Lớp'}
                sx={{ paddingTop: 1, paddingBottom: 1, ...tableBodyClass }}
              >
                <Box>
                  <Chip
                    label={<b>{row.classId ? BaseClassObj[row.classId] : 'Chưa có lớp'}</b>}
                    color={(row.classId?.slice(0, 2) as extendedColorPalettes) || 'default'}
                  />
                </Box>
              </TableCell>
              <TableCell
                data-cell={'Vai trò'}
                sx={{ paddingTop: 1, paddingBottom: 1, ...tableBodyClass }}
              >
                {UserRoles[row.role]?.title || ''}
              </TableCell>
              {user?.role === Role.CTO && (
                <TableCell
                  data-cell={'Action'}
                  key={`${row.id}-action`}
                  align={isMobile ? 'left' : 'right'}
                  sx={{ ...tableBodyClass }}
                >
                  <Tooltip title={'Menu'} placement={'top'}>
                    <IconButton
                      aria-label={'Menu'}
                      onClick={(e) => handleClickMenu(e, row)}
                      size={'small'}
                      color={'primary'}
                    >
                      <MoreVertIcon fontSize={'small'} sx={{ transform: 'rotate(90deg)' }} />
                    </IconButton>
                  </Tooltip>
                </TableCell>
              )}
            </TableRow>
          ))}
        </TableBody>
      </Table>
      {selectedRow && (
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
    </TableContainer>
  )
}

export default UserTableComponent
