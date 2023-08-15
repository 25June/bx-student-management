import { Student, Phone } from 'models'

export const formatDate = (date: string, forDataSave: boolean): string => {
  if (forDataSave) {
    // from yyyy-MM-dd to DD.MM.YYYY
    if (date) {
      const splitDate = date.split('-')
      return `${splitDate[2]}.${splitDate[1]}.${splitDate[0]}`
    }
    return ''
  }
  // from DD.MM.YYYY to yyyy-MM-dd
  if (date) {
    const splitDate = date.split('.')
    return `${splitDate[2]}-${splitDate[1]}-${splitDate[0]}`
  }
  return ''
}

export const formatPhone = (phone: string): string => {
  // from 0973173484 to 0973.173.484
  if (phone && phone.length > 9) {
    const splitNumber = phone.split('')
    splitNumber[3] = splitNumber[3] + '.'
    splitNumber[6] = splitNumber[6] + '.'
    return splitNumber.join('')
  }
  return phone || ''
}

export const formatPhoneWithoutDot = (phone: string): string => {
  if (phone) {
    return phone.replaceAll('.', '').trim()
  }
  return ''
}

export const splitFullName = (fullName: string) => {
  const lastBlankSpace = fullName.lastIndexOf(' ')
  if (lastBlankSpace === -1) {
    return {
      firstName: fullName,
      lastName: '',
    }
  }
  const firstName = fullName.slice(lastBlankSpace).trim()
  const lastName = fullName.slice(0, lastBlankSpace).trim()
  return { firstName, lastName }
}

export const formatStudentTable = (students: Student[]) => {
  return students
    .map((student: Student) => ({
      ...student,
      firstName: student.firstName.toUpperCase(),
      birthday: student.birthday,
      phones: student.phones.map((p: Phone) => ({
        ...p,
        number: formatPhone(p.number) || '',
      })),
    }))
    .sort((a, b) => a.firstName.localeCompare(b.firstName))
}
