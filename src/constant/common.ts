import { Class } from 'models/class'

export enum StudentActionType {
  ADD_NEW_STUDENT = 'ADD_NEW_STUDENT',
  EDIT_STUDENT = 'EDIT_STUDENT',
  DELETE_STUDENT = 'DELETE_STUDENT',
  VIEW_STUDENT = 'VIEW_STUDENT',
  VIEW_SCORE_BOOK = 'VIEW_SCORE_BOOK',
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
