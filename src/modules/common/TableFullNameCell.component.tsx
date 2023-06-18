import React from 'react'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import ImageBoxComponent from 'modules/image-box/ImageBox.component'

interface TableFullNameCellComponentProps {
  avatarPath?: string
  saintName: string
  lastName: string
  firstName: string
  gender: boolean
}

const TableFullNameCellComponent = ({
  avatarPath,
  saintName,
  firstName,
  lastName,
  gender,
}: TableFullNameCellComponentProps) => {
  return (
    <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
      <ImageBoxComponent
        imagePath={avatarPath}
        gender={gender}
        customStyles={{ borderRadius: '50%', maxWidth: 50 }}
      />
      <Box flex={1}>
        <Typography sx={{ color: '#808080', marginBottom: 0, textAlign: 'left' }}>
          {saintName}
        </Typography>
        <Typography sx={{ textTransform: 'capitalize', marginBottom: 0, textAlign: 'left' }}>
          {`${(lastName + ' ' + firstName).toLowerCase()}`}
        </Typography>
      </Box>
    </Box>
  )
}

export default TableFullNameCellComponent
