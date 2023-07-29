import React from 'react'
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

const AssessmentItem = ({
  assessment,
  onClickAction,
}: {
  assessment: Assessment
  onClickAction: (data: Assessment, actionType: AssessmentActionType) => void
}) => {
  return (
    <>
      <ListItem
        onClick={() => onClickAction(assessment, AssessmentActionType.EDIT_ASSESSMENT)}
        disableGutters={true}
        secondaryAction={
          <>
            <IconButton
              color={'warning'}
              onClick={() => onClickAction(assessment, AssessmentActionType.EDIT_ASSESSMENT)}
            >
              <EditIcon />
            </IconButton>
            <IconButton
              color={'error'}
              onClick={() => onClickAction(assessment, AssessmentActionType.DELETE_ASSESSMENT)}
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
        <ListItemText primary={assessment.lesson} secondary={assessment.bookDate} />
      </ListItem>
      <Divider variant="middle" component="li" />
    </>
  )
}

interface AssessmentSingleViewComponentProps {
  assessments: Assessment[]
  onClickAction: (data: Assessment, actionType: AssessmentActionType) => void
}

const AssessmentSingleViewComponent = ({
  assessments,
  onClickAction,
}: AssessmentSingleViewComponentProps) => {
  return (
    <Box>
      <List
        disablePadding={true}
        sx={{ width: '100%', maxWidth: 360, bgcolor: 'background.paper' }}
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
