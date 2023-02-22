import React, {
  createContext,
  PropsWithChildren,
  useContext,
  useState,
  useCallback,
  useMemo,
} from 'react'
import { SnackbarComponent } from 'modules'
import { AlertColor } from '@mui/material'

type SnackbarContextProps = {
  showSnackbar: (message: string, severity: AlertColor) => void
}

const SnackbarContext = createContext<SnackbarContextProps>({
  showSnackbar: () => console.log('snackbar ready'),
})

export const SnackbarProvider = ({ children }: PropsWithChildren<{}>) => {
  const [snackBarMessage, setSnackBarMessage] = useState<string>('')
  const [snackBarSeverity, setSnackBarSeverity] = useState<AlertColor>('success')
  const [isOpenSnackbar, setOpenSnackbar] = useState<boolean>(false)

  const showSnackbar = useCallback((message: string, severity: AlertColor) => {
    setSnackBarMessage(message)
    setSnackBarSeverity(severity)
    setOpenSnackbar(true)
  }, [])

  const value = useMemo(() => ({ showSnackbar }), [showSnackbar])

  return (
    <SnackbarContext.Provider value={value}>
      {children}
      <SnackbarComponent
        severity={snackBarSeverity}
        message={snackBarMessage}
        isOpen={isOpenSnackbar}
        close={() => setOpenSnackbar(false)}
      />
    </SnackbarContext.Provider>
  )
}

export const useSnackbarContext = () => {
  const useSnackbar = useContext(SnackbarContext)
  if (!useSnackbarContext) {
    console.error('Can not find snackbar context')
  }
  return useSnackbar
}
