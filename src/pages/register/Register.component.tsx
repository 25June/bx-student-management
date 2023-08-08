import { Box } from '@mui/material'
import RegisterFormComponent from 'modules/register/RegisterForm.component'
import ConfirmationFormComponent from 'modules/register/ConfirmationForm.component'
import React, { useState } from 'react'
import { useRegisterNewStudent } from 'services/registerStudent'
import { useSnackbarContext } from 'contexts/SnackbarContext'
import { RegisterStudent } from 'models/student'
import LogoAsBlue from 'static/images/logo/logo-blue.svg'
import FinishRegisterComponent from 'modules/register/FinishRegister.component'
import { GoogleReCaptchaProvider } from 'react-google-recaptcha-v3'

enum Step {
  INPUT_FORM,
  CONFIRM_INPUT,
  FINISH,
}

const RegisterComponent = () => {
  const registerNewStudent = useRegisterNewStudent()
  const { showSnackbar } = useSnackbarContext()
  const [loading, setLoading] = useState<boolean>(false)

  const [student, setStudent] = useState<Omit<RegisterStudent, 'id'>>()
  const [step, setStep] = useState<Step>(Step.INPUT_FORM)
  const handleConfirm = () => {
    if (student) {
      setLoading(true)
      registerNewStudent({
        dataInput: student,
        onSuccess: () => showSnackbar(`Thành Công`, 'success'),
        onError: () => showSnackbar(`Thất Bại`, 'error'),
        onComplete: () => {
          setLoading(false)
          setStep(Step.FINISH)
        },
      })
    }
  }
  return (
    <Box sx={{ position: 'relative', maxWidth: 500, margin: '0 auto' }}>
      <Box
        component={'img'}
        src={LogoAsBlue}
        sx={{
          position: 'fixed',
          display: 'flex',
          margin: '0 auto',
          zIndex: 0,
          aspectRatio: '9/16',
          maxWidth: 500,
        }}
      />
      <GoogleReCaptchaProvider reCaptchaKey={'6LdA4Y4nAAAAACPfA9KRoGEGVBjr30UcOx2x5NF3'}>
        <Box sx={{ zIndex: 2, position: 'relative' }}>
          {step === Step.INPUT_FORM && (
            <RegisterFormComponent
              student={student}
              setStudent={setStudent}
              onMoveToFinalStep={() => setStep(Step.CONFIRM_INPUT)}
            />
          )}
          {step === Step.CONFIRM_INPUT && student && (
            <ConfirmationFormComponent
              studentForm={student}
              onConfirm={handleConfirm}
              onBack={() => setStep(Step.FINISH)}
              loading={loading}
            />
          )}
          {step === Step.FINISH && <FinishRegisterComponent />}
        </Box>
      </GoogleReCaptchaProvider>
    </Box>
  )
}

export default RegisterComponent
