import { Box, Typography, Button } from '@mui/material'
import { useEffect } from 'react'
import writeXlsxFile from 'write-excel-file'
import {
  SCOREBOOK_BANNER_ROW,
  SCOREBOOK_PREPARE_ROW,
  SCOREBOOK_COLUMNS_WIDTH,
  SCOREBOOK_HEADER_ROW,
} from 'constant/export/scorebook'
import { useAssessmentContext } from 'contexts/AssessmentContext'
import { Class } from 'models/class'
import { get, groupBy, sortBy } from 'lodash'
import { StudentScoreBook } from 'models/ScoreBook'
import { useGetStudentScoreBooks } from 'services/scorebook'
import { useStudentContext } from 'contexts/StudentContext'
import { amber } from '@mui/material/colors'
import { AssessmentEnum } from 'constant/common'

interface Props {
  currentClass: Class
}

const ExportScoreBookComponent = ({ currentClass }: Props) => {
  const { assessments, onFetchAssessments } = useAssessmentContext()
  const { studentScoreBooks } = useGetStudentScoreBooks()
  const { students } = useStudentContext()

  useEffect(() => {
    if (currentClass.id) {
      onFetchAssessments(currentClass.id)
    }
  }, [currentClass, onFetchAssessments])

  const exportDate = async () => {
    if (students.length === 0 || assessments.length === 0) {
      return
    }
    const sortedStudent = students.sort((a, b) => a.firstName.localeCompare(b.firstName))
    const stuScoreBooks: StudentScoreBook[] = sortedStudent.map((stu) => {
      if (studentScoreBooks?.[stu.id]) {
        return {
          ...stu,
          ...studentScoreBooks[stu.id],
        }
      }
      return stu as StudentScoreBook
    })

    let { score5 = [], score15 = [], score45 = [], score60 = [] } = groupBy(assessments, 'type')
    score5 = sortBy(score5, 'bookDate')
    score15 = sortBy(score15, 'bookDate')
    score45 = sortBy(score45, 'bookDate')
    score60 = sortBy(score60, 'bookDate')
    const DATA_ROWS = stuScoreBooks.map((stu: StudentScoreBook, index) => {
      const score5List = assessments
        .filter((ass) => ass.type === AssessmentEnum.KT5)
        .map((ass) => {
          return get(stu, [AssessmentEnum.KT5, ass.id], 0)
        })
      const averageScore5 =
        score5List.length !== 0 ? score5List.reduce((a, b) => a + b, 0) / score5List.length : 0

      const score15List = assessments
        .filter((ass) => ass.type === AssessmentEnum.KT15)
        .map((ass) => {
          return get(stu, [AssessmentEnum.KT15, ass.id], 0)
        })
      const averageScore15 =
        score15List.length !== 0 ? score15List.reduce((a, b) => a + b, 0) / score15List.length : 0

      const score45List = assessments
        .filter((ass) => ass.type === AssessmentEnum.KT45)
        .map((ass) => {
          return get(stu, [AssessmentEnum.KT45, ass.id], 0)
        })
      const averageScore45 =
        score45List.length !== 0 ? score45List.reduce((a, b) => a + b, 0) / score45List.length : 0

      const score60List = assessments
        .filter((ass) => ass.type === AssessmentEnum.KT60)
        .map((ass) => {
          return get(stu, [AssessmentEnum.KT60, ass.id], 0)
        })
      const averageScore60 =
        score60List.length !== 0 ? score60List.reduce((a, b) => a + b, 0) / score60List.length : 0

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
        ...score5
          .map((assessment) => {
            const score = get(stu, ['score5', assessment.id])
            return [
              {
                alignVertical: 'top',
                align: 'center',
                type: Number,
                rightBorderStyle: 'thin',
                topBorderStyle: 'thin',
                bottomBorderStyle: 'thin',
                value: score,
                backgroundColor: score >= 5 ? '' : amber[200],
              },
            ]
          })
          .flat(),
        // average score5
        {
          alignVertical: 'top',
          align: 'center',
          fontWeight: 'bold',
          type: Number,
          rightBorderStyle: 'thin',
          topBorderStyle: 'thin',
          bottomBorderStyle: 'thin',
          value: averageScore5,
          backgroundColor: averageScore5 >= 5 ? '' : amber[200],
        },
        ...score15
          .map((assessment) => {
            const score = get(stu, ['score15', assessment.id])
            return [
              {
                alignVertical: 'top',
                align: 'center',
                type: Number,
                rightBorderStyle: 'thin',
                topBorderStyle: 'thin',
                bottomBorderStyle: 'thin',
                value: score,
                backgroundColor: score >= 5 ? '' : amber[200],
              },
            ]
          })
          .flat(),
        // average score15
        {
          alignVertical: 'top',
          align: 'center',
          fontWeight: 'bold',
          type: Number,
          rightBorderStyle: 'thin',
          topBorderStyle: 'thin',
          bottomBorderStyle: 'thin',
          value: averageScore15,
          backgroundColor: averageScore15 >= 5 ? '' : amber[200],
        },
        ...score45
          .map((assessment) => {
            const score = get(stu, ['score45', assessment.id])
            return [
              {
                alignVertical: 'top',
                align: 'center',
                type: Number,
                rightBorderStyle: 'thin',
                topBorderStyle: 'thin',
                bottomBorderStyle: 'thin',
                value: score,
                backgroundColor: score >= 5 ? '' : amber[200],
              },
            ]
          })
          .flat(),
        // average score45
        {
          alignVertical: 'top',
          align: 'center',
          fontWeight: 'bold',
          type: Number,
          rightBorderStyle: 'thin',
          topBorderStyle: 'thin',
          bottomBorderStyle: 'thin',
          value: averageScore45,
          backgroundColor: averageScore45 >= 5 ? '' : amber[200],
        },
        ...score60
          .map((assessment) => {
            const score = get(stu, ['score60', assessment.id])
            return [
              {
                alignVertical: 'top',
                align: 'center',
                type: Number,
                rightBorderStyle: 'thin',
                topBorderStyle: 'thin',
                bottomBorderStyle: 'thin',
                value: score,
                backgroundColor: score >= 5 ? '' : amber[200],
              },
            ]
          })
          .flat(),
        // average score60
        {
          alignVertical: 'top',
          align: 'center',
          fontWeight: 'bold',
          type: Number,
          rightBorderStyle: 'thin',
          topBorderStyle: 'thin',
          bottomBorderStyle: 'thin',
          value: averageScore60,
          backgroundColor: averageScore60 >= 5 ? '' : amber[200],
        },
      ]
    })

    const data: any[] = [
      SCOREBOOK_BANNER_ROW(assessments.map((a) => a.bookDate)),
      SCOREBOOK_PREPARE_ROW(
        currentClass,
        assessments.map((a) => a.bookDate)
      ),
      ...SCOREBOOK_HEADER_ROW({
        score5: score5.map((s) => s.bookDate),
        score15: score15.map((s) => s.bookDate),
        score45: score45.map((s) => s.bookDate),
        score60: score60.map((s) => s.bookDate),
      }),
      ...DATA_ROWS,
    ]

    await writeXlsxFile(data as any, {
      columns: SCOREBOOK_COLUMNS_WIDTH([...assessments.map((a) => a.bookDate), '', '', '', '']),
      fileName: `Bang Diem ${currentClass?.name || 'file'}.xlsx`,
      fontFamily: 'Times New Roman',
      fontSize: 13,
      orientation: 'landscape',
    })
  }

  return (
    <Box>
      <Typography fontSize={'1rem'} fontWeight={500} sx={{ marginBottom: 2 }}>
        Xuất Bảng Điểm
      </Typography>
      <Typography fontSize={'1rem'} fontWeight={500} sx={{ marginBottom: 2 }}>
        Lớp {currentClass?.name}
      </Typography>
      <Button onClick={exportDate} variant={'contained'}>
        Xuất file excel
      </Button>
    </Box>
  )
}

export default ExportScoreBookComponent
