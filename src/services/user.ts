import { auth, fireStoreDB, realtimeDB } from '../firebase'
import { update, ref } from 'firebase/database'
import { getDocs, query, collection, doc, updateDoc, setDoc, getDoc } from 'firebase/firestore'
import { sendPasswordResetEmail, updatePassword, getAuth, signOut } from 'firebase/auth'
import { useSnackbarContext } from 'contexts/SnackbarContext'
import { User } from 'models/user'
import { Router } from 'routes'
import { useNavigate } from 'react-router-dom'

const userCollection = 'user'
export const usersRef = collection(fireStoreDB, userCollection)
export const userDocRef = (userId: string) => doc(fireStoreDB, userCollection, userId)
export const userRef = (userId: string) => doc(collection(fireStoreDB, userCollection), userId)
export const getUsers = () => {
  return getDocs(query(usersRef))
    .then((snapshot) => {
      if (!snapshot.empty) {
        return snapshot.docs
          .filter((snapshotDoc) => snapshotDoc.exists() && !snapshotDoc.data().disabled)
          .sort((snapA, snapB) =>
            (snapA.data()?.classId || '').localeCompare(snapB.data()?.classId || '')
          )
          .map((snapshotDoc) => {
            return { id: snapshotDoc.id, ...snapshotDoc.data() } as User
          })
      }
      return null
    })
    .catch((error) => {
      console.error(error)
      return null
    })
}

export const useCreateUser = () => {
  const { showSnackbar } = useSnackbarContext()
  return ({
    firstName,
    lastName,
    email,
    classId,
    id,
  }: {
    id: string
    email: string
    firstName: string
    lastName: string
    classId: string
  }) =>
    setDoc(userDocRef(id), { email, id: id, firstName, lastName, classId })
      .then(() => {
        showSnackbar(`Create ${email} in database success`, 'success')
      })
      .catch((error) => {
        console.error(error)
        showSnackbar(`Create ${email} in database error`, 'error')
      })
}

export const useSendPasswordResetEmail = () => {
  const { showSnackbar } = useSnackbarContext()
  return (email: string) => {
    return sendPasswordResetEmail(auth, email)
      .then(() => {
        showSnackbar('Send password reset email success', 'success')
      })
      .catch((error) => {
        showSnackbar('Send password reset email error', 'error')
        console.error(error)
      })
  }
}

export const useUpdatePassword = () => {
  const { showSnackbar } = useSnackbarContext()
  return (newPassword: string) => {
    const currentAuth = getAuth()
    const user = currentAuth.currentUser
    if (user) {
      return updatePassword(user, newPassword)
        .then(() => {
          showSnackbar('Change password success', 'success')
        })
        .catch((error) => {
          showSnackbar('Change password fail', 'error')
          console.error(error)
        })
    }
    return Promise.reject('No User data')
  }
}

export const useSignOut = () => {
  const { showSnackbar } = useSnackbarContext()
  const navigate = useNavigate()
  return () => {
    signOut(auth).then(() => {
      showSnackbar('sign out successfully', 'success')
      navigate(Router.SIGN_IN)
    })
  }
}

export const useUpdateRole = () => {
  const { showSnackbar } = useSnackbarContext()
  return (user: User, role: number) => {
    return updateDoc(userRef(user.id), { role })
      .then(() => {
        showSnackbar(`Update role for ${user.email} success`, 'success')
      })
      .catch((error) => {
        showSnackbar(`Update role for ${user.email} fail`, 'error')
        console.error(error)
      })
  }
}

export const updateUserAvatar = (userId: string, downloadPath: string) => {
  return setDoc(userRef(userId), { avatarPath: downloadPath }, { merge: true })
}

export const useUpdateUserInfo = () => {
  const { showSnackbar } = useSnackbarContext()
  return async (user: User) => {
    const currentUserInfo = await getUserInfo(user.id)
    if (!currentUserInfo) {
      return Promise.reject('Invalid Data')
    }
    return setDoc(userRef(user.id), user, { merge: true })
      .then(() => {
        if (currentUserInfo.classId !== user.classId) {
          grantPermissionForUser(user.id, currentUserInfo.classId, user.classId)
        }
        showSnackbar(`Update info for ${user.email} success`, 'success')
      })
      .catch((error) => {
        showSnackbar(`Update info for ${user.email} fail`, 'error')
        console.error(error)
      })
  }
}

export const getUserInfo = (id: string) => {
  return getDoc(userDocRef(id)).then((user) => {
    if (user.exists()) {
      return user.data() as User
    }
    return null
  })
}

export const grantPermissionForUser = async (
  id: string,
  oldClassId: string,
  newClassId: string
) => {
  if (id) {
    update(ref(realtimeDB, `users/${id}`), { [oldClassId]: false, [newClassId]: true })
      .then(() => console.info(`Updated`, 'success'))
      .catch((error: any) => console.error(error, 'error'))
  }
}
