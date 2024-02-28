import React, { useEffect, useState } from 'react'
import InputLabel from '@mui/material/InputLabel'
import Select, { SelectChangeEvent, SelectProps } from '@mui/material/Select'
import MenuItem from '@mui/material/MenuItem'
import FormControl from '@mui/material/FormControl'
import { SchoolYear } from 'models/schoolYear'
import { fetchSchoolYears } from 'services/one-time-call/schoolYear'

interface SchoolYearsDropdownComponentProps {
  schoolYearId: string
  onChangeSchoolYear: (event: SelectChangeEvent) => void
  size?: SelectProps['size']
}

const SchoolYearsDropdownComponent = ({
  onChangeSchoolYear,
  size = 'medium',
  schoolYearId,
}: SchoolYearsDropdownComponentProps) => {
  const [schoolYears, setSchoolYears] = useState<SchoolYear[]>([])
  useEffect(() => {
    fetchSchoolYears()
      .then((schYear: SchoolYear[]) => {
        setSchoolYears(schYear)
      })
      .catch((error) => {
        console.error(error)
      })
  }, [])
  return (
    <FormControl fullWidth={true} size={size}>
      <InputLabel>Niên Khoá</InputLabel>
      {schoolYears.length > 0 && (
        <Select
          defaultValue=""
          value={schoolYearId}
          label="Niên Khoá"
          onChange={onChangeSchoolYear}
        >
          {schoolYears.map((c: SchoolYear) => (
            <MenuItem value={c.id} key={c.duration}>
              {c.duration}
            </MenuItem>
          ))}
        </Select>
      )}
    </FormControl>
  )
}

export default SchoolYearsDropdownComponent
