import React, { useState } from 'react'
import { Student } from 'models'
import TableContainer from '@mui/material/TableContainer'
import Paper from '@mui/material/Paper'
import Table from '@mui/material/Table'
import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'
import TableCell from '@mui/material/TableCell'
import TableBody from '@mui/material/TableBody'
import AttendanceHeaderComponent from 'modules/common/AttendanceHeader.component'
import AttendanceCheckboxComponent from 'modules/common/AttendanceCheckbox.component'
import { OnSubmitAttendanceProps } from 'models/diligent'
import { Attendances, submitAttendance } from 'services/diligent'
import TableFullNameCellComponent from 'modules/common/TableFullNameCell.component'
import { RollCallDate } from 'utils/customHooks'
import { useIsMobile } from 'utils/common'
import { Box } from '@mui/material'
import Grow from '@mui/material/Grow'
import Stack from '@mui/material/Stack'
import SingleDateViewComponent from 'modules/single-date-view/SingleDateView.component'
import { useClassContext } from 'contexts/ClassContext'
import { blueGrey } from '@mui/material/colors'
import Typography from '@mui/material/Typography'
import { DialogType, RollCallDateActionType } from 'constant/common'
import Button from '@mui/material/Button'
import { useDialogContext } from 'contexts/DialogContext'
import List from '@mui/material/List'
import ListItem from '@mui/material/ListItem'
import Divider from '@mui/material/Divider'
import NavigateNextIcon from '@mui/icons-material/NavigateNext'
import IconButton from '@mui/material/IconButton'
import Drawer from '@mui/material/Drawer'
import DiligentPanelContentComponent from 'modules/diligent/DiligentPanelContent.component'

export interface StudentRows extends Student {
  rollCalls: Record<string, string>
}

const ListStudent = ({
  row,
  onClickMenu,
}: {
  row: StudentRows
  onClickMenu: (row: StudentRows) => void
}) => {
  return (
    <>
      <ListItem
        onClick={() => onClickMenu(row)}
        secondaryAction={
          <IconButton aria-label={'Menu'} size={'small'} color={'primary'}>
            <NavigateNextIcon fontSize={'small'} />
          </IconButton>
        }
      >
        <TableFullNameCellComponent
          avatarPath={row.avatarPath}
          saintName={row.saintName}
          lastName={row.lastName}
          firstName={row.firstName}
          gender={!!row.gender}
        />
      </ListItem>
      <Divider variant="inset" component="li" />
    </>
  )
}

interface DiligentTableProps {
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
}: DiligentTableProps) => {
  const { classId, semesterId, schoolYearId } = useClassContext()
  const { openDialog } = useDialogContext()
  const isMobile = useIsMobile()
  const [selectedStuRow, setSelectedStuRow] = useState<StudentRows>()

  const handleSubmitAttendance =
    (studentId: string) =>
    ({ value, rollCallKey, isMissal }: OnSubmitAttendanceProps) => {
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

  const handleSelectRow = (row?: StudentRows) => {
    setSelectedStuRow(row)
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
        >
          Thêm ngày điểm danh
        </Button>
      </Box>
    )
  }

  if (isMobile) {
    if (selectedRollCallDate) {
      return (
        <Box sx={{ width: '100%' }}>
          <Grow in={!!selectedRollCallDate}>
            <Stack spacing={2}>
              {rows.map((row) => {
                return (
                  <SingleDateViewComponent
                    key={row.id}
                    student={row}
                    rollCallDate={selectedRollCallDate}
                    onSubmitAttendance={handleSubmitAttendance(row.id)}
                    attendance={attendances[row.id]}
                  />
                )
              })}
            </Stack>
          </Grow>
        </Box>
      )
    }

    return (
      <Box>
        <List>
          {rows.map((row) => {
            return <ListStudent row={row} key={row.id} onClickMenu={handleSelectRow} />
          })}
        </List>
        <Drawer
          variant="temporary"
          anchor={'right'}
          open={!!selectedStuRow}
          onClose={() => handleSelectRow(undefined)}
          sx={{ width: 325, maxWidth: 325 }}
        >
          {selectedStuRow && (
            <DiligentPanelContentComponent
              studentAttendance={selectedStuRow}
              rollCallDates={rollCallDates}
              attendance={attendances[selectedStuRow.id]}
              onClose={() => handleSelectRow(undefined)}
              onSubmitAttendance={handleSubmitAttendance(selectedStuRow.id)}
            />
          )}
        </Drawer>
      </Box>
    )
  }
  return (
    <TableContainer component={Paper} sx={{ maxHeight: 500, boxShadow: 3 }}>
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
