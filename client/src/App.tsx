import React from 'react'
import { Route,  Routes } from 'react-router-dom'
import HomePage from './pages/HomePage'
import Register from './pages/Register'
import './static/style/style.css'
import './static/style/mobile.css'

const App = () => {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/register" element={<Register />} />
    </Routes>
  )
}

export default App