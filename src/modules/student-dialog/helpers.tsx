import { Class, Student } from 'models'
import { formatPhoneWithoutDot } from 'utils/formatDataForTable'
import { BaseClasses } from 'constant/common'

export type Phone = {
  name: string
  number: string
}

export type StudentForm = {
  saintName: string
  fullName: string
  birthday: string
  address: string
  grade: string
  phone1: Phone
  phone2: Phone
  gender: boolean
  avatar?: File | null
  avatarPath?: string
  class?: Class
}

export const getValues = (stu?: Student | null) => {
  if (stu && stu.id) {
    return {
      saintName: stu.saintName,
      fullName: `${stu.lastName} ${stu.firstName}`,
      birthday: stu.birthday,
      address: stu.address,
      gender: !!stu.gender,
      grade: stu.grade,
      avatarPath: stu.avatarPath,
      class: stu.class,
      phone1: {
        ...stu.phones[0],
        number: formatPhoneWithoutDot(stu.phones[0].number),
      },
      phone2: {
        ...stu.phones[1],
        number: formatPhoneWithoutDot(stu.phones[1].number),
      },
      note: stu.note,
    }
  }
  return {
    saintName: '',
    fullName: '',
    birthday: '',
    address: '',
    grade: '1',
    gender: false,
    phone1: {
      name: '',
      number: '',
    },
    phone2: {
      name: '',
      number: '',
    },
    avatar: null,
    avatarPath: '',
    class: BaseClasses[0],
    note: '',
  }
}
