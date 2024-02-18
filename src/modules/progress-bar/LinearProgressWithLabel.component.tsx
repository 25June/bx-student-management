import React from 'react'
import LinearProgress, { LinearProgressProps } from '@mui/material/LinearProgress'
import Typography from '@mui/material/Typography'
import Box from '@mui/material/Box'
import { colors } from '@mui/material'
import { get } from 'lodash'

function LinearProgressWithLabel(props: LinearProgressProps & { value: number; label: string }) {
  let color: LinearProgressProps['color'] = 'inherit'
  if (props.value > 30 && props.value < 50) {
    color = 'warning'
  }
  if (props.value >= 50 && props.value < 75) {
    color = 'info'
  }
  if (props.value >= 75 && props.value <= 100) {
    color = 'success'
  }
  return (
    <Box sx={{ display: 'flex', alignItems: 'center' }}>
      <Box sx={{ width: '100%', mr: 1 }}>
        <LinearProgress variant="determinate" color={color} {...props} />
      </Box>
      <Box sx={{ minWidth: 55 }}>
        <Typography variant="body2" color="text.secondary">
          {props.label}
        </Typography>
      </Box>
    </Box>
  )
}

const ProgressBarContainer = ({
  title,
  current,
  total,
  backgroundCurrent,
  backgroundTotal,
  width = 64,
}: {
  title: string
  current: number
  total: number
  backgroundTotal: string
  backgroundCurrent: string
  width?: number
}) => {
  return (
    <Box
      sx={{ gap: '0.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
    >
      <Box sx={{ width }}>
        <Typography fontSize={'0.825rem'}>{title}</Typography>
      </Box>
      <Box
        sx={{
          flex: 1,
          height: 20,
          backgroundColor: backgroundTotal,
          width: '100%',
          borderRadius: '5px',
        }}
      >
        <Box
          sx={{
            width: `${(current / total) * 100}%`,
            backgroundColor: backgroundCurrent,
            textAlign: 'right',
            borderRadius: '5px',
          }}
        >
          <Box sx={{ paddingRight: 1 }}>{current}</Box>
        </Box>
      </Box>
    </Box>
  )
}

const PillProgress = ({ value, total, label }: { value: number; total: number; label: string }) => {
  let color: any = 'grey'
  const percent = (value / total) * 100 <= 30 ? 20 : (value / total) * 100
  if (percent > 30 && percent < 50) {
    color = 'amber'
  }
  if (percent >= 50 && percent < 75) {
    color = 'lightBlue'
  }
  if (percent >= 75 && percent <= 100) {
    color = 'lightGreen'
  }
  return (
    <Box
      sx={{
        flex: 1,
        height: 16,
        backgroundColor: get(colors, [color, 50]),
        width: '100%',
        borderRadius: '5px',
      }}
    >
      <Box
        sx={{
          width: `${percent}%`,
          backgroundColor: get(colors, [color, 700]),
          textAlign: 'right',
          borderRadius: '5px',
          transition: 'all 0.2s ease-out',
        }}
      >
        <Box sx={{ fontSize: '0.875rem', paddingRight: 1, color: get(colors, [color, 100]) }}>
          {label}
        </Box>
      </Box>
    </Box>
  )
}

const LinearWithValueLabelComponent = ({
  progress,
  label,
}: {
  progress: number
  label: string
}) => {
  return (
    <Box sx={{ width: '100%' }}>
      <LinearProgressWithLabel value={progress} label={label} />
    </Box>
  )
}

const LinearProgressComponent = ({ progress }: { progress: number }) => {
  return (
    <Box sx={{ width: '100%' }}>
      <LinearProgress color="primary" variant="determinate" value={progress || 0} />
    </Box>
  )
}

export {
  LinearWithValueLabelComponent,
  LinearProgressComponent,
  ProgressBarContainer,
  PillProgress,
}
