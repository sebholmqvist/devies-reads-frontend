import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useState, useEffect } from 'react'

export default function NavBar() {
  const [username, setUsername] = useState<string | null>(null)
  const navigate = useNavigate()
  const location = useLocation()

  useEffect(() => {
    // Läs direkt från localStorage
    const name = localStorage.getItem('username')
    setUsername(name)
  }, [location])

  const handleLogout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('userId')
    localStorage.removeItem('username')
    navigate('/login')
  }

  return (
    <nav className="bg-gray-800 text-white p-4 flex justify-between items-center">
      <div className="flex space-x-4">
        <Link to="/" className="hover:underline">Home</Link>
        {username && <Link to="/my-books" className="hover:underline">My Books</Link>}
      </div>
      <div className="flex space-x-4 items-center">
        {username ? (
          <>
            <span>Hej, {username}</span>
            <button
              onClick={handleLogout}
              className="bg-red-600 hover:bg-red-700 px-2 py-1 rounded"
            >
              Logga ut
            </button>
          </>
        ) : (
          <>
            <Link to="/login" className="hover:underline">Logga in</Link>
            <Link to="/register" className="hover:underline">Registrera</Link>
          </>
        )}
      </div>
    </nav>
  )
}
