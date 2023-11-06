import { Box, Tabs, Tab } from '@mui/material'
// import { Role } from 'constant/common'
import { useState } from 'react'
import { useClassContext } from 'contexts/ClassContext'
// import { useAuthentication } from 'contexts/AuthContext'
import ExportComponent from 'pages/import/Export.component'
// import ImportComponent from 'pages/import/Import.component'
import ExportDiligentComponent from 'pages/import/ExportDiligent.component'

interface TabPanelProps {
  children?: React.ReactNode
  index: number
  value: number
}

function CustomTabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && <Box>{children}</Box>}
    </div>
  )
}

function a11yProps(index: number) {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`,
  }
}

const ReportComponent = () => {
  const [tabValue, setTabValue] = useState<number>(2)
  const { classObj: currentClass } = useClassContext()

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue)
  }

  return (
    <Box>
      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Tabs value={tabValue} onChange={handleChange}>
          {/* <Tab label="Nhập" value={1} disabled={user?.role !== Role.CTO} {...a11yProps(1)} /> */}
          <Tab label="Xuất" value={2} {...a11yProps(2)} />
          <Tab label="Xuất Chuyên Cần" value={3} {...a11yProps(3)} />
          {/* <Tab label="Điểm Danh" value={3} {...a11yProps(3)} /> */}
          {/* <Tab label="Bảng Điểm" value={4} {...a11yProps(4)} /> */}
        </Tabs>
      </Box>
      {/* <CustomTabPanel value={tabValue} index={1}>
        <ImportComponent />
      </CustomTabPanel> */}
      <CustomTabPanel value={tabValue} index={2}>
        {currentClass && <ExportComponent currentClass={currentClass} />}
      </CustomTabPanel>
      <CustomTabPanel value={tabValue} index={3}>
        {currentClass && <ExportDiligentComponent currentClass={currentClass} />}
      </CustomTabPanel>
      {/* <CustomTabPanel value={tabValue} index={4}>
        <ScoreBookReport />
      </CustomTabPanel> */}
    </Box>
  )
}

export default ReportComponent
