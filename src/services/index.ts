import { useUpdateStudent, useDeleteStudent, useAddNewStudent, useGetStudents } from './student'
import { studentRef, queryClasses } from './firestore'
import { uploadFile, uploadProgress, removeImage } from 'services/storage'
import { fetchAssessments, useEditAssessment, useDeleteAssessment } from './assessment'

export {
  useUpdateStudent,
  useDeleteStudent,
  useAddNewStudent,
  useGetStudents,
  studentRef,
  queryClasses,
  uploadFile,
  uploadProgress,
  removeImage,
  fetchAssessments,
  useEditAssessment,
  useDeleteAssessment,
}
