import React from 'react'
import { buildImageUrl } from 'utils/common'
import { Box } from '@mui/material'

interface ImageBoxComponentProps {
  imagePath?: string
  gender?: boolean
  maxWidth?: number | string
  customStyles?: Record<string, string | number>
  isGLV?: boolean
}

const ImageBoxComponent = ({
  isGLV,
  imagePath,
  gender,
  maxWidth = 375,
  customStyles = {},
}: ImageBoxComponentProps) => {
  return (
    <Box
      component={'img'}
      src={buildImageUrl(imagePath, gender, isGLV)}
      alt={imagePath}
      sx={{
        width: '100%',
        maxWidth,
        aspectRatio: '1/1',
        objectFit: 'cover',
        margin: '0 auto',
        boxShadow: 2,
        borderRadius: '5px',
        ...customStyles,
      }}
    />
  )
}

export default ImageBoxComponent
