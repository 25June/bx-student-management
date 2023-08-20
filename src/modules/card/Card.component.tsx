import React from 'react'
import { Card, CardActions, CardContent, CardMedia, Button, Typography } from '@mui/material'
import { StudentActionType } from 'constant'
import { Student } from 'models'
import { buildImageUrl, useIsMobile } from 'utils/common'
import ScoreIcon from '@mui/icons-material/Score'
import PermIdentityIcon from '@mui/icons-material/PermIdentity'
import Box from '@mui/material/Box'
import Chip from '@mui/material/Chip'

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
  const transferHistoryContent = student.transferHistory
    ? student.transferHistory[0] === 'new'
      ? { label: 'Thiếu nhi mới', color: 'success' }
      : student.transferHistory[0] === 'standStill'
      ? {
          label: 'Học lại',
          color: 'warning',
        }
      : { label: `Chuyển từ ${student.transferHistory[0]}`, color: 'info' }
    : undefined

  return (
    <Card
      sx={{
        maxWidth: isMobile ? 275 : 300,
        minWidth: isMobile ? 275 : 300,
        background: 'transparent',
        backdropFilter: 'blur(4px)',
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
        sx={{ maxHeight: isMobile ? 80 : 120, padding: isMobile ? 1 : 2 }}
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
        {student.transferHistory && transferHistoryContent && (
          <Box sx={{ textAlign: 'center' }}>
            <Chip
              sx={{
                height: 'auto',
                '& .MuiChip-label': {
                  display: 'block',
                  whiteSpace: 'normal',
                },
              }}
              size={'small'}
              color={transferHistoryContent.color as any}
              label={transferHistoryContent.label}
            />
          </Box>
        )}
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
          color="info"
          variant="outlined"
        >
          Thông Tin
        </Button>
        <Button
          startIcon={<ScoreIcon />}
          size="small"
          onClick={() => onClickAction(student, StudentActionType.VIEW_SCORE_BOOK)}
          color="info"
          variant="outlined"
        >
          Bảng Điểm
        </Button>
      </CardActions>
    </Card>
  )
}

export default CardComponent
