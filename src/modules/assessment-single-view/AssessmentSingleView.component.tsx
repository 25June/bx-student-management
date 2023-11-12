import React, { useState, useEffect } from 'react'
import { Box, CircularProgress } from '@mui/material'
import List from '@mui/material/List'
import ListItem from '@mui/material/ListItem'
import Divider from '@mui/material/Divider'
import ListItemText from '@mui/material/ListItemText'
import ListItemAvatar from '@mui/material/ListItemAvatar'
import Avatar from '@mui/material/Avatar'
import Typography from '@mui/material/Typography'
import IconButton from '@mui/material/IconButton'
import { Assessment } from 'models'
import { Document } from 'models/assessment'
import { AssessmentActionType } from 'constant'
import { colorPalettes } from 'constant/common'
import EditIcon from '@mui/icons-material/Edit'
import DeleteIcon from '@mui/icons-material/Delete'
import { useClassContext } from 'contexts/ClassContext'
import { blueGrey, grey } from '@mui/material/colors'
import Button from '@mui/material/Button'
import Chip from '@mui/material/Chip'
import DownloadIcon from '@mui/icons-material/Download'
import { formatYYYMMDDToDDMMYYYY } from 'utils/datetime'
import { getDownloadLink } from 'services/storage'
import ScoreBookSummaryInfoComponent from 'modules/score-book/ScoreBookSummaryInfo.component'
import { getScoreBookSummary, ScoreBookSummaryResponse } from 'utils/scorebookSummary'
import { useStudentContext } from 'contexts/StudentContext'
import { StudentScoreBook } from 'models/ScoreBook'
import { Student } from 'models/student'

interface SecondaryTextProps {
  bookDate: string
  documents: Document[]
}

const SecondaryText = ({ bookDate, documents }: SecondaryTextProps) => {
  const [downloading, setDownloading] = useState<boolean>(false)
  const handleDownloadAssessment = (event: any, doc: Document) => {
    event.stopPropagation()
    setDownloading(true)
    getDownloadLink(doc.path).then((url) => {
      setDownloading(false)

      const link = document.createElement('a')
      link.setAttribute('href', url)
      link.setAttribute('download', doc.name)
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
    })
  }
  return (
    <Box sx={{ display: 'flex', gap: 0.25, flexDirection: 'column' }}>
      <Box
        fontWeight={500}
        fontSize={'0.825rem'}
        component={'span'}
        color={grey[500]}
        marginBottom={0.5}
        marginTop={0.5}
      >
        {bookDate}
      </Box>
      {documents?.map((doc) => (
        <Box sx={{ width: 150 }} key={doc.path}>
          <Chip
            icon={downloading ? <CircularProgress size={'1rem'} /> : <DownloadIcon />}
            size={'small'}
            label={doc.name}
            color={'info'}
            onClick={(event: any) => handleDownloadAssessment(event, doc)}
          />
        </Box>
      ))}
    </Box>
  )
}

const AssessmentItem = ({
  assessment,
  onClickAction,
  stuScoreBooks,
}: {
  assessment: Assessment
  onClickAction: (data: Assessment, actionType: AssessmentActionType) => void
  stuScoreBooks: StudentScoreBook[] | Student[]
}) => {
  const { students } = useStudentContext()
  const { disableUpdate } = useClassContext()
  const [scoreBookSummary, setScoreBookSummary] = useState<ScoreBookSummaryResponse>()
  useEffect(() => {
    if (stuScoreBooks?.length !== 0 && assessment) {
      Promise.resolve().then(() => {
        setScoreBookSummary(
          getScoreBookSummary({
            assessmentType: assessment.type,
            assessmentId: assessment.id,
            studentScoreBooks: stuScoreBooks as StudentScoreBook[],
          })
        )
      })
    }
  }, [stuScoreBooks, assessment])
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
            onClick={() => onClickAction(assessment, AssessmentActionType.EDIT_ASSESSMENT)}
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
              documents={assessment.documents ?? []}
            />
          }
        />
      </ListItem>
      {scoreBookSummary && (
        <ScoreBookSummaryInfoComponent
          onFilterStudentByGrade={() => null}
          totalStudents={students.length}
          {...scoreBookSummary}
        />
      )}
      <Divider variant="middle" component="li" />
    </>
  )
}

interface AssessmentSingleViewComponentProps {
  assessments: Assessment[]
  onClickAction: (data: Assessment | null, actionType: AssessmentActionType) => void
  stuScoreBooks: StudentScoreBook[] | Student[]
}

const AssessmentSingleViewComponent = ({
  assessments,
  onClickAction,
  stuScoreBooks,
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
            stuScoreBooks={stuScoreBooks}
          />
        ))}
      </List>
    </Box>
  )
}

export default AssessmentSingleViewComponent
