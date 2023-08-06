import Box from '@mui/material/Box'
import { Chip } from '@mui/material'
import KeyboardBackspaceIcon from '@mui/icons-material/KeyboardBackspace'
import React from 'react'
import { ImageBoxComponent } from 'modules/index'
import { StudentRows } from 'modules/diligent-table/DiligentTable.component'
import { AttendanceProps, OnSubmitAttendanceProps } from 'models/diligent'
import FormControl from '@mui/material/FormControl'
import FormLabel from '@mui/material/FormLabel'
import { formatDisplayTable } from 'utils/datetime'
import DiligentFormComponent from 'modules/diligent/DiligentForm.component'
import { get } from 'lodash'
import { RollCallDate } from 'utils/customHooks'

interface DiligentPanelComponentProps {
  studentAttendance: StudentRows
  rollCallDates: RollCallDate[]
  attendance: Record<string, AttendanceProps>
  onClose: () => void
  onSubmitAttendance: (data: OnSubmitAttendanceProps) => void
}

const DiligentPanelContentComponent = ({
  rollCallDates,
  studentAttendance,
  attendance,
  onSubmitAttendance,
  onClose,
}: DiligentPanelComponentProps) => {
  return (
    <Box pt={9} pr={2} pl={2} mb={5}>
      <Box display={'flex'} alignItems={'center'} mb={1}>
        <Chip
          color={'default'}
          size={'small'}
          icon={<KeyboardBackspaceIcon />}
          onClick={onClose}
          label="Trở về"
          variant="outlined"
        />
      </Box>
      <Box sx={{ display: 'flex' }}>
        <ImageBoxComponent
          imagePath={studentAttendance.avatarPath}
          gender={studentAttendance.gender}
          maxWidth={200}
        />
      </Box>
      <Box mt={1.5}>
        <Box textAlign={'center'} component={'h5'} fontWeight={400} margin={0}>
          {studentAttendance.saintName}
        </Box>
        <Box textAlign={'center'} component={'h3'} fontWeight={500} mt={0}>
          {`${studentAttendance.lastName} ${studentAttendance.firstName}`}
        </Box>
        <Box>
          {rollCallDates.map(({ key, dateAsString }: { key: string; dateAsString: string }) => {
            return (
              <FormControl
                component="fieldset"
                variant="standard"
                key={`checkbox-date-${key}`}
                sx={{
                  display: 'flex',
                  justifyContent: 'space-evenly',
                  flexDirection: 'row',
                  alignItems: 'center',
                  gap: 1.5,
                  width: '100%',
                  paddingTop: 1,
                  paddingBottom: 1,
                  borderBottom: '1px solid rgba(224, 224, 224, 1)',
                  '&:last-child': { borderBottom: 0 },
                  boxSizing: 'border-box',
                }}
              >
                <FormLabel component="span" sx={{ flexGrow: 1 }}>
                  {formatDisplayTable(dateAsString)}
                </FormLabel>
                <DiligentFormComponent
                  onSubmitAttendance={onSubmitAttendance}
                  rollCallKey={key}
                  TL={!!get(attendance, [`${key}`, 'tl'], false)}
                  GL={!!get(attendance, [`${key}`, 'gl'], false)}
                />
              </FormControl>
            )
          })}
        </Box>
      </Box>
    </Box>
  )
}

export default DiligentPanelContentComponent
