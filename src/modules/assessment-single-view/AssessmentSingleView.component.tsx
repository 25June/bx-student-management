import React, { useState } from 'react'
import { Box } from '@mui/material'
import List from '@mui/material/List'
import ListItem from '@mui/material/ListItem'
import Divider from '@mui/material/Divider'
import ListItemText from '@mui/material/ListItemText'
import ListItemAvatar from '@mui/material/ListItemAvatar'
import Avatar from '@mui/material/Avatar'
import Typography from '@mui/material/Typography'
import IconButton from '@mui/material/IconButton'
import { Assessment } from 'models'
import { AssessmentActionType } from 'constant'
import { colorPalettes } from 'constant/common'
import EditIcon from '@mui/icons-material/Edit'
import DeleteIcon from '@mui/icons-material/Delete'
import { useClassContext } from 'contexts/ClassContext'
import { blueGrey } from '@mui/material/colors'
import Button from '@mui/material/Button'
import Chip from '@mui/material/Chip'
import DownloadIcon from '@mui/icons-material/Download'
import { formatYYYMMDDToDDMMYYYY } from 'utils/datetime'
import { getDownloadLink } from 'services/storage'
import { CircularProgress } from '@mui/material'
import { grey } from '@mui/material/colors'

interface SecondaryTextProps {
  bookDate: string
  fileName: string
}

const SecondaryText = ({ bookDate, fileName }: SecondaryTextProps) => {
  const [downloading, setDownloading] = useState<boolean>(false)
  const handleDownloadAssessment = (event: any) => {
    event.stopPropagation()
    setDownloading(true)
    getDownloadLink(fileName).then((url) => {
      setDownloading(false)

      const link = document.createElement('a')
      link.setAttribute('download', url)
      link.setAttribute('target', '_blank')
      link.href = url
      document.body.appendChild(link)
      link.click()
      link.remove()
    })
  }
  return (
    <Box sx={{ display: 'flex', gap: 0.25, flexDirection: 'column' }}>
      <Box fontWeight={500} fontSize={'0.825rem'} component={'span'} color={grey[500]} marginBottom={0.5}>
        {bookDate}
      </Box>
      {fileName && (
        <Box>
          <Chip
            icon={downloading ? <CircularProgress size={'1rem'} /> : <DownloadIcon />}
            size={'small'}
            label={'File kiểm tra'}
            color={'info'}
            onClick={handleDownloadAssessment}
          />
        </Box>
      )}
    </Box>
  )
}

const AssessmentItem = ({
  assessment,
  onClickAction,
}: {
  assessment: Assessment
  onClickAction: (data: Assessment, actionType: AssessmentActionType) => void
}) => {
  const { disableUpdate } = useClassContext()

  return (
    <>
      <ListItem
        alignItems={'flex-start'}
        disableGutters={true}
        secondaryAction={
          <>
            <IconButton
              color={'warning'}
              onClick={() => onClickAction(assessment, AssessmentActionType.EDIT_ASSESSMENT)}
              disabled={disableUpdate}
            >
              <EditIcon />
            </IconButton>
            <IconButton
              color={'error'}
              onClick={() => onClickAction(assessment, AssessmentActionType.DELETE_ASSESSMENT)}
              disabled={disableUpdate}
            >
              <DeleteIcon />
            </IconButton>
          </>
        }
      >
        <ListItemAvatar>
          <Avatar
            variant={'rounded'}
            sx={{ width: 48, height: 48, bgcolor: colorPalettes[assessment.type] }}
          >
            <Typography>{assessment.type.slice(5)}'</Typography>
          </Avatar>
        </ListItemAvatar>
        <ListItemText
          onClick={() => onClickAction(assessment, AssessmentActionType.EDIT_ASSESSMENT)}
          disableTypography={true}
          primary={assessment.lesson}
          secondary={
            <SecondaryText
              bookDate={formatYYYMMDDToDDMMYYYY(assessment.bookDate)}
              fileName={assessment.documentPath || ''}
            />
          }
        />
      </ListItem>
      <Divider variant="middle" component="li" />
    </>
  )
}

interface AssessmentSingleViewComponentProps {
  assessments: Assessment[]
  onClickAction: (data: Assessment | null, actionType: AssessmentActionType) => void
}

const AssessmentSingleViewComponent = ({
  assessments,
  onClickAction,
}: AssessmentSingleViewComponentProps) => {
  const { disableUpdate } = useClassContext()
  if (assessments.length === 0) {
    return (
      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
        <Typography textTransform={'capitalize'} variant={'caption'} color={blueGrey[700]}>
          <i>Chưa có bài kiểm tra nào.</i>
        </Typography>
        <Button
          variant={'contained'}
          onClick={() => onClickAction(null, AssessmentActionType.ADD_NEW_ASSESSMENT)}
          disabled={disableUpdate}
        >
          Thêm bài kiểm tra
        </Button>
      </Box>
    )
  }

  return (
    <Box>
      <List
        disablePadding={true}
        sx={{
          width: '100%',
          maxWidth: 360,
          background: 'transparent',
          backdropFilter: 'blur(2px)',
        }}
      >
        {assessments.map((assessment) => (
          <AssessmentItem
            key={assessment.id}
            assessment={assessment}
            onClickAction={onClickAction}
          />
        ))}
      </List>
    </Box>
  )
}

export default AssessmentSingleViewComponent
