import React from 'react'
import { Student } from 'models/student'
import { OnSubmitAttendanceProps } from 'models/diligent'
import {
  TableContainer,
  Paper,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Grow,
  // Stack,
  Box,
  Typography,
  Button,
} from '@mui/material'
import { blueGrey } from '@mui/material/colors'
import AttendanceHeaderComponent from 'modules/diligent-table/AttendanceHeader.component'
import AttendanceCheckboxComponent from 'modules/diligent-table/AttendanceCheckbox.component'
import TableFullNameCellComponent from 'modules/common/TableFullNameCell.component'
import SingleDateViewComponent from 'modules/single-date-view/SingleDateView.component'
import { RollCallDate } from 'models/diligent'
import { useIsMobile } from 'utils/common'
import { DialogType, RollCallDateActionType } from 'constant/common'
import { useDialogContext } from 'contexts/DialogContext'
import { useClassContext } from 'contexts/ClassContext'
import { Attendances, submitAttendance } from 'services/diligent'
import { FixedSizeList } from 'react-window'
import AutoSizer from 'react-virtualized-auto-sizer'

export interface StudentRows extends Student {
  rollCalls: Record<string, string>
}

interface Props {
  rows: StudentRows[]
  rollCallDates: RollCallDate[]
  openDiligentDialog: (date: string, id: string) => void
  selectedRollCallDate?: RollCallDate
  attendances?: Attendances | null
}

const DiligentTableComponent = ({
  rows,
  rollCallDates,
  openDiligentDialog,
  selectedRollCallDate,
  attendances,
}: Props) => {
  const { classId, semesterId, schoolYearId, disableUpdate } = useClassContext()
  const { openDialog } = useDialogContext()
  const isMobile = useIsMobile()

  const handleSubmitAttendance =
    (studentId: string) =>
    ({ value, rollCallKey, isMissal }: OnSubmitAttendanceProps) => {
      if (disableUpdate) {
        return Promise.reject(new Error('wrong class'))
      }
      if (rollCallKey) {
        return submitAttendance({
          studentId,
          classId,
          rollDateId: rollCallKey,
          attendance: value,
          isMissal,
          semesterId,
          schoolYearId,
        })
      }
    }

  if (!attendances || !rollCallDates || rollCallDates.length === 0) {
    return (
      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
        <Typography textTransform={'capitalize'} variant={'caption'} color={blueGrey[700]}>
          <i>Chưa có ngày điểm danh. Thêm ngày điểm danh.</i>
        </Typography>
        <Button
          variant={'contained'}
          onClick={() =>
            openDialog(
              DialogType.STUDY_DATE_DIALOG,
              RollCallDateActionType.ADD_STUDY_DATE,
              undefined,
              undefined
            )
          }
          disabled={disableUpdate}
        >
          Thêm ngày điểm danh
        </Button>
      </Box>
    )
  }

  if (isMobile && selectedRollCallDate) {
    return (
      <Box sx={{ width: '100%', height: '100%' }}>
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
                  itemCount={(rows || []).length}
                  itemSize={156}
                  width={width}
                >
                  {({ index, style }) => (
                    <div
                      style={{
                        ...style,
                        paddingTop: index === 0 ? '1rem' : 0,
                        paddingBottom: index === rows.length - 1 ? '3rem' : 0,
                      }}
                    >
                      <SingleDateViewComponent
                        key={rows[index].id}
                        student={rows[index]}
                        rollCallDate={selectedRollCallDate}
                        onSubmitAttendance={handleSubmitAttendance(rows[index].id)}
                        attendance={attendances[rows[index].id]}
                      />
                    </div>
                  )}
                </FixedSizeList>
              )}
            </AutoSizer>
          </Box>
        </Grow>
      </Box>
    )
  }
  return (
    <TableContainer
      component={Paper}
      sx={{ maxHeight: 500, boxShadow: 3, background: 'rgba(255,255,255, 0.6)' }}
    >
      <Table stickyHeader={true} sx={{ minWidth: 650 }} aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell key={'fullName'}>Họ và Tên</TableCell>
            <TableCell key={'rollDates'}>
              <AttendanceHeaderComponent
                openDiligentDialog={openDiligentDialog}
                rollCallDates={rollCallDates}
              />
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map((row) => (
            <TableRow key={row.id} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
              <TableCell sx={{ paddingTop: 1, paddingBottom: 1 }}>
                <TableFullNameCellComponent
                  avatarPath={row.avatarPath}
                  saintName={row.saintName}
                  lastName={row.lastName}
                  firstName={row.firstName}
                  gender={!!row.gender}
                />
              </TableCell>
              <TableCell sx={{ paddingTop: 1, paddingBottom: 1 }}>
                <AttendanceCheckboxComponent
                  studentId={row.id}
                  rollCallDates={rollCallDates}
                  attendance={attendances?.[row.id] || {}}
                  onSubmitAttendance={handleSubmitAttendance(row.id)}
                />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  )
}

export default DiligentTableComponent
