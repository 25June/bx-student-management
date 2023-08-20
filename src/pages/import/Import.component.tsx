import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Typography from '@mui/material/Typography'
import TextField from '@mui/material/TextField'
import FormControl from '@mui/material/FormControl'
import Tab from '@mui/material/Tab'
import Tabs from '@mui/material/Tabs'
import { Controller, useForm } from 'react-hook-form'
import * as yup from 'yup'
import { yupResolver } from '@hookform/resolvers/yup'
import React, { useEffect, useState } from 'react'
import { formatMockData, formatStudentTable } from 'utils'
import TableComponent from 'modules/Table/Table.component'
import { studentColumns } from 'modules/Table/helpers'
import { SelectChangeEvent } from '@mui/material/Select'
import { BaseClasses, Role } from 'constant/common'
import { useBatchAddStudents } from 'services/student'
import { Class, Student } from 'models'
import { useSnackbarContext } from 'contexts/SnackbarContext'
import ClassDropdownComponent from 'modules/class-dropdown/ClassDropdown.component'
import { useAuthentication } from 'contexts/AuthContext'

type ImportProps = {
  value: string
}

const ImportSchema = yup.object().shape({
  value: yup.string().required('This field is required'),
})

interface TabPanelProps {
  children?: React.ReactNode
  index: number
  value: number
}

function CustomTabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && <Box>{children}</Box>}
    </div>
  )
}

function a11yProps(index: number) {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`,
  }
}

const ImportComponent = () => {
  const [tabValue, setTabValue] = React.useState<number>(2)
  const [value, setValue] = useState<Student[]>([])
  const { showSnackbar } = useSnackbarContext()
  const { user } = useAuthentication()

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
  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue)
  }

  const parseValue = (values: ImportProps) => {
    console.log(values)
    const formatToArray = JSON.parse(formatValue(values.value))
    console.log({ formatToArray })
    const formatData = formatMockData(formatToArray)
    console.log({ formatData })
    const formatStudents = formatStudentTable(formatData)
    console.log({ formatStudents })
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

  const handleChangeClass = (e: SelectChangeEvent) => {
    const selectedClass = BaseClasses.find((c: Class) => c.id === (e.target.value as string))
    if (typeof selectedClass === 'undefined') {
      console.error('Error at Selected class')
      return
    }
    setClassObj(selectedClass || BaseClasses[0])
  }

  return (
    <Box>
      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Tabs value={tabValue} onChange={handleChange}>
          <Tab label="Nhập" value={1} disabled={user?.role !== Role.CTO} {...a11yProps(1)} />
          <Tab label="Xuất" value={2} {...a11yProps(2)} />
        </Tabs>
      </Box>
      <CustomTabPanel value={tabValue} index={1}>
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
              <ClassDropdownComponent classObj={classObj} onChangeClass={handleChangeClass} />
            </Box>
            <Button onClick={saveData} variant={'contained'} sx={{ mt: 2 }} disabled={!value}>
              Confirm Save Date
            </Button>
          </Box>
        </Box>
      </CustomTabPanel>
      <CustomTabPanel value={tabValue} index={2}>
        Item Two
      </CustomTabPanel>
    </Box>
  )
}

export default ImportComponent
