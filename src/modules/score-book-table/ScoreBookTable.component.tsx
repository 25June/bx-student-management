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
  Grow,
  TextField,
} from '@mui/material'
import { Controller, useForm } from 'react-hook-form'
import { Assessment, StudentScoreBook } from 'models'
import TableFullNameCellComponent from 'modules/common/TableFullNameCell.component'
import { grey, orange } from '@mui/material/colors'
import { groupBy, get } from 'lodash'
import { useState, useCallback } from 'react'
import { useClassContext } from 'contexts/ClassContext'
import { setNewStudentScore } from 'services/scorebook'
import { useSnackbarContext } from 'contexts/SnackbarContext'
import { FixedSizeList } from 'react-window'
import AutoSizer from 'react-virtualized-auto-sizer'
import { useIsMobile } from 'utils/common'
import { Item } from 'modules/single-score-view/SingleScoreView.component'
import { AssessmentEnum, colorPalettes } from 'constant/common'
import ScoreBookPanelComponent from 'modules/score-book-panel/ScoreBookPanel.component'
import { styled } from '@mui/material/styles'

const AverageScore = styled(Box, { shouldForwardProp: (props) => props !== 'assessmentType' })<{
  assessmentType: AssessmentEnum
}>(({ assessmentType }) => ({
  backgroundColor: colorPalettes[assessmentType],
  borderRadius: '10px',
  color: '#fff',
  padding: '0.25rem 0.5rem',
  fontSize: '0.75rem',
  lineHeight: '125%',
}))

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
  const isMobile = useIsMobile()

  const [isOpenScoreBook, setIsOpenScoreBook] = useState<boolean>(false)
  const [selectedStudent, setSelectedStudent] = useState<StudentScoreBook>()

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

  const getAverage = ({
    assessments,
    specificScorebook,
    assessmentType,
  }: {
    assessments: Assessment[]
    specificScorebook?: Record<string, number>
    assessmentType: AssessmentEnum
  }): string => {
    if (!specificScorebook || assessments.length <= 0) {
      return '0'
    }
    const assessmentsByType = assessments.filter((a) => a.type === assessmentType)
    const sum = assessmentsByType.reduce((acc, cur) => {
      return acc + specificScorebook[cur.id] ?? 0
    }, 0)
    return (sum / assessmentsByType.length).toFixed(2)
  }

  const handleCloseScoreBook = useCallback(() => {
    setSelectedStudent(undefined)
    setIsOpenScoreBook(false)
  }, [])

  if (isMobile) {
    return (
      <Grow in={true}>
        <Box
          sx={{
            background: 'transparent',
            backdropFilter: 'blur(2px)',
            height: '100%',
            WebkitMask: 'linear-gradient(0deg,#0000,#000 5% 95%,#0000)',
          }}
        >
          <AutoSizer>
            {({ height, width }: any) => (
              <FixedSizeList
                height={height}
                itemCount={(studentScoreBooks || []).length}
                itemSize={isMobile ? 156 : 170}
                width={width}
              >
                {({ index, style }) => (
                  <div
                    style={{
                      ...style,
                      paddingTop: index === 0 ? '1rem' : 0,
                      paddingBottom: index === studentScoreBooks.length - 1 ? '3rem' : 0,
                    }}
                  >
                    <Item>
                      <TableFullNameCellComponent
                        avatarPath={studentScoreBooks[index].avatarPath}
                        saintName={studentScoreBooks[index].saintName}
                        lastName={studentScoreBooks[index].lastName}
                        firstName={studentScoreBooks[index].firstName}
                        gender={!!studentScoreBooks[index].gender}
                        action={() => {
                          setIsOpenScoreBook(true)
                          setSelectedStudent(studentScoreBooks[index])
                        }}
                      />
                      {studentScoreBooks[index] ? (
                        <Box
                          sx={{
                            display: 'flex',
                            justifyContent: 'space-evenly',
                            gap: '0.5rem',
                            flexWrap: 'wrap',
                            alignItems: 'center',
                            padding: '1rem 0.5rem 0 0.5rem',
                          }}
                        >
                          <Box>Trung Bình:</Box>
                          <AverageScore assessmentType={AssessmentEnum.KT5}>
                            KT5 -{' '}
                            {getAverage({
                              assessments,
                              specificScorebook: studentScoreBooks[index].score5,
                              assessmentType: AssessmentEnum.KT5,
                            })}
                          </AverageScore>
                          <AverageScore assessmentType={AssessmentEnum.KT15}>
                            KT15 -{' '}
                            {getAverage({
                              assessments,
                              specificScorebook: studentScoreBooks[index].score15,
                              assessmentType: AssessmentEnum.KT15,
                            })}
                          </AverageScore>
                          <AverageScore assessmentType={AssessmentEnum.KT45}>
                            KT45 -{' '}
                            {getAverage({
                              assessments,
                              specificScorebook: studentScoreBooks[index].score45,
                              assessmentType: AssessmentEnum.KT45,
                            })}
                          </AverageScore>
                          <AverageScore assessmentType={AssessmentEnum.KT60}>
                            KT60 -{' '}
                            {getAverage({
                              assessments,
                              specificScorebook: studentScoreBooks[index].score60,
                              assessmentType: AssessmentEnum.KT60,
                            })}
                          </AverageScore>
                        </Box>
                      ) : null}
                    </Item>
                  </div>
                )}
              </FixedSizeList>
            )}
          </AutoSizer>
          <ScoreBookPanelComponent
            isOpen={!!(selectedStudent?.id && isOpenScoreBook)}
            onClose={handleCloseScoreBook}
            studentId={selectedStudent?.id ?? ''}
          />
        </Box>
      </Grow>
    )
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
                  const score = row[col.field as keyof StudentScoreBook] ?? {}
                  const assessmentByType = groupAssessments[col.field] ?? []
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
