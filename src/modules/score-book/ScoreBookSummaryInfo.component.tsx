import React, { useState } from 'react'
import Box from '@mui/material/Box'
import { ScoreBookSummaryResponse } from 'utils/scorebookSummary'
import { blue, grey } from '@mui/material/colors'
import { styled } from '@mui/material'

interface ScoreBookSummaryInfoComponentProps extends ScoreBookSummaryResponse {
  totalStudents: number
}

interface Level {
  score: number
  percentage: number
  color: string
  text: string
}

const ScoreBox = styled(Box, {
  shouldForwardProp: (prop) => prop !== 'color' && prop !== 'width' && prop !== 'selected',
})<{ color: string; width: number; selected?: boolean }>(({ theme, color, width, selected }) => ({
  width: width + '%',
  backgroundColor: color,
  textAlign: 'right',
  paddingRight: 4,
  fontWeight: selected ? 600 : 400,

  transition: theme.transitions.create('width', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.enteringScreen,
  }),
}))

const ScoreBookSummaryInfoComponent = ({
  average,
  needToImprove,
  upperAverage,
  good,
  wellDome,
  excellent,
  totalStudents,
}: ScoreBookSummaryInfoComponentProps) => {
  const [selectedType, setSelectedType] = useState<Level>()
  const levels: Level[] = [
    {
      score: needToImprove,
      percentage: (needToImprove / totalStudents) * 100,
      color: blue[100],
      text: 'Yếu',
    },
    {
      score: average,
      percentage: (average / totalStudents) * 100,
      color: blue[200],
      text: 'Trung Bình',
    },
    {
      score: upperAverage,
      percentage: (upperAverage / totalStudents) * 100,
      color: blue[300],
      text: 'Trung Bình Khá',
    },
    {
      score: good,
      percentage: (good / totalStudents) * 100,
      color: blue[400],
      text: 'Khá',
    },
    {
      score: wellDome,
      percentage: (wellDome / totalStudents) * 100,
      color: blue[500],
      text: 'Giỏi',
    },
    {
      score: excellent,
      percentage: (excellent / totalStudents) * 100,
      color: blue[600],
      text: 'Xuất Sắc',
    },
  ]

  return (
    <Box
      sx={{
        position: 'sticky',
        top: 64,
        zIndex: 1,
        boxShadow: 3,
        borderRadius: 1,
        backgroundImage: 'linear-gradient(to top, rgba(255,255,255,0.8), rgba(255,255,255,1))',
        padding: 1,
        marginBottom: 2,
      }}
    >
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          height: 32,
        }}
      >
        {levels.map((level) => {
          if (level.score === 0) {
            return null
          }
          return (
            <ScoreBox
              key={level.color}
              color={level.color}
              width={level.percentage}
              selected={selectedType?.color === level.color}
              onClick={() =>
                setSelectedType((prev) => (level.color === prev?.color ? undefined : level))
              }
            >
              {level.score}
            </ScoreBox>
          )
        })}
      </Box>
      <Box color={grey[700]}>
        {selectedType ? `${selectedType?.score} ${selectedType.text}` : 'Thống kê theo điểm'}
      </Box>
    </Box>
  )
}

export default ScoreBookSummaryInfoComponent
