import { Box, Typography, CircularProgress } from '@mui/material'

interface Props {
  value?: number
}

const CircularProgressBar = ({ value = 80 }: Props) => {
  return (
    <Box sx={{ position: 'relative', display: 'inline-flex' }}>
      <CircularProgress value={value} thickness={10} size={'5rem'} variant="determinate" />
      <Box
        sx={{
          top: 0,
          left: 0,
          bottom: 0,
          right: 0,
          position: 'absolute',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Typography variant="caption" component="div" color="text.secondary">{`${Math.round(
          value
        )}%`}</Typography>
      </Box>
    </Box>
  )
}

export default CircularProgressBar
