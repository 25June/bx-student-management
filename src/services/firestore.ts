import { app } from '../firebase'
import { collection, query, getFirestore } from 'firebase/firestore'

const db = getFirestore(app)
const classRef = collection(db, 'class')
export const queryClasses = query(classRef)
