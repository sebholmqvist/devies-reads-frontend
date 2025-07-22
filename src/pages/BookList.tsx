// src/pages/BookList.tsx
import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import api from '../services/api'
import type { Book } from '../types'

export default function BookList() {
  const [books, setBooks]         = useState<Book[]>([])
  const [loading, setLoading]     = useState(true)
  const [error, setError]         = useState<string>('')
  const [searchTerm, setSearchTerm] = useState<string>('')
  const [genreFilter, setGenreFilter] = useState<string>('')

  // Hämta alla böcker
  useEffect(() => {
    api.get<Book[]>('/books')
      .then(res => {
        setBooks(res.data)
        setError('')
      })
      .catch(() => setError('Kunde inte ladda böcker'))
      .finally(() => setLoading(false))
  }, [])

  // Extrahera unika genrer för filter‑dropdown
  const genres = Array.from(new Set(books.map(b => b.genre)))

  // Filtrera baserat på sökterm + genre
  const filtered = books.filter(b =>
    b.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
    (genreFilter ? b.genre === genreFilter : true)
  )

  if (loading) return <p className="p-8">Laddar böcker…</p>
  if (error)   return <p className="p-8 text-red-600">{error}</p>

  return (
    <div className="space-y-6">
      {/* Filter‑UI */}
      <div className="flex flex-wrap items-center gap-4">
        <input
          type="text"
          placeholder="Sök böcker..."
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
          className="flex-1 border rounded p-2 focus:outline-none focus:ring-2 focus:ring-primary"
        />
        <select
          value={genreFilter}
          onChange={e => setGenreFilter(e.target.value)}
          className="border rounded p-2 focus:outline-none focus:ring-2 focus:ring-primary"
        >
          <option value="">Alla genrer</option>
          {genres.map(g => (
            <option key={g} value={g}>{g}</option>
          ))}
        </select>
      </div>

      {/* Bok‑grid */}
      <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
        {filtered.map(book => (
          <Link
            key={book.id}
            to={`/books/${book.id}`}
            className="bg-white dark:bg-gray-800 rounded-lg shadow hover:shadow-lg transition p-4 flex flex-col"
          >
            <img
              src={book.coverUrl}
              alt={book.name}
              className="w-full h-48 object-cover rounded"
            />
            <h2 className="mt-4 text-xl font-semibold">{book.name}</h2>
            <p className="mt-1 text-gray-600 dark:text-gray-400 flex-1 capitalize">
              {book.genre}
            </p>
            <div className="mt-2 text-sm font-medium text-primary">
              ★ {book.averageRating.toFixed(1)}
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}
