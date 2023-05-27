import React from 'react'
import { buildImageUrl } from 'utils/common'
import { Box } from '@mui/material'

interface ImageBoxComponentProps {
  imagePath?: string
  gender?: boolean
  maxWidth?: number | string
  customStyles?: Record<string, string | number>
}

const ImageBoxComponent = ({
  imagePath,
  gender,
  maxWidth = 375,
  customStyles = {},
}: ImageBoxComponentProps) => {
  return (
    <Box
      component={'img'}
      src={buildImageUrl(imagePath, gender)}
      alt={imagePath}
      sx={{
        width: '100%',
        maxWidth,
        aspectRatio: '1/1',
        objectFit: 'cover',
        margin: '0 auto',
        ...customStyles,
      }}
    />
  )
}

export default ImageBoxComponent
