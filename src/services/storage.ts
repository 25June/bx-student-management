import {
  getStorage,
  ref,
  uploadBytesResumable,
  getDownloadURL,
  UploadTaskSnapshot,
  deleteObject,
  StorageReference,
} from 'firebase/storage'
import { v4 as uuidv4 } from 'uuid'

const storage = getStorage()
const storageRef = (pathName: string): StorageReference => ref(storage, pathName)
const avatarRef = (filename: string): StorageReference => ref(storage, `avatars/${filename}`)
const getAvatarRef = (path: string): StorageReference => ref(storage, path)
const assessmentRef = (filename: string): StorageReference => ref(storage, `assessment/${filename}`)

export const metadata = {
  contentType: 'image/jpeg',
}

export const uploadFile = async (
  file: File | Blob,
  updateProgress: (progress: number) => void,
  isUploadImage: boolean = true
): Promise<string> => {
  let fileRef: StorageReference
  if (isUploadImage) {
    fileRef = avatarRef(uuidv4())
  } else {
    fileRef = assessmentRef(uuidv4())
  }
  const handleUpload = uploadBytesResumable(fileRef, file, {
    contentType: file.type,
  })
  handleUpload.on(
    'state_changed',
    (snapshot) => {
      const progress = uploadProgress(snapshot)
      updateProgress(progress)
    },
    (error) => {
      console.error('Upload failed', error.message)
    }
  )
  return (await handleUpload.then((snapshot) => snapshot.ref.fullPath as string)) as Promise<string>
}

export const getDownloadLink = (imagePath: string) =>
  getDownloadURL(getAvatarRef(imagePath)).then((downloadURL) => {
    return downloadURL
  })

export const uploadProgress = (snapshot: UploadTaskSnapshot) => {
  const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100
  console.log('Upload is ' + progress + '% done')
  if (progress === 100) {
    console.info('Upload successfully')
  }
  switch (snapshot.state) {
    case 'paused':
      console.log('Upload is paused')
      break
    case 'running':
      console.log('Upload is running')
      break
  }
  return progress || 0
}

export const removeImage = (avatarPath: string) => {
  return deleteObject(storageRef(avatarPath))
    .then(() => {
      console.log(`Remove ${avatarPath} successfully`)
    })
    .catch(() => {
      console.log(`Remove ${avatarPath} failed`)
    })
}
