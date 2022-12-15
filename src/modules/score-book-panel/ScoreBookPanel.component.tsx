import Box from '@mui/material/Box'
import { Score, ScoreBook, Student } from 'models'
import MuiDrawer from '@mui/material/Drawer'
import { Button, TextField } from '@mui/material'
import KeyboardBackspaceIcon from '@mui/icons-material/KeyboardBackspace'
import studentBoyLogo from 'static/images/cards/student-boy.png'
import React, { useState } from 'react'
import Accordion from '@mui/material/Accordion'
import AccordionDetails from '@mui/material/AccordionDetails'
import AccordionSummary from '@mui/material/AccordionSummary'
import Typography from '@mui/material/Typography'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import IconButton from '@mui/material/IconButton'
import CheckIcon from '@mui/icons-material/Check'
import ClearIcon from '@mui/icons-material/Clear'
import { averageScore } from './helpers'

interface ScoreItemProps {
  point: Score
}

const ScoreItem = ({ point }: ScoreItemProps) => {
  return (
    <>
      <TextField
        id={'lan-1'}
        label={'Lan 1'}
        type={'number'}
        size={'small'}
        variant={'outlined'}
        sx={{ width: '70%' }}
        defaultValue={point.point}
      />
      <Box display={'flex'} gap={1}>
        <IconButton aria-label="Save">
          <CheckIcon />
        </IconButton>
        <IconButton aria-label="delete">
          <ClearIcon />
        </IconButton>
      </Box>
    </>
  )
}

interface ScoreBookPanelComponentProps {
  isOpen: boolean
  studentInfo: Student
  scoreBook: ScoreBook
  onClose: () => void
  onClickAction: (student: any, actionType: string) => void
}

const ScoreBookPanelComponent = ({
  isOpen,
  scoreBook,
  studentInfo,
  onClose,
  onClickAction,
}: ScoreBookPanelComponentProps) => {
  const [expanded, setExpanded] = useState<string | boolean>(false)

  const handleChange = (panel: string) => (event: React.SyntheticEvent, isExpanded: boolean) => {
    setExpanded(isExpanded ? panel : false)
  }
  if (!scoreBook || !studentInfo) {
    return null
  }
  const score5 = Object.values(scoreBook.score5)
  const score15 = Object.values(scoreBook.score15)
  const score45 = Object.values(scoreBook.score45)
  const score60 = Object.values(scoreBook.score60)

  return (
    <MuiDrawer
      variant="temporary"
      anchor={'bottom'}
      open={isOpen}
      onClose={onClose}
      sx={{ width: '100%', maxWidth: 375 }}
    >
      <Box pt={9} pr={2} pl={2} mb={5}>
        <Box display={'flex'} alignItems={'center'} mb={2}>
          <Button color={'primary'} onClick={onClose} startIcon={<KeyboardBackspaceIcon />}>
            Back
          </Button>
        </Box>
        <Box component={'img'} src={studentBoyLogo} alt={'image-detail'} sx={{ width: '100%' }} />
        <Box>
          <Box textAlign={'center'} component={'h2'} margin={0}>
            {studentInfo.saintName}
          </Box>
          <Box textAlign={'center'} component={'h1'} mt={0}>
            {`${studentInfo.lastName} ${studentInfo.firstName}`}
          </Box>
          <Box>
            <Accordion expanded={expanded === 'score5'} onChange={handleChange('score5')}>
              <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                aria-controls="panel1bh-content"
                id="panel1bh-header"
              >
                <Typography sx={{ width: '70%', flexShrink: 0 }}>TB Kiểm Tra 5': </Typography>
                <Typography sx={{ color: 'text.secondary' }}>{averageScore(score5)}</Typography>
              </AccordionSummary>
              <AccordionDetails>
                {score5.map((point, index) => (
                  <Box
                    mb={2}
                    sx={{ display: 'flex', justifyContent: 'space-between' }}
                    key={`score5-${index}-${point.point}`}
                  >
                    <ScoreItem point={point} />
                  </Box>
                ))}
              </AccordionDetails>
            </Accordion>
            <Accordion expanded={expanded === 'score15'} onChange={handleChange('score15')}>
              <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                aria-controls="panel2bh-content"
                id="panel2bh-header"
              >
                <Typography sx={{ width: '70%', flexShrink: 0 }}>TB Kiểm Tra 15': </Typography>
                <Typography sx={{ color: 'text.secondary' }}>{averageScore(score15)}</Typography>
              </AccordionSummary>
              <AccordionDetails>
                {score15.map((point, index) => (
                  <Box
                    mb={2}
                    sx={{ display: 'flex', justifyContent: 'space-between' }}
                    key={`score5-${index}-${point.point}`}
                  >
                    <ScoreItem point={point} />
                  </Box>
                ))}
              </AccordionDetails>
            </Accordion>
            <Accordion expanded={expanded === 'score45'} onChange={handleChange('score45')}>
              <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                aria-controls="panel3bh-content"
                id="panel3bh-header"
              >
                <Typography sx={{ width: '70%', flexShrink: 0 }}>TB Kiểm Tra 45':</Typography>
                <Typography sx={{ color: 'text.secondary' }}>{averageScore(score45)}</Typography>
              </AccordionSummary>
              <AccordionDetails>
                {score45.map((point, index) => (
                  <Box
                    mb={2}
                    sx={{ display: 'flex', justifyContent: 'space-between' }}
                    key={`score5-${index}-${point.point}`}
                  >
                    <ScoreItem point={point} />
                  </Box>
                ))}
              </AccordionDetails>
            </Accordion>
            <Accordion expanded={expanded === 'score60'} onChange={handleChange('score60')}>
              <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                aria-controls="panel4bh-content"
                id="panel4bh-header"
              >
                <Typography sx={{ width: '70%', flexShrink: 0 }}>TB Kiểm Tra 60': </Typography>
                <Typography sx={{ color: 'text.secondary' }}>{averageScore(score60)}</Typography>
              </AccordionSummary>
              <AccordionDetails>
                {score60.map((point, index) => (
                  <Box
                    mb={2}
                    sx={{ display: 'flex', justifyContent: 'space-between' }}
                    key={`score5-${index}-${point.point}`}
                  >
                    <ScoreItem point={point} />
                  </Box>
                ))}
              </AccordionDetails>
            </Accordion>
          </Box>
        </Box>
      </Box>
    </MuiDrawer>
  )
}

export default ScoreBookPanelComponent
