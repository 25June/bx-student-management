import React from 'react'

const ImageBoxComponent = (imagePath: string) => {
  const prefix = 'https://firebasestorage.googleapis.com/v0/b/bx-management.appspot.com/o/'
  return (
    <img src={`${prefix}/${imagePath}`} alt={imagePath} />
  )
}

export default ImageBoxComponent
