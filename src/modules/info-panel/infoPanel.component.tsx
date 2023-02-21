import React from 'react'
import { Box, TextField, Button } from '@mui/material'
import MuiDrawer from '@mui/material/Drawer'
import KeyboardBackspaceIcon from '@mui/icons-material/KeyboardBackspace'
import EditIcon from '@mui/icons-material/Edit'
import { StudentActionType } from 'constant'
import DeleteIcon from '@mui/icons-material/Delete'
import { Student } from 'models'
import { formatDate } from 'utils/formatDataForTable'
import { ImageBoxComponent } from 'modules'

interface InfoPanelComponentProps {
  isOpen: boolean
  studentInfo?: Student
  onClose: () => void
  onClickAction: (student: any, actionType: string) => void
}

const InfoPanelComponent = ({
  isOpen,
  studentInfo,
  onClose,
  onClickAction,
}: InfoPanelComponentProps) => {
  if (!studentInfo) {
    return null
  }

  const handleRemoveStudent = () => {
    onClickAction(studentInfo, StudentActionType.DELETE_STUDENT)
    onClose()
  }

  return (
    <MuiDrawer
      variant="temporary"
      anchor={'right'}
      open={isOpen}
      onClose={onClose}
      onKeyDown={onClose}
      sx={{ width: '100%', maxWidth: 375 }}
    >
      <Box pt={9} pr={2} pl={2} mb={5}>
        <Box display={'flex'} alignItems={'center'} mb={2}>
          <Button color={'primary'} onClick={onClose} startIcon={<KeyboardBackspaceIcon />}>
            Back
          </Button>
        </Box>
        <ImageBoxComponent imagePath={studentInfo.avatarPath} gender={studentInfo.gender} />
        <Box>
          <Box textAlign={'center'} component={'h2'} margin={0}>
            {studentInfo.saintName}
          </Box>
          <Box textAlign={'center'} component={'h1'} mt={0}>
            {`${studentInfo.lastName} ${studentInfo.firstName}`}
          </Box>
          <Box mb={2} width={'100%'}>
            <TextField
              id={'birthday'}
              label={'Ngày sinh'}
              InputLabelProps={{ shrink: true }}
              InputProps={{ readOnly: true }}
              type={'date'}
              value={formatDate(studentInfo.birthday, false)}
              variant={'standard'}
              sx={{ width: '100%' }}
            />
          </Box>
          <Box mb={2} width={'100%'}>
            <TextField
              id={'address'}
              label={'Địa chỉ'}
              InputLabelProps={{ shrink: true }}
              InputProps={{ readOnly: true }}
              value={studentInfo.address}
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
              label={'Văn hoá'}
              InputLabelProps={{ shrink: true }}
              InputProps={{ readOnly: true }}
              value={studentInfo.grade}
              variant={'standard'}
              sx={{ width: '45%' }}
            />
            <TextField
              id={'gender'}
              label={'Giới tính'}
              InputLabelProps={{ shrink: true }}
              InputProps={{ readOnly: true }}
              value={studentInfo.gender ? 'Nữ' : 'Nam'}
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
              label={'Tên'}
              InputLabelProps={{ shrink: true }}
              InputProps={{ readOnly: true }}
              value={studentInfo.phones[0].name}
              sx={{ width: '100%' }}
              variant={'standard'}
            />
            <TextField
              id={'phone-number-2'}
              label={'Số điện thoại'}
              InputLabelProps={{ shrink: true }}
              InputProps={{ readOnly: true }}
              value={studentInfo.phones[0].number}
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
              label={'Tên'}
              InputLabelProps={{ shrink: true }}
              InputProps={{ readOnly: true }}
              value={studentInfo.phones[1].name}
              sx={{ width: '100%' }}
              variant={'standard'}
            />
            <TextField
              id={'phone-number-2'}
              label={'Số điện thoại'}
              InputLabelProps={{ shrink: true }}
              InputProps={{ readOnly: true }}
              value={studentInfo.phones[1].number}
              sx={{ width: '100%' }}
              variant={'standard'}
            />
          </Box>
          <Box display={'flex'} justifyContent={'space-between'}>
            <Button
              startIcon={<EditIcon />}
              size="small"
              onClick={() => onClickAction(studentInfo, StudentActionType.EDIT_STUDENT)}
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

export default InfoPanelComponent
