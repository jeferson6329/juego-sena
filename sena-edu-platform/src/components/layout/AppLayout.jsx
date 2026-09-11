import { useState } from 'react'
import { Outlet } from 'react-router-dom'
import Navbar from './Navbar'
import Sidebar from './Sidebar'

export default function AppLayout() {
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <div className="min-h-screen bg-gray-950">
      <Navbar onMenuToggle={() => setMenuOpen(v => !v)} menuOpen={menuOpen} />
      <Sidebar open={menuOpen} onClose={() => setMenuOpen(false)} />

      {/* Main content pushed right of sidebar on lg+ */}
      <main className="lg:pl-64 pt-14 min-h-screen">
        <div className="p-4 sm:p-6 max-w-5xl mx-auto animate-fade-in">
          <Outlet />
        </div>
      </main>
    </div>
  )
}
