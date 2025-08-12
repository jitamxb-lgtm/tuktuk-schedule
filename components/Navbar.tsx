'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

export default function Navbar() {
  const pathname = usePathname()

  return (
    <nav className="bg-slate-800 py-4 px-6 flex justify-center shadow-md">
      <div className="flex gap-4">
        <Link
          href="/"
          className={`text-white text-decoration-none py-2.5 px-5 mx-2.5 rounded-md transition-colors duration-300 font-medium ${
            pathname === '/' ? 'bg-gray-600' : 'hover:bg-gray-600'
          }`}
        >
          Home (Schedule)
        </Link>
        <Link
          href="/set-schedule"
          className={`text-white text-decoration-none py-2.5 px-5 mx-2.5 rounded-md transition-colors duration-300 font-medium ${
            pathname === '/set-schedule' ? 'bg-gray-600' : 'hover:bg-gray-600'
          }`}
        >
          Set Schedule
        </Link>
      </div>
    </nav>
  )
}