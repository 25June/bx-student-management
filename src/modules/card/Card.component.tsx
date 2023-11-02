import React from 'react'
import { Card, CardActions, CardContent, CardMedia, Button, Typography } from '@mui/material'
import RestoreFromTrashIcon from '@mui/icons-material/RestoreFromTrash'
import { StudentActionType } from 'constant'
import { Student } from 'models/student'
import { buildImageUrl } from 'utils/common'
import StudentIcon from 'modules/common/StudentIcon'
import HolyBibleIcon from 'modules/common/HolyBibleIcon'
import HolyGrailIcon from 'modules/common/HolyGrailIcon'
import { restoreStudent } from 'services/student'
import { useClassContext } from 'contexts/ClassContext'
import { useStudentContext } from 'contexts/StudentContext'

interface Props {
  student: Student
  onClickAction: (student: Student, actionType: StudentActionType) => void
}

const CardComponent = ({ student, onClickAction }: Props) => {
  const { fetchStudents } = useStudentContext()
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
        maxWidth: 275,
        minWidth: 275,
        background: 'transparent',
        backdropFilter: 'blur(4px)',
        display: 'flex',
        flexDirection: 'column',
      }}
      data-id={student.id}
    >
      <CardMedia
        component="img"
        height={275}
        src={avatar}
        alt="student-girl"
        sx={{ objectFit: 'contain' }}
        onClick={() => onClickAction(student, StudentActionType.VIEW_STUDENT)}
      />
      <CardContent
        sx={{ maxHeight: 120, padding: 1, flex: 1 }}
        onClick={() => onClickAction(student, StudentActionType.VIEW_STUDENT)}
      >
        <Typography gutterBottom={false} variant={'h6'} sx={{ color: '#757575' }}>
          {student.saintName}
        </Typography>
        <Typography
          gutterBottom={false}
          variant={'h6'}
          sx={{ textTransform: 'capitalize', color: '#616161' }}
        >
          {fullName}
        </Typography>
      </CardContent>
      <CardActions
        sx={{
          display: 'flex',
          flexWrap: 'wrap',
          justifyContent: 'center',
          columnGap: 1,
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
