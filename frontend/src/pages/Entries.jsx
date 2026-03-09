import React, { useState, useEffect } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { getEntries, getProjects, getUsers } from '../api/client'

const statusLabels = {
  pending: { text: 'Ожидает', class: 'bg-yellow-100 text-yellow-700' },
  approved: { text: 'Одобрена', class: 'bg-green-100 text-green-700' },
  rejected: { text: 'Отклонена', class: 'bg-red-100 text-red-700' },
}

export default function Entries() {
  const [searchParams, setSearchParams] = useSearchParams()
  const [entries, setEntries] = useState([])
  const [total, setTotal] = useState(0)
  const [page, setPage] = useState(1)
  const [projects, setProjects] = useState([])
  const [users, setUsers] = useState([])
  const [filters, setFilters] = useState({
    status: searchParams.get('status') || '',
    project_id: '',
    user_id: '',
    date_from: '',
    date_to: '',
  })

  useEffect(() => {
    getProjects().then((res) => setProjects(res.data))
    getUsers().then((res) => setUsers(res.data))
  }, [])

  useEffect(() => {
    const params = { page, per_page: 20 }
    if (filters.status) params.status = filters.status
    if (filters.project_id) params.project_id = filters.project_id
    if (filters.user_id) params.user_id = filters.user_id
    if (filters.date_from) params.date_from = filters.date_from
    if (filters.date_to) params.date_to = filters.date_to

    getEntries(params).then((res) => {
      setEntries(res.data.entries)
      setTotal(res.data.total)
    })
  }, [page, filters])

  const totalPages = Math.ceil(total / 20)

  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Записи журнала</h2>

      <div className="bg-white rounded-xl shadow-sm p-4 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
          <select value={filters.status} onChange={(e) => { setFilters({ ...filters, status: e.target.value }); setPage(1) }} className="px-3 py-2 border rounded-lg text-sm">
            <option value="">Все статусы</option>
            <option value="pending">Ожидают</option>
            <option value="approved">Одобрены</option>
            <option value="rejected">Отклонены</option>
          </select>
          <select value={filters.project_id} onChange={(e) => { setFilters({ ...filters, project_id: e.target.value }); setPage(1) }} className="px-3 py-2 border rounded-lg text-sm">
            <option value="">Все объекты</option>
            {projects.map((p) => (<option key={p.id} value={p.id}>{p.name}</option>))}
          </select>
          <select value={filters.user_id} onChange={(e) => { setFilters({ ...filters, user_id: e.target.value }); setPage(1) }} className="px-3 py-2 border rounded-lg text-sm">
            <option value="">Все сотрудники</option>
            {users.map((u) => (<option key={u.id} value={u.id}>{u.full_name}</option>))}
          </select>
          <input type="date" value={filters.date_from} onChange={(e) => { setFilters({ ...filters, date_from: e.target.value }); setPage(1) }} className="px-3 py-2 border rounded-lg text-sm" placeholder="С даты" />
          <input type="date" value={filters.date_to} onChange={(e) => { setFilters({ ...filters, date_to: e.target.value }); setPage(1) }} className="px-3 py-2 border rounded-lg text-sm" placeholder="По дату" />
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Дата</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Объект</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Этап</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Сотрудник</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Вид работ</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Статус</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Фото</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {entries.map((entry) => { const st = statusLabels[entry.status] || statusLabels.pending; return (<tr key={entry.id} className="hover:bg-gray-50"><td className="px-4 py-3 text-sm"><Link to={`/entries/${entry.id}`} className="text-blue-600 hover:underline">{entry.entry_date}</Link></td><td className="px-4 py-3 text-sm">{entry.project_name}</td><td className="px-4 py-3 text-sm">{entry.stage_name}</td><td className="px-4 py-3 text-sm">{entry.user_name}</td><td className="px-4 py-3 text-sm text-gray-600">{entry.work_type || '—'}</td><td className="px-4 py-3"><span className={`px-2 py-1 rounded-full text-xs font-medium ${st.class}`}>{st.text}</span></td><td className="px-4 py-3 text-sm text-gray-500">{entry.photos?.length || 0}</td></tr>); })}
            {entries.length === 0 && (<tr><td colSpan="7" className="px-4 py-8 text-center text-gray-400">Записи не найдены</td></tr>)}
          </tbody>
        </table>
        {totalPages > 1 && (<div className="flex items-center justify-between px-4 py-3 border-t"><div className="text-sm text-gray-500">Всего: {total} записей (стр. {page} из {totalPages})</div><div className="flex gap-2"><button onClick={() => setPage(Math.max(1, page - 1))} disabled={page === 1} className="px-3 py-1 border rounded text-sm disabled:opacity-50">Назад</button><button onClick={() => setPage(Math.min(totalPages, page + 1))} disabled={page === totalPages} className="px-3 py-1 border rounded text-sm disabled:opacity-50">Вперёд</button></div></div>)}
      </div>
    </div>
  )
}
