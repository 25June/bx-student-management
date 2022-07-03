import React from 'react'
import { Button, Box } from '@mui/material'
import { makeStyles } from '@mui/styles'
import { GridColDef } from '@mui/x-data-grid'
import AddIcon from '@mui/icons-material/Add'
import TableComponent from '../../modules/Table/Table.component'
// import { Student } from '../../models/student';
import { students } from '../../mockData/students'

const columns: GridColDef[] = [
  { field: 'id', headerName: 'Id' },
  { field: 'saintName', headerName: 'Saint name' },
  { field: 'lastName', headerName: 'Last name' },
  { field: 'firstName', headerName: 'First name' },
  { field: 'birthday', headerName: 'Birthday' },
  { field: 'address', headerName: 'Address' },
  { field: 'grade', headerName: 'Grade' },
  { field: 'phone1', headerName: 'Mother phone' },
  { field: 'phone2', headerName: 'Father phone' },
]

const HomeComponent = () => {
  const classes = useStyles()
  const newStudents = students.map((value, index) => ({ id: index, ...value }))
  return (
    <div className={classes.home}>
      <Box className={classes.title}>
        <h1>Thông Tin Thiếu Nhi</h1>
        <Button variant="outlined" startIcon={<AddIcon />}>
          Add
        </Button>
      </Box>
      <TableComponent columns={columns} rows={newStudents} />
    </div>
  )
}

const useStyles = makeStyles({
  home: {
    width: '100%',
  },
  title: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
})
export default HomeComponent
