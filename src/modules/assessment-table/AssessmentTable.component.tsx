import * as React from 'react'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'
import Paper from '@mui/material/Paper'
import { Assessment } from 'models'
import { Box, Tooltip, Typography } from '@mui/material'
import EditIcon from '@mui/icons-material/Edit'
import { AssessmentActionType } from 'constant'
import DeleteIcon from '@mui/icons-material/Delete'
import MenuItem from '@mui/material/MenuItem'
import Menu from '@mui/material/Menu'
import { useState } from 'react'
import IconButton from '@mui/material/IconButton'
import MoreVertIcon from '@mui/icons-material/MoreVert'

const tableColumns = [
  {
    value: 'lesson',
    label: 'Bài học',
  },
  {
    value: 'bookDate',
    label: 'Ngày thực hiện',
  },
  {
    value: 'type',
    label: 'Loại bài kiểm tra',
  },
]

interface AssessmentTableComponentProps {
  rows: Assessment[]
  onClickAction: (data: Assessment, actionType: AssessmentActionType) => void
}

const AssessmentTableComponent = ({ rows, onClickAction }: AssessmentTableComponentProps) => {
  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null)
  const [open, setOpen] = useState(false)
  const [selectedRow, setSelectedRow] = useState<Assessment>()
  const handleClickMenu = (event: React.MouseEvent<HTMLButtonElement>, row: Assessment) => {
    setAnchorEl(event.currentTarget)
    setOpen(true)
    setSelectedRow(row)
  }

  return (
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 650 }} aria-label="simple table">
        <TableHead>
          <TableRow>
            {tableColumns.map((col) => {
              return <TableCell key={col.value}>{col.label}</TableCell>
            })}
            <TableCell />
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map((row) => (
            <TableRow key={row.id} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
              {tableColumns.map((col) => {
                return (
                  <TableCell key={`${row.id}-${col.value}`}>{(row as any)[col.value]}</TableCell>
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
          ))}
        </TableBody>
      </Table>
      {selectedRow && (
        <Menu open={open} anchorEl={anchorEl} onClose={() => setOpen(false)}>
          <MenuItem
            onClick={() => {
              onClickAction(selectedRow, AssessmentActionType.EDIT_ASSESSMENT)
              setOpen(false)
            }}
          >
            <Box display={'flex'} alignItems={'center'} gap={2}>
              <EditIcon fontSize="small" color={'warning'} />
              <Typography color={'#ed6c02'} fontSize={'0.875rem'}>
                Cập nhật thông tin
              </Typography>
            </Box>
          </MenuItem>
          <MenuItem
            onClick={() => {
              onClickAction(selectedRow, AssessmentActionType.DELETE_ASSESSMENT)
              setOpen(false)
            }}
          >
            <Box display={'flex'} alignItems={'center'} gap={2}>
              <DeleteIcon fontSize="small" color={'error'} />
              <Typography color={'#d32f2f'} fontSize={'0.875rem'}>
                Xoá thông tin
              </Typography>
            </Box>
          </MenuItem>
        </Menu>
      )}
    </TableContainer>
  )
}

export default AssessmentTableComponent
