import { Assessment, Phone } from 'models'
import { Box, Typography } from '@mui/material'
import React from 'react'
import MenuItem from '@mui/material/MenuItem'
import { ScoreBookActionType, StudentActionType } from 'constant'
import EditIcon from '@mui/icons-material/Edit'
import DeleteIcon from '@mui/icons-material/Delete'
import { AssessmentEnum, ScoreEnum } from 'constant/common'
import { getScoreName } from 'utils/getScoreName'

export const studentColumns = [
  { field: 'fullName', headerName: 'Họ và Tên', disableSort: true },
  { field: 'birthday', headerName: 'Ngày Sinh', render: (data: string) => data, disableSort: true },
  { field: 'address', headerName: 'Địa Chỉ', render: (data: string) => data, disableSort: true },
  { field: 'grade', headerName: 'Văn Hoá', render: (data: string) => data, disableSort: true },
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
    disableSort: true,
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
        case AssessmentEnum.KT5:
          return {
            ...acc,
            score5: [...acc.score5, cur],
          }
        case AssessmentEnum.KT15:
          return {
            ...acc,
            score15: [...acc.score15, cur],
          }
        case AssessmentEnum.KT45:
          return {
            ...acc,
            score45: [...acc.score45, cur],
          }
        case AssessmentEnum.KT60:
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
      {Object.keys(data).map((key) => (
        <span key={key}>{data[key]}</span>
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
  { field: 'fullName', headerName: 'Họ và Tên', disableSort: true },
  {
    field: ScoreEnum.SCORE_5,
    headerName: getScoreName(AssessmentEnum.KT5),
    render: (data: ScoreProps) => data && Object.keys(data)?.length !== 0 && <Score data={data} />,
    disableSort: true,
  },
  {
    field: ScoreEnum.SCORE_15,
    headerName: getScoreName(AssessmentEnum.KT15),
    render: (data: ScoreProps) => data && Object.keys(data)?.length !== 0 && <Score data={data} />,
    disableSort: true,
  },
  {
    field: ScoreEnum.SCORE_45,
    headerName: getScoreName(AssessmentEnum.KT45),
    render: (data: ScoreProps) => data && Object.keys(data)?.length !== 0 && <Score data={data} />,
    disableSort: true,
  },
  {
    field: ScoreEnum.SCORE_60,
    headerName: getScoreName(AssessmentEnum.KT60),
    render: (data: ScoreProps) => data && Object.keys(data)?.length !== 0 && <Score data={data} />,
    disableSort: true,
  },
]
