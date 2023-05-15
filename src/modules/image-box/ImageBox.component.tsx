import React from 'react'
import { buildImageUrl } from 'utils/common'
import { Box } from '@mui/material'

interface ImageBoxComponentProps {
  imagePath?: string
  gender?: boolean
  maxWidth?: number | string
}

const ImageBoxComponent = ({ imagePath, gender, maxWidth = 375 }: ImageBoxComponentProps) => {
  return (
    <Box
      component={'img'}
      src={buildImageUrl(imagePath, gender)}
      alt={imagePath}
      sx={{ width: '100%', maxWidth, aspectRatio: '1/1', objectFit: 'cover', margin: '0 auto' }}
    />
  )
}

export default ImageBoxComponent
