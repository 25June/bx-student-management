import { Student } from 'models'
import studentGirlLogo from 'static/images/cards/student-girl.png'
import studentBoyLogo from 'static/images/cards/student-boy.png'

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
  return mockStudents
    .filter((student) => student)
    .map(({ phone1, phone2, ...student }: any, index: number) => {
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

export const buildImageUrl = (imagePath?: string, gender?: boolean) => {
  if (!imagePath) {
    return gender ? studentGirlLogo : studentBoyLogo
  }
  const prefix = 'https://firebasestorage.googleapis.com/v0/b/bx-management.appspot.com/o/'
  const postfix = '?alt=media&token=23812601-6493-46bc-b0fc-3d1164216a17'
  const formatImage = imagePath.replaceAll('/', '%2F')
  return prefix + formatImage + postfix
}

export const getToday = () => {
  const now = new Date()

  const day = ('0' + now.getDate()).slice(-2)
  const month = ('0' + (now.getMonth() + 1)).slice(-2)

  return now.getFullYear() + '-' + month + '-' + day
}
