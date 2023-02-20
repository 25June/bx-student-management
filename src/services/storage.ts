import {
  getStorage,
  ref,
  uploadBytesResumable,
  getDownloadURL,
  UploadTaskSnapshot,
  deleteObject,
} from 'firebase/storage'

const storage = getStorage()
const storageRef = (pathName: string) => ref(storage, pathName)
const avatarRef = (filename: string) => ref(storage, `avatars/${filename}`)
const getAvatarRef = (path: string) => ref(storage, path)

export const metadata = {
  contentType: 'image/jpeg',
}

export const uploadAvatar = async (
  file: File,
  updateProgress: (progress: number) => void
): Promise<string> => {
  const referencePath = avatarRef(file.name)
  const handleUpload = uploadBytesResumable(referencePath, file, metadata)
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
    console.log('File available at', downloadURL)
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
    .catch((error) => {
      console.log(`Remove ${avatarPath} failed`)
    })
}
