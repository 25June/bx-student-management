import React, { Suspense } from 'react'
import 'App.scss'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import ROUTES from 'routes'
import { AuthContextProvider } from 'contexts/AuthContext'
import { PrivateComponent, FallbackComponent } from './modules/index'

function App() {
  return (
    <div className="App">
      <AuthContextProvider>
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
      </AuthContextProvider>
    </div>
  )
}

export default App
