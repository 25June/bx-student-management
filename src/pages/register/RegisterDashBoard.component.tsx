import { Box, ToggleButtonGroup, Typography } from '@mui/material'
import ToggleButton from '@mui/material/ToggleButton'
import TableRowsIcon from '@mui/icons-material/TableRows'
import StyleIcon from '@mui/icons-material/Style'
import SingleInfoViewComponent from 'modules/student/SingleInfoViewComponent'
import { TableComponent } from 'modules'
import { renderStudentActions, studentColumns } from 'modules/Table/helpers'
import React, { useEffect, useState } from 'react'
import { useIsMobile } from 'utils/common'
import { useGetNewRegisterStudent } from 'services/registerStudent'
import { RegisterStudent } from 'models/student'
import { RegisterActionType } from 'constant/common'

const RegisterDashBoardComponent = () => {
  const isMobile = useIsMobile()
  const [displayType, setDisplayType] = useState<string | null>('card')
  const [filteredRegisters, setFilteredRegisters] = useState<RegisterStudent[]>([])
  const { registerStudents } = useGetNewRegisterStudent()
  useEffect(() => {
    if (registerStudents) {
      setFilteredRegisters(registerStudents)
    }
  }, [registerStudents])

  const handleFilterStudentByClass = (selectedClassId: string) => {
    if (registerStudents && registerStudents.length !== 0) {
      if (!registerStudents) {
        setFilteredRegisters(registerStudents)
        return
      }

      const filtered = registerStudents.filter((stu) => {
        return stu.class?.id === selectedClassId
      })
      setFilteredRegisters(filtered)
    }
  }
  console.log(handleFilterStudentByClass)

  const handleClickAction = (data: RegisterStudent, type: RegisterActionType | any) => {
    if (type === RegisterActionType.DISABLE_QR_CODE) {
      return
    }
    if (type === RegisterActionType.CONFIRM_NEW_REGISTER) {
      return
    }
    if (type === RegisterActionType.VIEW_DETAIL) {
      return
    }
  }

  const handleChangeDisplay = (
    event: React.MouseEvent<HTMLElement>,
    newDisplayType: string | null
  ) => {
    setDisplayType(newDisplayType)
  }
  return (
    <Box>
      <Box p={isMobile ? 1 : 2}>
        <Typography variant={'h1'} sx={{ textAlign: 'left', fontSize: isMobile ? '1rem' : '2rem' }}>
          Danh Sách Đăng Ký
        </Typography>
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: 4,
            marginTop: 1,
            flexWrap: isMobile ? 'wrap' : 'nowrap',
            gap: isMobile ? 1 : 2,
          }}
        >
          <Box>{/*  List of Class */}</Box>
          <Box display={'flex'} sx={{ gap: isMobile ? 1 : 2 }}>
            <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
              <ToggleButtonGroup
                color={'info'}
                value={displayType}
                exclusive={true}
                onChange={handleChangeDisplay}
              >
                <ToggleButton value="table" aria-label="display-table" size="small">
                  <TableRowsIcon />
                </ToggleButton>
                <ToggleButton value="card" aria-label="display-card" size="small">
                  <StyleIcon />
                </ToggleButton>
              </ToggleButtonGroup>
            </Box>
          </Box>
        </Box>
        {isMobile ? (
          <Box>
            {(filteredRegisters || []).map((student) => (
              <SingleInfoViewComponent
                key={student.id}
                student={student}
                onClickAction={handleClickAction}
              />
            ))}
          </Box>
        ) : (
          <TableComponent
            columns={studentColumns}
            rows={filteredRegisters || []}
            onClickAction={handleClickAction}
            renderActionMenu={renderStudentActions}
          />
        )}
      </Box>
    </Box>
  )
}

export default RegisterDashBoardComponent
