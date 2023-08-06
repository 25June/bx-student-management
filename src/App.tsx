import React, { Suspense } from 'react'
import 'App.scss'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { ThemeProvider } from '@mui/material/styles'
import ROUTES from 'routes'
import { AuthContextProvider } from 'contexts/AuthContext'
import { PrivateComponent, FallbackComponent } from './modules/index'
import { SnackbarProvider } from 'contexts/SnackbarContext'
import { AssessmentProvider } from 'contexts/AssessmentContext'
import { StudentProvider } from 'contexts/StudentContext'
import { ClassProvider } from 'contexts/ClassContext'
import theme from './styleConfigs'
import { DialogProvider } from 'contexts/DialogContext'
import { DiligentProvider } from 'contexts/DiligentContext'

function App() {
  return (
    <div className="App">
      <AuthContextProvider>
        <ThemeProvider theme={theme}>
          <SnackbarProvider>
            <ClassProvider>
              <AssessmentProvider>
                <StudentProvider>
                  <DiligentProvider>
                    <DialogProvider>
                      <BrowserRouter>
                        <Suspense fallback={<FallbackComponent />}>
                          <Routes>
                            {ROUTES.map((route) => {
                              return (
                                <Route
                                  key={route.name}
                                  path={route.path}
                                  element={
                                    route.isPrivate ? (
                                      <PrivateComponent component={route.component} />
                                    ) : (
                                      route.component
                                    )
                                  }
                                />
                              )
                            })}
                          </Routes>
                        </Suspense>
                      </BrowserRouter>
                    </DialogProvider>
                  </DiligentProvider>
                </StudentProvider>
              </AssessmentProvider>
            </ClassProvider>
          </SnackbarProvider>
        </ThemeProvider>
      </AuthContextProvider>
    </div>
  )
}

export default App
