// src/pages/BookPage.tsx
import { useParams } from 'react-router-dom'
import { useEffect, useState } from 'react'
import api from '../services/api'
import type { Book } from '../types'

type ShelfItem = {
  bookId: string
  status: 'haveRead' | 'currentlyReading' | 'wantToRead'
}

const statusOptions = [
  { key: 'wantToRead', label: 'Vill läsa' },
  { key: 'currentlyReading', label: 'Läser' },
  { key: 'haveRead', label: 'Läst' },
] as const

export default function BookPage() {
  const { id } = useParams<{ id: string }>()

  const [book, setBook] = useState<Book | null>(null)
  const [userShelf, setUserShelf] = useState<ShelfItem['status'] | ''>('')
  const [userRating, setUserRating] = useState<number>(0)
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string>('')

  // Hämta bok + rating
  useEffect(() => {
    if (!id) return
    setLoading(true)
    api
      .get<Book>(`/books/${id}`)
      .then(res => {
        setBook(res.data)
        setUserRating(res.data.userRating ?? 0)
        setError('')
      })
      .catch(() => setError('Kunde inte ladda bokdata'))
      .finally(() => setLoading(false))
  }, [id])

  // Hämta användarens hyllstatus
  useEffect(() => {
    const userId = localStorage.getItem('userId')
    if (!userId || !id) {
      setUserShelf('')
      return
    }
    api
      .get<{ shelf: ShelfItem[] }>(`/users/${userId}`)
      .then(res => {
        const item = res.data.shelf.find(x => x.bookId === id)
        setUserShelf(item?.status ?? '')
      })
      .catch(() => setUserShelf(''))
  }, [id])

  // Uppdatera hyllstatus
  const handleShelf = async (newStatus: ShelfItem['status']) => {
    if (!book?.id) return
    const userId = localStorage.getItem('userId')
    if (!userId) {
      alert('Logga in för att ändra status')
      return
    }
    try {
      await api.put(`/users/${userId}/shelf`, { bookId: book.id, status: newStatus })
    } catch {
      await api.post(`/users/${userId}/shelf`, {
        bookId: book.id,
        status: newStatus,
      })
    }
    // Läs om hyllstatus
    try {
      const res = await api.get<{ shelf: ShelfItem[] }>(`/users/${userId}`)
      const item = res.data.shelf.find(x => x.bookId === book.id)
      setUserShelf(item?.status ?? '')
    } catch {
      // ignore
    }
  }

  // Sätt betyg
  const handleRate = async (star: number) => {
    if (!book?.id) return
    const userId = localStorage.getItem('userId')
    if (!userId) {
      alert('Logga in för att betygsätta')
      return
    }
    try {
      const res = await api.post<Book>(`/books/${book.id}/rate`, {
        bookId: book.id,
        rating: star,
      })
      setBook(res.data)
      setUserRating(res.data.userRating ?? star)
    } catch (err) {
      console.error(err)
      alert('Fel vid uppdatering av betyg')
    }
  }

  if (loading) return <p className="p-8 text-center">Laddar…</p>
  if (error) return <p className="p-8 text-center text-red-600">{error}</p>
  if (!book) return <p className="p-8 text-center">Bok finns ej</p>

  return (
    <div className="prose prose-lg dark:prose-invert max-w-3xl mx-auto p-6">
      <h1 className="text-4xl font-bold mb-4">{book.name}</h1>
      <img
        src={book.coverUrl}
        alt={book.name}
        className="w-full max-w-xs rounded-lg shadow-lg mb-6"
      />

      <div className="space-y-4">
        <p>
          <strong>Genre:</strong>{' '}
          <span className="italic">{book.genre}</span>
        </p>
        <p>{book.description}</p>
        <p>
          <strong>Genomsnittligt betyg:</strong>{' '}
          <span className="text-primary font-semibold">
            ★ {book.averageRating.toFixed(1)}
          </span>
        </p>
      </div>

      {/* Rating-komponent */}
      <div className="mt-8">
        <p className="font-semibold mb-2">Ditt betyg:</p>
        <div className="flex items-center space-x-1">
          {[1, 2, 3, 4, 5].map(star => (
            <button
              key={star}
              disabled={!localStorage.getItem('token')}
              onClick={() => handleRate(star)}
              className={`
                text-2xl transition 
                ${star <= userRating ? 'text-yellow-400' : 'text-gray-300 dark:text-gray-600'}
                hover:text-yellow-500
                disabled:opacity-50 disabled:cursor-not-allowed
              `}
            >
              ★
            </button>
          ))}
        </div>
      </div>

      {/* Status‑knappar */}
      <div className="mt-8">
        <p className="font-semibold mb-2">Din status:</p>
        <div className="flex flex-wrap gap-3">
          {statusOptions.map(({ key, label }) => {
            const isActive = userShelf === key
            return (
              <button
                key={key}
                disabled={!localStorage.getItem('token')}
                onClick={() => handleShelf(key)}
                className={`
                  px-5 py-2 text-sm font-medium rounded-full border-2 transition
                  ${isActive
                    ? 'bg-primary text-white border-primary'
                    : 'bg-white dark:bg-gray-800 text-primary border-primary hover:bg-primary hover:text-white'}
                  focus:outline-none focus:ring-2 focus:ring-primary
                  disabled:opacity-50 disabled:cursor-not-allowed
                `}
              >
                {label}
              </button>
            )
          })}
        </div>
      </div>
    </div>
  )
}
