import { useUpdateStudent, useDeleteStudent, useAddNewStudent, useGetStudents } from './student'
import { studentRef, queryClasses } from './firestore'
import { uploadAvatar, uploadProgress, removeImage } from 'services/storage'
import {
  useAddNewAssessment,
  useGetAssessments,
  useEditAssessment,
  useDeleteAssessment,
} from './assessment'

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
  useAddNewAssessment,
  useGetAssessments,
  useEditAssessment,
  useDeleteAssessment,
}
