import React, { useState } from 'react'
import Box from '@mui/material/Box'
import { ScoreBookSummaryResponse } from 'utils/scorebookSummary'
import { blue, grey } from '@mui/material/colors'
import { styled } from '@mui/material'

interface ScoreBookSummaryInfoComponentProps extends ScoreBookSummaryResponse {
  totalStudents: number
  onFilterStudentByGrade: (data?: any) => void
}

interface Level {
  score: number
  percentage: number
  color: string
  text: string
  isBelong: (score: number) => boolean
}

const ScoreBox = styled(Box, {
  shouldForwardProp: (prop) => prop !== 'color' && prop !== 'width' && prop !== 'selected',
})<{ backgroundColor: string; width: number; selected?: boolean }>(
  ({ theme, backgroundColor, width, selected }) => ({
    width: width + '%',
    background: backgroundColor,
    textAlign: 'right',
    paddingRight: 4,
    color: grey[700],
    fontWeight: selected ? 600 : 400,

    transition: theme.transitions.create('width', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  })
)

const ScoreBookSummaryInfoComponent = ({
  average,
  needToImprove,
  upperAverage,
  good,
  wellDome,
  excellent,
  totalStudents,
  onFilterStudentByGrade,
}: ScoreBookSummaryInfoComponentProps) => {
  const [selectedType, setSelectedType] = useState<Level>()
  const levels: Level[] = [
    {
      score: needToImprove,
      percentage: (needToImprove / totalStudents) * 100,
      color: blue[100],
      text: 'Yếu (< 5)',
      isBelong: (score: number) => score >= 0 && score < 5,
    },
    {
      score: average,
      percentage: (average / totalStudents) * 100,
      color: blue[200],
      text: 'Trung Bình (5 < 6)',
      isBelong: (score: number) => score >= 5 && score < 6,
    },
    {
      score: upperAverage,
      percentage: (upperAverage / totalStudents) * 100,
      color: blue[300],
      text: 'Trung Bình Khá (6 < 7)',
      isBelong: (score: number) => score >= 6 && score < 7,
    },
    {
      score: good,
      percentage: (good / totalStudents) * 100,
      color: blue[400],
      text: 'Khá (7 < 8)',
      isBelong: (score: number) => score >= 7 && score < 8,
    },
    {
      score: wellDome,
      percentage: (wellDome / totalStudents) * 100,
      color: blue[500],
      text: 'Giỏi (8 < 9)',
      isBelong: (score: number) => score >= 8 && score < 9,
    },
    {
      score: excellent,
      percentage: (excellent / totalStudents) * 100,
      color: blue[600],
      text: 'Xuất Sắc (9 < 10)',
      isBelong: (score: number) => score >= 9 && score <= 10,
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
              backgroundColor={level.color}
              width={level.percentage}
              selected={selectedType?.color === level.color}
              onClick={() => {
                setSelectedType((prev) => (level.color === prev?.color ? undefined : level))
                onFilterStudentByGrade(
                  selectedType?.color === level.color ? undefined : level.isBelong
                )
              }}
            >
              {level.score}
            </ScoreBox>
          )
        })}
      </Box>
      <Box color={grey[700]}>
        {selectedType ? `${selectedType?.score} em ${selectedType.text}` : 'Thống kê theo điểm'}
      </Box>
    </Box>
  )
}

export default ScoreBookSummaryInfoComponent
