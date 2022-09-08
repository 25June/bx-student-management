import React from 'react'
import { Box, TextField, Button } from '@mui/material'
import MuiDrawer from '@mui/material/Drawer'
import studentBoyLogo from '../../static/images/cards/student-boy.png'
import KeyboardBackspaceIcon from '@mui/icons-material/KeyboardBackspace'
import EditIcon from '@mui/icons-material/Edit'
import { StudentActionType } from '../../constant/common'
import DeleteIcon from '@mui/icons-material/Delete'
import { Student } from '../../models/student'

interface RightPanelComponentProps {
  isOpen: boolean
  data: Student
  onClose: () => void
  onClickAction: (student: any, actionType: string) => void
}

const RightPanelComponent = ({
  isOpen,
  data,
  onClose,
  onClickAction,
}: RightPanelComponentProps) => {
  if (!data) {
    return null
  }

  const handleRemoveStudent = () => {
    onClickAction(data, StudentActionType.DELETE_STUDENT)
    onClose()
  }

  return (
    <MuiDrawer
      variant="temporary"
      anchor={'right'}
      open={isOpen}
      onClose={onClose}
      onKeyDown={onClose}
    >
      <Box pt={9} pr={2} pl={2} mb={5} sx={{ width: 400 }}>
        <Box display={'flex'} alignItems={'center'} mb={2}>
          <Button color={'primary'} onClick={onClose} startIcon={<KeyboardBackspaceIcon />}>
            Back
          </Button>
        </Box>
        <Box component={'img'} src={studentBoyLogo} alt={'image-detail'} sx={{ width: '100%' }} />
        <Box>
          <Box textAlign={'center'} component={'h2'} margin={0}>
            {data.saintName}
          </Box>
          <Box textAlign={'center'} component={'h1'} mt={0}>
            {`${data.lastName} ${data.firstName}`}
          </Box>
          <Box mb={2} width={'100%'}>
            <TextField
              id={'birthday'}
              label={'Birthday'}
              InputLabelProps={{ shrink: true }}
              InputProps={{ readOnly: true }}
              type={'date'}
              value={data.birthday}
              variant={'standard'}
              sx={{ width: '100%' }}
            />
          </Box>
          <Box mb={2} width={'100%'}>
            <TextField
              id={'address'}
              label={'Address'}
              InputLabelProps={{ shrink: true }}
              InputProps={{ readOnly: true }}
              value={data.address}
              variant={'standard'}
              sx={{ width: '100%' }}
            />
          </Box>
          <Box
            mb={2}
            width={'100%'}
            display={'flex'}
            justifyContent={'space-between'}
            flexWrap={'wrap'}
          >
            <TextField
              id={'grade'}
              label={'Grade'}
              InputLabelProps={{ shrink: true }}
              InputProps={{ readOnly: true }}
              value={data.grade}
              variant={'standard'}
              sx={{ width: '45%' }}
            />
            <TextField
              id={'gender'}
              label={'Gender'}
              InputLabelProps={{ shrink: true }}
              InputProps={{ readOnly: true }}
              value={'Male'}
              variant={'standard'}
              sx={{ width: '45%' }}
            />
          </Box>
          <Box
            sx={{
              width: '100%',
              marginBottom: 2,
              display: 'flex',
              justifyContent: 'space-between',
            }}
          >
            <TextField
              id={'phone-name-1'}
              label={'Name'}
              InputLabelProps={{ shrink: true }}
              InputProps={{ readOnly: true }}
              value={data.phones[0].name}
              sx={{ width: '100%' }}
              variant={'standard'}
            />
            <TextField
              id={'phone-number-2'}
              label={'Number'}
              InputLabelProps={{ shrink: true }}
              InputProps={{ readOnly: true }}
              value={data.phones[0].number}
              sx={{ width: '100%' }}
              variant={'standard'}
            />
          </Box>
          <Box
            sx={{
              width: '100%',
              marginBottom: 2,
              display: 'flex',
              justifyContent: 'space-between',
            }}
          >
            <TextField
              id={'phone-name-1'}
              label={'Name'}
              InputLabelProps={{ shrink: true }}
              InputProps={{ readOnly: true }}
              value={data.phones[0].name}
              sx={{ width: '100%' }}
              variant={'standard'}
            />
            <TextField
              id={'phone-number-2'}
              label={'Number'}
              InputLabelProps={{ shrink: true }}
              InputProps={{ readOnly: true }}
              value={data.phones[0].number}
              sx={{ width: '100%' }}
              variant={'standard'}
            />
          </Box>
          <Box display={'flex'} justifyContent={'space-between'}>
            <Button
              startIcon={<EditIcon />}
              size="small"
              onClick={() => onClickAction(data, StudentActionType.EDIT_STUDENT)}
              color="warning"
              variant="outlined"
            >
              Sửa
            </Button>
            <Button
              startIcon={<DeleteIcon />}
              size="small"
              onClick={handleRemoveStudent}
              color="error"
              variant="outlined"
            >
              Xoá
            </Button>
          </Box>
        </Box>
      </Box>
    </MuiDrawer>
  )
}

export default RightPanelComponent
