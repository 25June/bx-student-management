import React, { useState } from 'react'
import {
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TableSortLabel,
  Paper,
  Tooltip,
} from '@mui/material'
import { visuallyHidden } from '@mui/utils'
import IconButton from '@mui/material/IconButton'
import EditIcon from '@mui/icons-material/Edit'
import DeleteIcon from '@mui/icons-material/Delete'
import MoreVertIcon from '@mui/icons-material/MoreVert'
import { StudentActionType } from 'constant'
import { Phone, Student } from 'models'
import Menu from '@mui/material/Menu'
import MenuItem from '@mui/material/MenuItem'

interface TableProps {
  columns: any[]
  rows: any[]
  onClickAction?: (data: any, type: string) => void
}

interface EnhancedTableProps {
  onRequestSort: (event: React.MouseEvent<unknown>, property: any) => void
  order: Order
  orderBy: string
  columns: any[]
}

const descendingComparator = (a: any, b: any, orderBy: string) => {
  if (typeof a[orderBy] === 'undefined') {
    return -1
  }
  if (typeof b[orderBy] === 'undefined') {
    return 1
  }
  return a[orderBy].localeCompare(b[orderBy])
}

type Order = 'asc' | 'desc'

function getComparator(order: Order, orderBy: string): (a: any, b: any) => number {
  return order === 'desc'
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy)
}

const EnhancedTableHead = (props: EnhancedTableProps) => {
  const { order, orderBy, onRequestSort, columns } = props

  const createSortHandler = (property: any) => (event: React.MouseEvent<unknown>) => {
    onRequestSort(event, property)
  }

  return (
    <TableHead>
      <TableRow>
        {columns.map((column: any) => (
          <TableCell
            key={column.field}
            padding={'normal'}
            sortDirection={orderBy === column.field ? order : false}
          >
            <TableSortLabel
              active={orderBy === column.field}
              direction={orderBy === column.field ? order : 'asc'}
              onClick={createSortHandler(column.field)}
            >
              {column.headerName}
              {orderBy === column.field ? (
                <Box component="span" sx={visuallyHidden}>
                  {order === 'desc' ? 'sorted descending' : 'sorted ascending'}
                </Box>
              ) : null}
            </TableSortLabel>
          </TableCell>
        ))}
        <TableCell padding={'normal'} />
      </TableRow>
    </TableHead>
  )
}

const TableComponent = ({ rows, columns, onClickAction }: TableProps) => {
  const [order, setOrder] = useState<Order>('desc')
  const [orderBy, setOrderBy] = useState<any>('firstName')

  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null)
  const [open, setOpen] = useState(false)
  const [selectedStudent, setSelectedStudent] = useState<Student>()

  const handleClickMenu = (event: React.MouseEvent<HTMLButtonElement>, row: Student) => {
    setAnchorEl(event.currentTarget)
    setOpen(true)
    setSelectedStudent(row)
  }

  const handleClickActions = (method: StudentActionType) => {
    if (onClickAction) {
      onClickAction(selectedStudent, method)
    }
    setOpen(false)
  }

  const handleRequestSort = (event: React.MouseEvent<unknown>, property: any) => {
    const isAsc = orderBy === property && order === 'asc'
    setOrder(isAsc ? 'desc' : 'asc')
    setOrderBy(property)
  }

  return (
    <Box p={2}>
      <Paper>
        <TableContainer
          sx={{ maxHeight: 'calc(100vh - 240px)', width: '100%', overflow: 'auto' }}
          component={Paper}
        >
          <Table
            stickyHeader={true}
            sx={{ minWidth: 750 }}
            aria-labelledby="tableTitle"
            size={'medium'}
          >
            <EnhancedTableHead
              order={order}
              orderBy={orderBy}
              onRequestSort={handleRequestSort}
              columns={columns}
            />
            <TableBody>
              {rows
                .slice()
                .sort(getComparator(order, orderBy))
                .map((row, index) => {
                  return (
                    <TableRow hover={true} tabIndex={index} key={row.id}>
                      {columns.map((column) => {
                        return (
                          <TableCell key={`cell-${column.field}-${row.id}`}>
                            {column.render(row[column.field])}
                          </TableCell>
                        )
                      })}
                      <TableCell>
                        <Tooltip title={'Menu'}>
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
        </TableContainer>
      </Paper>
      <Menu open={open} anchorEl={anchorEl} onClose={() => setOpen(false)}>
        <MenuItem onClick={() => handleClickActions(StudentActionType.EDIT_STUDENT)}>
          <Box display={'flex'} alignItems={'center'} gap={2}>
            <EditIcon fontSize="small" color={'warning'} />
            <Typography color={'#ed6c02'} fontSize={'0.875rem'}>
              Cập nhật thông tin
            </Typography>
          </Box>
        </MenuItem>
        <MenuItem onClick={() => handleClickActions(StudentActionType.DELETE_STUDENT)}>
          <Box display={'flex'} alignItems={'center'} gap={2}>
            <DeleteIcon fontSize="small" color={'error'} />
            <Typography color={'#d32f2f'} fontSize={'0.875rem'}>
              Xoá thông tin
            </Typography>
          </Box>
        </MenuItem>
      </Menu>
    </Box>
  )
}

export default TableComponent
