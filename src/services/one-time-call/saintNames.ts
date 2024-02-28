import { realtimeDB } from '../../firebase'
import { get, ref } from 'firebase/database'

const saintNamesPathName = `saintNames`

export const getAllSaintNames = () => {
  return get(ref(realtimeDB, saintNamesPathName))
    .then((snapshot) => {
      if (snapshot.exists()) {
        const value = snapshot.val()
        return JSON.parse(value)
      }
      return []
    })
    .catch((error) => {
      console.error('error - getAllSaintNames', error)
      return []
    })
}
