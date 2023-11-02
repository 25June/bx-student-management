import { Chip, FormControl, FormLabel, Box, Drawer, Typography } from '@mui/material'
import KeyboardBackspaceIcon from '@mui/icons-material/KeyboardBackspace'
import React, { useEffect, useState } from 'react'
import { ImageBoxComponent } from 'modules/index'
import { Student } from 'models/student'
import { OnSubmitAttendanceProps } from 'models/diligent'
import { formatDisplayTable } from 'utils/datetime'
import { groupRollCallToSortedMonths, RollCallDate } from 'utils/customHooks'
import DiligentFormComponent from 'modules/diligent/DiligentForm.component'
import { get, isEmpty, orderBy } from 'lodash'
import { useClassContext } from 'contexts/ClassContext'
import { useDiligentContext } from 'contexts/DiligentContext'
import { submitAttendance } from 'services/diligent'

interface Props {
  student?: Student
  open: boolean
  onClose: () => void
}

const DiligentPanelComponent = ({ student, open, onClose }: Props) => {
  const { attendances, rollCallDates, fetchRollCallDates } = useDiligentContext()
  const { disableUpdate, classId, schoolYearId, semesterId } = useClassContext()
  const [groupRollDate, setGroupRollDate] = useState<Record<string, RollCallDate[]>>()

  useEffect(() => {
    if (open && fetchRollCallDates) {
      fetchRollCallDates({ classId, semesterId, schoolYearId })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open])

  useEffect(() => {
    if (rollCallDates) {
      const sortedMonthDate = groupRollCallToSortedMonths(rollCallDates)
      setGroupRollDate(sortedMonthDate)
    }
  }, [rollCallDates])

  const onSubmitAttendance = ({ value, rollCallKey, isMissal }: OnSubmitAttendanceProps) => {
    if (disableUpdate || !student) {
      return Promise.reject('wrong class')
    }
    if (rollCallKey) {
      return submitAttendance({
        studentId: student.id,
        classId,
        rollDateId: rollCallKey,
        attendance: value,
        isMissal,
        semesterId,
        schoolYearId,
      })
    }
  }
  const attendance = get(attendances, [student?.id || ''], null)
  return (
    <Drawer
      variant="temporary"
      anchor={'right'}
      open={open}
      onClose={onClose}
      sx={{ width: 325, maxWidth: 325 }}
    >
      {student && attendance && !isEmpty(groupRollDate) && (
        <Box pt={2} pr={2} pl={2} mb={5}>
          <Box display={'flex'} alignItems={'center'} mb={2}>
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
              imagePath={student.avatarPath}
              gender={student.gender}
              maxWidth={200}
            />
          </Box>
          <Box mt={1.5}>
            <Box textAlign={'center'} component={'h5'} fontWeight={400} margin={0}>
              {student.saintName}
            </Box>
            <Box textAlign={'center'} component={'h3'} fontWeight={500} mt={0}>
              {`${student.lastName} ${student.firstName}`}
            </Box>
            {orderBy(Object.keys(groupRollDate), [], ['desc']).map((monthKey) => (
              <Box key={monthKey}>
                <Typography sx={{ margin: '0.5rem 0' }}>{monthKey}</Typography>
                {orderBy(groupRollDate[monthKey], ['dateAsNumber'], ['desc']).map(
                  ({ dateAsString, key }) => (
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
                        disabled={disableUpdate}
                      />
                    </FormControl>
                  )
                )}
              </Box>
            ))}
          </Box>
        </Box>
      )}
    </Drawer>
  )
}

export default DiligentPanelComponent
