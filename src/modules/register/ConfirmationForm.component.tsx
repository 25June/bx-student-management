import { Box, Typography, Button, Divider, CircularProgress } from '@mui/material'
import React, { useCallback, useEffect } from 'react'
import { RegisterStudent } from 'models/student'
import { formatYYYMMDDToDDMMYYYY } from 'utils/datetime'
import { blue } from '@mui/material/colors'
import DoneAllIcon from '@mui/icons-material/DoneAll'
import { useGoogleReCaptcha } from 'react-google-recaptcha-v3'

const ConfirmationFormComponent = ({
  studentForm,
  onConfirm,
  onBack,
  loading,
}: {
  studentForm: Omit<RegisterStudent, 'id'>
  onConfirm: any
  onBack: any
  loading: boolean
}) => {
  const { executeRecaptcha } = useGoogleReCaptcha()
  // Create an event handler so you can call the verification on button click event or form submit
  const handleReCaptchaVerify = useCallback(async () => {
    if (!executeRecaptcha) {
      console.log('Execute recaptcha not yet available')
      return
    }

    const token = await executeRecaptcha(onConfirm)
    console.log({ token })
    // Do whatever you want with the token
  }, [onConfirm, executeRecaptcha])

  useEffect(() => {
    handleReCaptchaVerify()
  }, [handleReCaptchaVerify])

  return (
    <Box p={2} sx={{ position: 'relative', height: '100%' }}>
      <Box>
        <Box>
          <Typography fontSize={'1.5rem'} fontWeight={500} sx={{ color: blue[500] }}>
            Kiểm Tra Thông Tin
          </Typography>
          <Typography
            fontSize={'1.25rem'}
            fontWeight={500}
            sx={{ marginBottom: 2, color: blue[300] }}
          >
            Niên Khoá 2023 - 2024
          </Typography>
        </Box>
      </Box>
      <Box sx={{ textAlign: 'left', paddingBottom: 3 }}>
        <Typography fontSize={'1rem'} fontWeight={400} sx={{ marginBottom: 2 }}>
          Em{' '}
          <b>
            {studentForm.saintName || `~`} {studentForm.fullName || `~`}
          </b>
        </Typography>
        <Typography fontSize={'1rem'} fontWeight={400} sx={{ marginBottom: 2 }}>
          Sinh ngày{' '}
          <b>{studentForm.birthday ? formatYYYMMDDToDDMMYYYY(studentForm.birthday) : '~'}</b>, Tại{' '}
          <b>{studentForm.bornIn || `~`}</b>
        </Typography>
        <Typography fontSize={'1rem'} fontWeight={400} sx={{ marginBottom: 2 }}>
          Học tại trường <b>{studentForm.schoolName || `~`}</b>, Lớp{' '}
          <b>{studentForm.grade || `~`}</b>
        </Typography>
        <Typography fontSize={'1rem'} fontWeight={400} sx={{ marginBottom: 2 }}>
          Là con ông <b>{studentForm.parent.fatherName || `~`}</b>
        </Typography>
        <Typography fontSize={'1rem'} fontWeight={400} sx={{ marginBottom: 2 }}>
          Và con bà <b>{studentForm.parent.motherName || `~`}</b>
        </Typography>
        <Typography fontSize={'1rem'} fontWeight={400} sx={{ marginBottom: 2 }}>
          Địa chỉ thường trú là <b>{studentForm.address || `~`}</b>
        </Typography>
        <Typography fontSize={'1rem'} fontWeight={400} sx={{ marginBottom: 2 }}>
          Địa chỉ tạm trú là <b>{studentForm.shortTermAddress || `~`}</b>
        </Typography>
        <Typography fontSize={'1rem'} fontWeight={400} sx={{ marginBottom: 2 }}>
          Điện thoại <b>{studentForm.phones[0]?.name || `~`}</b> số{' '}
          <b>{studentForm.phones[0]?.number || `~`}</b>
        </Typography>
        <Typography fontSize={'1rem'} fontWeight={400} sx={{ marginBottom: 2 }}>
          Điện thoại <b>{studentForm.phones[1]?.name || `~`}</b> số{' '}
          <b>{studentForm.phones[1]?.number || `~`}</b>
        </Typography>

        <Typography fontSize={'1rem'} fontWeight={400} sx={{ marginBottom: 2 }}>
          Rửa tội ngày{' '}
          <b>{studentForm.baptismDate ? formatYYYMMDDToDDMMYYYY(studentForm.baptismDate) : '~'}</b>{' '}
          tại <b>{studentForm.baptismChurch || `~`}</b> do Linh Mục{' '}
          <b>{studentForm.baptismByPriest || `~`}</b>
        </Typography>
        <Typography fontSize={'1rem'} fontWeight={400} sx={{ marginBottom: 2 }}>
          Xưng tội và Rước lễ lần đầu ngày{' '}
          <b>
            {studentForm.eucharistAndReconciliationDate
              ? formatYYYMMDDToDDMMYYYY(studentForm.eucharistAndReconciliationDate)
              : '~'}
          </b>{' '}
          tại <b>{studentForm.eucharistAndReconciliationChurch || `~`}</b> do Linh Mục{' '}
          <b>{studentForm.eucharistAndReconciliationByPriest || `~`}</b>
        </Typography>
      </Box>
      <Box>
        <Divider />
        <Box sx={{ display: 'flex', justifyContent: 'center', gap: 4, marginTop: 2 }}>
          <Button onClick={onBack} color={'primary'} variant={'outlined'} disabled={loading}>
            Chỉnh sửa lại
          </Button>
          <Button
            onClick={handleReCaptchaVerify}
            color={'primary'}
            variant={'contained'}
            disabled={loading}
            endIcon={loading ? <CircularProgress size={'1rem'} /> : <DoneAllIcon />}
          >
            Xác nhận
          </Button>
        </Box>
      </Box>
    </Box>
  )
}

export default ConfirmationFormComponent
