import { useCallback, useState } from 'react'
import Box from '@mui/material/Box'
import Backdrop from '@mui/material/Backdrop'
import SpeedDial from '@mui/material/SpeedDial'
import SpeedDialIcon from '@mui/material/SpeedDialIcon'
import PermIdentityIcon from '@mui/icons-material/PermIdentity'
import SpeedDialAction from '@mui/material/SpeedDialAction'
import AssignmentIcon from '@mui/icons-material/Assignment'
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth'
import {
  ActionType,
  AssessmentActionType,
  DialogType,
  RollCallDateActionType,
  StudentActionType,
} from 'constant/common'
import { useDialogContext } from 'contexts/DialogContext'
import { useAssessmentContext } from 'contexts/AssessmentContext'
import { useGetAssessments } from 'services'
import { useClassContext } from 'contexts/ClassContext'

const actions = [
  {
    icon: <PermIdentityIcon />,
    name: 'Thêm thiếu nhi',
    dialogType: DialogType.STUDENT_DIALOG,
    actionType: StudentActionType.ADD_NEW_STUDENT,
  },
  {
    icon: <AssignmentIcon />,
    name: 'Thêm bài kiểm tra',
    dialogType: DialogType.ASSESSMENT_DIALOG,
    actionType: AssessmentActionType.ADD_NEW_ASSESSMENT,
  },
  {
    icon: <CalendarMonthIcon />,
    name: 'Thêm ngày học',
    dialogType: DialogType.STUDY_DATE_DIALOG,
    actionType: RollCallDateActionType.ADD_STUDY_DATE,
  },
]

const SpeedDialComponent = () => {
  const { openDialog } = useDialogContext()
  const { setAssessments } = useAssessmentContext()
  const getAssessments = useGetAssessments()
  const { classId } = useClassContext()

  const [open, setOpen] = useState<boolean>(false)
  const handleOpen = useCallback(() => setOpen(true), [])
  const handleClose = useCallback(() => setOpen(false), [])

  const assessmentCallBack = useCallback(() => {
    setTimeout(() => {
      getAssessments(classId).then((res) => {
        setAssessments(res)
      })
    }, 500)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const handleOpenDialog = useCallback(
    (dialogType: DialogType, actionType: ActionType) => {
      if (
        dialogType === DialogType.ASSESSMENT_DIALOG &&
        actionType === AssessmentActionType.ADD_NEW_ASSESSMENT
      ) {
        openDialog(dialogType, actionType, null, assessmentCallBack)
        setOpen(false)
        return
      }
      openDialog(dialogType, actionType, null)
      setOpen(false)
    },
    [assessmentCallBack, openDialog]
  )

  return (
    <Box
      sx={{
        height: open ? 'calc(100vh - 56px)' : 56,
        width: open ? 'calc(100vw - 50px)' : 56,
        transform: 'translateZ(0px)',
        flexGrow: 1,
        position: 'fixed',
        right: 0,
        bottom: 0,
        zIndex: 2,
      }}
    >
      <Backdrop open={open} />
      <SpeedDial
        ariaLabel="SpeedDial tooltip example"
        sx={{ position: 'absolute', bottom: 16, right: 16 }}
        icon={<SpeedDialIcon />}
        onClose={handleClose}
        onOpen={handleOpen}
        open={open}
      >
        {actions.map((action) => (
          <SpeedDialAction
            key={action.name}
            icon={action.icon}
            tooltipTitle={action.name}
            tooltipOpen={true}
            onClick={() => handleOpenDialog(action.dialogType, action.actionType)}
            sx={{
              '.MuiSpeedDialAction-staticTooltipLabel': { whiteSpace: 'nowrap' },
            }}
          />
        ))}
      </SpeedDial>
    </Box>
  )
}

export default SpeedDialComponent
