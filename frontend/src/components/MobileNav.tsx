import { Link, useLocation } from "react-router-dom"
import { Home, LayoutGrid, User, BookOpen, MessageSquare } from "lucide-react"

interface MobileNavProps {
  isLoggedIn?: boolean
  onToggleLogin?: () => void
}

export function MobileNav({ isLoggedIn, onToggleLogin }: MobileNavProps) {
  const location = useLocation()
  
  const navItems = [
    { id: 'landing', label: 'Beranda', icon: Home, path: '/' },
    { id: 'catalog', label: 'Katalog', icon: LayoutGrid, path: '/catalog' },
    { id: 'profile', label: 'Profile', icon: User, special: true },
    { id: 'howtoborrow', label: 'Pinjam', icon: BookOpen, path: '/howtoborrow' },
    { id: 'contact', label: 'Kontak', icon: MessageSquare, path: '/contact' },
  ]

  return (
    <div className="md:hidden fixed bottom-6 left-6 right-6 z-50">
      <nav className="bg-white/80 dark:bg-gray-950/80 backdrop-blur-xl border border-gray-100 dark:border-gray-800 rounded-3xl shadow-2xl px-4 py-3 flex items-center justify-between relative overflow-visible">
        {navItems.map((item) => {
          const Icon = item.icon
          const isActive = item.path === location.pathname || (item.special && location.pathname === '/profile')

          if (item.special) {
            return (
              <button
                key={item.id}
                onClick={onToggleLogin}
                className="relative -top-8 flex flex-col items-center group"
              >
                <div className={`w-14 h-14 rounded-full flex items-center justify-center shadow-lg transition-all duration-500 scale-110 ${isLoggedIn ? 'bg-blue-600 shadow-blue-500/20' : 'bg-black dark:bg-white shadow-black/20 dark:shadow-white/20'} group-hover:scale-125`}>
                  <Icon className={`h-6 w-6 ${isLoggedIn ? 'text-white' : 'text-white dark:text-black'}`} />
                </div>
                <span className={`mt-1 text-[10px] font-black uppercase tracking-widest ${isActive ? 'text-blue-600 dark:text-blue-400' : 'text-gray-400'}`}>
                  {isLoggedIn ? 'Saya' : 'Profil'}
                </span>
              </button>
            )
          }

          return (
            <Link
              key={item.id}
              to={item.path!}
              className="flex flex-col items-center gap-1 min-w-[50px] group transition-all"
            >
              <div className={`transition-all duration-300 ${isActive ? 'scale-110' : 'group-hover:scale-110 opacity-70'}`}>
                <Icon className={`h-5 w-5 ${isActive ? 'text-blue-600 dark:text-blue-400' : 'text-gray-400'}`} />
              </div>
              <span className={`text-[9px] font-black uppercase tracking-wider transition-colors ${isActive ? 'text-blue-600 dark:text-blue-400' : 'text-gray-400'}`}>
                {item.label}
              </span>
              {isActive && (
                <div className="absolute top-0 h-1 w-8 bg-blue-600 dark:bg-blue-400 rounded-full blur-[2px] opacity-20" />
              )}
            </Link>
          )
        })}
      </nav>
    </div>
  )
}
