import React, { useRef, useState } from 'react'
import {
  DialogTitle,
  DialogContent,
  DialogActions,
  Dialog,
  Button,
  CircularProgress,
  Box,
  Typography,
} from '@mui/material'
import ClearIcon from '@mui/icons-material/Clear'
import CheckIcon from '@mui/icons-material/Check'
import { buildImageUrl, useIsMobile } from 'utils/common'
import ReactCrop, { PixelCrop, Crop, centerCrop, makeAspectCrop } from 'react-image-crop'
import 'react-image-crop/dist/ReactCrop.css'
import { removeImage, uploadAvatar } from 'services'
import { updateUserAvatar } from 'services/user'
import { updateStudentAvatar } from 'services/student'
import { LinearProgressComponent } from 'modules/progress-bar/LinearProgressWithLabel.component'
import { useSnackbarContext } from 'contexts/SnackbarContext'
import { useDebounceEffect } from './useDebounceEffect'
import { canvasPreview } from 'modules/cropping-image/canvasPreview'

interface CroppingImageProps {
  avatarPath: string
  userId?: string
  studentId?: string
  isOpen: boolean
  onClose: (refreshData?: boolean) => void
}

function centerAspectCrop(mediaWidth: number, mediaHeight: number, aspect: number) {
  return centerCrop(
    makeAspectCrop(
      {
        unit: '%',
        width: 90,
      },
      aspect,
      mediaWidth,
      mediaHeight
    ),
    mediaWidth,
    mediaHeight
  )
}

const CroppingImageComponent = ({
  avatarPath,
  userId,
  studentId,
  isOpen,
  onClose,
}: CroppingImageProps) => {
  const isMobile = useIsMobile()
  const previewCanvasRef = useRef<HTMLCanvasElement>(null)
  const imgRef = useRef<HTMLImageElement>(null)

  const [completedCrop, setCompletedCrop] = useState<PixelCrop>()

  const [crop, setCrop] = useState<Crop>()
  const [isLoading, setLoading] = useState<boolean>(false)
  const [isImageReady, setImageReady] = useState<boolean>(false)
  const [uploadImageProgress, setUploadImageProgress] = useState<number>(0)
  const { showSnackbar } = useSnackbarContext()

  useDebounceEffect(
    async () => {
      if (
        completedCrop?.width &&
        completedCrop?.height &&
        imgRef.current &&
        previewCanvasRef.current
      ) {
        // We use canvasPreview as it's much faster than imgPreview.
        canvasPreview(imgRef.current, previewCanvasRef.current, completedCrop)
      }
    },
    100,
    [completedCrop]
  )
  const handleClose = (fresherData?: boolean) => {
    onClose(fresherData)
  }

  const onCrop = async () => {
    setLoading(true)
    if (!previewCanvasRef.current) {
      throw new Error('Crop canvas does not exist')
    }
    previewCanvasRef.current.toBlob(
      async (blobFile) => {
        if (blobFile) {
          const downloadPath = await uploadAvatar(blobFile, setUploadImageProgress)
          if (downloadPath && userId && avatarPath) {
            updateUserAvatar(userId, downloadPath)
              .then(() => {
                showSnackbar(`Update avatar success`, 'success')
                removeImage(avatarPath)
              })
              .catch((error) => {
                showSnackbar(`Update avatar failed`, 'error')
                console.error(error)
              })
              .finally(() => {
                setLoading(false)
                handleClose(true)
              })
          }
          if (downloadPath && studentId && avatarPath) {
            updateStudentAvatar(studentId, downloadPath)
              .then(() => {
                showSnackbar(`Update avatar success`, 'success')
                removeImage(avatarPath)
              })
              .catch((error) => {
                showSnackbar(`Update avatar failed`, 'error')
                console.error(error)
              })
              .finally(() => {
                setLoading(false)
                handleClose(true)
              })
          }
        }
      },
      'image/png',
      1
    )
  }

  const onImageLoad = (e: React.SyntheticEvent<HTMLImageElement>) => {
    const { width, height } = e.currentTarget
    setCrop(centerAspectCrop(width, height, 1))
    setImageReady(true)
  }

  return (
    <Dialog open={isOpen} onClose={() => handleClose(false)} fullWidth={isMobile} maxWidth={'lg'}>
      <DialogTitle>Cropping Image</DialogTitle>
      <DialogContent dividers={true}>
        {!isImageReady && (
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              position: 'absolute',
            }}
          >
            <CircularProgress />
          </Box>
        )}
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-around',
            alignItems: 'flex-end',
            gap: '2em',
          }}
        >
          <Box maxWidth={500}>
            <ReactCrop
              crop={crop}
              onChange={(_, percentCrop) => setCrop(percentCrop)}
              onComplete={(c) => setCompletedCrop(c)}
              aspect={1}
            >
              <img
                crossOrigin={'anonymous'}
                ref={imgRef}
                alt="Crop me"
                src={buildImageUrl(avatarPath, false, true, true)}
                onLoad={onImageLoad}
              />
            </ReactCrop>
          </Box>
          {!!completedCrop && (
            <Box>
              <Typography sx={{ marginBottom: 1, marginTop: 1 }}>Kết quả:</Typography>
              <Box sx={{ width: '100%' }}>
                <canvas
                  ref={previewCanvasRef}
                  style={{
                    border: '1px solid black',
                    objectFit: 'contain',
                    width: completedCrop.width,
                    height: completedCrop.height,
                  }}
                />
              </Box>
            </Box>
          )}
        </Box>
      </DialogContent>
      <DialogActions>
        {isLoading && (
          <Box sx={{ width: '100%', position: 'absolute', top: 0, left: 0 }}>
            <LinearProgressComponent progress={uploadImageProgress} />
          </Box>
        )}
        <Button
          autoFocus={true}
          onClick={() => handleClose(false)}
          variant="outlined"
          color={'neutral'}
          disabled={isLoading}
          startIcon={<ClearIcon />}
        >
          Huỷ
        </Button>
        <Button
          type={'button'}
          onClick={onCrop}
          autoFocus={true}
          variant="contained"
          color={'primary'}
          startIcon={isLoading ? <CircularProgress size={'1rem'} /> : <CheckIcon />}
          disabled={isLoading}
        >
          Lưu
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default CroppingImageComponent
