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
    <nav className="bg-white dark:bg-gray-800 shadow-md">
      <div className="container mx-auto flex items-center justify-between p-4">
        <div className="flex space-x-6">
          <Link to="/" className="text-lg font-semibold hover:text-primary">Home</Link>
          {username && <Link to="/my-books" className="text-lg font-semibold hover:text-primary">My Books</Link>}
        </div>
        <div className="flex items-center space-x-4">
          {username ? (
            <>
              <span className="font-medium">Hej, {username}</span>
              <button
                onClick={handleLogout}
                className="px-3 py-1 bg-red-500 hover:bg-red-600 text-white rounded"
              >
                Logga ut
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="hover:text-primary">Logga in</Link>
              <Link to="/register" className="hover:text-primary">Registrera</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  )
}
