import React from 'react'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import ImageBoxComponent from 'modules/image-box/ImageBox.component'
import IconButton from '@mui/material/IconButton'
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos'

interface Props {
  avatarPath?: string
  saintName: string
  lastName: string
  firstName: string
  gender: boolean
  action?: () => void
}

const TableFullNameCellComponent = ({
  avatarPath,
  saintName,
  firstName,
  lastName,
  gender,
  action,
}: Props) => {
  return (
    <Box sx={{ display: 'flex', gap: 2, alignItems: 'center', width: '100%' }}>
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
      {action ? (
        <IconButton onClick={action}>
          <ArrowForwardIosIcon fontSize={'inherit'} color={'action'} />
        </IconButton>
      ) : null}
    </Box>
  )
}

export default TableFullNameCellComponent
