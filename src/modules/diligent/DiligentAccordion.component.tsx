import Accordion from '@mui/material/Accordion'
import AccordionSummary from '@mui/material/AccordionSummary'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import TableFullNameCellComponent from 'modules/common/TableFullNameCell.component'
import AccordionDetails from '@mui/material/AccordionDetails'
import FormControl from '@mui/material/FormControl'
import FormLabel from '@mui/material/FormLabel'
import React from 'react'
import { StudentRows } from 'modules/diligent-table/DiligentTable.component'
import { RollCallDate } from 'utils/customHooks'
import { OnSubmitAttendanceProps } from 'modules/common/AttendanceCheckbox.component'
import { formatDisplayTable } from 'utils/datetime'
import DiligentFormComponent from './DiligentForm.component'

interface DiligentComponentProps {
  studentRow: StudentRows
  rollCallDates: RollCallDate[]
  onSubmitAttendance: (data: OnSubmitAttendanceProps) => void
  attendance: any
}

const DiligentAccordionComponent = ({
  studentRow,
  rollCallDates,
  onSubmitAttendance,
  attendance,
}: DiligentComponentProps) => {
  if (!rollCallDates) {
    return null
  }

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
                gap: 1,
                width: '100%',
                paddingTop: 1,
                paddingBottom: 1,
                borderBottom: '1px solid rgba(224, 224, 224, 1)',
                '&:last-child': { borderBottom: 0 },
                boxSizing: 'border-box',
              }}
            >
              <FormLabel component="span">{formatDisplayTable(dateAsString)}</FormLabel>
              <DiligentFormComponent
                onSubmitAttendance={onSubmitAttendance}
                rollCallKey={key}
                TL={!!(attendance?.[key] && attendance[key].tl)}
                GL={!!(attendance?.[key] && attendance[key].gl)}
              />
            </FormControl>
          )
        })}
      </AccordionDetails>
    </Accordion>
  )
}

export default DiligentAccordionComponent
