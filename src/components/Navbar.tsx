import { Link, useLocation } from 'react-router-dom'

export default function Navbar() {
  const location = useLocation()

  return (
    <nav className="navbar">
      <Link
        to="/"
        className={location.pathname === '/' ? 'active' : ''}
      >
        Home (Schedule)
      </Link>
      <Link
        to="/set-schedule"
        className={location.pathname === '/set-schedule' ? 'active' : ''}
      >
        Set Schedule
      </Link>
    </nav>
  )
}