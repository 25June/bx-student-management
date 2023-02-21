import React from 'react'
import { buildImageUrl } from 'utils/common'
import { Box } from '@mui/material'

interface ImageBoxComponentProps {
  imagePath?: string
  gender?: boolean
}

const ImageBoxComponent = ({ imagePath, gender }: ImageBoxComponentProps) => {
  return (
    <Box
      component={'img'}
      src={buildImageUrl(imagePath, gender)}
      alt={imagePath}
      sx={{ width: '100%', maxWidth: 375, aspectRatio: '1/1', objectFit: 'cover' }}
    />
  )
}

export default ImageBoxComponent
