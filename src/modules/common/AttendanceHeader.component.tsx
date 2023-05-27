import React from 'react'
import { Box, IconButton } from '@mui/material'
import { formatDisplayTable } from 'utils/datetime'
import EditIcon from '@mui/icons-material/Edit'

interface AttendanceHeaderProps {
  rollCall?: Record<string, string>
  openDiligentDialog: (date: string, id: string) => void
}

const AttendanceHeaderComponent = ({ rollCall, openDiligentDialog }: AttendanceHeaderProps) => {
  const onOpenDiligentDialog = (
    event: React.MouseEvent<HTMLAnchorElement> | React.MouseEvent<HTMLButtonElement>,
    date: string,
    id: string
  ) => {
    openDiligentDialog(date, id)
  }

  return (
    <Box sx={{ display: 'flex', justifyContent: 'space-around', alignItems: 'center', gap: 2 }}>
      {rollCall
        ? Object.keys(rollCall).map((key: string) => (
            <Box
              key={`date-${key}-${rollCall[key]}`}
              sx={{ display: 'flex', gap: 0.5, justifyContent: 'flex-end', width: '84px' }}
            >
              <span>{formatDisplayTable(rollCall[key])}</span>
              <IconButton
                aria-label="update"
                size={'small'}
                onClick={(event) => onOpenDiligentDialog(event, rollCall[key], key)}
              >
                <EditIcon fontSize={'small'} color={'action'} sx={{ fontSize: '1rem' }} />
              </IconButton>
            </Box>
          ))
        : null}
    </Box>
  )
}

export default AttendanceHeaderComponent
