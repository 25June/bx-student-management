import { Phone, Score } from 'models'
import { Box, Typography } from '@mui/material'
import React from 'react'
import MenuItem from '@mui/material/MenuItem'
import { ScoreBookActionType, StudentActionType } from 'constant'
import EditIcon from '@mui/icons-material/Edit'
import DeleteIcon from '@mui/icons-material/Delete'

export const studentColumns = [
  { field: 'saintName', headerName: 'Tên Thánh', render: (data: string) => data },
  { field: 'lastName', headerName: 'Họ', render: (data: string) => data },
  { field: 'firstName', headerName: 'Tên', render: (data: string) => data },
  { field: 'birthday', headerName: 'Ngày Sinh', render: (data: string) => data },
  { field: 'address', headerName: 'Địa Chỉ', render: (data: string) => data },
  { field: 'grade', headerName: 'Văn Hoá', render: (data: string) => data },
  {
    field: 'phones',
    headerName: 'Điện Thoại',
    render: (data: Phone[]) => (
      <>
        {data.map((phone: Phone) => {
          if (phone.number) {
            return (
              <Box key={`${phone.number}-${phone.name}`}>{`${phone.name} - ${phone.number}`}</Box>
            )
          }
          return null
        })}
      </>
    ),
  },
]

const renderScore = (data: Record<string, Score>) => {
  return (
    <Box display={'flex'} gap={2}>
      {Object.values(data).map((score, index) => (
        <span key={`${score.bookDate}-${index}`}>{score.score}</span>
      ))}
    </Box>
  )
}

export const renderStudentActions = (onClickActions: (action: string) => void) => {
  return (
    <div>
      <MenuItem onClick={() => onClickActions(StudentActionType.EDIT_STUDENT)}>
        <Box display={'flex'} alignItems={'center'} gap={2}>
          <EditIcon fontSize="small" color={'warning'} />
          <Typography color={'#ed6c02'} fontSize={'0.875rem'}>
            Cập nhật thông tin
          </Typography>
        </Box>
      </MenuItem>
      <MenuItem onClick={() => onClickActions(StudentActionType.DELETE_STUDENT)}>
        <Box display={'flex'} alignItems={'center'} gap={2}>
          <DeleteIcon fontSize="small" color={'error'} />
          <Typography color={'#d32f2f'} fontSize={'0.875rem'}>
            Xoá thông tin
          </Typography>
        </Box>
      </MenuItem>
    </div>
  )
}

export const renderScoreBookActions = (onClickActions: (action: string) => void) => {
  return (
    <div>
      <MenuItem onClick={() => onClickActions(ScoreBookActionType.EDIT_SCORE_BOOK)}>
        <Box display={'flex'} alignItems={'center'} gap={2}>
          <EditIcon fontSize="small" color={'warning'} />
          <Typography color={'#ed6c02'} fontSize={'0.875rem'}>
            Cập nhật thông tin
          </Typography>
        </Box>
      </MenuItem>
      <MenuItem onClick={() => onClickActions(ScoreBookActionType.DELETE_SCORE_BOOK)}>
        <Box display={'flex'} alignItems={'center'} gap={2}>
          <DeleteIcon fontSize="small" color={'error'} />
          <Typography color={'#d32f2f'} fontSize={'0.875rem'}>
            Xoá thông tin
          </Typography>
        </Box>
      </MenuItem>
    </div>
  )
}

export const ScoreBookColumns = [
  { field: 'saintName', headerName: 'Tên Thánh', render: (data: string) => data },
  { field: 'lastName', headerName: 'Họ', render: (data: string) => data },
  { field: 'firstName', headerName: 'Tên', render: (data: string) => data },
  {
    field: 'score5',
    headerName: 'KT5',
    render: (data: Record<string, Score>) => renderScore(data),
  },
  {
    field: 'score15',
    headerName: 'KT15',
    render: (data: Record<string, Score>) => renderScore(data),
  },
  {
    field: 'score45',
    headerName: 'KT45',
    render: (data: Record<string, Score>) => renderScore(data),
  },
  {
    field: 'score60',
    headerName: 'KT60',
    render: (data: Record<string, Score>) => renderScore(data),
  },
]
