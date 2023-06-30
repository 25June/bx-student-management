import React from 'react'
import { Alert, Snackbar, AlertColor } from '@mui/material'

interface SnackbarComponentProps {
  severity: AlertColor
  message: string
  isOpen: boolean
  close: () => void
}

const SnackbarComponent = ({ severity, message, isOpen, close }: SnackbarComponentProps) => {
  return (
    <Snackbar open={isOpen} autoHideDuration={500} onClose={close}>
      <Alert onClose={close} severity={severity} sx={{ width: '100%' }}>
        {message}
      </Alert>
    </Snackbar>
  )
}

export default SnackbarComponent
