// src/pages/MyBooksPage.tsx
import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import api from '../services/api'
import type { Book } from '../types'

type ShelfItem = {
  bookId: string
  status: 'haveRead' | 'currentlyReading' | 'wantToRead'
}

export default function MyBooksPage() {
  const [shelf, setShelf] = useState<ShelfItem[]>([])
  const [books, setBooks] = useState<Record<string, Book>>({})
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const userId = localStorage.getItem('userId')
    if (!userId) {
      setError('Du måste vara inloggad')
      setLoading(false)
      return
    }

    api
      .get<{ shelf: ShelfItem[] }>(`/users/${userId}`)
      .then((res) => {
        setShelf(res.data.shelf)
        return Promise.all(
          res.data.shelf.map((item) =>
            api.get<Book>(`/books/${item.bookId}`).then((r) => ({
              id: item.bookId,
              data: r.data,
            }))
          )
        )
      })
      .then((results) => {
        const map: Record<string, Book> = {}
        results.forEach(({ id, data }) => {
          map[id] = data
        })
        setBooks(map)
      })
      .catch(() => setError('Kunde inte ladda din hylla'))
      .finally(() => setLoading(false))
  }, [])

  if (loading) return <p className="p-8">Laddar din hylla…</p>
  if (error) return <p className="p-8 text-red-600">{error}</p>
  if (shelf.length === 0) return <p className="p-8">Din hylla är tom</p>

  return (
    <div className="max-w-3xl mx-auto space-y-4">
      <h1 className="text-2xl font-bold">Min Bokhylla</h1>
      {shelf.map(({ bookId, status }) => {
        const book = books[bookId]
        if (!book) return null
        return (
          <Link
            key={bookId}
            to={`/books/${bookId}`}
            className="block p-4 border rounded hover:bg-gray-50"
          >
            <div className="flex items-center space-x-4">
              <img
                src={book.coverUrl}
                alt={book.name}
                className="w-16 rounded"
              />
              <div>
                <h2 className="text-lg font-semibold">{book.name}</h2>
                <p className="text-sm text-gray-600 capitalize">{status}</p>
              </div>
            </div>
          </Link>
        )
      })}
    </div>
  )
}
