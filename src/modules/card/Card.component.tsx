import React from 'react'
import { Card, CardActions, CardContent, CardMedia, Button, Typography } from '@mui/material'
import { StudentActionType } from 'constant'
import { Student } from 'models'
import { buildImageUrl, useIsMobile } from 'utils/common'
import StudentIcon from 'modules/common/StudentIcon'
import HolyBibleIcon from 'modules/common/HolyBibleIcon'
import HolyGrailIcon from 'modules/common/HolyGrailIcon'
import { restoreStudent } from 'services/student'
import RestoreFromTrashIcon from '@mui/icons-material/RestoreFromTrash'
import { useClassContext } from 'contexts/ClassContext'
import { useStudentContext } from 'contexts/StudentContext'

const CardComponent = ({
  student,
  onClickAction,
}: {
  student: Student
  onClickAction: (student: any, actionType: StudentActionType) => void
}) => {
  const { fetchStudents } = useStudentContext()
  const isMobile = useIsMobile()
  const fullName = student.lastName.toString() + ' ' + student.firstName.toString()
  const avatar = buildImageUrl(student.avatarPath, student.gender)
  const { disableUpdate, classId } = useClassContext()

  const handleRestoreStudent = (studentId: string) => {
    restoreStudent(studentId).then(() => {
      fetchStudents(classId)
    })
  }

  return (
    <Card
      sx={{
        maxWidth: isMobile ? 275 : 300,
        minWidth: isMobile ? 275 : 300,
        background: 'transparent',
        backdropFilter: 'blur(4px)',
        display: 'flex',
        flexDirection: 'column',
      }}
      data-id={student.id}
    >
      <CardMedia
        component="img"
        height={isMobile ? 275 : 300}
        src={avatar}
        alt="student-girl"
        sx={{ objectFit: 'contain' }}
        onClick={() => onClickAction(student, StudentActionType.VIEW_STUDENT)}
      />
      <CardContent
        sx={{ maxHeight: 120, padding: isMobile ? 1 : 2, flex: 1 }}
        onClick={() => onClickAction(student, StudentActionType.VIEW_STUDENT)}
      >
        <Typography
          gutterBottom={!isMobile}
          variant={isMobile ? 'h6' : 'h5'}
          sx={{ color: '#757575' }}
        >
          {student.saintName}
        </Typography>
        <Typography
          gutterBottom={!isMobile}
          variant={isMobile ? 'h6' : 'h5'}
          sx={{ textTransform: 'capitalize', color: '#616161' }}
        >
          {fullName}
        </Typography>
      </CardContent>
      <CardActions
        sx={{
          display: 'flex',
          flexWrap: 'wrap',
          justifyContent: isMobile ? 'center' : 'space-around',
          columnGap: isMobile ? 1 : 2,
          rowGap: 1,
        }}
        disableSpacing={true}
      >
        {student.isDeleted && (
          <Button
            startIcon={<RestoreFromTrashIcon />}
            size="small"
            onClick={() => handleRestoreStudent(student.id)}
            color="success"
            variant="outlined"
            disabled={disableUpdate}
          >
            Khôi phục
          </Button>
        )}
        {!student.isDeleted && (
          <>
            <Button
              startIcon={<HolyGrailIcon color={'info'} />}
              size="small"
              onClick={() => onClickAction(student, StudentActionType.VIEW_STUDENT_DILIGENT)}
              color="info"
              variant="outlined"
              disabled={disableUpdate}
            >
              Chuyên Cần
            </Button>
            <Button
              startIcon={<HolyBibleIcon color={'info'} />}
              size="small"
              onClick={() => onClickAction(student, StudentActionType.VIEW_SCORE_BOOK)}
              color="info"
              variant="outlined"
              disabled={disableUpdate}
            >
              Bảng Điểm
            </Button>
            <Button
              startIcon={<StudentIcon color={'info'} />}
              size="small"
              onClick={() => onClickAction(student, StudentActionType.VIEW_STUDENT)}
              color="info"
              variant="outlined"
              disabled={disableUpdate}
            >
              Thông Tin
            </Button>
          </>
        )}
      </CardActions>
    </Card>
  )
}

export default CardComponent
