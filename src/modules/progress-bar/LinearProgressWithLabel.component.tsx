import React, { useEffect, useState } from 'react'
import LinearProgress, { LinearProgressProps } from '@mui/material/LinearProgress'
import Typography from '@mui/material/Typography'
import Box from '@mui/material/Box'

function LinearProgressWithLabel(props: LinearProgressProps & { value: number; label: string }) {
  const [color, setColor] = useState<LinearProgressProps['color']>('inherit')
  useEffect(() => {
    if (props.value > 30 && props.value < 50) {
      setColor('warning')
      return
    }
    if (props.value >= 50 && props.value < 75) {
      setColor('info')
      return
    }
    if (props.value >= 75 && props.value <= 100) {
      setColor('success')
      return
    }
    setColor('inherit')
  }, [props.value])
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

export { LinearWithValueLabelComponent, LinearProgressComponent }
