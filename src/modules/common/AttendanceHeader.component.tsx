import React from 'react'
import { Box, IconButton } from '@mui/material'
import { formatDisplayTable } from 'utils/datetime'
import EditIcon from '@mui/icons-material/Edit'
import { RollCallDates } from 'utils/customHooks'

interface AttendanceHeaderProps {
  rollCallDates: RollCallDates[]
  openDiligentDialog: (date: string, id: string) => void
}

const AttendanceHeaderComponent = ({
  rollCallDates = [],
  openDiligentDialog,
}: AttendanceHeaderProps) => {
  const onOpenDiligentDialog = (
    event: React.MouseEvent<HTMLAnchorElement> | React.MouseEvent<HTMLButtonElement>,
    date: string,
    id: string
  ) => {
    openDiligentDialog(date, id)
  }

  return (
    <Box sx={{ display: 'flex', justifyContent: 'space-around', alignItems: 'center', gap: 2 }}>
      {rollCallDates.map((sortedRollCall: RollCallDates) => (
        <Box
          key={`date-${sortedRollCall.key}`}
          sx={{ display: 'flex', gap: 0.5, justifyContent: 'flex-end', width: '84px' }}
        >
          <span>{formatDisplayTable(sortedRollCall.value)}</span>
          <IconButton
            aria-label="update"
            size={'small'}
            onClick={(event) =>
              onOpenDiligentDialog(event, sortedRollCall.value, sortedRollCall.key)
            }
          >
            <EditIcon fontSize={'small'} color={'action'} sx={{ fontSize: '1rem' }} />
          </IconButton>
        </Box>
      ))}
    </Box>
  )
}

export default AttendanceHeaderComponent
