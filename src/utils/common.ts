import { Student } from '../models/student'

export const convertStringToDate = (date: string) => {
  const [day, month, year] = date.split('.')
  return new Date(Number(year), Number(month), Number(day))
}

export const mockDataFormatFirstName = (firstName: string): string => {
  const name = firstName.toLowerCase()
  return name.charAt(0).toUpperCase() + name.slice(1)
}

export const mockDataFormatBirthday = (birthday: string): string => {
  if (birthday) {
    const splitBirthday = birthday.split('.')
    return `${splitBirthday[2]}-${splitBirthday[1]}-${splitBirthday[0]}`
  }
  return ''
}

export const mockDataFormatPhone = (phone: string): string =>
  phone ? phone.replaceAll('.', '') : ''

export const formatMockData = (mockStudents: any[]): Student[] => {
  return mockStudents.map((student: any, index: number) => {
    return {
      ...student,
      firstName: mockDataFormatFirstName(student.firstName),
      birthday: mockDataFormatBirthday(student.birthday),
      phone: [
        { name: 'Father', number: mockDataFormatPhone(student.phone1) },
        { name: 'Mother', number: mockDataFormatPhone(student.phone2) },
      ],
      id: `student-${index}`,
    } as Student
  })
}
