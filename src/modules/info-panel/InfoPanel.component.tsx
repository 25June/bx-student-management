import React from 'react'
import { Box, TextField, Button, Chip } from '@mui/material'
import MuiDrawer from '@mui/material/Drawer'
import KeyboardBackspaceIcon from '@mui/icons-material/KeyboardBackspace'
import EditIcon from '@mui/icons-material/Edit'
import { StudentActionType } from 'constant'
import DeleteIcon from '@mui/icons-material/Delete'
import { Student } from 'models'
import { ImageBoxComponent } from 'modules'
import MoveUpIcon from '@mui/icons-material/MoveUp'

interface InfoPanelComponentProps {
  isOpen: boolean
  studentInfo?: Student
  onClose: () => void
  onClickAction: (student: any, actionType: StudentActionType) => void
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
      sx={{
        [`& .MuiDrawer-paper`]: { width: 325, boxSizing: 'border-box' },
      }}
    >
      <Box pt={9} pr={2} pl={2} mb={5}>
        <Box display={'flex'} alignItems={'center'} mb={1}>
          <Chip
            color={'default'}
            size={'small'}
            icon={<KeyboardBackspaceIcon />}
            onClick={onClose}
            label="Trở về"
            variant="outlined"
          />
        </Box>
        <Box display={'flex'}>
          <ImageBoxComponent
            imagePath={studentInfo.avatarPath}
            gender={studentInfo.gender}
            maxWidth={200}
          />
        </Box>
        <Box>
          <Box textAlign={'center'} component={'h5'} fontWeight={400} margin={0}>
            {studentInfo.saintName}
          </Box>
          <Box textAlign={'center'} component={'h3'} fontWeight={500} mt={0}>
            {`${studentInfo.lastName} ${studentInfo.firstName}`}
          </Box>
          <Box mb={2} width={'100%'}>
            <TextField
              id={'birthday'}
              label={'Ngày sinh'}
              InputLabelProps={{ shrink: true }}
              InputProps={{ readOnly: true }}
              type={'date'}
              value={studentInfo.birthday}
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
              multiline={true}
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
              startIcon={<MoveUpIcon />}
              size="small"
              onClick={() => onClickAction(studentInfo, StudentActionType.TRANSFER_CLASS)}
              color="success"
              variant="contained"
            >
              Chuyển lớp
            </Button>
            <Button
              startIcon={<DeleteIcon />}
              size="small"
              onClick={handleRemoveStudent}
              color="error"
              variant="outlined"
              disabled={studentInfo.isDeleted}
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
