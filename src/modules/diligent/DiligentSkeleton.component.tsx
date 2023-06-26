import * as React from 'react'
import Skeleton from '@mui/material/Skeleton'
import Stack from '@mui/material/Stack'

const DiligentSkeleton = () => {
  return (
    <Stack spacing={2}>
      <Skeleton variant="rectangular" width={'100%'} height={74} />
      <Skeleton variant="rectangular" width={'100%'} height={74} />
      <Skeleton variant="rectangular" width={'100%'} height={74} />
      <Skeleton variant="rectangular" width={'100%'} height={74} />
    </Stack>
  )
}

export default DiligentSkeleton
