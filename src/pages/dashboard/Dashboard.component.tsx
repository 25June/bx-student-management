import { Box, Typography } from '@mui/material'
import ReportContainer from './ReportContainer'
import HolyGrailIcon from 'modules/common/HolyGrailIcon'
import HolyBibleIcon from 'modules/common/HolyBibleIcon'
import { useIsMobile } from 'utils/common'

const DashboardComponent = () => {
  const isMobile = useIsMobile()
  const gl = {
    title: 'Giáo Lý',
    date: '22/11/2024',
    value: 200,
    total: 300,
    subtitle: 'Em tham dự',
    icon: <HolyBibleIcon color={'inherit'} styles={{ width: 64, height: 64 }} />,
  }
  const tl = {
    title: 'Thánh Lễ',
    date: '22/11/2024',
    value: 200,
    total: 300,
    subtitle: 'Em tham dự',
    icon: <HolyGrailIcon color={'inherit'} styles={{ width: 64, height: 64 }} />,
  }
  return (
    <Box>
      <Typography variant={'h1'} sx={{ textAlign: 'left', fontSize: '1rem', marginBottom: '1rem' }}>
        Tổng quan
      </Typography>
      <Box sx={{ display: 'flex', gap: '1rem', flexDirection: isMobile ? 'column' : 'row' }}>
        <ReportContainer {...gl} />
        <ReportContainer {...tl} />
      </Box>
    </Box>
  )
}

export default DashboardComponent
