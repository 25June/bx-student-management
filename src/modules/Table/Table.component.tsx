import React, { useState } from 'react'
import {
  Box,
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
import { StudentActionType } from '../../constant/common'

interface TableProps {
  columns: any[]
  rows: any[]
  onClickAction: (data: any, type: string) => void
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

function getComparator<Key extends keyof any>(
  order: Order,
  orderBy: string
): (a: any, b: any) => number {
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

  const handleRequestSort = (event: React.MouseEvent<unknown>, property: any) => {
    const isAsc = orderBy === property && order === 'asc'
    setOrder(isAsc ? 'desc' : 'asc')
    setOrderBy(property)
  }

  return (
    <Box sx={{ width: '100%' }}>
      <Paper sx={{ width: '100%', mb: 2 }}>
        <TableContainer>
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
                .map((row) => {
                  return (
                    <TableRow hover={true} role="checkbox" tabIndex={-1} key={row.id}>
                      {columns.map((column) => (
                        <TableCell key={`cell-${column.field}-${row.id}`}>
                          {row[column.field]}
                        </TableCell>
                      ))}
                      <TableCell>
                        <Tooltip title="Sửa thông tin" placement="top">
                          <IconButton
                            aria-label="Edit student"
                            component="span"
                            onClick={() => onClickAction(row, StudentActionType.EDIT_STUDENT)}
                            size="small"
                            color="warning"
                          >
                            <EditIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>

                        <Tooltip title="Xoá thông tin">
                          <IconButton
                            aria-label="Remove student"
                            component="span"
                            onClick={() => onClickAction(row, StudentActionType.DELETE_STUDENT)}
                            size="small"
                            color="error"
                          >
                            <DeleteIcon fontSize="small" />
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
    </Box>
  )
}

export default TableComponent
