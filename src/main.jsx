import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Invitation from './pages/Invitation.jsx'
import IntakeForm from './pages/IntakeForm.jsx'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Invitation />} />
        <Route path="/isi-data" element={<IntakeForm />} />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
)
