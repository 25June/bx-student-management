import React, { Suspense } from 'react'
import 'App.scss'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import ROUTES from 'routes'
import { AuthContextProvider } from 'contexts/AuthContext'
import { PrivateComponent, FallbackComponent } from './modules/index'
import { SnackbarProvider } from 'contexts/SnackbarContext'
import { AssessmentProvider } from 'contexts/AssessmentContext'
import { StudentProvider } from 'contexts/StudentContext'

function App() {
  return (
    <div className="App">
      <AuthContextProvider>
        <SnackbarProvider>
          <AssessmentProvider>
            <StudentProvider>
              <BrowserRouter>
                <Routes>
                  {ROUTES.map((route) => {
                    return (
                      <Route
                        key={route.name}
                        path={route.path}
                        element={
                          route.isPrivate ? (
                            <Suspense fallback={<FallbackComponent />}>
                              <PrivateComponent component={route.component} />
                            </Suspense>
                          ) : (
                            <Suspense fallback={<FallbackComponent />}>{route.component}</Suspense>
                          )
                        }
                      />
                    )
                  })}
                </Routes>
              </BrowserRouter>
            </StudentProvider>
          </AssessmentProvider>
        </SnackbarProvider>
      </AuthContextProvider>
    </div>
  )
}

export default App
