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
import { useStudentContext } from 'contexts/StudentContext'
import { useClassContext } from 'contexts/ClassContext'
import writeXlsxFile from 'write-excel-file'
import { format } from 'date-fns'
import { formatYYYMMDDToDDMMYYYY } from 'utils/datetime'

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
  const { students } = useStudentContext()
  const { classObj: currentClass } = useClassContext()

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

  const exportDate = async () => {
    const BANNER_ROW = [
      {
        value: `Ban Giáo Lý Thiếu Nhi`,
        fontWeight: 'bold',
        span: 3,
        align: 'center',
        wrap: true,
      },
      null,
      null,
      {
        value: `Danh Sách Học Sinh Giáo Lý`,
        fontWeight: 'bold',
        span: 5,
        align: 'center',
        alignVertical: 'center',
        wrap: true,
      },
      null,
      null,
      null,
      null,
      {
        value: `Cập nhật ngày ${format(new Date(), 'dd/MM/yyyy')}`,
        rowSpan: 2,
        align: 'center',
        alignVertical: 'center',
        wrap: true,
      },
    ]
    const PREPARE_ROW = [
      {
        value: `Lớp ${currentClass?.name}`,
        fontWeight: 'bold',
        span: 3,
        align: 'center',
        wrap: true,
      },
      null,
      null,
      {
        value: `Niên Khoá 2023-2024`,
        fontWeight: 'bold',
        span: 5,
        align: 'center',
        alignVertical: 'center',
        wrap: true,
      },
      null,
      null,
      null,
      null,
      null,
    ]
    const HEADER_ROW = [
      {
        value: 'STT',
        fontWeight: 'bold',
        borderStyle: 'thin',
        align: 'center',
      },
      {
        value: 'Tên Thánh',
        fontWeight: 'bold',
        borderStyle: 'thin',
        align: 'center',
      },
      {
        value: 'Họ và',
        fontWeight: 'bold',
        leftBorderStyle: 'thin',
        topBorderStyle: 'thin',
        bottomBorderStyle: 'thin',
        align: 'center',
      },
      {
        value: 'Tên',
        fontWeight: 'bold',
        rightBorderStyle: 'thin',
        topBorderStyle: 'thin',
        bottomBorderStyle: 'thin',
        align: 'center',
      },
      {
        value: 'Ngày Sinh',
        fontWeight: 'bold',
        align: 'center',
        borderStyle: 'thin',
      },
      {
        value: 'Địa Chỉ',
        fontWeight: 'bold',
        align: 'center',
        borderStyle: 'thin',
      },
      {
        value: 'VH',
        fontWeight: 'bold',
        align: 'center',
        borderStyle: 'thin',
      },
      {
        value: 'Điện Thoại 1',
        fontWeight: 'bold',
        align: 'center',
        borderStyle: 'thin',
      },
      {
        value: 'Điện Thoại 2',
        fontWeight: 'bold',
        align: 'center',
        borderStyle: 'thin',
      },
    ]
    const DATA_ROWS = students.map((stu, index) => {
      return [
        {
          alignVertical: 'top',
          type: Number,
          value: index + 1,
          align: 'center',
          borderStyle: 'thin',
        },
        {
          alignVertical: 'top',
          type: String,
          value: stu.saintName || '',
          borderStyle: 'thin',
        },
        {
          alignVertical: 'top',
          type: String,
          value: stu.lastName,
          leftBorderStyle: 'thin',
          topBorderStyle: 'thin',
          bottomBorderStyle: 'thin',
        },
        {
          alignVertical: 'top',
          type: String,
          value: stu.firstName,
          fontWeight: 'bold',
          rightBorderStyle: 'thin',
          topBorderStyle: 'thin',
          bottomBorderStyle: 'thin',
        },
        {
          alignVertical: 'top',
          type: String,
          value: stu.birthday ? formatYYYMMDDToDDMMYYYY(stu.birthday) : stu.birthday,
          borderStyle: 'thin',
          align: 'center',
        },
        {
          alignVertical: 'top',
          type: String,
          value: stu.address || '',
          wrap: true,
          borderStyle: 'thin',
        },
        {
          alignVertical: 'top',
          type: String,
          value: stu.grade?.toString() || '',
          align: 'center',
          borderStyle: 'thin',
        },
        {
          alignVertical: 'top',
          type: String,
          value: stu.phones[0] ? stu.phones[0].number : '',
          align: 'center',
          borderStyle: 'thin',
        },
        {
          alignVertical: 'top',
          type: String,
          value: stu.phones[1] ? stu.phones[1].number : '',
          align: 'center',
          borderStyle: 'thin',
        },
      ]
    })
    const COLUMNS = [
      {
        width: 5,
      },
      {
        width: 10,
      },
      {
        width: 20,
      },
      {
        width: 8,
      },
      {
        width: 12,
      },
      {
        width: 40,
      },
      {
        width: 7,
      },
      {
        width: 15,
      },
      {
        width: 15,
      },
    ]
    const data = [BANNER_ROW, PREPARE_ROW, HEADER_ROW, ...DATA_ROWS]
    console.log(data)
    await writeXlsxFile(data as any, {
      columns: COLUMNS,
      fileName: `${currentClass?.id || 'file'}.xlsx`,
      fontFamily: 'Times New Roman',
      fontSize: 13,
      orientation: 'landscape',
    })
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
        <Box sx={{ textAlign: 'left', padding: 1 }}>
          <Typography fontSize={'1rem'} fontWeight={400} sx={{ marginBottom: 1 }}>
            Xuất Thông Tin Thiếu Nhi
          </Typography>
          <Typography fontSize={'1rem'} fontWeight={500} sx={{ marginBottom: 2 }}>
            Lớp {currentClass?.name}
          </Typography>
          <Button onClick={exportDate} variant={'contained'}>
            Xuất file excel
          </Button>
        </Box>
      </CustomTabPanel>
    </Box>
  )
}

export default ImportComponent
