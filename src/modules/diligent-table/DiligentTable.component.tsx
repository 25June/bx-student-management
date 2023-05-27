import React from 'react'
import { Student } from 'models'
import TableContainer from '@mui/material/TableContainer'
import Paper from '@mui/material/Paper'
import Table from '@mui/material/Table'
import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'
import TableCell from '@mui/material/TableCell'
import TableBody from '@mui/material/TableBody'
import AttendanceHeaderComponent from 'modules/common/AttendanceHeader.component'
import AttendanceCheckboxComponent, {
  OnSubmitAttendanceProps,
} from 'modules/common/AttendanceCheckbox.component'
import { useGetAttendanceByClassId, useSubmitAttendance } from 'services/diligent'
import { useClassContext } from 'contexts/ClassContext'
import TableFullNameCellComponent from 'modules/common/TableFullNameCell.component'

interface StudentRows extends Student {
  rollCalls: Record<string, string>
}

interface DiligentTableProps {
  rows: StudentRows[]
  rollCalls: Record<string, string>
  openDiligentDialog: (date: string, id: string) => void
}

const DiligentTableComponent = ({ rows, rollCalls, openDiligentDialog }: DiligentTableProps) => {
  const { classId } = useClassContext()
  const { attendances } = useGetAttendanceByClassId(classId)
  const submitAttendance = useSubmitAttendance()

  const handleSubmitAttendance =
    (studentId: string) =>
    ({ value, rollCallKey, isMissal }: OnSubmitAttendanceProps) => {
      if (rollCallKey) {
        submitAttendance({
          studentId,
          classId,
          rollDateId: rollCallKey,
          attendance: value,
          isMissal,
        })
      }
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
                rollCall={rollCalls}
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
                  rollCall={rollCalls}
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
