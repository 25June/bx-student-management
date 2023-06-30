import Box from '@mui/material/Box'
import TableComponent from 'modules/Table/Table.component'
import ScoreBookDialogComponent from 'modules/score-book-dialog/ScoreBookDialog.component'
import { renderScoreBookActions, ScoreBookColumns } from 'modules/Table/helpers'
import { StudentScoreBooks, Student } from 'models'
import React, { useState, useMemo, useEffect } from 'react'
import { useStudentContext } from 'contexts/StudentContext'
import { useClassContext } from 'contexts/ClassContext'
import { Typography } from '@mui/material'
import { useGetStudentScoreBooks1 } from 'services/scorebook'
import SemesterDropdownComponent from 'modules/common/SemesterDropdown.component'
import { SelectChangeEvent } from '@mui/material/Select'
import SearchComponent from 'modules/common/Search.component'
import { toLowerCaseNonAccentVietnamese, useIsMobile } from 'utils/common'
import ScoreBookAccordionComponent from 'modules/score-book/ScoreBookAccordion.component'
import AccordionSummary from '@mui/material/AccordionSummary'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import TableFullNameCellComponent from 'modules/common/TableFullNameCell.component'
import AccordionDetails from '@mui/material/AccordionDetails'
import Accordion from '@mui/material/Accordion'

const ScoreBookComponent = () => {
  const { students } = useStudentContext()
  const { classId } = useClassContext()
  const isMobile = useIsMobile()
  const { studentScoreBooks } = useGetStudentScoreBooks1({ classId })
  const [selectedScoreBook, setSelectedScoreBook] = useState<StudentScoreBooks>()
  const [selectedSemester, setSelectedSemester] = useState<string>('hk1')

  const stuScoreBooks1: StudentScoreBooks[] | Student[] = useMemo(() => {
    if (students.length !== 0) {
      return students.map((stu) => {
        if (studentScoreBooks?.[stu.id]) {
          return {
            ...stu,
            ...studentScoreBooks[stu.id],
          }
        }
        return stu
      })
    }
    return []
  }, [students, studentScoreBooks])

  const [filteredStuScoreBooks, setFilteredStuScoreBooks] = useState<
    StudentScoreBooks[] | Student[]
  >([])
  useEffect(() => {
    if (stuScoreBooks1) {
      setFilteredStuScoreBooks(stuScoreBooks1)
    }
  }, [stuScoreBooks1])

  const handleChangeSemester = (event: SelectChangeEvent) => {
    setSelectedSemester(event.target.value)
  }

  const handleFilterStudentByName = (value: string) => {
    if (stuScoreBooks1 && stuScoreBooks1.length !== 0) {
      if (!value) {
        setFilteredStuScoreBooks(stuScoreBooks1)
        return
      }

      const filtered = stuScoreBooks1.filter((stu) => {
        const keywordArr = [...stu.lastName.split(' '), ...stu.firstName.split(' ')].map(
          (keyword) => toLowerCaseNonAccentVietnamese(keyword)
        )
        return keywordArr.includes(value.toLowerCase())
      })
      setFilteredStuScoreBooks(filtered)
    }
  }

  return (
    <Box p={isMobile ? 1 : 2}>
      <Box
        sx={{
          display: 'flex',
          gap: isMobile ? 1 : 2,
          width: '100%',
          alignItems: isMobile ? 'flex-start' : 'center',
          flexDirection: isMobile ? 'column' : 'row',
        }}
      >
        <Typography sx={{ textAlign: 'left', fontSize: isMobile ? '1rem' : '2rem' }} variant={'h1'}>
          Bảng Điểm
        </Typography>
        <SemesterDropdownComponent
          selectedSemester={selectedSemester}
          onChangeSemester={handleChangeSemester}
          size={'small'}
        />
      </Box>
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          marginBottom: isMobile ? 2 : 4,
          marginTop: 1,
          alignItems: isMobile ? 'flex-start' : 'center',
          flexDirection: isMobile ? 'column' : 'row',
          gap: 2,
        }}
      >
        <Box>
          <SearchComponent onChange={handleFilterStudentByName} />
        </Box>
      </Box>
      {!isMobile && filteredStuScoreBooks?.length !== 0 ? (
        <TableComponent
          columns={ScoreBookColumns}
          rows={filteredStuScoreBooks}
          onClickAction={(data: StudentScoreBooks) => setSelectedScoreBook(data)}
          renderActionMenu={renderScoreBookActions}
        />
      ) : (
        <Box>
          {filteredStuScoreBooks.map((row) => (
            <Accordion key={row.id}>
              <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                aria-controls={`scorebook-accordion-content-${row.id}`}
                id={`scorebook-accordion-header-${row.id}`}
              >
                <TableFullNameCellComponent
                  avatarPath={row.avatarPath}
                  saintName={row.saintName}
                  lastName={row.lastName}
                  firstName={row.firstName}
                  gender={!!row.gender}
                />
              </AccordionSummary>
              <AccordionDetails>
                <ScoreBookAccordionComponent
                  key={row.id}
                  studentScoreBook={row as StudentScoreBooks}
                />
              </AccordionDetails>
            </Accordion>
          ))}
        </Box>
      )}
      {!!selectedScoreBook && (
        <ScoreBookDialogComponent
          isOpen={!!selectedScoreBook}
          onClose={() => setSelectedScoreBook(undefined)}
          data={selectedScoreBook}
        />
      )}
    </Box>
  )
}

export default ScoreBookComponent
