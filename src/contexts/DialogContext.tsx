import React, {
  createContext,
  PropsWithChildren,
  useCallback,
  useContext,
  useMemo,
  useState,
} from 'react'
import {
  AssessmentActionType,
  DialogType,
  RollCallDateActionType,
  StudentActionType,
} from 'constant/common'
import { AssessmentDialogComponent, StudentDialogComponent } from 'modules'
import DiligentDialogComponent from 'modules/diligent-dialog/DiligentDialog.component'
import { Assessment, Student } from 'models'

type ActionType = AssessmentActionType | StudentActionType | RollCallDateActionType
type RollCallDate = {
  id: string
  date: string
}
type DataType = Student | Assessment | RollCallDate | null

interface DialogContextProps {
  openDialog: (
    dialogType: DialogType,
    actionType: ActionType,
    selectedData: DataType,
    callback?: (refreshData?: boolean) => void
  ) => void
}

const dialogContextDefaultProps: DialogContextProps = {
  openDialog: () => null,
}

const DialogContext = createContext(dialogContextDefaultProps)

export const DialogProvider = ({ children }: PropsWithChildren) => {
  const [open, setOpen] = useState<boolean>(false)
  const [action, setAction] = useState<ActionType>()
  const [dialog, setDialogType] = useState<DialogType>()
  const [data, setData] = useState<DataType>()
  const [callbackFn, setCallbackFn] = useState<(refreshData?: boolean) => void>()
  const handleOpenDialog = useCallback(
    (
      dialogType: DialogType,
      actionType: ActionType,
      selectedData: DataType,
      callback?: (refreshData?: boolean) => void
    ) => {
      setOpen(true)
      setDialogType(dialogType)
      setAction(actionType)
      setData(selectedData)
      if (callback) {
        setCallbackFn(() => callback)
      }
    },
    []
  )

  const handleCloseDialog = (refreshData?: boolean) => {
    if (refreshData && callbackFn) {
      callbackFn(refreshData)
    }
    setOpen(false)
  }
  const value = useMemo(() => {
    return {
      openDialog: handleOpenDialog,
    }
  }, [handleOpenDialog])
  return (
    <DialogContext.Provider value={value}>
      {children}
      {dialog === DialogType.STUDENT_DIALOG && (
        <StudentDialogComponent
          isOpen={open}
          onClose={handleCloseDialog}
          action={action || ''}
          student={data as Student}
        />
      )}
      {dialog === DialogType.ASSESSMENT_DIALOG && (
        <AssessmentDialogComponent
          isOpen={open}
          onClose={handleCloseDialog}
          action={action || ''}
          data={data as Assessment}
        />
      )}
      {dialog === DialogType.STUDY_DATE_DIALOG && (
        <DiligentDialogComponent
          isOpen={open}
          onClose={handleCloseDialog}
          action={action || ''}
          rollCall={data as RollCallDate}
        />
      )}
    </DialogContext.Provider>
  )
}

export const useDialogContext = () => {
  const context = useContext(DialogContext)
  if (!context) {
    return dialogContextDefaultProps
  }

  return context
}
