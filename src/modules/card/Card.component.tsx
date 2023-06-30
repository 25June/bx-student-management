import React from 'react'
import { Card, CardActions, CardContent, CardMedia, Button, Typography } from '@mui/material'
import { StudentActionType } from 'constant'
import { Student } from 'models'
import { buildImageUrl, useIsMobile } from 'utils/common'
import ScoreIcon from '@mui/icons-material/Score'
import PermIdentityIcon from '@mui/icons-material/PermIdentity'

const CardComponent = ({
  student,
  onClickAction,
}: {
  student: Student
  onClickAction: (student: any, actionType: StudentActionType) => void
}) => {
  const isMobile = useIsMobile()
  const fullName = student.lastName.toString() + ' ' + student.firstName.toString()
  const avatar = buildImageUrl(student.avatarPath, student.gender)
  return (
    <Card sx={{ maxWidth: isMobile ? 275 : 300, minWidth: isMobile ? 275 : 300 }}>
      <CardMedia
        component="img"
        height={isMobile ? 200 : 300}
        src={avatar}
        alt="student-girl"
        sx={{ objectFit: 'contain' }}
      />
      <CardContent sx={{ height: isMobile ? 60 : 120, padding: isMobile ? 1 : 2 }}>
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
          justifyContent: isMobile ? 'center' : 'space-around',
          gap: isMobile ? 1 : 2,
        }}
        disableSpacing={true}
      >
        <Button
          startIcon={<PermIdentityIcon />}
          size="small"
          onClick={() => onClickAction(student, StudentActionType.VIEW_STUDENT)}
          color="warning"
          variant="outlined"
        >
          Thông Tin
        </Button>
        <Button
          startIcon={<ScoreIcon />}
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
