import { useUpdateStudent, useDeleteStudent, useAddNewStudent, useGetStudents } from './student'
import { studentRef, queryClasses } from './firestore'
import { uploadAvatar, uploadProgress, removeImage } from 'services/storage'

export {
  useUpdateStudent,
  useDeleteStudent,
  useAddNewStudent,
  useGetStudents,
  studentRef,
  queryClasses,
  uploadAvatar,
  uploadProgress,
  removeImage,
}
