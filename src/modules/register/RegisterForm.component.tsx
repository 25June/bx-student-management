import { Box, Button, Typography, Stepper, Step, StepLabel, StepContent } from '@mui/material'
import React, { useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import ClassDropdownComponent from 'modules/class-dropdown/ClassDropdown.component'
import { formatPhone, splitFullName } from 'utils/formatDataForTable'
import { getRegisterValues, StudentRegisterForm } from 'modules/student-dialog/helpers'
import { Class } from 'models'
import { SelectChangeEvent } from '@mui/material/Select'
import { BaseClasses } from 'constant/common'
import { RegisterStudent } from 'models/student'
import StudentInfoStepComponent from 'modules/register/StudentInfoStep.component'
import ParentInfoStepComponent from 'modules/register/ParentInfoStep.component'
import SacramentInfoComponent from 'modules/register/SacramentInfo.component'
import { blue } from '@mui/material/colors'

const RegisterFormComponent = ({
  student,
  setStudent,
  onMoveToFinalStep,
}: {
  student?: Omit<RegisterStudent, 'id'>
  setStudent: any
  onMoveToFinalStep: any
}) => {
  const { handleSubmit, control, setValue } = useForm<StudentRegisterForm>({
    defaultValues: getRegisterValues(student),
  })
  const [activeStep, setActiveStep] = useState<number>(0)

  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1)
  }

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1)
  }
  const onSubmit = async (data: StudentRegisterForm) => {
    const { firstName, lastName } = splitFullName(data.fullName)
    const newStudent: Omit<RegisterStudent, 'id'> = {
      ...data,
      firstName,
      lastName,
      phones: [
        { ...data.phone1, number: formatPhone(data.phone1.number) },
        { ...data.phone2, number: formatPhone(data.phone2.number) },
      ],
    }
    setStudent(newStudent)
    onMoveToFinalStep()
  }

  const handleChangeClass = (event: SelectChangeEvent) => {
    const selectedClass = BaseClasses.find((c: Class) => c.id === (event.target.value as string))
    if (typeof selectedClass === 'undefined') {
      console.error('Error at Selected class')
      return
    }
    setValue('class', selectedClass || BaseClasses[0])
  }
  const steps = [
    {
      label: 'Thông tin thiếu nhi',
      content: <StudentInfoStepComponent control={control} />,
    },
    {
      label: 'Thông tin phụ huynh',
      content: <ParentInfoStepComponent control={control} />,
    },
    {
      label: 'Thông tin Bí Tích',
      content: <SacramentInfoComponent control={control} />,
    },
  ]

  return (
    <Box p={2}>
      <Typography fontSize={'1.5rem'} fontWeight={500} sx={{ color: blue[500] }}>
        Ghi Danh Học Giáo Lý
      </Typography>
      <Typography fontSize={'1.25rem'} fontWeight={500} sx={{ marginBottom: 2, color: blue[300] }}>
        Niên Khoá 2023 - 2024
      </Typography>

      <form>
        <Controller
          control={control}
          name={'class'}
          render={({ field }) => (
            <ClassDropdownComponent
              classObj={field.value}
              onChangeClass={handleChangeClass}
              size={'small'}
            />
          )}
        />
        <Stepper activeStep={activeStep} orientation="vertical">
          {steps.map((step, index) => {
            return (
              <Step key={step.label}>
                <StepLabel
                  optional={
                    index === 2 ? <Typography variant="caption">Bước cuối</Typography> : null
                  }
                >
                  {step.label}
                </StepLabel>
                <StepContent>
                  <Box>{step.content}</Box>
                  <Box sx={{ mb: 2 }}>
                    <Box sx={{ textAlign: 'right' }}>
                      <Button
                        variant="contained"
                        onClick={index === steps.length - 1 ? handleSubmit(onSubmit) : handleNext}
                        sx={{ mt: 1, mr: 1 }}
                      >
                        {index === steps.length - 1 ? 'Hoàn tất' : 'Tiếp tục'}
                      </Button>
                      {index !== 0 && (
                        <Button onClick={handleBack} sx={{ mt: 1, mr: 1 }}>
                          Trở về bước {index}
                        </Button>
                      )}
                    </Box>
                  </Box>
                </StepContent>
              </Step>
            )
          })}
        </Stepper>
      </form>
    </Box>
  )
}

export default RegisterFormComponent
