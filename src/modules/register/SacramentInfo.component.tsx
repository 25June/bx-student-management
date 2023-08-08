import { Box, TextField } from '@mui/material'
import { Controller } from 'react-hook-form'
import React from 'react'

const SacramentInfoComponent = ({ control }: { control: any }) => {
  return (
    <Box>
      <Box
        component={'fieldset'}
        sx={{
          border: '1px solid #bdbdbd',
          borderRadius: '5px',
          marginBottom: '1rem',
          position: 'relative',
        }}
      >
        <Box component={'legend'}>Rửa Tội</Box>
        <Controller
          control={control}
          name={'baptismDate'}
          render={({ field }) => (
            <TextField
              id="outlined-Birthday"
              label="Vào Ngày"
              type="date"
              helperText="Ngày / Tháng / Năm"
              margin="normal"
              InputLabelProps={{ shrink: true }}
              fullWidth={true}
              {...field}
            />
          )}
        />
        <Controller
          control={control}
          name={'baptismChurch'}
          render={({ field }) => (
            <TextField
              id="outlined-Address"
              label="Tại"
              helperText="Ví dụ: Giáo Xứ Bình Xuyên"
              margin="normal"
              fullWidth={true}
              {...field}
            />
          )}
        />
        <Controller
          control={control}
          name={'baptismByPriest'}
          render={({ field }) => (
            <TextField
              id="outlined-Address"
              label="Do Linh Mục"
              helperText="Ví dụ: Phê-rô Nguyễn Văn An"
              margin="normal"
              fullWidth={true}
              {...field}
            />
          )}
        />
      </Box>
      <Box
        component={'fieldset'}
        sx={{ border: '1px solid #bdbdbd', borderRadius: '5px', position: 'relative' }}
      >
        <Box component={'legend'}>Xưng Tội và Rước Lễ Lần Đầu</Box>
        <Controller
          control={control}
          name={'eucharistAndReconciliationDate'}
          render={({ field }) => (
            <TextField
              id="outlined-Birthday"
              label="Vào Ngày"
              type="date"
              helperText="Ngày / Tháng / Năm"
              margin="normal"
              InputLabelProps={{ shrink: true }}
              fullWidth={true}
              {...field}
            />
          )}
        />
        <Controller
          control={control}
          name={'eucharistAndReconciliationChurch'}
          render={({ field }) => (
            <TextField
              id="outlined-Address"
              label="Tại"
              helperText="Ví dụ: Giáo Xứ Bình Xuyên"
              margin="normal"
              fullWidth={true}
              {...field}
            />
          )}
        />
        <Controller
          control={control}
          name={'eucharistAndReconciliationByPriest'}
          render={({ field }) => (
            <TextField
              id="outlined-Address"
              label="Do Linh Mục"
              helperText="Ví dụ: Phê-rô Nguyễn Văn An"
              margin="normal"
              fullWidth={true}
              {...field}
            />
          )}
        />
      </Box>
    </Box>
  )
}

export default SacramentInfoComponent
