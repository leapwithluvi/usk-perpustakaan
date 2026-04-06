import { useState, useEffect } from "react"
import { useParams } from "react-router-dom"
import { 
  ArrowLeft, 
  User, 
  Share2, 
  Hash,
  CalendarDays,
  BookOpen,
  Layers,
  Loader2
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ModalConfirm } from "@/components/ui/ModalConfirm"
import { Footer } from "../components/Footer"
import { api, IMAGE_BASE_URL } from "@/lib/api"
import { toast } from "sonner"

interface BookDetailsProps {
  onBack: () => void
  onNavigate: (path: string) => void
}

export function BookDetails({ onBack, onNavigate }: BookDetailsProps) {
  const { slug } = useParams<{ slug: string }>()
  const [book, setBook] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [borrowing, setBorrowing] = useState(false)
  const [showBorrowConfirm, setShowBorrowConfirm] = useState(false)
  const [isLoggedIn] = useState(!!localStorage.getItem("token"))

  useEffect(() => {
    if (slug) {
      fetchBook(slug)
    }
  }, [slug])

  const fetchBook = async (bookId: string) => {
    try {
      const res = await api.getBookBySlug(bookId)
      if (res && res.data) {
        setBook(res.data)
      } else {
        setBook(null)
      }
    } catch (error) {
      console.error("Gagal mengambil detail buku:", error)
      setBook(null)
    } finally {
      setLoading(false)
    }
  }

  const handleBorrowClick = () => {
    if (!isLoggedIn) {
      toast.error("Silakan login terlebih dahulu untuk meminjam buku.")
      onNavigate('profile') 
      return
    }

    if (book.stock <= 0) {
      toast.error("Maaf, stok buku ini sedang habis.")
      return
    }

    setShowBorrowConfirm(true)
  }

  const confirmBorrow = async () => {
    setShowBorrowConfirm(false)
    setBorrowing(true)
    try {
      // Calculate dueDate (7 days from now)
      const dueDate = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString()
      
      await api.createBorrowing({
        bookId: book.id,
        dueDate
      })

      toast.success("Pengajuan peminjaman berhasil dikirim! Silakan cek status di profil Anda.")
      // Refresh book data to show updated stock (if backend updates it immediately)
      fetchBook(book.slug)
    } catch (error: any) {
      toast.error(error.message || "Gagal mengajukan peminjaman")
    } finally {
      setBorrowing(false)
    }
  }

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-white dark:bg-gray-950">
      <div className="w-12 h-12 border-4 border-black dark:border-white border-t-transparent rounded-full animate-spin" />
    </div>
  )

  if (!book) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-white dark:bg-gray-950 p-6 space-y-6">
        <div className="text-center space-y-2">
          <h2 className="text-4xl font-black text-black dark:text-white uppercase tracking-tighter">Buku tidak ditemukan</h2>
          <p className="text-sm text-gray-400 font-bold uppercase tracking-widest">Slug: {slug}</p>
        </div>
        <Button onClick={onBack} variant="outline" className="rounded-2xl px-12 h-14 font-black uppercase tracking-widest text-xs">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Kembali ke Katalog
        </Button>
      </div>
    )
  }

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href)
    toast.success("Link berhasil disalin ke clipboard!")
  }

  return (
    <div className="min-h-screen bg-white dark:bg-gray-950 selection:bg-black selection:text-white transition-colors">
      <main className="max-w-7xl mx-auto px-6 py-12 lg:py-20">
        {/* Navigation */}
        <nav className="mb-12">
          <button 
            onClick={onBack}
            className="group flex items-center gap-2 text-xs font-black uppercase tracking-[0.2em] text-gray-400 dark:text-gray-600 hover:text-black dark:hover:text-white transition-all"
          >
            <ArrowLeft className="h-4 w-4 transform group-hover:-translate-x-1 transition-transform" />
            Kembali ke Katalog
          </button>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 lg:gap-24 items-start">
          {/* Left Column: Cover Image */}
          <div className="lg:col-span-5 relative group">
            <div className="relative aspect-[3/4] rounded-[2rem] overflow-hidden shadow-2xl transition-transform duration-700 group-hover:scale-[1.02] perspective-1000">
               {book.coverImage ? (
                 <img 
                   src={book.coverImage.startsWith("/") 
                     ? `${IMAGE_BASE_URL}${book.coverImage}` 
                     : book.coverImage
                   } 
                   alt={book.title}
                   className="w-full h-full object-cover"
                   onError={(e) => {
                     (e.target as HTMLImageElement).src = "https://placehold.co/400x600?text=No+Cover"
                   }}
                 />
               ) : (
                 <div className="w-full h-full bg-gray-100 dark:bg-gray-900 flex items-center justify-center p-12 text-center">
                    <span className="text-4xl font-black uppercase tracking-tighter opacity-10">{book.title}</span>
                 </div>
               )}
               
               {/* Atelier Overlay */}
               <div className="absolute inset-0 pointer-events-none opacity-[0.03] dark:opacity-[0.08] bg-[url('https://www.transparenttextures.com/patterns/natural-paper.png')]" />
               
               {/* Spine Detail */}
               <div className="absolute inset-y-0 left-0 w-8 bg-gradient-to-r from-black/20 to-transparent pointer-events-none" />
            </div>

            {/* Floating Stats */}
            <div className="absolute -bottom-6 -right-6 lg:-right-12 bg-white dark:bg-zinc-900 p-6 rounded-3xl shadow-xl border border-gray-100 dark:border-white/5 space-y-4 max-w-[200px] hidden md:block z-40">
               <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-blue-50 dark:bg-blue-950/30 flex items-center justify-center">
                     <BookOpen className="h-4 w-4 text-blue-500" />
                  </div>
                  <div>
                    <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 dark:text-gray-500">Halaman</p>
                    <p className="text-sm font-black text-black dark:text-white uppercase">{book.pageCount} Hal.</p>
                  </div>
               </div>
               <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-emerald-50 dark:bg-emerald-950/30 flex items-center justify-center">
                     <Layers className="h-4 w-4 text-emerald-500" />
                  </div>
                  <div>
                    <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 dark:text-gray-500">Stok</p>
                    <p className="text-sm font-black text-black dark:text-white uppercase">{book.stock} / {book.maxStock}</p>
                  </div>
               </div>
            </div>
          </div>

          {/* Right Column: Content */}
          <div className="lg:col-span-7 space-y-10">
            <div className="space-y-6">
              <div className="flex flex-wrap gap-3">
                <Badge className={`px-4 py-1 rounded-full text-[10px] font-black tracking-widest uppercase border transition-colors ${
                  book.stock > 0 
                    ? "bg-emerald-50 text-emerald-700 border-emerald-100 dark:bg-emerald-950/30 dark:text-emerald-400 dark:border-emerald-900" 
                    : "bg-red-50 text-red-700 border-red-100 dark:bg-red-950/30 dark:text-red-400 dark:border-red-900"
                }`}>
                   {book.stock > 0 ? "Tersedia" : "Dipinjam"}
                </Badge>
                <Badge variant="outline" className="px-4 py-1 rounded-full text-[10px] font-black tracking-widest uppercase border-gray-200 dark:border-gray-800 text-gray-500 dark:text-gray-400">
                   {book.category?.name || "Uncategorized"}
                </Badge>
              </div>

              <div className="space-y-4">
                <h1 className="text-5xl lg:text-7xl font-black text-black dark:text-white uppercase tracking-tighter leading-[0.85]">
                   {book.title}
                </h1>
                <div className="flex items-center gap-4 py-2">
                   <div className="w-10 h-10 rounded-full bg-gray-100 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 flex items-center justify-center relative overflow-hidden group/avatar">
                      <User className="h-5 w-5 text-gray-400 dark:text-gray-600" />
                      <div className="absolute inset-0 bg-black dark:bg-white scale-0 group-hover/avatar:scale-100 transition-transform duration-500 opacity-10" />
                   </div>
                   <div>
                     <p className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 dark:text-gray-600">Ditulis oleh</p>
                     <h3 className="text-lg font-black text-black dark:text-white uppercase tracking-tight">{book.author}</h3>
                   </div>
                </div>
              </div>
            </div>

            <div className="space-y-6 max-w-2xl">
              <div 
                className="text-gray-500 dark:text-gray-400 text-lg leading-relaxed font-medium quill-content"
                dangerouslySetInnerHTML={{ __html: book.description || "Mohon maaf, deskripsi untuk buku ini belum tersedia." }}
              />

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 py-10 border-y border-gray-100 dark:border-white/5">
                 <div className="flex items-center gap-5">
                    <div className="w-12 h-12 rounded-2xl bg-zinc-50 dark:bg-white/5 flex items-center justify-center border border-gray-100 dark:border-white/10 shrink-0">
                       <Hash className="h-5 w-5 text-gray-400 dark:text-gray-500" />
                    </div>
                    <div>
                      <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 dark:text-gray-500 mb-1">ISBN Buku</p>
                      <p className="text-sm font-black text-black dark:text-white uppercase tracking-tight">{book.isbn}</p>
                    </div>
                 </div>
                 <div className="flex items-center gap-5">
                    <div className="w-12 h-12 rounded-2xl bg-zinc-50 dark:bg-white/5 flex items-center justify-center border border-gray-100 dark:border-white/10 shrink-0">
                       <CalendarDays className="h-5 w-5 text-gray-400 dark:text-gray-500" />
                    </div>
                    <div>
                      <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 dark:text-gray-500 mb-1">Tahun Terbit</p>
                      <p className="text-sm font-black text-black dark:text-white uppercase tracking-tight">{book.year}</p>
                    </div>
                 </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 pt-4">
               <Button 
                onClick={handleBorrowClick}
                disabled={borrowing || book.stock <= 0}
                className="flex-1 lg:flex-none lg:px-16 h-16 sm:h-16 bg-black dark:bg-white text-white dark:text-black hover:bg-zinc-800 dark:hover:bg-zinc-200 rounded-2xl font-black uppercase tracking-[0.2em] text-xs transition-all shadow-2xl hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:grayscale"
               >
                  {borrowing ? <Loader2 className="h-5 w-5 animate-spin" /> : book.stock <= 0 ? "Stok Habis" : "Pinjam Buku"}
               </Button>
               <Button 
                onClick={handleShare}
                variant="outline" 
                size="icon" 
                className="w-full sm:w-16 h-16 rounded-2xl border-gray-200 dark:border-white/5 hover:bg-gray-50 dark:hover:bg-white/5 transition-all shrink-0"
               >
                  <Share2 className="h-5 w-5 text-gray-400 dark:text-gray-500 mr-2 sm:mr-0" />
                  <span className="sm:hidden font-black uppercase tracking-widest text-xs text-gray-400">Bagikan</span>
               </Button>
            </div>
          </div>
        </div>
      </main>
      <Footer onNavigate={onNavigate} />
      
      <ModalConfirm
        isOpen={showBorrowConfirm}
        onClose={() => setShowBorrowConfirm(false)}
        onConfirm={confirmBorrow}
        title="Konfirmasi Pinjam"
        description={`Apakah Anda yakin ingin meminjam buku "${book.title}"? Anda memiliki waktu 7 hari untuk mengembalikan buku ini setelah diambil.`}
        confirmText="Ya, Pinjam Buku"
        type="info"
        isLoading={borrowing}
      />
    </div>
  )
}
