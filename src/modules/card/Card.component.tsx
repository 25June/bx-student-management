import React from 'react'
import { Card, CardActions, CardContent, CardMedia, Button, Typography } from '@mui/material'
import studentGirlLogo from '../../static/images/cards/student-girl.png'
import studentBoyLogo from '../../static/images/cards/student-boy.png'
import { StudentActionType } from '../../constant/common'
import VisibilityIcon from '@mui/icons-material/Visibility'
import { Student } from '../../models/student'

const CardComponent = ({
  student,
  onClickAction,
}: {
  student: Student
  onClickAction: (student: any, actionType: string) => void
}) => {
  const fullName = student.lastName.toString() + ' ' + student.firstName.toString()
  return (
    <Card sx={{ maxWidth: 300 }}>
      <CardMedia
        component="img"
        height="300"
        src={student.gender ? studentGirlLogo : studentBoyLogo}
        alt="student-girl"
        sx={{ padding: 1 }}
      />
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
          Xem Thông Tin
        </Button>
      </CardActions>
    </Card>
  )
}

export default CardComponent
