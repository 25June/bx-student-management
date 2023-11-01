import React from 'react'
import { Box, IconButton, Typography } from '@mui/material'
import { formatDisplayTable } from 'utils/datetime'
import EditIcon from '@mui/icons-material/Edit'
import { RollCallDate } from 'utils/customHooks'

interface AttendanceHeaderProps {
  rollCallDates: RollCallDate[]
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
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'space-around',
        alignItems: 'center',
        gap: 2,
      }}
    >
      {rollCallDates
        .sort((a, b) => (a.dateAsNumber > b.dateAsNumber ? 1 : -1))
        .map((sortedRollCall: RollCallDate) => (
          <Box
            key={`date-${sortedRollCall.key}`}
            sx={{
              display: 'flex',
              gap: 0.5,
              justifyContent: 'center',
              width: 135,
            }}
          >
            <Typography variant={'body1'} sx={{ fontSize: '1rem' }}>
              {formatDisplayTable(sortedRollCall.dateAsString)}
            </Typography>
            <IconButton
              aria-label="update"
              size={'small'}
              sx={{ padding: 0.625 }}
              onClick={(event) =>
                onOpenDiligentDialog(event, sortedRollCall.dateAsString, sortedRollCall.key)
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
