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
import NoteDialogComponent from 'modules/diligent/NoteDialog.component'
import ConfigDialogComponent from 'modules/config-dialog/ConfigDialog.component'
import TransferStudentDialogComponent from 'modules/student/TransferStudentDialog.component'

type ActionType = AssessmentActionType | StudentActionType | RollCallDateActionType
type RollCallDate = {
  id: string
  date: string
}
type Attendance = {
  note: string
  studentId: string
  rollCallDateId: string
}
type DataType = Student | Assessment | RollCallDate | Attendance | null

interface DialogContextProps {
  openDialog: (
    dialogType: DialogType,
    actionType?: ActionType,
    selectedData?: DataType,
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
      actionType?: ActionType,
      selectedData?: DataType,
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

  const handleCloseDialog = useCallback(
    (refreshData?: boolean) => {
      if (refreshData && callbackFn) {
        callbackFn(refreshData)
      }
      setOpen(false)
      setAction(undefined)
      setDialogType(undefined)
    },
    [callbackFn]
  )
  const value = useMemo(() => {
    return {
      openDialog: handleOpenDialog,
    }
  }, [handleOpenDialog])
  return (
    <DialogContext.Provider value={value}>
      {children}
      {dialog === DialogType.STUDENT_DIALOG && action !== 'TRANSFER_CLASS' && (
        <StudentDialogComponent
          isOpen={open}
          onClose={handleCloseDialog}
          action={action || ''}
          student={data as Student}
        />
      )}
      {dialog === DialogType.STUDENT_DIALOG && action === 'TRANSFER_CLASS' && (
        <TransferStudentDialogComponent
          isOpen={open}
          onClose={handleCloseDialog}
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
      {dialog === DialogType.STUDY_DATE_DIALOG && action !== 'ADD_NOTE' && (
        <DiligentDialogComponent
          isOpen={open}
          onClose={handleCloseDialog}
          action={(action as RollCallDateActionType) || RollCallDateActionType.ADD_STUDY_DATE}
          rollCall={data as RollCallDate}
        />
      )}
      {dialog === DialogType.STUDY_DATE_DIALOG && action === 'ADD_NOTE' && (
        <NoteDialogComponent
          isOpen={open}
          onClose={handleCloseDialog}
          note={(data as Attendance)?.note || ''}
          rollCallDateId={(data as Attendance)?.rollCallDateId || ''}
          studentId={(data as Attendance)?.studentId}
        />
      )}
      {dialog === DialogType.CONFIG_DIALOG && (
        <ConfigDialogComponent onClose={handleCloseDialog} isOpen={open} />
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
