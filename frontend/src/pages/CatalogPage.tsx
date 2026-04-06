import { useState, useEffect } from "react"
import { useSearchParams, useParams } from "react-router-dom"
import { Footer } from "@/components/Footer"
import { Filters } from "@/components/Filters"
import { Pagination } from "@/components/Pagination"
import { BookCard } from "@/components/BookCard"
import { ChevronRight, Home, Loader2 } from "lucide-react"
import { api } from "@/lib/api"

export function CatalogPage({ 
  onNavigate,
  onOpenBook
}: { 
  onNavigate?: (path: string) => void,
  onOpenBook?: (slug: string) => void
}) {
  const [searchParams, setSearchParams] = useSearchParams()
  const { categorySlug } = useParams()
  
  const [books, setBooks] = useState<any[]>([])
  const [categories, setCategories] = useState<any[]>([])
  const [meta, setMeta] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const [initialLoading, setInitialLoading] = useState(true)

  const searchQuery = searchParams.get("search") || ""
  const activeStatus = searchParams.get("status") || "all"
  const activeLimit = parseInt(searchParams.get("limit") || "12")
  const currentPage = parseInt(searchParams.get("page") || "1")

  // For UI highlight, if categorySlug exists, use it, otherwise use 'all'
  const activeCategory = categorySlug || "all"

  // Ambil daftar buku dan kategori
  useEffect(() => {
    fetchCategories()
  }, [])

  useEffect(() => {
    fetchBooks()
  }, [searchParams, categories, categorySlug])

  const fetchCategories = async () => {
    try {
      const res = await api.getCategories()
      setCategories(res.data)
    } catch (error) {
      console.error("Gagal mengambil kategori", error)
    }
  }

  const fetchBooks = async () => {
    setLoading(true)
    try {
      const res = await api.getBooks({
        page: currentPage,
        limit: activeLimit,
        search: searchQuery,
        categorySlug: categorySlug,
        availability: activeStatus === "all" ? undefined : activeStatus as any
      })
      setBooks(res.data.data)
      setMeta(res.data.meta)
    } catch (error) {
      console.error("Gagal mengambil katalog buku", error)
    } finally {
      setLoading(false)
      setInitialLoading(false)
    }
  }

  // Fungsi untuk memperbarui URL search params saat filter berubah
  const updateFilters = (newParams: Record<string, string>) => {
    if (newParams.genre) {
      const slug = newParams.genre === "all" ? "" : `/${newParams.genre}`
      onNavigate?.(`catalog${slug}`)
      return
    }

    const nextParams = new URLSearchParams(searchParams)
    Object.entries(newParams).forEach(([key, value]) => {
      if (value && value !== "all") {
        nextParams.set(key, value)
      } else {
        nextParams.delete(key)
      }
    })
    // Reset ke halaman 1 jika filter berubah
    if (!newParams.page && !newParams.limit) nextParams.delete("page") 
    setSearchParams(nextParams)
  }

  return (
    <div className="min-h-screen bg-white dark:bg-gray-950 font-sans text-gray-900 dark:text-gray-100 selection:bg-black selection:text-white transition-colors">
      
      <main className="max-w-7xl mx-auto px-6 py-12 space-y-12">
        {/* Navigasi Breadcrumbs */}
        <nav className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-gray-400 dark:text-gray-500">
           <Home 
            className="h-3.5 w-3.5 cursor-pointer hover:text-black dark:hover:text-white transition-colors" 
            onClick={() => onNavigate?.('')}
           />
           <ChevronRight className="h-3 w-3" />
           <span 
            className="hover:text-black dark:hover:text-white cursor-pointer transition-colors"
            onClick={() => onNavigate?.('')}
           >
            Beranda
           </span>
           <ChevronRight className="h-3 w-3" />
           <span className="text-black dark:text-white">Katalog Buku</span>
        </nav>

        {/* Bagian Header */}
        <div className="space-y-2">
          <h1 className="text-5xl font-black text-black dark:text-white tracking-tighter uppercase leading-none">
            Arsip Digital
          </h1>
          <p className="text-sm text-gray-400 dark:text-gray-500 font-bold uppercase tracking-[0.2em]">Jelajahi koleksi pustaka kami</p>
        </div>

        {/* Komponen Filter */}
        <section className="bg-gray-50/50 dark:bg-gray-900/50 p-6 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm transition-all hover:shadow-md">
            <Filters 
              searchQuery={searchQuery}
              setSearchQuery={(val) => updateFilters({ search: val })}
              selectedCategory={activeCategory}
              setSelectedCategory={(val) => updateFilters({ genre: val })}
              status={activeStatus}
              setStatus={(val) => updateFilters({ status: val })}
              limit={activeLimit}
              setLimit={(val) => updateFilters({ limit: val })}
            />
        </section>

        {/* Daftar Buku */}
        <section className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-16 py-8 min-h-[400px] transition-opacity duration-300 relative ${loading ? 'opacity-50 pointer-events-none' : 'opacity-100'}`}>
          {/* Overlay Loader subtle saat update data */}
          {loading && !initialLoading && (
            <div className="absolute inset-0 z-50 flex items-center justify-center bg-white/20 dark:bg-black/20 backdrop-blur-[2px] rounded-2xl">
               <Loader2 className="h-8 w-8 animate-spin text-black dark:text-white" />
            </div>
          )}

          {initialLoading ? (
            <div className="col-span-full flex flex-col items-center justify-center py-20 space-y-4">
              <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
              <p className="text-xs font-black uppercase tracking-widest text-gray-400">Membuka Brangkas Arsip...</p>
            </div>
          ) : books.length > 0 ? (
            books.map((book) => (
              <BookCard 
                  key={book.id} 
                  title={book.title} 
                  author={book.author} 
                  status={book.stock > 0 ? "tersedia" : "dipinjam"} 
                  coverImage={book.coverImage}
                  onOpenDetails={() => onOpenBook?.(book.slug)}
              />
            ))
          ) : (
            <div className="col-span-full py-20 text-center space-y-4">
              <p className="text-xl font-bold text-gray-500">Koleksi tidak ditemukan</p>
              <button 
                onClick={() => setSearchParams({})}
                className="text-xs font-black uppercase tracking-widest underline underline-offset-4"
              >
                Reset Filter
              </button>
            </div>
          )}
        </section>

        {/* Bagian Paginasi */}
        <section className="border-t border-gray-100 dark:border-white/5 mt-12 pb-20">
            <Pagination 
              currentPage={meta?.page || 1}
              totalPages={meta?.totalPages || 0}
              onPageChange={(page) => updateFilters({ page: page.toString() })}
            />
        </section>
      </main>

      <Footer onNavigate={onNavigate} />
    </div>
  )
}
