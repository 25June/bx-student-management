import { Controller } from 'react-hook-form'
import { Box, TextField } from '@mui/material'
import { formatPhoneWithoutDot } from 'utils/formatDataForTable'
import InputAdornment from '@mui/material/InputAdornment'
import React from 'react'

const ParentInfoStepComponent = ({ control }: { control: any }) => {
  return (
    <Box>
      <Controller
        control={control}
        name={'parent.fatherName'}
        render={({ field }) => (
          <TextField
            id="outlined-Address"
            label="Tên Thánh, Họ và Tên Cha"
            helperText="Ví dụ: Phê-rô Nguyễn Văn An"
            margin="normal"
            fullWidth={true}
            {...field}
          />
        )}
      />
      <Controller
        control={control}
        name={'parent.motherName'}
        render={({ field }) => (
          <TextField
            id="outlined-Address"
            label="Tên Thánh, Họ và Tên Mẹ"
            helperText="Ví dụ: Anna Nguyễn Thị An"
            margin="normal"
            fullWidth={true}
            {...field}
          />
        )}
      />
      <Controller
        control={control}
        name={'address'}
        render={({ field }) => (
          <TextField
            id="outlined-Address"
            label="Địa Chỉ Thường Trú"
            helperText="Ví dụ: 68 Dương Bá Trạc, p1, q8"
            margin="normal"
            multiline={true}
            maxRows={2}
            fullWidth={true}
            {...field}
          />
        )}
      />
      <Controller
        control={control}
        name={'shortTermAddress'}
        render={({ field }) => (
          <TextField
            id="outlined-Address"
            label="Địa Chỉ Tạm Trú"
            helperText="Ví dụ: 68 Dương Bá Trạc, p1, q8"
            margin="normal"
            multiline={true}
            maxRows={2}
            fullWidth={true}
            {...field}
          />
        )}
      />
      <Box sx={{ display: 'flex', justifyContent: 'space-between', gap: 1.5 }}>
        <Controller
          control={control}
          name={'phone1.name'}
          render={({ field }) => (
            <TextField
              sx={{ maxWidth: '35%' }}
              id={`outlined-name-phone1`}
              label="Tên"
              helperText="Ví dụ: Cha"
              margin="normal"
              type="text"
              fullWidth={true}
              InputLabelProps={{ shrink: true }}
              {...field}
            />
          )}
        />
        <Controller
          control={control}
          name={'phone1.number'}
          render={({ field }) => (
            <TextField
              sx={{ marginLeft: 1 }}
              id={`outlined-number-phone1`}
              label="Điện Thoại"
              helperText="Ví dụ: 0123456789"
              margin="normal"
              type="number"
              fullWidth={true}
              InputLabelProps={{ shrink: true }}
              {...field}
              inputMode={'numeric'}
              value={formatPhoneWithoutDot(field.value)}
              InputProps={{
                startAdornment: <InputAdornment position="start">+84</InputAdornment>,
              }}
            />
          )}
        />
      </Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', gap: 1.5 }}>
        <Controller
          control={control}
          name={'phone2.name'}
          render={({ field }) => (
            <TextField
              sx={{ maxWidth: '35%' }}
              id={`outlined-name-phone2`}
              label="Tên"
              helperText="Ví dụ: Mẹ"
              margin="normal"
              type="text"
              fullWidth={true}
              InputLabelProps={{ shrink: true }}
              {...field}
            />
          )}
        />
        <Controller
          control={control}
          name={'phone2.number'}
          render={({ field }) => (
            <TextField
              sx={{ marginLeft: 1 }}
              id={`outlined-number-phone2`}
              label="Điện Thoại"
              helperText="Ví dụ: 0123456789"
              margin="normal"
              type="text"
              fullWidth={true}
              InputLabelProps={{ shrink: true }}
              {...field}
              inputMode={'numeric'}
              value={formatPhoneWithoutDot(field.value)}
              InputProps={{
                startAdornment: <InputAdornment position="start">+84</InputAdornment>,
              }}
            />
          )}
        />
      </Box>
    </Box>
  )
}

export default ParentInfoStepComponent
