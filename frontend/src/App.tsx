import { useState, useEffect } from 'react'
import { Routes, Route, Navigate, useNavigate, useLocation } from 'react-router-dom'
import { Toaster, toast } from 'sonner'
import { LandingPage } from './pages/LandingPage'
import { CatalogPage } from './pages/CatalogPage'
import { HowToBorrow } from './pages/HowToBorrow'
import { Contact } from './pages/Contact'
import { BookDetails } from './pages/BookDetails'
import { ProfilePage } from './pages/ProfilePage'
import { LoginPage } from './pages/LoginPage'
import { RegisterPage } from './pages/RegisterPage'
import { AdminLayout } from './components/admin/AdminLayout'
import { AdminDashboard } from './pages/admin/AdminDashboard'
import { AdminBuku } from './pages/admin/AdminBuku'
import { AdminCategory } from './pages/admin/AdminCategory'
import { AdminBukuFormPage } from './pages/admin/AdminBukuFormPage'
import { AdminUser } from './pages/admin/AdminUser'
import { AdminPinjaman } from './pages/admin/AdminPinjaman'
import { AdminProfile } from './pages/admin/AdminProfile'
import { ProtectedRoute } from './components/ProtectedRoute'
import { Navbar } from './components/Navbar'
import { MobileNav } from './components/MobileNav'
import { ThemeProvider } from './components/ThemeProvider'
import { ScrollToTop } from './components/ScrollToTop'
import { api, getAuthToken, removeAuthToken } from './lib/api'
import { ModalConfirm } from './components/ui/ModalConfirm'
import './index.css'

export default function App() {
  const navigate = useNavigate()
  const location = useLocation()
  const [isLoggedIn, setIsLoggedIn] = useState(!!getAuthToken())
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false)

  useEffect(() => {
    checkAuth()
  }, [])

  const checkAuth = async () => {
    const token = getAuthToken()
    if (!token) {
      setLoading(false)
      return
    }

    try {
      const res = await api.getMe()
      setUser(res.data.user) // Fix: should be res.data.user
      setIsLoggedIn(true)
    } catch (error) {
      removeAuthToken()
      setIsLoggedIn(false)
      setUser(null)
    } finally {
      setLoading(false)
    }
  }

  const handleLoginSuccess = (userData: any) => {
    setUser(userData)
    setIsLoggedIn(true)
    if (userData.role === 'ADMIN') {
      navigate('/admin')
    } else {
      navigate('/')
    }
  }

  const handleLogout = () => {
    setShowLogoutConfirm(true)
  }

  const confirmLogout = () => {
    removeAuthToken()
    setIsLoggedIn(false)
    setUser(null)
    setShowLogoutConfirm(false)
    navigate('/')
    toast.success("Berhasil keluar dari akun")
  }

  const handleNavigate = (path: string) => {
    // Normalisasi path jika menggunakan kunci statis lama
    if (path === 'landing') navigate('/')
    else if (path === 'catalog') navigate('/catalog')
    else if (path === 'howtoborrow') navigate('/howtoborrow')
    else if (path === 'contact') navigate('/contact')
    else if (path === 'profile') navigate('/profile')
    else navigate(path.startsWith('/') ? path : `/${path}`)
  }

  if (loading) return null

  const isAdminPath = location.pathname.startsWith('/admin')
  const isAuthPath = location.pathname === '/login' || location.pathname === '/register'

  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
      <ScrollToTop />
      <div className="flex flex-col min-h-screen">
        {!isAdminPath && !isAuthPath && (
          <Navbar 
            isLoggedIn={isLoggedIn}
            user={user}
            onToggleLogin={() => navigate(isLoggedIn ? '/profile' : '/login')}
            onOpenAdmin={() => navigate('/admin')}
          />
        )}
        
        <main className="flex-1 pb-24 md:pb-0">
          <Routes>
            <Route path="/" element={<LandingPage onNavigate={handleNavigate} onOpenBook={(slug) => handleNavigate(`/book/${slug}`)} onOpenGenre={(slug) => handleNavigate(`/catalog/${slug}`)} />} />
            <Route path="/catalog/:categorySlug?" element={<CatalogPage onNavigate={handleNavigate} onOpenBook={(slug) => handleNavigate(`/book/${slug}`)} />} />
            <Route path="/howtoborrow" element={<HowToBorrow onNavigate={handleNavigate} />} />
            <Route path="/contact" element={<Contact onNavigate={handleNavigate} />} />
            <Route path="/book/:slug" element={<BookDetails onBack={() => navigate(-1)} onNavigate={handleNavigate} />} />
            <Route path="/profile" element={isLoggedIn ? <ProfilePage user={user} onLogout={handleLogout} /> : <Navigate to="/login" />} />
            <Route path="/login" element={<LoginPage onSuccess={handleLoginSuccess} onSwitchToRegister={() => navigate('/register')} onBack={() => navigate('/')} />} />
            <Route path="/register" element={<RegisterPage onSuccess={() => navigate('/login')} onSwitchToLogin={() => navigate('/login')} onBack={() => navigate('/login')} />} />
            
            {/* Admin Routes */}
            <Route 
              path="/admin" 
              element={
                <ProtectedRoute isLoggedIn={isLoggedIn} user={user} loading={loading} requiredRole="ADMIN">
                  <AdminLayout user={user} onExit={handleLogout} />
                </ProtectedRoute>
              }
            >
              <Route index element={<AdminDashboard />} />
              <Route path="buku" element={<AdminBuku onNavigate={(_, id) => navigate(id ? `/admin/buku/edit/${id}` : `/admin/buku/add`)} />} />
              <Route path="buku/add" element={<AdminBukuFormPage onBack={() => navigate('/admin/buku')} />} />
              <Route path="buku/edit/:id" element={<AdminBukuFormPage onBack={() => navigate('/admin/buku')} />} />
              <Route path="kategori" element={<AdminCategory />} />
              <Route path="user" element={<AdminUser />} />
              <Route path="pinjaman" element={<AdminPinjaman />} />
              <Route path="profile" element={<AdminProfile user={user} />} />
            </Route>
          </Routes>
        </main>

        {!isAdminPath && !isAuthPath && (
          <MobileNav 
            isLoggedIn={isLoggedIn}
            onToggleLogin={() => navigate(isLoggedIn ? '/profile' : '/login')} 
          />
        )}
        <Toaster position="top-center" richColors />
        <ModalConfirm 
          isOpen={showLogoutConfirm}
          onClose={() => setShowLogoutConfirm(false)}
          onConfirm={confirmLogout}
          title="Konfirmasi Keluar"
          description="Apakah Anda yakin ingin keluar dari akun Digital Atelier Anda?"
          confirmText="Ya, Keluar"
          cancelText="Batal"
          type="warning"
        />
      </div>
    </ThemeProvider>
  )
}
