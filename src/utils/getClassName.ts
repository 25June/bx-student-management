import { BaseClasses } from 'constant/common'
import { Class } from 'models/class'

export const getClass = (classId: string = '') => {
  return BaseClasses.find((c: Class) => c.id === classId)
}
