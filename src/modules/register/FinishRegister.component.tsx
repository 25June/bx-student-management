import { Box, Typography } from '@mui/material'
import React from 'react'
import { grey } from '@mui/material/colors'

const FinishRegisterComponent = () => {
  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        padding: 3,
        boxSizing: 'border-box',
        position: 'relative',
        zIndex: 1,
      }}
    >
      <Box
        sx={{
          width: 500,
          border: '1px solid #F0F0F0',
          padding: 2,
          borderRadius: 5,
          boxShadow: 2,
          background: 'rgba(255,255,255, 0.6)',
        }}
      >
        <Typography
          variant={'h5'}
          sx={{ color: grey[900], textAlign: 'left', marginBottom: '0.5rem' }}
        >
          Ghi Danh Thành Công!
        </Typography>
        <Typography sx={{ color: grey[900], textAlign: 'left' }} fontSize={'0.825rem'}>
          Cảm ơn quý phụ huynh đã cho các em thiếu nhi học giáo lý.
        </Typography>
      </Box>
    </Box>
  )
}

export default FinishRegisterComponent
