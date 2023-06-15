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
import { UserAction, UserRoles } from 'constant/common'
import { useAuthentication } from 'contexts/AuthContext'

interface UserTableComponentProps {
  rows: User[]
  onClickAction: (action: string, selectedRow: User) => void
}

const UserTableComponent = ({ rows, onClickAction }: UserTableComponentProps) => {
  const { authUser } = useAuthentication()
  const [selectedRow, setSelectedRow] = useState<User>()
  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null)

  const handleClickMenu = (e: React.MouseEvent<HTMLButtonElement>, row: User) => {
    setAnchorEl(e.currentTarget)
    setSelectedRow(row)
  }
  console.log(authUser)

  return (
    <TableContainer component={Paper} sx={{ maxHeight: 500, boxShadow: 3 }}>
      <Table stickyHeader={true} sx={{ minWidth: 650 }} aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell key={'email'}>Email</TableCell>
            <TableCell key={'role'}>Role</TableCell>
            <TableCell />
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map((row) => (
            <TableRow key={row.email} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
              <TableCell sx={{ paddingTop: 1, paddingBottom: 1 }}>{row.email}</TableCell>
              <TableCell sx={{ paddingTop: 1, paddingBottom: 1 }}>
                {UserRoles[row.role]?.title || ''}
              </TableCell>
              <TableCell key={`${row.id}-action`} align={'right'}>
                <Tooltip title={'Menu'} placement={'top'}>
                  <IconButton
                    aria-label={'Menu'}
                    onClick={(e) => handleClickMenu(e, row)}
                    size={'small'}
                    color={'primary'}
                  >
                    <MoreVertIcon fontSize={'small'} />
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
