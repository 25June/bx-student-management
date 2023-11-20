import {
  Table,
  Menu,
  Box,
  Chip,
  CircularProgress,
  IconButton,
  Tooltip,
  Typography,
  MenuItem,
  Button,
  TableRow,
  Paper,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
} from '@mui/material'
import EditIcon from '@mui/icons-material/Edit'
import DeleteIcon from '@mui/icons-material/Delete'
import MoreVertIcon from '@mui/icons-material/MoreVert'
import DownloadIcon from '@mui/icons-material/Download'
import { useState } from 'react'
import { grey } from '@mui/material/colors'
import { AssessmentActionType } from 'constant'
import { Assessment, Document } from 'models/assessment'
import { useIsMobile } from 'utils/common'
import { getScoreName } from 'utils/getScoreName'
import { formatYYYMMDDToDDMMYYYY } from 'utils/datetime'
import { get } from 'lodash'
import { downloadAssessment, tableColumns } from 'utils/assessment'

interface Props {
  rows: Assessment[]
  onClickAction: (data: Assessment, actionType: AssessmentActionType) => void
}

const AssessmentTableComponent = ({ rows, onClickAction }: Props) => {
  const isMobile = useIsMobile()
  const [downloading, setDownloading] = useState<boolean>(false)
  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null)
  const [open, setOpen] = useState(false)
  const [selectedRow, setSelectedRow] = useState<Assessment>()
  const handleClickMenu = (event: React.MouseEvent<HTMLButtonElement>, row: Assessment) => {
    setAnchorEl(event.currentTarget)
    setOpen(true)
    setSelectedRow(row)
  }

  const handleDownloadAssessment = (event: any, doc: Document) => {
    setDownloading(true)
    downloadAssessment(event, doc).then(() => {
      setDownloading(false)
    })
  }

  const tableBodyClass = isMobile
    ? {
        '&:before': { content: `attr(data-cell)`, fontWeight: 500 },
        display: 'grid',
        gridTemplateColumns: '17ch auto',
        borderBottom: 0,
      }
    : {}

  const actionClass = {
    display: 'flex',
    justifyContent: 'center',
    gap: 2,
    borderBottom: '1px solid rgba(224, 224, 224, 1)',
  }

  return (
    <TableContainer component={Paper} sx={{ border: `1px solid ${grey[300]}` }}>
      <Table stickyHeader={true} sx={{ minWidth: isMobile ? 0 : 650 }} aria-label="simple table">
        <TableHead>
          <TableRow sx={{ display: isMobile ? 'none' : '' }}>
            {tableColumns.map((col) => {
              return <TableCell key={col.value}>{col.label}</TableCell>
            })}
            <TableCell key={'file'}>File</TableCell>
            <TableCell />
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map((row, index) => {
            const assessment = {
              ...row,
              type: getScoreName(row.type),
              bookDate: row.bookDate ? formatYYYMMDDToDDMMYYYY(row.bookDate) : '',
            }
            return (
              <TableRow key={row.id} sx={{ background: index % 2 === 0 ? '#fff' : grey[50] }}>
                {tableColumns.map((col) => {
                  return (
                    <TableCell
                      key={`${row.id}-${col.value}`}
                      data-cell={col.label}
                      sx={tableBodyClass}
                    >
                      {get(assessment, [col.value], '~')}
                    </TableCell>
                  )
                })}
                <TableCell key={`${row.id}-document`} data-cell={'document'}>
                  {assessment.documents?.map((doc) => (
                    <Box sx={{ width: 150 }} key={doc.path}>
                      <Chip
                        icon={downloading ? <CircularProgress size={'1rem'} /> : <DownloadIcon />}
                        size={'small'}
                        label={doc.name}
                        color={'info'}
                        onClick={(event: any) => handleDownloadAssessment(event, doc)}
                      />
                    </Box>
                  ))}
                </TableCell>
                {isMobile ? (
                  <TableCell key={`${row.id}-action`} sx={actionClass}>
                    <Button
                      onClick={() => onClickAction(row, AssessmentActionType.EDIT_ASSESSMENT)}
                      variant="outlined"
                      color={'warning'}
                      startIcon={<EditIcon />}
                    >
                      <Typography color={'#ed6c02'} fontSize={'0.875rem'}>
                        Cập nhật
                      </Typography>
                    </Button>
                    <Button
                      onClick={() => onClickAction(row, AssessmentActionType.DELETE_ASSESSMENT)}
                      variant="outlined"
                      color={'error'}
                      startIcon={<DeleteIcon />}
                    >
                      <Typography color={'#d32f2f'} fontSize={'0.875rem'}>
                        Xoá
                      </Typography>
                    </Button>
                  </TableCell>
                ) : (
                  <TableCell key={`${row.id}-action`} align={'right'}>
                    <Tooltip title={'Menu'} placement={'top'}>
                      <IconButton
                        aria-label={'Menu'}
                        onClick={(e) => handleClickMenu(e, row)}
                        size={'small'}
                        color={'primary'}
                      >
                        <MoreVertIcon fontSize={'small'} />
                      </IconButton>
                    </Tooltip>
                  </TableCell>
                )}
              </TableRow>
            )
          })}
        </TableBody>
      </Table>
      {selectedRow && (
        <Menu open={open} anchorEl={anchorEl} onClose={() => setOpen(false)}>
          <MenuItem
            onClick={() => {
              onClickAction(selectedRow, AssessmentActionType.EDIT_ASSESSMENT)
              setOpen(false)
            }}
          >
            <Box display={'flex'} alignItems={'center'} gap={2}>
              <EditIcon fontSize="small" color={'warning'} />
              <Typography color={'#ed6c02'} fontSize={'0.875rem'}>
                Cập nhật thông tin
              </Typography>
            </Box>
          </MenuItem>
          <MenuItem
            onClick={() => {
              onClickAction(selectedRow, AssessmentActionType.DELETE_ASSESSMENT)
              setOpen(false)
            }}
          >
            <Box display={'flex'} alignItems={'center'} gap={2}>
              <DeleteIcon fontSize="small" color={'error'} />
              <Typography color={'#d32f2f'} fontSize={'0.875rem'}>
                Xoá thông tin
              </Typography>
            </Box>
          </MenuItem>
        </Menu>
      )}
    </TableContainer>
  )
}

export default AssessmentTableComponent
