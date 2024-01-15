import {
  Table,
  TableRow,
  Paper,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  Box,
  Typography,
  Button,
  TextField,
} from '@mui/material'
import { Controller, useForm } from 'react-hook-form'
import { Assessment, StudentScoreBook } from 'models'
import TableFullNameCellComponent from 'modules/common/TableFullNameCell.component'
import { grey, orange } from '@mui/material/colors'
import { groupBy, get } from 'lodash'
import { useState } from 'react'
import { useClassContext } from 'contexts/ClassContext'
import { setNewStudentScore } from 'services/scorebook'
import { useSnackbarContext } from 'contexts/SnackbarContext'

const ScoreForm = ({
  data,
  onChangeData,
}: {
  data: number
  onChangeData: (submittedValue: { score: number }) => void
}) => {
  const [openEditBox, setOpenEditBox] = useState<boolean>(false)

  const { disableUpdate } = useClassContext()

  const {
    handleSubmit,
    control,
    reset,
    formState: { errors, isDirty },
    setError,
    setValue,
  } = useForm<{ score: number }>()
  const onSubmit = (value: { score: number }) => {
    setOpenEditBox(false)

    if (disableUpdate || !isDirty) {
      return
    }
    if (isNaN(Number(value.score)) || Number(value.score) > 10) {
      setError('score', { message: 'Invalid input' }, { shouldFocus: true })
      return
    }
    const submittedValue = {
      score: Number(value.score),
    }
    onChangeData(submittedValue)
    reset()
  }
  if (openEditBox) {
    return (
      <Controller
        control={control}
        name={'score'}
        render={({ field }) => (
          <TextField
            id="outlined-lesson"
            label={''}
            type="number"
            inputMode="decimal"
            margin="normal"
            fullWidth={true}
            helperText={errors.score?.message}
            error={!!errors.score}
            size={'small'}
            disabled={disableUpdate}
            sx={{
              input: { padding: '0.25rem', height: '1rem', fontSize: '0.75rem' },
              maxWidth: 32,
              margin: 0,
            }}
            {...field}
            autoFocus={true}
            onBlur={handleSubmit(onSubmit)}
            className={'hide-increment-input-number'}
          />
        )}
      />
    )
  }
  return (
    <Button
      size="small"
      variant="text"
      sx={{ minWidth: 'auto' }}
      onClick={() => {
        setValue('score', data ?? 0)
        setOpenEditBox(true)
      }}
    >
      {data || (
        <Typography component="span" fontWeight={300} color={orange[400]}>
          0
        </Typography>
      )}
    </Button>
  )
}

export const scorebookColumns = [
  { field: 'fullName', headerName: 'Họ và Tên', disableSort: true },
  { field: 'score5', headerName: 'KT5', render: (data: string) => data, disableSort: true },
  { field: 'score15', headerName: 'KT15', render: (data: string) => data, disableSort: true },
  { field: 'score45', headerName: 'KT45', render: (data: string) => data, disableSort: true },
  {
    field: 'score60',
    headerName: 'Thi',
    render: (data: string) => data,
    disableSort: true,
  },
]

interface Props {
  assessments: Assessment[]
  studentScoreBooks: StudentScoreBook[]
}

const ScorebookTable = ({ studentScoreBooks, assessments }: Props) => {
  const { classId, semesterId, schoolYearId } = useClassContext()
  const { showSnackbar } = useSnackbarContext()
  const groupAssessments = groupBy(assessments, 'type')
  const updateScore =
    (studentId: string, type: string, assessmentId: string) => (score: { score: number }) => {
      if (studentId) {
        setNewStudentScore({
          studentId,
          type,
          score: score.score,
          assessmentId,
          classId,
          semesterId,
          schoolYearId,
        })
          .then(() => {
            showSnackbar('Cập nhật 1 thành công', 'success')
          })
          .catch(() => showSnackbar('Cập nhật 1 thất bại', 'error'))
      }
    }
  return (
    <TableContainer component={Paper} sx={{ border: `1px solid ${grey[300]}` }}>
      <Table stickyHeader={true} sx={{ minWidth: 650 }}>
        <TableHead>
          <TableRow>
            {scorebookColumns.map((col) => {
              return <TableCell key={col.field}>{col.headerName}</TableCell>
            })}
          </TableRow>
        </TableHead>
        <TableBody>
          {studentScoreBooks.map((row, index) => {
            return (
              <TableRow key={row.id} sx={{ background: index % 2 === 0 ? '#fff' : grey[50] }}>
                {scorebookColumns.map((col) => {
                  if (col.field === 'fullName') {
                    return (
                      <TableCell key={`cell-${col.field}-${row.id}`}>
                        <TableFullNameCellComponent
                          avatarPath={row.avatarPath}
                          saintName={row.saintName}
                          lastName={row.lastName}
                          firstName={row.firstName}
                          gender={!!row.gender}
                        />
                      </TableCell>
                    )
                  }
                  const score = row[col.field as keyof StudentScoreBook] || {}
                  const assessmentByType = groupAssessments[col.field]
                  return (
                    <TableCell key={`${row.id}-${col.field}`} data-cell={col.field}>
                      {assessmentByType.map((a) => (
                        <Box
                          component="span"
                          key={`${row.id}-${col.field}-${a.id}`}
                          sx={{
                            '::after': {
                              content: "'|'",
                              padding: '0 0.25rem',
                              color: grey[500],
                            },
                            ':last-child': {
                              '::after': {
                                display: 'none',
                              },
                            },
                          }}
                        >
                          <ScoreForm
                            onChangeData={updateScore(row.id, col.field, a.id)}
                            data={get(score, a.id)}
                          />
                        </Box>
                      ))}
                    </TableCell>
                  )
                })}
              </TableRow>
            )
          })}
        </TableBody>
      </Table>
    </TableContainer>
  )
}

export default ScorebookTable
