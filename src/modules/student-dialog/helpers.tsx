import { Class, Student } from 'models'
import { formatPhoneWithoutDot } from 'utils/formatDataForTable'
import { BaseClasses } from 'constant/common'
import { RegisterStudent } from 'models/student'

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

export type StudentRegisterForm = {
  saintName: string
  fullName: string
  birthday: string
  bornIn?: string
  address: string
  shortTermAddress: string
  grade: string
  schoolName: string
  phone1: Phone
  phone2: Phone
  gender: boolean
  class?: Class
  note: string
  parent: {
    fatherName: string
    motherName: string
  }
  baptismDate: string
  baptismChurch: string
  baptismByPriest: string
  eucharistAndReconciliationDate: string
  eucharistAndReconciliationChurch: string
  eucharistAndReconciliationByPriest: string
}

export const getRegisterValues = (student?: Omit<RegisterStudent, 'id'>) => {
  if (student) {
    return {
      saintName: student.saintName || '',
      fullName: student.fullName || '',
      birthday: student.birthday || '',
      bornIn: student.bornIn || '',
      address: student.address || '',
      shortTermAddress: student.address || '',
      grade: student.grade || '',
      schoolName: student.schoolName || '',
      gender: false,
      phone1: {
        name: student.phones[0]?.name || '',
        number: student.phones[0]?.number || '',
      },
      phone2: {
        name: student.phones[1]?.name || '',
        number: student.phones[1]?.number || '',
      },
      class: student.class || BaseClasses[0],
      note: student.note || '',
      parent: {
        fatherName: student.parent?.fatherName || '',
        motherName: student.parent?.motherName || '',
      },
      baptismDate: student.baptismDate || '',
      baptismChurch: student.baptismChurch || '',
      baptismByPriest: student.baptismByPriest || '',
      eucharistAndReconciliationDate: student.eucharistAndReconciliationDate || '',
      eucharistAndReconciliationChurch: student.eucharistAndReconciliationChurch || '',
      eucharistAndReconciliationByPriest: student.eucharistAndReconciliationByPriest || '',
    }
  }
  return {
    saintName: '',
    fullName: '',
    birthday: '',
    bornIn: '',
    address: '',
    shortTermAddress: '',
    grade: '1',
    schoolName: '',
    gender: false,
    phone1: {
      name: '',
      number: '',
    },
    phone2: {
      name: '',
      number: '',
    },
    class: BaseClasses[0],
    note: '',
    parent: {
      fatherName: '',
      motherName: '',
    },
    baptismDate: '',
    baptismChurch: '',
    baptismByPriest: '',
    eucharistAndReconciliationDate: '',
    eucharistAndReconciliationChurch: '',
    eucharistAndReconciliationByPriest: '',
  }
}
