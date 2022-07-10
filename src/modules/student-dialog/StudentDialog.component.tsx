import React, { useState } from 'react'
import {
  Box,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Button,
  TextField,
} from '@mui/material'
import { useTheme } from '@mui/material/styles'
import useMediaQuery from '@mui/material/useMediaQuery'

interface StudentDialogComponent {
  isOpen: boolean
  onClose: () => void
  actionType: string
  onAddStudent?: (data: any) => void
}
const StudentDialogComponent = ({
  isOpen,
  onClose,
  actionType,
  onAddStudent,
}: StudentDialogComponent) => {
  const theme = useTheme()
  const fullScreen = useMediaQuery(theme.breakpoints.down('md'))

  const [saintName, setSaintName] = useState<string>('')
  const [fullName, setFullName] = useState<string>('')
  const [birthday, setBirthday] = useState<Date>(new Date())
  const [address, setAddress] = useState<string>('')
  const [grade, setGrade] = useState<number>(1)
  const [phone1, setPhone1] = useState<string>('')
  const [phone2, setPhone2] = useState<string>('')

  const addStudent = (): void => {
    if (onAddStudent) {
      onAddStudent({
        saintName,
        fullName,
        birthday,
        address,
        grade,
        phone1,
        phone2,
      })
    }
    onClose()
  }
  return (
    <Dialog
      fullScreen={fullScreen}
      open={isOpen}
      onClose={onClose}
      aria-labelledby="responsive-dialog-title"
    >
      <DialogTitle id="responsive-dialog-title">
        Them Thong Tin Thieu Nhi
      </DialogTitle>
      <DialogContent dividers={true}>
        <DialogContentText>
          Xin dien vao nhung o trong duoi day!
        </DialogContentText>
        <TextField
          id="outlined-SaintName"
          label="Ten Thanh"
          helperText="Ex: Maria, Giuse, Anna"
          margin="normal"
          fullWidth={true}
          onChange={(event) => setSaintName(event.target.value)}
        />
        <TextField
          id="outlined-FullName"
          label="Ho va Ten"
          helperText="Ex: Nguyen Van A"
          margin="normal"
          fullWidth={true}
          onChange={(event) => setFullName(event.target.value)}
        />
        <TextField
          id="outlined-Birthday"
          label="Ngay Sinh"
          type="date"
          helperText="Ngay/Thang/Nam"
          margin="normal"
          fullWidth={true}
          InputLabelProps={{ shrink: true }}
          onChange={(event) => setBirthday(new Date(event.target.value))}
        />
        <TextField
          id="outlined-Address"
          label="Dia Chi"
          helperText="Ex: 231/83/13T Duong Ba Trac, p1, q8"
          margin="normal"
          fullWidth={true}
          onChange={(event) => setAddress(event.target.value)}
        />
        <TextField
          id="outlined-Grade"
          label="Lop"
          helperText="Ex: 1, 2, 3, 4, 5"
          margin="normal"
          type="number"
          fullWidth={true}
          InputLabelProps={{ shrink: true }}
          onChange={(event) => setGrade(Number(event.target.value))}
        />
        <TextField
          id="outlined-Phone1"
          label="Phone 1"
          helperText="Ex: 0973173484"
          margin="normal"
          type="number"
          fullWidth={true}
          InputLabelProps={{ shrink: true }}
          onChange={(event) => setPhone1(event.target.value)}
        />
        <TextField
          id="outlined-Phone2"
          label="Phone 2"
          helperText="Ex: 0973173484"
          margin="normal"
          type="number"
          fullWidth={true}
          InputLabelProps={{ shrink: true }}
          onChange={(event) => setPhone2(event.target.value)}
        />
      </DialogContent>
      <DialogActions sx={{ padding: '16px 24px' }}>
        <Button autoFocus={true} onClick={onClose} variant="outlined">
          Huy
        </Button>
        <Button onClick={addStudent} autoFocus={true} variant="contained">
          Luu
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default StudentDialogComponent
