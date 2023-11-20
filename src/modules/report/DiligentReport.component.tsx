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
import { KeyValueProp } from 'models/common'
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos'
import IconButton from '@mui/material/IconButton'
import { useClassContext } from 'contexts/ClassContext'

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
          backgroundColor: backgroundTotal,
          width: '100%',
          borderRadius: '5px',
        }}
      >
        <Box
          sx={{
            width: `${(current / total) * 100}%`,
            backgroundColor: backgroundCurrent,
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
  const { classId } = useClassContext()
  const splitDate = data.date.dateAsString.split('-')
  const color = classId.slice(0, 2)
  return (
    <>
      <ListItem alignItems={'flex-start'} disableGutters={true}>
        <ListItemAvatar>
          <Avatar
            variant={'rounded'}
            sx={{
              width: 48,
              height: 48,
              backgroundColor: `${color}.dark`,
            }}
          >
            {splitDate?.length !== 0 && (
              <Typography>
                {splitDate[2]}
                <Box sx={{ fontSize: '0.5rem' }} component="sub">
                  /{splitDate[1]}
                </Box>
              </Typography>
            )}
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
                  backgroundCurrent={`${color}.main`}
                  backgroundTotal={`${color}.light`}
                  title={'Thánh Lễ'}
                />
                <ProgressBarContainer
                  current={data.gl}
                  total={data.total}
                  backgroundCurrent={`${color}.dark`}
                  backgroundTotal={`${color}.light`}
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
  )
}

export default DiligentReport
