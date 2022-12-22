import { Student } from 'models'

export const convertStringToDate = (date: string) => {
  const [day, month, year] = date.split('.')
  return new Date(Number(year), Number(month), Number(day))
}

export const mockDataFormatFirstName = (firstName: string): string => {
  const name = firstName.toLowerCase()
  return name.charAt(0).toUpperCase() + name.slice(1)
}

export const mockDataFormatBirthday = (birthday?: string): string => {
  if (birthday) {
    const splitBirthday = birthday.split('.')
    return `${splitBirthday[2]}-${splitBirthday[1]}-${splitBirthday[0]}`
  }
  return ''
}

export const mockDataFormatPhone = (phone: string): string =>
  phone ? phone.toString().replaceAll('.', '') : ''

export const formatMockData = (mockStudents: any[]): Student[] => {
  return mockStudents.map(({ phone1, phone2, ...student }: any, index: number) => {
    return {
      ...student,
      firstName: mockDataFormatFirstName(student.firstName),
      birthday: mockDataFormatBirthday(student.birthday),
      phones: [
        { name: 'Cha', number: mockDataFormatPhone(phone1) },
        { name: 'Mẹ', number: mockDataFormatPhone(phone2) },
      ],
      id: `student-${index}`,
    } as Student
  })
}
