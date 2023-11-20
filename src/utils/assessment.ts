import { Document } from 'models/assessment'
import { getDownloadLink } from 'services/storage'

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
