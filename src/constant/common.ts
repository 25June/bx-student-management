import { Class } from 'models/class'

export enum StudentActionType {
  ADD_NEW_STUDENT = 'ADD_NEW_STUDENT',
  EDIT_STUDENT = 'EDIT_STUDENT',
  DELETE_STUDENT = 'DELETE_STUDENT',
  VIEW_STUDENT = 'VIEW_STUDENT',
  VIEW_SCORE_BOOK = 'VIEW_SCORE_BOOK',
}

export enum AssessmentActionType {
  ADD_NEW_ASSESSMENT = 'ADD_NEW_ASSESSMENT',
  EDIT_ASSESSMENT = 'EDIT_ASSESSMENT',
  DELETE_ASSESSMENT = 'DELETE_ASSESSMENT',
  VIEW_ASSESSMENT = 'VIEW_ASSESSMENT',
}

export enum ScoreBookActionType {
  ADD_NEW_SCORE_BOOK = 'ADD_NEW_SCORE_BOOK',
  EDIT_SCORE_BOOK = 'EDIT_SCORE_BOOK',
  DELETE_SCORE_BOOK = 'DELETE_SCORE_BOOK',
  VIEW_SCORE_BOOK = 'VIEW_SCORE_BOOK',
}

export enum RollCallDateActionType {
  ADD_STUDY_DATE = 'ADD_STUDY_DATE',
  EDIT_STUDY_DATE = 'EDIT_STUDY_DATE',
}

export enum AttendanceType {
  THANH_LE = 'tl',
  GIAO_LY = 'gl',
}

export const BaseClasses: Class[] = [
  { id: 'kt1', name: 'Khai Tâm 1' },
  { id: 'kt2', name: 'Khai Tâm 2' },
  { id: 'rl1', name: 'Rước Lễ 1' },
  { id: 'rl2a', name: 'Rước Lễ 2A' },
  { id: 'rl2b', name: 'Rước Lễ 2B' },
  { id: 'ts1a', name: 'Thêm Sức 1A' },
  { id: 'ts1b', name: 'Thêm Sức 1B' },
  { id: 'ts2', name: 'Thêm Sức 2' },
  { id: 'bd1', name: 'Bao Đồng 1' },
  { id: 'bd2', name: 'Bao Đồng 2' },
  { id: 'vd', name: 'Vào Đời' },
]

export enum AssessmentEnum {
  KT5 = 'KT5',
  KT15 = 'KT15',
  KT45 = 'KT45',
  KT60 = 'KT60',
}

export interface BaseAssessment {
  id: string
  name: string
}

export const BaseAssessments: BaseAssessment[] = [
  { id: AssessmentEnum.KT5, name: 'Kiểm Tra 5 phút' },
  { id: AssessmentEnum.KT15, name: 'Kiểm Tra 15 phút' },
  { id: AssessmentEnum.KT45, name: 'Kiểm Tra 45 phút' },
  { id: AssessmentEnum.KT60, name: 'Thi' },
]

export enum UserAction {
  GRANT_PERMISSION = 'GRANT_PERMISSION',
  CHANGE_PASSWORD = 'CHANGE_PASSWORD',
  RESET_PASSWORD = 'RESET_PASSWORD',
  UPDATE_INFO = 'UPDATE_INFO',
}

export enum Role {
  CO_CLASS_MANAGER = 0,
  CLASS_MANAGER = 1,
  GROUP_MANAGER = 2,
  CEO = 3,
  CTO = 4,
  SECRECTARY = 5,
}

export const UserRoles = [
  {
    title: 'Giáo Lý Viên',
    id: 0,
  },
  {
    title: 'Giáo Lý Viên Chủ Nhiệm',
    id: 1,
  },
  {
    title: 'Trưởng Khối',
    id: 2,
  },
  {
    title: 'Ban Điều Hành',
    id: 3,
  },
  {
    title: 'Admin',
    id: 4,
  },
  {
    title: 'Thư Ký',
    id: 5,
  },
]
