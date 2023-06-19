import { Checkbox } from '@mui/material'
import Accordion from '@mui/material/Accordion'
import AccordionSummary from '@mui/material/AccordionSummary'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import TableFullNameCellComponent from 'modules/common/TableFullNameCell.component'
import AccordionDetails from '@mui/material/AccordionDetails'
import FormControl from '@mui/material/FormControl'
import FormLabel from '@mui/material/FormLabel'
import FormControlLabel from '@mui/material/FormControlLabel'
import React from 'react'
import { StudentRows } from 'modules/diligent-table/DiligentTable.component'
import { RollCallDates } from 'utils/customHooks'
import { OnSubmitAttendanceProps } from 'modules/common/AttendanceCheckbox.component'
import { useClassContext } from 'contexts/ClassContext'
import { useGetAttendanceByClassId } from 'services/diligent'
import { formatDisplayTable } from 'utils/datetime'

interface DiligentComponentProps {
  studentRow: StudentRows
  rollCallDates: RollCallDates[]
  onSubmitAttendance: (data: OnSubmitAttendanceProps) => void
}

const DiligentAccordionComponent = ({
  studentRow,
  rollCallDates,
  onSubmitAttendance,
}: DiligentComponentProps) => {
  const { classId } = useClassContext()
  const { attendances } = useGetAttendanceByClassId({ classId })
  if (!attendances || !rollCallDates) {
    return null
  }
  const stuAttendance = attendances[studentRow.id]
  return (
    <Accordion>
      <AccordionSummary
        expandIcon={<ExpandMoreIcon />}
        aria-controls={`panel-content-${studentRow.id}`}
        id={`panel-header-${studentRow.id}`}
      >
        <TableFullNameCellComponent
          avatarPath={studentRow.avatarPath}
          saintName={studentRow.saintName}
          lastName={studentRow.lastName}
          firstName={studentRow.firstName}
          gender={!!studentRow.gender}
        />
      </AccordionSummary>
      <AccordionDetails>
        {rollCallDates.map(({ key, value }: { key: string; value: string }) => {
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
                gap: 1,
                width: '100%',
                paddingTop: 1,
                paddingBottom: 1,
                borderBottom: '1px solid rgba(224, 224, 224, 1)',
                '&:last-child': { borderBottom: 0 },
                boxSizing: 'border-box',
              }}
            >
              <FormLabel component="span">{formatDisplayTable(value)}</FormLabel>
              <FormControlLabel
                control={
                  <Checkbox
                    sx={{ padding: 0.5 }}
                    size={'small'}
                    checked={!!(stuAttendance && stuAttendance?.[key] && stuAttendance[key].tl)}
                    onChange={(event) =>
                      onSubmitAttendance({
                        value: event.target.checked,
                        rollCallKey: key,
                        isMissal: true,
                      })
                    }
                  />
                }
                label="Thánh Lễ"
                sx={{ margin: 0 }}
              />

              <FormControlLabel
                control={
                  <Checkbox
                    sx={{ padding: 0.5 }}
                    size={'small'}
                    checked={!!(stuAttendance && stuAttendance?.[key] && stuAttendance[key].gl)}
                    onChange={(event) =>
                      onSubmitAttendance({
                        value: event.target.checked,
                        rollCallKey: key,
                        isMissal: false,
                      })
                    }
                  />
                }
                label={'Giáo Lý'}
                sx={{ margin: 0 }}
              />
            </FormControl>
          )
        })}
      </AccordionDetails>
    </Accordion>
  )
}

export default DiligentAccordionComponent
