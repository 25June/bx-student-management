import React from 'react'
import './App.css'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import ROUTES from './routes'
import { AuthContextProvider } from './contexts/AuthContext'
import { PrivateComponent } from './modules/index'

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
                      <PrivateComponent component={route.component} />
                    ) : (
                      route.component
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
