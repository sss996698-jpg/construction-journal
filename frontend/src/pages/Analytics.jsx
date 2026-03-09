import React, { useState, useEffect } from 'react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line } from 'recharts'
import { getStatsByProject, getStatsByUser, getStatsByDate } from '../api/client'

export default function Analytics() {
  const [stats, setStats] = useState(null)
  const [filter, setFilter] = useState('project')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true)
        let data
        if (filter === 'project') {
          data = await getStatsByProject()
        } else if (filter === 'user') {
          data = await getStatsByUser()
        } else {
          data = await getStatsByDate()
        }
        setStats(data)
      } catch (error) {
        console.error('Failed to fetch stats:', error)
      } finally {
        setLoading(false)
      }
    }
    fetchStats()
  }, [filter])

  if (loading) {
    return <div className="p-4">Loading...</div>
  }

  if (!stats || stats.length === 0) {
    return <div className="p-4">No data available</div>
  }

  return (
    <div className="p-6 bg-white rounded-lg">
      <div className="flex gap-4 mb-6">
        <button
          onClick={() => setFilter('project')}
          className={`px-4 py-2 rounded ${filter === 'project' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
        >
          By Project
        </button>
        <button
          onClick={() => setFilter('user')}
          className={`px-4 py-2 rounded ${filter === 'user' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
        >
          By User
        </button>
        <button
          onClick={() => setFilter('date')}
          className={`px-4 py-2 rounded ${filter === 'date' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
        >
          By Date
        </button>
      </div>

      <ResponsiveContainer width="100%" height={400}>
        <BarChart data={stats}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="count" fill="#8884d8" />
        </BarChart>
      </ResponsiveContainer>

      {stats.length > 1 && (
        <div className="mt-8">
          <ResponsiveContainer width="100%" height={400}>
            <LineChart data={stats}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="count" stroke="#82ca9d" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  )
}
