import React from 'react'
import { Box, Typography } from '@mui/material'
import { LinearWithValueLabelComponent } from 'modules/progress-bar/LinearProgressWithLabel.component'
import { CountStudentPresentResponse } from 'utils/diligentSummary'

interface AttendanceCountComponentProps {
  studentAttendanceCount: CountStudentPresentResponse
  totalStudents: number
}

const AttendanceCountComponent = ({
  studentAttendanceCount,
  totalStudents,
}: AttendanceCountComponentProps) => {
  return (
    <Box
      sx={{
        position: 'sticky',
        top: 64,
        zIndex: 1,
        boxShadow: 3,
        borderRadius: 1,
        backgroundImage: 'linear-gradient(to top, rgba(255,255,255,0.8), rgba(255,255,255,1))',
        padding: 1,
      }}
    >
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          gap: 2,
        }}
      >
        <Typography fontSize={'0.75rem'}>GL</Typography>
        <LinearWithValueLabelComponent
          progress={(studentAttendanceCount.gl / totalStudents) * 100}
          label={`${studentAttendanceCount.gl} em`}
        />
      </Box>
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          gap: 2,
        }}
      >
        <Typography fontSize={'0.75rem'}>TL</Typography>
        <LinearWithValueLabelComponent
          progress={(studentAttendanceCount.tl / totalStudents) * 100}
          label={`${studentAttendanceCount.tl} em`}
        />
      </Box>
    </Box>
  )
}

export default AttendanceCountComponent
