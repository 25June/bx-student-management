import { useIsMobile } from 'utils/common'
import { useState } from 'react'
import * as React from 'react'
import TableContainer from '@mui/material/TableContainer'
import Paper from '@mui/material/Paper'
import { grey } from '@mui/material/colors'
import Table from '@mui/material/Table'
import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'
import TableCell from '@mui/material/TableCell'
import TableBody from '@mui/material/TableBody'
import { Box, Tooltip, Typography } from '@mui/material'
import IconButton from '@mui/material/IconButton'
import MoreVertIcon from '@mui/icons-material/MoreVert'
import Menu from '@mui/material/Menu'
import MenuItem from '@mui/material/MenuItem'
import { RegisterStudent } from 'models/student'
import { RegisterActionType } from 'constant/common'
import RemoveRedEyeIcon from '@mui/icons-material/RemoveRedEye'
import DoneAllIcon from '@mui/icons-material/DoneAll'
import BlockIcon from '@mui/icons-material/Block'

const tableColumns = [
  {
    value: 'saintName',
    label: 'Tên Thánh',
  },
  {
    value: 'fullName',
    label: 'Họ và Tên',
  },
  {
    value: 'birthday',
    label: 'Ngày Sinh',
  },
  {
    value: 'address',
    label: 'Địa Chỉ',
  },
  {
    value: 'phone1',
    label: 'Điện Thoại 1',
  },
  {
    value: 'phone2',
    label: 'Điện Thoại 2',
  },
]

interface RegisterTableProps {
  rows: RegisterStudent[]
  onClickAction: (data: RegisterStudent, actionType: RegisterActionType) => void
}

const RegisterTableComponent = ({ rows, onClickAction }: RegisterTableProps) => {
  const isMobile = useIsMobile()
  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null)
  const [open, setOpen] = useState(false)
  const [selectedRow, setSelectedRow] = useState<RegisterStudent>()
  const handleClickMenu = (event: React.MouseEvent<HTMLButtonElement>, row: RegisterStudent) => {
    setAnchorEl(event.currentTarget)
    setOpen(true)
    setSelectedRow(row)
  }

  const tableBodyClass = isMobile
    ? {
        '&:before': { content: `attr(data-cell)`, fontWeight: 500 },
        display: 'grid',
        gridTemplateColumns: '17ch auto',
        borderBottom: 0,
      }
    : {}

  return (
    <TableContainer component={Paper} sx={{ border: `1px solid ${grey[300]}` }}>
      <Table stickyHeader={true} sx={{ minWidth: isMobile ? 0 : 650 }} aria-label="simple table">
        <TableHead>
          <TableRow sx={{ display: isMobile ? 'none' : '' }}>
            {tableColumns.map((col) => {
              return <TableCell key={col.value}>{col.label}</TableCell>
            })}
            <TableCell />
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map((row, index) => {
            return (
              <TableRow key={row.id} sx={{ background: index % 2 === 0 ? '#fff' : grey[50] }}>
                {tableColumns.map((col) => {
                  return (
                    <TableCell
                      key={`${row.id}-${col.value}`}
                      data-cell={col.label}
                      sx={tableBodyClass}
                    >
                      {(row as any)[col.value]}
                    </TableCell>
                  )
                })}
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
            )
          })}
        </TableBody>
      </Table>
      {selectedRow && (
        <Menu open={open} anchorEl={anchorEl} onClose={() => setOpen(false)}>
          <MenuItem
            onClick={() => {
              onClickAction(selectedRow, RegisterActionType.VIEW_DETAIL)
              setOpen(false)
            }}
          >
            <Box display={'flex'} alignItems={'center'} gap={2}>
              <RemoveRedEyeIcon fontSize="small" color={'info'} />
              <Typography fontSize={'0.875rem'}>Xem chi tiết</Typography>
            </Box>
          </MenuItem>
          <MenuItem
            onClick={() => {
              onClickAction(selectedRow, RegisterActionType.CONFIRM_NEW_REGISTER)
              setOpen(false)
            }}
          >
            <Box display={'flex'} alignItems={'center'} gap={2}>
              <DoneAllIcon fontSize="small" color={'info'} />
              <Typography fontSize={'0.875rem'}>Xác nhận</Typography>
            </Box>
          </MenuItem>
          <MenuItem
            onClick={() => {
              onClickAction(selectedRow, RegisterActionType.DISABLE_QR_CODE)
              setOpen(false)
            }}
          >
            <Box display={'flex'} alignItems={'center'} gap={2}>
              <BlockIcon fontSize="small" color={'error'} />
              <Typography color={'#d32f2f'} fontSize={'0.875rem'}>
                Vô Hiệu QR Code
              </Typography>
            </Box>
          </MenuItem>
        </Menu>
      )}
    </TableContainer>
  )
}

export default RegisterTableComponent
