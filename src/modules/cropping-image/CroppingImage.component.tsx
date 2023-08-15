import React, { useRef, useState } from 'react'
import {
  DialogTitle,
  DialogContent,
  DialogActions,
  Dialog,
  Button,
  CircularProgress,
  Box,
} from '@mui/material'
import ClearIcon from '@mui/icons-material/Clear'
import CheckIcon from '@mui/icons-material/Check'
import { buildImageUrl, useIsMobile } from 'utils/common'
import Cropper, { ReactCropperElement } from 'react-cropper'
import 'cropperjs/dist/cropper.css'
import { removeImage, uploadAvatar } from 'services'
import { updateUserAvatar } from 'services/user'
import { LinearProgressComponent } from 'modules/progress-bar/LinearProgressWithLabel.component'
import { useSnackbarContext } from 'contexts/SnackbarContext'

interface CroppingImageProps {
  avatarPath: string
  userId: string
  isOpen: boolean
  onClose: (refreshData?: boolean) => void
}

const CroppingImageComponent = ({ avatarPath, userId, isOpen, onClose }: CroppingImageProps) => {
  const isMobile = useIsMobile()
  const cropperRef = useRef<ReactCropperElement>(null)
  const [isLoading, setLoading] = useState<boolean>(false)
  const [uploadImageProgress, setUploadImageProgress] = useState<number>(0)
  const { showSnackbar } = useSnackbarContext()

  const onCrop = async () => {
    setLoading(true)
    const cropper = cropperRef.current?.cropper
    if (cropper) {
      cropper.getCroppedCanvas().toBlob(async (blobFile) => {
        if (blobFile) {
          const downloadPath = await uploadAvatar(blobFile, setUploadImageProgress)
          if (downloadPath && userId && avatarPath) {
            updateUserAvatar(userId, downloadPath)
              .then(() => {
                showSnackbar(`Update avatar success`, 'success')
                removeImage(avatarPath)
              })
              .catch((error) => {
                showSnackbar(`Update avatar fail`, 'error')
                console.error(error)
              })
              .finally(() => {
                setLoading(false)
                onClose(true)
              })
          }
        }
      })
    }
  }
  return (
    <Dialog open={isOpen} onClose={() => onClose(false)} fullWidth={isMobile}>
      <DialogTitle>Cropping Image</DialogTitle>
      <DialogContent dividers={true}>
        <Cropper
          src={buildImageUrl(avatarPath, false, true, true)}
          style={{ height: 400, width: '100%' }}
          // Cropper.js options
          initialAspectRatio={1}
          guides={false}
          ref={cropperRef}
        />
      </DialogContent>
      <DialogActions>
        {isLoading && (
          <Box sx={{ width: '100%', position: 'absolute', top: 0, left: 0 }}>
            <LinearProgressComponent progress={uploadImageProgress} />
          </Box>
        )}
        <Button
          autoFocus={true}
          onClick={() => onClose(false)}
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
