import { fireStoreDB } from '../../firebase'
import { getDocs, doc, query, collection, getDoc } from 'firebase/firestore'
import { SchoolYear } from 'models/schoolYear'

const schoolYearsPathname = `schoolYear`

export const fetchSchoolYears = () => {
  const schoolYear = collection(fireStoreDB, schoolYearsPathname)
  return getDocs(query(schoolYear)).then((res) => {
    if (res.empty) {
      return []
    }
    return res.docs.map((snapshot) => ({ ...snapshot.data(), id: snapshot.id } as SchoolYear))
  })
}

export const fetchSchoolYearById = (id: string) => {
  return getDoc(doc(collection(fireStoreDB, schoolYearsPathname), id)).then((snapshot) => {
    return { ...snapshot.data(), id: snapshot.id } as SchoolYear
  })
}
