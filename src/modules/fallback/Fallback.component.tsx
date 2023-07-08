import Box from '@mui/material/Box'
import CircularProgress from '@mui/material/CircularProgress'

const FallbackComponent = () => {
  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        width: '100vw',
        height: '100vh',
      }}
    >
      <CircularProgress color="primary" />
    </Box>
  )
}

export default FallbackComponent
