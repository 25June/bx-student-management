import { Document, Assessment } from 'models/assessment'
import { getDownloadLink, removeImage } from 'services/storage'
import { AssessmentEnum } from 'constant/common'
import { getToday } from './common'
import { AssessmentActionType } from 'constant/common'
import { ButtonProps } from '@mui/material'

export const downloadAssessment = (event: any, doc: Document) => {
  event.stopPropagation()
  return getDownloadLink(doc.path).then((url) => {
    const link = document.createElement('a')
    link.setAttribute('href', url)
    link.setAttribute('download', doc.name)
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  })
}

export const tableColumns = [
  {
    value: 'lesson',
    label: 'Bài học',
  },
  {
    value: 'bookDate',
    label: 'Ngày thực hiện',
  },
  {
    value: 'type',
    label: 'Loại',
  },
]

export const removeAssessmentDocuments = (
  existingDocuments?: Document[],
  documents?: Document[]
) => {
  if (existingDocuments && documents && existingDocuments.length !== documents.length) {
    const documentPaths = documents.map((doc) => doc.path)
    const uniqItems = (documents || []).filter((doc) => !documentPaths.includes(doc.path))
    const removeList = uniqItems.map((doc) => removeImage(doc.path))
    Promise.all(removeList).then(() => console.log('remove success'))
  }
}

export const AssessmentFormDefaultValue = (data: Assessment | null) => {
  if (data) {
    return {
      bookDate: data.bookDate,
      type: data.type,
      lesson: data.lesson,
    }
  }

  return {
    bookDate: getToday(),
    type: AssessmentEnum.KT5,
    lesson: '',
    uploadDocument: null,
  }
}

export const getButtonColor = (type: string): ButtonProps['color'] => {
  if (type === AssessmentActionType.ADD_NEW_ASSESSMENT) {
    return 'primary'
  }
  if (type === AssessmentActionType.EDIT_ASSESSMENT) {
    return 'warning'
  }
  return 'error'
}
