import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { getDashboard, getEntries } from '../api/client'

export default function Dashboard() {
  const [stats, setStats] = useState(null)
  const [recentEntries, setRecentEntries] = useState([])

  useEffect(() => {
    getDashboard().then((res) => setStats(res.data))
    getEntries({ per_page: 5, status: 'pending' }).then((res) => setRecentEntries(res.data.entries))
  }, [])

  if (!stats) return <div className="text-gray-500">Загрузка...</div>

  const cards = [
    { label: 'Всего записей', value: stats.total_entries, color: 'bg-blue-500' },
    { label: 'Ожидают проверки', value: stats.pending_entries, color: 'bg-yellow-500' },
    { label: 'Одобрено сегодня', value: stats.approved_today, color: 'bg-green-500' },
    { label: 'Отклонено сегодня', value: stats.rejected_today, color: 'bg-red-500' },
    { label: 'Объектов', value: stats.total_projects, color: 'bg-purple-500' },
    { label: 'Работников', value: stats.total_workers, color: 'bg-indigo-500' },
  ]

  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Дашборд</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
        {cards.map((card) => (
          <div key={card.label} className="bg-white rounded-xl shadow-sm p-5">
            <div className="flex items-center gap-3">
              <div className={`w-10 h-10 ${card.color} rounded-lg flex items-center justify-center text-white font-bold text-lg`}>
                {card.value}
              </div>
              <div className="text-sm text-gray-600">{card.label}</div>
            </div>
          </div>
        ))}
      </div>

      {recentEntries.length > 0 && (
        <div className="bg-white rounded-xl shadow-sm p-5">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Ожидают проверки</h3>
          <div className="space-y-3">
            {recentEntries.map((entry) => (
              <Link
                key={entry.id}
                to={`/entries/${entry.id}`}
                className="block p-3 border rounded-lg hover:bg-gray-50 transition-colors"
              >
                <div className="flex justify-between items-center">
                  <div>
                    <span className="font-medium">{entry.project_name}</span>
                    <span className="text-gray-400 mx-2">/</span>
                    <span className="text-gray-600">{entry.stage_name}</span>
                  </div>
                  <span className="text-sm text-gray-400">{entry.entry_date}</span>
                </div>
                <div className="text-sm text-gray-500 mt-1">
                  {entry.user_name} — {entry.work_type || 'Без описания'}
                </div>
              </Link>
            ))}
          </div>
          <Link to="/entries?status=pending" className="block text-center text-blue-600 text-sm mt-4 hover:underline">
            Показать все
          </Link>
        </div>
      )}
    </div>
  )
}
