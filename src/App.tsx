// src/App.tsx
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import NavBar from './components/NavBar'
import BookList from './pages/BookList'        // Din boklista
import BookPage from './pages/BookPage'
import MyBooksPage from './pages/MyBooksPage'
import Login from './pages/Login'
import Register from './pages/Register'

export default function App() {
  return (
    <BrowserRouter>
      <NavBar />
      <main className="container mx-auto p-6">
        <Routes>
          <Route path="/" element={<BookList />} />
          <Route path="/books/:id" element={<BookPage />} />
          <Route path="/my-books" element={<MyBooksPage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
        </Routes>
      </main>
    </BrowserRouter>
  )
}
