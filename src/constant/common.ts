import { Class } from 'models/class'

export enum StudentActionType {
  ADD_NEW_STUDENT = 'ADD_NEW_STUDENT',
  EDIT_STUDENT = 'EDIT_STUDENT',
  DELETE_STUDENT = 'DELETE_STUDENT',
  VIEW_STUDENT = 'VIEW_STUDENT',
  VIEW_SCORE_BOOK = 'VIEW_SCORE_BOOK',
  VIEW_STUDENT_DILIGENT = 'VIEW_STUDENT_DILIGENT',
  TRANSFER_CLASS = 'TRANSFER_CLASS',
  RESTORE = 'RESTORE',
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
  ADD_NOTE = 'ADD_NOTE',
}

export enum RegisterActionType {
  ADD_NEW_REGISTER = 'ADD_NEW_REGISTER',
  DISABLE_QR_CODE = 'DISABLE_QR_CODE',
  CONFIRM_NEW_REGISTER = 'CONFIRM_NEW_REGISTER',
  VIEW_DETAIL = 'VIEW_DETAIL',
}

export enum AttendanceType {
  THANH_LE = 'tl',
  GIAO_LY = 'gl',
}

export const BaseClasses: Class[] = [
  { id: 'kt1', name: 'Khai Tâm 1' },
  { id: 'kt2', name: 'Khai Tâm 2' },
  { id: 'rl1', name: 'Rước Lễ 1A' },
  { id: 'rl1b', name: 'Rước Lễ 1B' },
  { id: 'rl2a', name: 'Rước Lễ 2' },
  // { id: 'rl2b', name: 'Rước Lễ 2B' },
  { id: 'ts1a', name: 'Thêm Sức 1A' },
  { id: 'ts1b', name: 'Thêm Sức 1B' },
  { id: 'ts2', name: 'Thêm Sức 2' },
  { id: 'bd1', name: 'Bao Đồng 1' },
  { id: 'bd2', name: 'Bao Đồng 2' },
  { id: 'vd', name: 'Vào Đời' },
  { id: 'dt', name: 'Dự Trưởng' },
]

export const BaseClassObj: Record<string, string> = {
  kt1: 'Khai Tâm 1',
  kt2: 'Khai Tâm 2',
  rl1: 'Rước Lễ 1A',
  rl1b: 'Rước Lễ 1B',
  rl2a: 'Rước Lễ 2',
  // rl2b: 'Rước Lễ 2B',
  ts1a: 'Thêm Sức 1A',
  ts1b: 'Thêm Sức 1B',
  ts2: 'Thêm Sức 2',
  bd1: 'Bao Đồng 1',
  bd2: 'Bao Đồng 2',
  vd: 'Vào Đời',
  dt: 'Dự Trưởng',
}

export enum AssessmentEnum {
  KT5 = 'score5',
  KT15 = 'score15',
  KT45 = 'score45',
  KT60 = 'score60',
}

export enum ScoreEnum {
  SCORE_5 = 'score5',
  SCORE_15 = 'score15',
  SCORE_45 = 'score45',
  SCORE_60 = 'score60',
}

export interface BaseAssessment {
  id: AssessmentEnum
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
  VIEW_PROFILE = 'VIEW_PROFILE',
}

export enum Role {
  CO_CLASS_MANAGER = 0,
  CLASS_MANAGER = 1,
  GROUP_MANAGER = 2,
  CEO = 3,
  CTO = 4,
  SECRECTARY = 5,
  COLLABORATOR = 6,
  CLASS_ASSISTANCE = 7,
}

export enum DialogType {
  STUDENT_DIALOG,
  ASSESSMENT_DIALOG,
  STUDY_DATE_DIALOG,
  CONFIG_DIALOG,
}

export type ActionType = AssessmentActionType | StudentActionType | RollCallDateActionType

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
  {
    title: 'Hỗ Trợ',
    id: 6,
  },
  {
    title: 'Dự Trưởng',
    id: 7,
  },
]

export type extendedColorPalettes = 'kt' | 'rl' | 'ts' | 'bd' | 'vd' | 'dt'

export const Semesters = [
  {
    key: 'hk1',
    label: 'Học Kỳ 1',
  },
  {
    key: 'hk2',
    label: 'Học Kỳ 2',
  },
]

export const SemesterObj: Record<string, string> = {
  hk1: 'Học Kỳ 1',
  hk2: 'Học Kỳ 2',
}

export const colorPalettes = {
  score5: '#89C0B7',
  score15: '#fccf55',
  score45: '#6F91B5',
  score60: '#EF8F88',
}
