import { Box, TextField } from '@mui/material'
import { Controller } from 'react-hook-form'
import InputAdornment from '@mui/material/InputAdornment'
import React from 'react'

const StudentInfoStepComponent = ({ control }: { control: any }) => {
  return (
    <Box>
      <Box display={'flex'} justifyContent={'space-between'} gap={1}>
        <Controller
          control={control}
          name={'saintName'}
          render={({ field }) => (
            <TextField
              id="outlined-SaintName"
              label="Tên thánh"
              helperText="Ví dụ: Maria/Giuse/Anna"
              margin="normal"
              fullWidth={true}
              {...field}
            />
          )}
        />
      </Box>
      <Controller
        control={control}
        name={'fullName'}
        render={({ field }) => (
          <TextField
            id="outlined-FullName"
            label="Họ và Tên"
            helperText="Ví dụ: Nguyễn Văn An"
            margin="normal"
            fullWidth={true}
            {...field}
          />
        )}
      />
      <Controller
        control={control}
        name={'birthday'}
        render={({ field }) => (
          <TextField
            id="outlined-Birthday"
            label="Sinh Ngày"
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
        name={'bornIn'}
        render={({ field }) => (
          <TextField
            id="outlined-Address"
            label="Sinh Tại"
            helperText="Ví dụ: Tp. Hồ Chí Minh"
            margin="normal"
            fullWidth={true}
            {...field}
          />
        )}
      />
      <Box display={'flex'} justifyContent={'space-between'} gap={1.5}>
        <Controller
          control={control}
          name={'schoolName'}
          render={({ field }) => (
            <TextField
              id="outlined-Address"
              label="Học Trường"
              margin="normal"
              helperText="Ví dụ: Rạch Ông"
              {...field}
            />
          )}
        />
        <Controller
          control={control}
          name={'grade'}
          render={({ field }) => (
            <TextField
              sx={{ marginLeft: 1, maxWidth: '30%' }}
              id="outlined-Grade"
              label="Văn Hoá"
              helperText="Ví dụ: 1"
              margin="normal"
              type="string"
              InputLabelProps={{ shrink: true }}
              fullWidth={true}
              InputProps={{
                startAdornment: <InputAdornment position="start">Lớp</InputAdornment>,
              }}
              {...field}
            />
          )}
        />
      </Box>
    </Box>
  )
}

export default StudentInfoStepComponent
