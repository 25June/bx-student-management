import React from 'react'
import './App.css'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import ROUTES from './routes'

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          {ROUTES.map((route) => {
            return <Route key={route.name} path={route.path} element={route.component} />
          })}
        </Routes>
      </BrowserRouter>
    </div>
  )
}

export default App
