import Box from '@mui/material/Box'
import CircularProgress from '@mui/material/CircularProgress'

const FallbackComponent = () => {
  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        width: 'calc(100vw - 54px)',
        height: 'calc(100vh - 64px)',
      }}
    >
      <CircularProgress color="primary" />
    </Box>
  )
}

export default FallbackComponent
