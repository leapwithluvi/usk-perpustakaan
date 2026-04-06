import { Link, NavLink } from "react-router-dom"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { User, LogIn } from "lucide-react"
import { ModeToggle } from "./ModeToggle"

interface NavbarProps {
  isLoggedIn?: boolean
  user?: any
  onToggleLogin?: () => void
  onOpenAdmin?: () => void
}

export function Navbar({ isLoggedIn, user, onToggleLogin, onOpenAdmin }: NavbarProps) {
  const isAdmin = user?.role === "ADMIN"
  const navItems = [
    { label: "Beranda", path: "/" },
    { label: "Katalog", path: "/catalog" },
    { label: "Cara Pinjam", path: "/howtoborrow" },
    { label: "Kontak", path: "/contact" },
  ]

  return (
    <nav className="flex items-center justify-between px-6 py-4 bg-white dark:bg-gray-950 border-b border-gray-100 dark:border-gray-800 sticky top-0 z-50 transition-colors">
      <div className="flex items-center gap-8">
        <Link to="/" className="text-xl font-bold tracking-tighter text-black dark:text-white cursor-pointer hover:opacity-80 transition-opacity">
          DIGITAL ATELIER
        </Link>
        <div className="hidden md:flex items-center gap-6">
          {navItems.map((item) => (
            <NavLink 
              key={item.path}
              to={item.path}
              className={({ isActive }) => 
                `text-xs font-bold uppercase tracking-widest transition-colors ${
                  isActive ? 'text-black dark:text-white' : 'text-gray-400 hover:text-black dark:hover:text-white'
                }`
              }
            >
              {item.label}
            </NavLink>
          ))}
        </div>
      </div>
      
      <div className="flex items-center gap-4">
        <ModeToggle />
        {isAdmin && onOpenAdmin && (
          <button
            onClick={onOpenAdmin}
            className="hidden md:flex text-xs font-bold uppercase tracking-widest text-gray-400 hover:text-black dark:hover:text-white transition-colors"
          >
            Admin
          </button>
        )}
        
        {isLoggedIn ? (
          <Avatar 
            onClick={onToggleLogin}
            className="h-9 w-9 border border-gray-200 dark:border-gray-800 cursor-pointer hover:opacity-80 transition-opacity"
          >
            <AvatarImage src="" />
            <AvatarFallback className="bg-gray-50 dark:bg-gray-900">
              <User className="h-5 w-5 text-gray-600 dark:text-gray-400" />
            </AvatarFallback>
          </Avatar>
        ) : (
          <Button 
            onClick={onToggleLogin}
            variant="outline" 
            className="rounded-md px-6 border-gray-300 dark:border-gray-700 font-bold uppercase tracking-widest text-[10px] hover:bg-gray-50 dark:hover:bg-gray-900 transition-all"
          >
            <LogIn className="h-3 w-3 mr-2" />
            Sign In
          </Button>
        )}
      </div>
    </nav>
  )
}
