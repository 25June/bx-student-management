import { app } from '../firebase'
import { collection, query, getFirestore } from 'firebase/firestore'

const db = getFirestore(app)

// Class collection
const classRef = collection(db, 'class')
export const queryClasses = query(classRef)

// Student collection
export const studentRef = collection(db, 'student')
