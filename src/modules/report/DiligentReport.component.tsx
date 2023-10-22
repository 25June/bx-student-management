import { OverviewReport } from 'models/report'
import {
  Box,
  Typography,
  Divider,
  List,
  ListItem,
  ListItemAvatar,
  Avatar,
  ListItemText,
} from '@mui/material'
import { pink, red } from '@mui/material/colors'
import { KeyValueProp } from 'models/common'
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos'
import IconButton from '@mui/material/IconButton'

const ProgressBarContainer = ({
  title,
  current,
  total,
  backgroundCurrent,
  backgroundTotal,
}: {
  title: string
  current: number
  total: number
  backgroundTotal: string
  backgroundCurrent: string
}) => {
  return (
    <Box
      sx={{ gap: '0.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
    >
      <Box sx={{ width: 64 }}>
        <Typography fontSize={'0.825rem'}>{title}</Typography>
      </Box>
      <Box
        sx={{
          flex: 1,
          height: 20,
          background: backgroundTotal,
          width: '100%',
          borderRadius: '5px',
        }}
      >
        <Box
          sx={{
            width: `${(current / total) * 100}%`,
            background: backgroundCurrent,
            textAlign: 'right',
            borderRadius: '5px',
          }}
        >
          <Box sx={{ paddingRight: 1 }}>{current}</Box>
        </Box>
      </Box>
    </Box>
  )
}

const DiligentReportItem = ({
  data,
  onViewDetail,
}: {
  data: OverviewReport
  onViewDetail: (date: KeyValueProp, month: string) => void
}) => {
  const splitDate = data.date.dateAsString.split('-')
  return (
    <>
      <ListItem alignItems={'flex-start'} disableGutters={true}>
        <ListItemAvatar>
          <Avatar
            variant={'rounded'}
            sx={{
              width: 48,
              height: 48,
              backgroundImage:
                'linear-gradient(to right top, #ffafbd, #ffb3b4, #ffb7ac, #ffbda5, #ffc3a0)',
            }}
          >
            <Typography>
              {splitDate.at(2)}
              <Box sx={{ fontSize: '0.5rem' }} component="sub">
                /{splitDate.at(1)}
              </Box>
            </Typography>
          </Avatar>
        </ListItemAvatar>
        <ListItemText
          disableTypography={true}
          primary={
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                width: '100%',
              }}
            >
              <Box
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'center',
                  gap: '0.5rem',
                  flexGrow: 1,
                }}
                onClick={() =>
                  onViewDetail(
                    { key: data.date.key, value: data.date.dateAsString },
                    data.date.month
                  )
                }
              >
                <ProgressBarContainer
                  current={data.tl}
                  total={data.total}
                  backgroundCurrent={'#ffafbd'}
                  backgroundTotal={pink[50]}
                  title={'Thánh Lễ'}
                />
                <ProgressBarContainer
                  current={data.gl}
                  total={data.total}
                  backgroundCurrent={'#ffc3a0'}
                  backgroundTotal={red[50]}
                  title={'Giáo Lý'}
                />
              </Box>
              <Box sx={{ width: 32 }}>
                <IconButton
                  size="small"
                  onClick={() =>
                    onViewDetail(
                      { key: data.date.key, value: data.date.dateAsString },
                      data.date.month
                    )
                  }
                >
                  <ArrowForwardIosIcon fontSize={'inherit'} color={'action'} />
                </IconButton>
              </Box>
            </Box>
          }
        />
      </ListItem>
      <Divider variant="middle" component="li" />
    </>
  )
}

interface Props {
  data: OverviewReport[]
  onViewDetail: (date: KeyValueProp, month: string) => void
}

const DiligentReport = ({ data, onViewDetail }: Props) => {
  return (
    <Box>
      <List
        disablePadding={true}
        sx={{
          width: '100%',
          maxWidth: '100%',
          background: 'transparent',
          backdropFilter: 'blur(2px)',
        }}
      >
        {data.map((data) => (
          <DiligentReportItem key={data.date.key} data={data} onViewDetail={onViewDetail} />
        ))}
      </List>
    </Box>
  )
}

export default DiligentReport
