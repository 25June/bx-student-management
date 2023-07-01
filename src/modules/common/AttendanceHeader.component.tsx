import React from 'react'
import { Box, IconButton, Typography } from '@mui/material'
import { formatDisplayTable } from 'utils/datetime'
import EditIcon from '@mui/icons-material/Edit'
import { RollCallDate } from 'utils/customHooks'
import { useIsMobile } from 'utils/common'

interface AttendanceHeaderProps {
  rollCallDates: RollCallDate[]
  openDiligentDialog: (date: string, id: string) => void
}

const AttendanceHeaderComponent = ({
  rollCallDates = [],
  openDiligentDialog,
}: AttendanceHeaderProps) => {
  const isMobile = useIsMobile()
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
        gap: isMobile ? 1 : 2,
      }}
    >
      {rollCallDates.map((sortedRollCall: RollCallDate) => (
        <Box
          key={`date-${sortedRollCall.key}`}
          sx={{ display: 'flex', gap: 0.5, justifyContent: 'flex-end', width: isMobile ? 64 : 84 }}
        >
          <Typography variant={'body1'} sx={{ fontSize: isMobile ? '0.75rem' : '1rem' }}>
            {formatDisplayTable(sortedRollCall.dateAsString)}
          </Typography>
          <IconButton
            aria-label="update"
            size={'small'}
            sx={{ padding: isMobile ? 0 : 0.625 }}
            onClick={(event) =>
              onOpenDiligentDialog(event, sortedRollCall.dateAsString, sortedRollCall.key)
            }
          >
            <EditIcon
              fontSize={'small'}
              color={'action'}
              sx={{ fontSize: isMobile ? '0.75rem' : '1rem' }}
            />
          </IconButton>
        </Box>
      ))}
    </Box>
  )
}

export default AttendanceHeaderComponent
