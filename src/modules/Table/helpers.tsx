import { Assessment, Phone } from 'models'
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

export type GroupAssessmentProps = {
  score5: Assessment[]
  score15: Assessment[]
  score45: Assessment[]
  score60: Assessment[]
}

export const groupAssessments = (assessments: Assessment[]): GroupAssessmentProps => {
  return assessments.reduce(
    (acc, cur) => {
      switch (cur.type) {
        case 'KT5':
          return {
            ...acc,
            score5: [...acc.score5, cur],
          }
        case 'KT15':
          return {
            ...acc,
            score15: [...acc.score15, cur],
          }
        case 'KT45':
          return {
            ...acc,
            score45: [...acc.score45, cur],
          }
        case 'KT60':
          return {
            ...acc,
            score60: [...acc.score60, cur],
          }
      }
      return acc
    },
    {
      score5: [] as Assessment[],
      score15: [] as Assessment[],
      score45: [] as Assessment[],
      score60: [] as Assessment[],
    }
  )
}

type ScoreProps = Record<string, number>

const Score = ({ data }: { data: ScoreProps }) => {
  return (
    <Box display={'flex'} gap={2}>
      {Object.keys(data).map((key, index) => (
        <span key={`${key}-${index}`}>{data[key]}</span>
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
    render: (data: ScoreProps = {}) => <Score data={data} />,
  },
  {
    field: 'score15',
    headerName: 'KT15',
    render: (data: ScoreProps = {}) => <Score data={data} />,
  },
  {
    field: 'score45',
    headerName: 'KT45',
    render: (data: ScoreProps = {}) => <Score data={data} />,
  },
  {
    field: 'score60',
    headerName: 'KT60',
    render: (data: ScoreProps = {}) => <Score data={data} />,
  },
]
