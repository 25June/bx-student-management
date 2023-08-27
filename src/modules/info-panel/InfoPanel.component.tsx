import React, { useState, useEffect } from 'react'
import { Box, TextField, Button, Chip } from '@mui/material'
import MuiDrawer from '@mui/material/Drawer'
import KeyboardBackspaceIcon from '@mui/icons-material/KeyboardBackspace'
import EditIcon from '@mui/icons-material/Edit'
import { StudentActionType } from 'constant'
import DeleteIcon from '@mui/icons-material/Delete'
import { Student } from 'models'
import { ImageBoxComponent } from 'modules'
import MoveUpIcon from '@mui/icons-material/MoveUp'
import EditInfoPanelComponent from 'modules/info-panel/EditInfoPanel.component'

interface InfoPanelComponentProps {
  isOpen: boolean
  student?: Student
  onClose: () => void
  onClickAction: (student: any, actionType: StudentActionType) => void
}

const InfoPanelComponent = ({
  isOpen,
  student,
  onClose,
  onClickAction,
}: InfoPanelComponentProps) => {
  const [editMode, setEditMode] = useState<boolean>(false)

  useEffect(() => {
    return () => setEditMode(false)
  }, [])

  const handleRemoveStudent = () => {
    onClickAction(student, StudentActionType.DELETE_STUDENT)
    onClose()
  }

  return (
    <MuiDrawer
      variant="temporary"
      anchor={'right'}
      open={isOpen}
      onClose={onClose}
      sx={{
        [`& .MuiDrawer-paper`]: { width: 325, boxSizing: 'border-box' },
      }}
    >
      {student && (
        <Box pt={9} pr={2} pl={2} mb={5} key={student.id}>
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
          {!editMode && (
            <Box display={'flex'}>
              <ImageBoxComponent
                imagePath={student.avatarPath}
                gender={student.gender}
                maxWidth={200}
              />
            </Box>
          )}
          <Box>
            {editMode && <EditInfoPanelComponent student={student} setEditMode={setEditMode} />}
            {!editMode && (
              <Box>
                <Box textAlign={'center'} component={'h5'} fontWeight={400} margin={0}>
                  {student.saintName}
                </Box>
                <Box textAlign={'center'} component={'h3'} fontWeight={500} mt={0}>
                  {`${student.lastName} ${student.firstName}`}
                </Box>
                <Box mb={2} width={'100%'}>
                  <TextField
                    id={'birthday'}
                    label={'Ngày sinh'}
                    InputLabelProps={{ shrink: true }}
                    InputProps={{ readOnly: true }}
                    type={'date'}
                    value={student.birthday}
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
                    value={student.address}
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
                    value={student.grade}
                    variant={'standard'}
                    sx={{ width: '45%' }}
                  />
                  <TextField
                    id={'gender'}
                    label={'Giới tính'}
                    InputLabelProps={{ shrink: true }}
                    InputProps={{ readOnly: true }}
                    value={student.gender ? 'Nữ' : 'Nam'}
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
                    value={student.phones[0].name}
                    sx={{ width: '100%' }}
                    variant={'standard'}
                  />
                  <TextField
                    id={'phone-number-1'}
                    label={'Số điện thoại'}
                    InputLabelProps={{ shrink: true }}
                    InputProps={{ readOnly: true }}
                    value={student.phones[0].number}
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
                    id={'phone-name-2'}
                    label={'Tên'}
                    InputLabelProps={{ shrink: true }}
                    InputProps={{ readOnly: true }}
                    value={student.phones[1].name}
                    sx={{ width: '100%' }}
                    variant={'standard'}
                  />
                  <TextField
                    id={'phone-number-2'}
                    label={'Số điện thoại'}
                    InputLabelProps={{ shrink: true }}
                    InputProps={{ readOnly: true }}
                    value={student.phones[1].number}
                    sx={{ width: '100%' }}
                    variant={'standard'}
                  />
                </Box>
                {student.phones[2] && (
                  <Box
                    sx={{
                      width: '100%',
                      marginBottom: 2,
                      display: 'flex',
                      justifyContent: 'space-between',
                    }}
                  >
                    <TextField
                      id={'phone-name-3'}
                      label={'Tên'}
                      InputLabelProps={{ shrink: true }}
                      InputProps={{ readOnly: true }}
                      value={student.phones[2]?.name || ''}
                      sx={{ width: '100%' }}
                      variant={'standard'}
                    />
                    <TextField
                      id={'phone-number-3'}
                      label={'Số điện thoại'}
                      InputLabelProps={{ shrink: true }}
                      InputProps={{ readOnly: true }}
                      value={student.phones[2]?.number || ''}
                      sx={{ width: '100%' }}
                      variant={'standard'}
                    />
                  </Box>
                )}
                <Box display={'flex'} justifyContent={'space-between'}>
                  <Button
                    startIcon={<EditIcon />}
                    size="small"
                    onClick={() => setEditMode(true)}
                    color="warning"
                    variant="outlined"
                  >
                    Sửa
                  </Button>
                  <Button
                    startIcon={<MoveUpIcon />}
                    size="small"
                    onClick={() => onClickAction(student, StudentActionType.TRANSFER_CLASS)}
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
                    disabled={student.isDeleted}
                  >
                    Xoá
                  </Button>
                </Box>
              </Box>
            )}
          </Box>
        </Box>
      )}
    </MuiDrawer>
  )
}

export default InfoPanelComponent
