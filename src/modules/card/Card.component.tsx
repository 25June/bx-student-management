import React from 'react'
import { Card, CardActions, CardContent, CardMedia, Button, Typography } from '@mui/material'
import { StudentActionType } from 'constant'
import VisibilityIcon from '@mui/icons-material/Visibility'
import { Student } from 'models'
import { buildImageUrl } from 'utils/common'

const CardComponent = ({
  student,
  onClickAction,
}: {
  student: Student
  onClickAction: (student: any, actionType: string) => void
}) => {
  const fullName = student.lastName.toString() + ' ' + student.firstName.toString()
  const avatar = buildImageUrl(student.avatarPath, student.gender)
  return (
    <Card sx={{ maxWidth: 300, minWidth: 300 }}>
      <CardMedia component="img" height="300" src={avatar} alt="student-girl" />
      <CardContent sx={{ height: 120 }}>
        <Typography gutterBottom={true} variant="h5" component="div">
          {student.saintName}
        </Typography>
        <Typography gutterBottom={true} variant="h5" component="div">
          {fullName}
        </Typography>
      </CardContent>
      <CardActions sx={{ display: 'flex', justifyContent: 'space-around' }}>
        <Button
          startIcon={<VisibilityIcon />}
          size="small"
          onClick={() => onClickAction(student, StudentActionType.VIEW_STUDENT)}
          color="warning"
          variant="outlined"
        >
          Thông Tin
        </Button>
        <Button
          startIcon={<VisibilityIcon />}
          size="small"
          onClick={() => onClickAction(student, StudentActionType.VIEW_SCORE_BOOK)}
          color="warning"
          variant="outlined"
        >
          Bảng Điểm
        </Button>
      </CardActions>
    </Card>
  )
}

export default CardComponent
