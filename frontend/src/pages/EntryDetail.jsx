import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { getEntry, reviewEntry } from '../api/client'

const statusLabels = {
  pending: { text: 'Ожидает проверки', class: 'bg-yellow-100 text-yellow-700' },
  approved: { text: 'Одобрена', class: 'bg-green-100 text-green-700' },
  rejected: { text: 'Отклонена', class: 'bg-red-100 text-red-700' },
}

export default function EntryDetail({ user }) {
  const { id } = useParams()
  const navigate = useNavigate()
  const [entry, setEntry] = useState(null)
  const [rejectionReason, setRejectionReason] = useState('')
  const [showRejectForm, setShowRejectForm] = useState(false)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    getEntry(id).then((res) => setEntry(res.data))
  }, [id])

  if (!entry) return <div className="text-gray-500">Загрузка...</div>

  const canReview = ['coordinator', 'admin'].includes(user?.role) && entry.status === 'pending'
  const st = statusLabels[entry.status]

  const handleApprove = async () => {
    setLoading(true)
    await reviewEntry(entry.id, { status: 'approved' })
    setEntry({ ...entry, status: 'approved' })
    setLoading(false)
  }

  const handleReject = async () => {
    setLoading(true)
    await reviewEntry(entry.id, { status: 'rejected', rejection_reason: rejectionReason })
    setEntry({ ...entry, status: 'rejected', rejection_reason: rejectionReason })
    setShowRejectForm(false)
    setLoading(false)
  }

  const fields = [
    { label: 'Дата', value: entry.entry_date },
    { label: 'Объект', value: entry.project_name },
    { label: 'Этап', value: entry.stage_name },
    { label: 'Сотрудник', value: entry.user_name },
    { label: 'Работников', value: entry.workers_count ?? '—' },
    { label: 'Чел-часы', value: entry.man_hours ?? '—' },
    { label: 'Техника', value: entry.equipment || '—' },
    { label: 'Вид работ', value: entry.work_type || '—' },
    { label: 'Количество', value: entry.work_quantity ?? '—' },
    { label: 'Комментарии', value: entry.comments || '—' },
  ]

  return (
    <div>
      <button onClick={() => navigate(-1)} className="text-blue-600 hover:underline text-sm mb-4 block">
        &larr; Назад к списку
      </button>

      <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-gray-800">Запись #{entry.id}</h2>
          <span className={`px-3 py-1 rounded-full text-sm font-medium ${st.class}`}>
            {st.text}
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          {fields.map((f) => (
            <div key={f.label}>
              <div className="text-xs text-gray-400 uppercase mb-1">{f.label}</div>
              <div className="text-sm text-gray-800">{f.value}</div>
            </div>
          ))}
        </div>

        {entry.rejection_reason && (
          <div className="bg-red-50 p-3 rounded-lg mb-4">
            <div className="text-xs text-red-400 uppercase mb-1">Причина отклонения</div>
            <div className="text-sm text-red-700">{entry.rejection_reason}</div>
          </div>
        )}

        {entry.reviewer_name && (
          <div className="text-sm text-gray-400">
            Проверил: {entry.reviewer_name} ({entry.reviewed_at?.slice(0, 10)})
          </div>
        )}
      </div>

      {entry.photos?.length > 0 && (
        <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">
            Фотографии ({entry.photos.length})
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
            {entry.photos.map((photo) => (
              <a
                key={photo.id}
                href={`/api/photos/${photo.id}`}
                target="_blank"
                rel="noopener noreferrer"
                className="block aspect-square bg-gray-100 rounded-lg overflow-hidden hover:opacity-80 transition-opacity"
              >
                <img
                  src={`/api/photos/${photo.id}`}
                  alt={`Фото ${photo.id}`}
                  className="w-full h-full object-cover"
                />
              </a>
            ))}
          </div>
        </div>
      )}

      {canReview && (
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Проверка записи</h3>

          {showRejectForm ? (
            <div className="space-y-3">
              <textarea
                value={rejectionReason}
                onChange={(e) => setRejectionReason(e.target.value)}
                placeholder="Укажите причину отклонения..."
                className="w-full px-3 py-2 border rounded-lg text-sm"
                rows={3}
              />
              <div className="flex gap-2">
                <button
                  onClick={handleReject}
                  disabled={loading}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg text-sm hover:bg-red-700 disabled:opacity-50"
                >
                  Отклонить
                </button>
                <button
                  onClick={() => setShowRejectForm(false)}
                  className="px-4 py-2 border rounded-lg text-sm"
                >
                  Отмена
                </button>
              </div>
            </div>
          ) : (
            <div className="flex gap-3">
              <button
                onClick={handleApprove}
                disabled={loading}
                className="px-6 py-2 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 disabled:opacity-50"
              >
                Одобрить
              </button>
              <button
                onClick={() => setShowRejectForm(true)}
                className="px-6 py-2 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700"
              >
                Отклонить
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
