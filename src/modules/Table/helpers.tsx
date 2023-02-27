import { Phone, Score } from 'models'
import { Box } from '@mui/material'
import React from 'react'

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
