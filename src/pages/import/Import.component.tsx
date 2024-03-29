import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Typography from '@mui/material/Typography'
import TextField from '@mui/material/TextField'
import FormControl from '@mui/material/FormControl'
import { Controller, useForm } from 'react-hook-form'
import * as yup from 'yup'
import { yupResolver } from '@hookform/resolvers/yup'
import React, { useEffect, useState } from 'react'
import { formatImportedData } from 'utils/common'
import { formatStudentTable } from 'utils/formatDataForTable'
import TableComponent from 'modules/Table/Table.component'
import { studentColumns } from 'modules/Table/helpers'
import { SelectChangeEvent } from '@mui/material/Select'
import { BaseClasses } from 'constant/common'
import { useBatchAddStudents } from 'services/student'
import { Class, Student } from 'models'
import { useSnackbarContext } from 'contexts/SnackbarContext'
import ClassDropdownComponent from 'modules/class-dropdown/ClassDropdown.component'
import { getAllSaintNames } from 'services/one-time-call/saintNames'

type ImportProps = {
  value: string
}

const ImportSchema = yup.object().shape({
  value: yup.string().required('This field is required'),
})

const ImportComponent = () => {
  const [value, setValue] = useState<Student[]>([])
  const { showSnackbar } = useSnackbarContext()

  const [classObj, setClassObj] = useState<Class>(BaseClasses[0])
  const { control, handleSubmit, reset } = useForm<ImportProps>({
    defaultValues: {
      value: '',
    },
    resolver: yupResolver(ImportSchema),
  })
  const addStudents = useBatchAddStudents()

  useEffect(() => {
    return () => reset()
  }, [reset])

  const formatValue = (unFormatValue: string) => {
    return unFormatValue.slice(1, unFormatValue.length - 1)
  }

  const parseValue = (values: ImportProps) => {
    const formatToArray = JSON.parse(formatValue(values.value))
    const formatData = formatImportedData(formatToArray)
    const formatStudents = formatStudentTable(formatData)
    setValue(formatStudents)
  }

  const saveData = () => {
    // call hook
    const formatValueBeforeAdd: Omit<Student, 'id'>[] = value.map(
      ({ id, ...student }: Student) => ({
        ...student,
        class: classObj,
      })
    )
    return addStudents({
      students: formatValueBeforeAdd,
      onSuccess: () => {
        showSnackbar('Add success', 'success')
      },
      onError: () => {
        showSnackbar('Add Error', 'error')
      },
      onComplete: () => console.log('completed'),
    })
  }

  const listall = () => {
    getAllSaintNames().then((value) => console.log(value))
  }

  const handleChangeClass = (e: SelectChangeEvent) => {
    const selectedClass = BaseClasses.find((c: Class) => c.id === (e.target.value as string))
    if (typeof selectedClass === 'undefined') {
      console.error('Error at Selected class')
      return
    }
    setClassObj(selectedClass || BaseClasses[0])
  }

  return (
    <Box pt={1} textAlign={'left'} width={'100%'}>
      <Box pr={2} pl={2}>
        <Typography fontSize={'1rem'} fontWeight={500} sx={{ marginBottom: 2 }}>
          Nhập Thông Tin Thiếu Nhi
        </Typography>
        <form onSubmit={handleSubmit(parseValue)}>
          <Controller
            name="value"
            control={control}
            render={({ field }) => {
              return (
                <FormControl fullWidth={true}>
                  <TextField
                    helperText={'Stringify before parse'}
                    multiline={true}
                    maxRows={10}
                    label={'Dữ liệu'}
                    fullWidth={true}
                    {...field}
                  />
                </FormControl>
              )
            }}
          />
          <Button type={'submit'} variant={'outlined'}>
            Parse
          </Button>
        </form>
        {value.length !== 0 && <TableComponent columns={studentColumns} rows={value} />}
        <Box mt={2} mb={2}>
          <ClassDropdownComponent
            useDarkMode={false}
            classObj={classObj}
            onChangeClass={handleChangeClass}
          />
        </Box>
        <Button onClick={saveData} variant={'contained'} sx={{ mt: 2 }} disabled={!value}>
          Confirm Save Date
        </Button>
        <Button onClick={listall} variant={'contained'} sx={{ mt: 2 }} disabled={!value}>
          List all saint names in database
        </Button>
      </Box>
    </Box>
  )
}

export default ImportComponent
