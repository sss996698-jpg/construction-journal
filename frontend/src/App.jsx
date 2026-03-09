import React, { useState, useEffect } from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { getMe } from './api/client'
import Sidebar from './components/Sidebar'
import Dashboard from './pages/Dashboard'
import Entries from './pages/Entries'
import EntryDetail from './pages/EntryDetail'
import Analytics from './pages/Analytics'
import Projects from './pages/Projects'
import Users from './pages/Users'
import Login from './pages/Login'
import './index.css'

export default function App() {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const userData = await getMe()
        setUser(userData)
      } catch (error) {
        setUser(null)
      } finally {
        setLoading(false)
      }
    }
    checkAuth()
  }, [])

  if (loading) {
    return <div className="flex items-center justify-center h-screen">Loading...</div>
  }

  return (
    <BrowserRouter>
      {user ? (
        <div className="flex h-screen">
          <Sidebar user={user} setUser={setUser} />
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/entries" element={<Entries />} />
            <Route path="/entries/:id" element={<EntryDetail />} />
            <Route path="/analytics" element={<Analytics />} />
            <Route path="/projects" element={<Projects />} />
            <Route path="/users" element={<Users />} />
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </div>
      ) : (
        <Routes>
          <Route path="/*" element={<Login setUser={setUser} />} />
        </Routes>
      )}
    </BrowserRouter>
  )
}
