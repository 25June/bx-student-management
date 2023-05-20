import { Assessment, Phone } from 'models'
import { Box, Typography, IconButton } from '@mui/material'
import React from 'react'
import MenuItem from '@mui/material/MenuItem'
import { ScoreBookActionType, StudentActionType } from 'constant'
import EditIcon from '@mui/icons-material/Edit'
import DeleteIcon from '@mui/icons-material/Delete'
import { AssessmentEnum, RollCallDateActionType } from 'constant/common'
import { formatDisplayTable } from 'utils/datetime'

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
  { field: 'saintName', headerName: 'Tên Thánh', render: (saintName: string) => saintName },
  { field: 'lastName', headerName: 'Họ', render: (lastName: string) => lastName },
  { field: 'firstName', headerName: 'Tên', render: (firstName: string) => firstName },
  {
    field: 'score5',
    headerName: AssessmentEnum.KT5,
    render: (data: ScoreProps) => Object.keys(data)?.length !== 0 && <Score data={data} />,
  },
  {
    field: 'score15',
    headerName: AssessmentEnum.KT15,
    render: (data: ScoreProps) => Object.keys(data)?.length !== 0 && <Score data={data} />,
  },
  {
    field: 'score45',
    headerName: AssessmentEnum.KT45,
    render: (data: ScoreProps) => Object.keys(data)?.length !== 0 && <Score data={data} />,
  },
  {
    field: 'score60',
    headerName: AssessmentEnum.KT60,
    render: (data: ScoreProps) => Object.keys(data)?.length !== 0 && <Score data={data} />,
  },
]

export const renderDate = (
  rollCall?: Record<string, string>,
  isHeader?: boolean,
  openDiligentDialog?: (date: string, id: string) => void
) => {
  const onOpenDiligentDialog = (
    event: React.MouseEvent<HTMLAnchorElement> | React.MouseEvent<HTMLButtonElement>,
    date: string,
    id: string
  ) => {
    openDiligentDialog?.(date, id)
    event.preventDefault()
  }

  return (
    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 2 }}>
      {rollCall
        ? Object.keys(rollCall).map((key: string) => (
            <Box key={`date-${key}-${rollCall[key]}`} sx={{ display: 'flex', gap: 0.5 }}>
              <span>{formatDisplayTable(rollCall[key])}</span>
              {isHeader && openDiligentDialog && (
                <IconButton
                  aria-label="update"
                  size={'small'}
                  onClick={(event) => onOpenDiligentDialog(event, rollCall[key], key)}
                >
                  <EditIcon fontSize={'small'} color={'action'} sx={{ fontSize: '1rem' }} />
                </IconButton>
              )}
            </Box>
          ))
        : null}
    </Box>
  )
}

export const attendanceColumns = [
  { field: 'saintName', headerName: 'Tên Thánh', render: (data: string) => data },
  { field: 'lastName', headerName: 'Họ', render: (data: string) => data },
  { field: 'firstName', headerName: 'Tên', render: (data: string) => data },
]

export const renderAttendanceActions = (onClickActions: (type: string) => void) => {
  return (
    <div>
      <MenuItem onClick={() => onClickActions(RollCallDateActionType.EDIT_STUDY_DATE)}>
        <Box display={'flex'} alignItems={'center'} gap={2}>
          <EditIcon fontSize="small" color={'warning'} />
          <Typography color={'#ed6c02'} fontSize={'0.875rem'}>
            Cập nhật thông tin
          </Typography>
        </Box>
      </MenuItem>
    </div>
  )
}
