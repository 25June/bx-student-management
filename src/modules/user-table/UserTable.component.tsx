import React, { useState } from 'react'
import TableContainer from '@mui/material/TableContainer'
import Paper from '@mui/material/Paper'
import Table from '@mui/material/Table'
import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'
import TableCell from '@mui/material/TableCell'
import TableBody from '@mui/material/TableBody'
import { Box, Tooltip, Typography } from '@mui/material'
import IconButton from '@mui/material/IconButton'
import MoreVertIcon from '@mui/icons-material/MoreVert'
import { User } from 'models/user'
import Menu from '@mui/material/Menu'
import MenuItem from '@mui/material/MenuItem'
import EditIcon from '@mui/icons-material/Edit'
import PasswordIcon from '@mui/icons-material/Password'
import SwitchAccessShortcutIcon from '@mui/icons-material/SwitchAccessShortcut'
import { BaseClassObj, UserAction, UserRoles } from 'constant/common'
import { useIsMobile } from 'utils/common'
import { grey } from '@mui/material/colors'

interface UserTableComponentProps {
  rows: User[]
  onClickAction: (action: string, selectedRow: User) => void
}

const UserTableComponent = ({ rows, onClickAction }: UserTableComponentProps) => {
  const isMobile = useIsMobile()

  const [selectedRow, setSelectedRow] = useState<User>()
  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null)

  const handleClickMenu = (e: React.MouseEvent<HTMLButtonElement>, row: User) => {
    setAnchorEl(e.currentTarget)
    setSelectedRow(row)
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
            <TableCell key={'email'}>Email</TableCell>
            <TableCell key={'classId'}>Lớp</TableCell>
            <TableCell key={'role'}>Chức vụ</TableCell>
            <TableCell key={'action'} />
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
                {BaseClassObj[row.classId || 'kt1']}
              </TableCell>
              <TableCell
                data-cell={'Vai trò'}
                sx={{ paddingTop: 1, paddingBottom: 1, ...tableBodyClass }}
              >
                {UserRoles[row.role]?.title || ''}
              </TableCell>
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
            </TableRow>
          ))}
        </TableBody>
      </Table>
      {selectedRow && (
        <Menu open={!!selectedRow} anchorEl={anchorEl} onClose={() => setSelectedRow(undefined)}>
          <MenuItem onClick={() => onClickAction(UserAction.UPDATE_INFO, selectedRow)}>
            <Box display={'flex'} alignItems={'center'} gap={2}>
              <EditIcon fontSize="small" color={'info'} />
              <Typography fontSize={'0.875rem'}>Cập nhật thông tin</Typography>
            </Box>
          </MenuItem>
          <MenuItem onClick={() => onClickAction(UserAction.CHANGE_PASSWORD, selectedRow)}>
            <Box display={'flex'} alignItems={'center'} gap={2}>
              <PasswordIcon fontSize="small" color={'info'} />
              <Typography fontSize={'0.875rem'}>Thay đổi mật khẩu</Typography>
            </Box>
          </MenuItem>
          <MenuItem onClick={() => onClickAction(UserAction.RESET_PASSWORD, selectedRow)}>
            <Box display={'flex'} alignItems={'center'} gap={2}>
              <PasswordIcon fontSize="small" color={'info'} />
              <Typography fontSize={'0.875rem'}>Reset mật khẩu</Typography>
            </Box>
          </MenuItem>
          <MenuItem onClick={() => onClickAction(UserAction.GRANT_PERMISSION, selectedRow)}>
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
