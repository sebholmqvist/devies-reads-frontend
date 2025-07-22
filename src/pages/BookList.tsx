import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import api from '../services/api'
import type { Book } from '../types'

const sortOptions = [
  { value: 'haveRead',     label: 'Mest lästa' },
  { value: 'wantToRead',   label: 'Mest vill läsa' },
  { value: 'averageRating',label: 'Högst betyg' },
  { value: 'name',         label: 'Namn' },
]

export default function BookList() {
  const [books, setBooks] = useState<Book[]>([])
  const [sortBy, setSortBy] = useState<string>('name')
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string>('')

  useEffect(() => {
    setLoading(true)
    api
      .get<Book[]>('/books')
      .then((res) => {
        setBooks(res.data)
        setError('')
      })
      .catch(() => {
        setError('Kunde inte hämta böcker')
      })
      .finally(() => {
        setLoading(false)
      })
  }, [])

  if (loading) return <p className="p-8">Laddar böcker…</p>
  if (error)   return <p className="p-8 text-red-600">{error}</p>

  if (books.length === 0) {
    return (
      <div className="p-8">
        <h1 className="text-2xl font-bold mb-4">Alla böcker</h1>
        <p className="text-gray-600">
          Inga böcker hittades. Skapa några via register‑flödet eller Swagger UI.
        </p>
      </div>
    )
  }

  const sorted = [...books].sort((a, b) => {
    switch (sortBy) {
      case 'haveRead':
        return (b.haveRead ?? 0) - (a.haveRead  ?? 0)
      case 'wantToRead':
        return (b.wantToRead ?? 0) - (a.wantToRead  ?? 0)
      case 'averageRating':
        return (b.averageRating ?? 0) - (a.averageRating ?? 0)
      case 'name':
      default:
        return (a.name ?? '').localeCompare(b.name ?? '')
    }
  })

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Alla böcker</h1>

      <label className="block mb-4">
        Sortera efter:{' '}
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          className="border rounded p-1"
        >
          {sortOptions.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      </label>

      <ul className="space-y-2">
        {sorted.map((book, idx) => (
          <li key={book.id ?? idx}>
            <Link
              to={book.id ? `/books/${book.id}` : '#'}
              className="text-blue-600 hover:underline"
            >
              {book.name}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  )
}
