import { Box, Typography, Paper } from '@mui/material'
// import CalendarMonthIcon from '@mui/icons-material/CalendarMonth'
import { blue } from '@mui/material/colors'
import { useClassContext } from 'contexts/ClassContext'
import { styled } from '@mui/material/styles'
import { Palette } from '@mui/material'

const ImageContainer = styled('div', { shouldForwardProp: (props) => props !== 'color' })<{
  color: string
}>(({ theme, color }) => ({
  width: 100,
  minWidth: 100,
  height: '100%',
  minHeight: 100,
  color: '#fff',
  background: color ? (theme.palette as any)?.[color]?.main : blue[300],
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  borderRadius: '0px 0px 10px 0px',
}))

interface Props {
  title: string
  date: string
  value: number
  total: number
  subtitle: string
  icon: JSX.Element
}

const ReportContainer = ({ title, date, value, total, subtitle, icon }: Props) => {
  // Interval to update the number every 1 second
  const { classId } = useClassContext()

  const color = classId.slice(0, 2)
  console.log({ color })
  return (
    <Paper
      elevation={2}
      sx={{
        borderRadius: '10px',
        display: 'flex',
        flexDirection: 'column',
        marginBottom: '1rem',
        maxWidth: 375,
        minWidth: 300,
      }}
    >
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: '0.5rem 0.5rem',
        }}
      >
        <Box>{title}</Box>
        <Box
          sx={{
            fontWeight: 500,
            fontSize: '0.875rem',
            display: 'flex',
            gap: '0.5rem',
            alignItems: 'center',
          }}
        >
          {date}
          {/* <IconButton size="small">
            <CalendarMonthIcon />
          </IconButton> */}
        </Box>
      </Box>
      <Box
        sx={{
          width: '100%',
          backgroundColor: '#fff',
          borderRadius: '10px',
          minHeight: 100,
          display: 'flex',
          gap: '0.5rem',
        }}
      >
        <Box
          sx={{
            flexGrow: 1,
            display: 'flex',
            flexDirection: 'column',
            padding: '0.5rem',
          }}
        >
          <Box>
            <Typography
              fontFamily={'Big Shoulders Display'}
              flexGrow={1}
              flexShrink={0}
              fontSize={'3.0rem'}
              lineHeight={'125%'}
            >
              {value}
              <Typography
                fontFamily={'inherit'}
                component={'sub'}
                fontSize={'1rem'}
                letterSpacing={'0.05em'}
                fontWeight={600}
              >
                /{total}
              </Typography>
            </Typography>
          </Box>
          <Typography fontSize={'0.875rem'} lineHeight={'125%'}>
            {subtitle}
          </Typography>
        </Box>
        <ImageContainer color={color}>{icon}</ImageContainer>
      </Box>
    </Paper>
  )
}

export default ReportContainer
