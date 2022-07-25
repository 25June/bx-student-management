import * as React from 'react'
import Card from '@mui/material/Card'
import CardActions from '@mui/material/CardActions'
import CardContent from '@mui/material/CardContent'
import CardMedia from '@mui/material/CardMedia'
import Button from '@mui/material/Button'
import Typography from '@mui/material/Typography'
import studentGirlLogo from '../../static/images/cards/student-girl.png'
import studentBoyLogo from '../../static/images/cards/student-boy.png'
import { StudentActionType } from '../../constant/common'
import DeleteIcon from '@mui/icons-material/Delete'
import EditIcon from '@mui/icons-material/Edit'

const CardComponent = ({
  student,
  onClickAction,
}: {
  student: any
  onClickAction: (student: any, actionType: string) => void
}) => {
  const fullName = student.lastName.toString() + ' ' + student.firstName.toString()
  return (
    <Card sx={{ maxWidth: 300 }}>
      <CardMedia
        component="img"
        height="300"
        src={student.gender === 'female' ? studentGirlLogo : studentBoyLogo}
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
          startIcon={<EditIcon />}
          size="small"
          onClick={() => onClickAction(student, StudentActionType.EDIT_STUDENT)}
          color="warning"
          variant="outlined"
        >
          Sửa
        </Button>
        <Button
          startIcon={<DeleteIcon />}
          size="small"
          onClick={() => onClickAction(student, StudentActionType.DELETE_STUDENT)}
          color="error"
          variant="outlined"
        >
          Xoá
        </Button>
      </CardActions>
    </Card>
  )
}

export default CardComponent
