import { Student } from 'models'
import useMediaQuery from '@mui/material/useMediaQuery'
import studentGirlLogo from 'static/images/cards/student-girl.png'
import studentBoyLogo from 'static/images/cards/student-boy.png'
import GLVLogo from 'static/images/cards/glv.png'

const formatFirstName = (firstName: string): string => {
  const name = firstName.toLowerCase()
  return name.charAt(0).toUpperCase() + name.slice(1)
}

const formatBirthday = (birthday?: string): string => {
  if (birthday) {
    const splitBirthday = birthday.split('.')
    return `${splitBirthday[2]}-${splitBirthday[1]}-${splitBirthday[0]}`
  }
  return ''
}

const formatPhone = (phone: string): string => (phone ? phone.toString().replaceAll('.', '') : '')

export const formatImportedData = (mockStudents: any[]): Student[] => {
  return mockStudents
    .filter((student) => student)
    .map(({ phone1, phone2, ...student }: any, index: number) => {
      return {
        ...student,
        firstName: formatFirstName(student.firstName),
        birthday: student.birthday ? formatBirthday(student.birthday) : '',
        phones: [
          { name: 'Cha', number: formatPhone(phone1) },
          { name: 'Mẹ', number: formatPhone(phone2) },
        ],
        id: `student-${index}`,
      } as Student
    })
}

export const buildImageUrl = (
  imagePath?: string,
  gender?: boolean,
  isGLV?: boolean,
  showFullScale?: boolean
) => {
  if (!imagePath) {
    return isGLV ? GLVLogo : gender ? studentGirlLogo : studentBoyLogo
  }
  // const prefix = process.env.REACT_APP_FIREBASE_STORAGE_URL
  // const postfix = '?alt=media&token=23812601-6493-46bc-b0fc-3d1164216a17'
  // const formatImage = imagePath.replaceAll('/', '%2F')
  const prefix = process.env.REACT_APP_IMAGE_KIT_URL
  const dimension = showFullScale ? '' : '?tr=w-500,h-500,fo-auto'
  const imageName = imagePath.replace('avatars/', '')
  return prefix + imageName + dimension
}

export const buildFileUrl = (filePath: string) => {
  return process.env.REACT_APP_FIREBASE_STORAGE_URL + filePath
}

export const getToday = () => {
  const now = new Date()

  const day = ('0' + now.getDate()).slice(-2)
  const month = ('0' + (now.getMonth() + 1)).slice(-2)

  return now.getFullYear() + '-' + month + '-' + day
}

export const useIsMobile = (): boolean => {
  return useMediaQuery('(max-width:900px)')
}

export const toLowerCaseNonAccentVietnamese = (str: string) => {
  str = str.toLowerCase()
  // We can also use this instead of from line 11 to line 17
  // str = str.replace(/\u00E0|\u00E1|\u1EA1|\u1EA3|\u00E3|\u00E2|\u1EA7|\u1EA5|\u1EAD|\u1EA9|\u1EAB|\u0103|\u1EB1|\u1EAF|\u1EB7|\u1EB3|\u1EB5/g, "a");
  // str = str.replace(/\u00E8|\u00E9|\u1EB9|\u1EBB|\u1EBD|\u00EA|\u1EC1|\u1EBF|\u1EC7|\u1EC3|\u1EC5/g, "e");
  // str = str.replace(/\u00EC|\u00ED|\u1ECB|\u1EC9|\u0129/g, "i");
  // str = str.replace(/\u00F2|\u00F3|\u1ECD|\u1ECF|\u00F5|\u00F4|\u1ED3|\u1ED1|\u1ED9|\u1ED5|\u1ED7|\u01A1|\u1EDD|\u1EDB|\u1EE3|\u1EDF|\u1EE1/g, "o");
  // str = str.replace(/\u00F9|\u00FA|\u1EE5|\u1EE7|\u0169|\u01B0|\u1EEB|\u1EE9|\u1EF1|\u1EED|\u1EEF/g, "u");
  // str = str.replace(/\u1EF3|\u00FD|\u1EF5|\u1EF7|\u1EF9/g, "y");
  // str = str.replace(/\u0111/g, "d");
  str = str.replace(/à|á|ạ|ả|ã|â|ầ|ấ|ậ|ẩ|ẫ|ă|ằ|ắ|ặ|ẳ|ẵ/g, 'a')
  str = str.replace(/è|é|ẹ|ẻ|ẽ|ê|ề|ế|ệ|ể|ễ/g, 'e')
  str = str.replace(/ì|í|ị|ỉ|ĩ/g, 'i')
  str = str.replace(/ò|ó|ọ|ỏ|õ|ô|ồ|ố|ộ|ổ|ỗ|ơ|ờ|ớ|ợ|ở|ỡ/g, 'o')
  str = str.replace(/ù|ú|ụ|ủ|ũ|ư|ừ|ứ|ự|ử|ữ/g, 'u')
  str = str.replace(/ỳ|ý|ỵ|ỷ|ỹ/g, 'y')
  str = str.replace(/đ/g, 'd')
  // Some system encode vietnamese combining accent as individual utf-8 characters
  str = str.replace(/\u0300|\u0301|\u0303|\u0309|\u0323/g, '') // Huyền sắc hỏi ngã nặng
  str = str.replace(/\u02C6|\u0306|\u031B/g, '') // Â, Ê, Ă, Ơ, Ư
  return str
}
