// src/pages/BookPage.tsx
import { useParams } from 'react-router-dom'
import { useEffect, useState } from 'react'
import api from '../services/api'
import type { Book } from '../types'

type ShelfItem = {
  bookId: string
  status: 'haveRead' | 'currentlyReading' | 'wantToRead'
}

export default function BookPage() {
  const { id } = useParams<{ id: string }>()

  const [book, setBook] = useState<Book | null>(null)
  const [userShelf, setUserShelf] = useState<ShelfItem['status'] | ''>('')
  const [userRating, setUserRating] = useState<number>(0)
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string>('')

  // 1) Hämta bokdetaljer inklusive averageRating & userRating
  useEffect(() => {
    if (!id) return
    setLoading(true)
    api
      .get<Book>(`/books/${id}`)
      .then((res) => {
        setBook(res.data)
        setUserRating(res.data.userRating ?? 0)
        setError('')
      })
      .catch(() => setError('Kunde inte ladda bokdata'))
      .finally(() => setLoading(false))
  }, [id])

  // 2) Hämta användarens hyllstatus
  useEffect(() => {
    const userId = localStorage.getItem('userId')
    if (!userId || !id) {
      setUserShelf('')
      return
    }

    api
      .get<{ shelf: ShelfItem[] }>(`/users/${userId}`)
      .then((res) => {
        const item = res.data.shelf.find((x) => x.bookId === id)
        setUserShelf(item?.status ?? '')
      })
      .catch(() => setUserShelf(''))
  }, [id])

  // 3) Byt hyllstatus (PUT eller POST)
  const handleShelf = async (newStatus: ShelfItem['status']) => {
    if (!book?.id) return
    const userId = localStorage.getItem('userId')
    if (!userId) {
      alert('Logga in för att ändra status')
      return
    }

    try {
      await api.put(`/users/${userId}/shelf`, {
        bookId: book.id,
        status: newStatus,
      })
    } catch {
      await api.post(`/users/${userId}/shelf`, {
        bookId: book.id,
        status: newStatus,
      })
    }

    // Läs om hyllstatus från servern
    try {
      const res = await api.get<{ shelf: ShelfItem[] }>(`/users/${userId}`)
      const item = res.data.shelf.find((x) => x.bookId === book.id)
      setUserShelf(item?.status ?? '')
    } catch {
      // ignore
    }
  }

  // 4) Sätt användarens betyg och läs tillbaka både avg & userRating
  const handleRate = async (star: number) => {
    if (!book?.id) return
    const userId = localStorage.getItem('userId')
    if (!userId) {
      alert('Logga in för att betygsätta')
      return
    }
    try {
      // POST /books/{id}/rate ger tillbaka hela Book med userRating
      const res = await api.post<Book>(`/books/${book.id}/rate`, {
        bookId: book.id,
        rating: star,
      })
      // uppdatera både global och personlig rating
      setBook(res.data)
      setUserRating(res.data.userRating ?? star)
    } catch (err: unknown) {
      console.error('Rating‑error:', err)
      alert('Fel vid uppdatering av betyg')
    }
  }

  if (loading) return <p className="p-8">Laddar…</p>
  if (error) return <p className="p-8 text-red-600">{error}</p>
  if (!book) return <p className="p-8">Bok finns ej</p>

  return (
    <div className="p-8 max-w-2xl mx-auto space-y-6">
      <h1 className="text-3xl font-bold">{book.name}</h1>
      <img src={book.coverUrl} alt={book.name} className="w-56 rounded shadow" />

      <p><strong>Genre:</strong> {book.genre}</p>
      <p><strong>Beskrivning:</strong> {book.description}</p>

      {/* Globala betyg */}
      <div>
        <strong>Genomsnittligt betyg:</strong> {book.averageRating.toFixed(2)}
      </div>

      {/* Ditt betyg */}
      <div className="space-y-2">
        <p className="font-semibold">Ditt betyg:</p>
        <div className="flex gap-1">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              disabled={!localStorage.getItem('token')}
              onClick={() => handleRate(star)}
              className={star <= userRating ? 'text-yellow-500' : 'text-gray-400'}
            >
              ★
            </button>
          ))}
        </div>
      </div>

      {/* Din hyllstatus */}
      <div className="space-y-2">
        <p className="font-semibold">Din status:</p>
        <div className="flex gap-2">
          {(['wantToRead', 'currentlyReading', 'haveRead'] as const).map((st) => (
            <button
              key={st}
              disabled={!localStorage.getItem('token')}
              onClick={() => handleShelf(st)}
              className={`px-3 py-1 rounded ${
                userShelf === st ? 'bg-yellow-300' : 'bg-gray-200'
              }`}
            >
              {st === 'wantToRead'
                ? 'Vill läsa'
                : st === 'currentlyReading'
                ? 'Läser'
                : 'Läst'}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
