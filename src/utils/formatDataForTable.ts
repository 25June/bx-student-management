import { Student, Phone } from 'models'

const formatDate = (date: string): string => {
  // format yyyy-MM-dd
  if (date) {
    const splitDate = date.split('-')
    return `${splitDate[2]}.${splitDate[1]}.${splitDate[0]}`
  }
  return ''
}

export const formatPhone = (phone: string): string => {
  if (phone) {
    const splitNumber = phone.split('')
    splitNumber[3] = splitNumber[3] + '.'
    splitNumber[6] = splitNumber[6] + '.'
    return splitNumber.join('')
  }
  return ''
}

export const splitFullName = (fullName: string) => {
  const lastBlankSpace = fullName.lastIndexOf(' ')
  const firstName = fullName.slice(lastBlankSpace).trim()
  const lastName = fullName.slice(0, lastBlankSpace).trim()
  return { firstName, lastName }
}

export const formatStudentTable = (students: Student[]) => {
  return students
    .map((student: Student) => ({
      ...student,
      firstName: student.firstName.toUpperCase(),
      birthday: formatDate(student.birthday),
      phones: student.phones.map((p: Phone) => ({
        ...p,
        number: p.number ? formatPhone(p.number) : '',
      })),
    }))
    .sort((a, b) => a.firstName.localeCompare(b.firstName))
}
