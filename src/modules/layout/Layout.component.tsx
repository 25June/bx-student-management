import * as React from 'react'
import Box from '@mui/material/Box'
import CssBaseline from '@mui/material/CssBaseline'
import HomeComponent from '../../pages/homepage/Home.component'
import TopBarComponent from '../topBar/TopBar.component'
import DrawerComponent from '../drawer/Drawer.component'
import { useEffect } from 'react'
import { queryClasses } from '../../services/firestore'
import { getAuth } from 'firebase/auth'
import { getDocs } from 'firebase/firestore'

export const drawerWidth = 240

const LayoutComponent = () => {
  const auth = getAuth()
  const [isOpen, setOpen] = React.useState(false)
  useEffect(() => {
    console.log('abc')
    auth.onAuthStateChanged((authUser) => {
      if (authUser) {
        getDocs(queryClasses).then((snapshots) => {
          console.log(snapshots.docs.map((doc) => doc.data()))
        })
      }
    })
  }, [])
  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      <TopBarComponent isOpen={isOpen} setOpen={setOpen} />
      <DrawerComponent isOpen={isOpen} />
      <Box component="main" sx={{ flexGrow: 1, pt: 8, pl: 3, pr: 3, pb: 3 }}>
        <HomeComponent />
      </Box>
    </Box>
  )
}

export default LayoutComponent
