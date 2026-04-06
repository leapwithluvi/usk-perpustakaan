import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Plus, Search, Pencil, Trash2, ChevronLeft, ChevronRight } from "lucide-react"
import { api, IMAGE_BASE_URL } from "@/lib/api"
import { toast } from "sonner"
import { ModalConfirm } from "@/components/ui/ModalConfirm"

interface AdminBukuProps {
  onNavigate: (page: string, id?: string | number) => void
}

export function AdminBuku({ onNavigate }: AdminBukuProps) {
  const [books, setBooks] = useState<any[]>([])
  const [meta, setMeta] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState("")
  const [page, setPage] = useState(1)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const [bookToDelete, setBookToDelete] = useState<string | number | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)

  useEffect(() => {
    fetchBooks()
  }, [page])

  const fetchBooks = async () => {
    setLoading(true)
    try {
      const res = await api.getBooks({ page, search, limit: 10 })
      setBooks(res.data.data)
      setMeta(res.data.meta)
    } catch (error) {
      console.error("Gagal mengambil daftar buku", error)
    } finally {
      setLoading(false)
    }
  }

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    setPage(1)
    fetchBooks()
  }

  const handleDelete = async () => {
    if (!bookToDelete) return
    setIsDeleting(true)
    try {
      await api.deleteBook(bookToDelete)
      toast.success("Buku berhasil dihapus dari koleksi")
      setShowDeleteConfirm(false)
      setBookToDelete(null)
      fetchBooks()
    } catch (error: any) {
      toast.error(error.message || "Gagal menghapus buku")
    } finally {
      setIsDeleting(false)
    }
  }

  const openDeleteConfirm = (id: string | number) => {
    setBookToDelete(id)
    setShowDeleteConfirm(true)
  }

  return (
    <div className="flex flex-col gap-8 p-6 md:p-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">Manajemen Buku</h1>
          <p className="text-sm text-muted-foreground mt-1">Kelola seluruh koleksi buku perpustakaan secara real-time.</p>
        </div>
        <Button onClick={() => onNavigate("buku-add")} className="flex items-center gap-2 font-bold uppercase tracking-widest text-[10px] h-9 px-5">
          <Plus className="h-4 w-4" /> Tambah Buku
        </Button>
      </div>

      <Card className="border border-border/60 shadow-sm overflow-hidden">
        <CardHeader className="pb-3 border-b border-border/40 bg-muted/5">
          <form onSubmit={handleSearch} className="flex items-center justify-between gap-3">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input 
                placeholder="Cari judul, penulis, atau ISBN..." 
                className="pl-9 text-sm h-10 bg-background" 
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <Button type="submit" variant="secondary" size="sm" className="font-bold uppercase tracking-widest text-[10px]">Filter</Button>
          </form>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border/40 bg-muted/20">
                  <th className="text-left text-[10px] font-black uppercase tracking-widest text-muted-foreground px-6 py-4">Informasi Buku</th>
                  <th className="text-left text-[10px] font-black uppercase tracking-widest text-muted-foreground px-6 py-4 whitespace-nowrap">Kategori</th>
                  <th className="text-left text-[10px] font-black uppercase tracking-widest text-muted-foreground px-6 py-4">Stok</th>
                  <th className="text-left text-[10px] font-black uppercase tracking-widest text-muted-foreground px-6 py-4">Status</th>
                  <th className="text-right text-[10px] font-black uppercase tracking-widest text-muted-foreground px-6 py-4">Aksi</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  Array.from({ length: 5 }).map((_, i) => (
                    <tr key={i} className="animate-pulse">
                      <td colSpan={5} className="py-8 px-6">
                        <div className="h-10 bg-muted rounded w-full" />
                      </td>
                    </tr>
                  ))
                ) : books.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="py-20 text-center text-muted-foreground font-medium italic">Tidak ada buku ditemukan.</td>
                  </tr>
                ) : books.map((book, i) => (
                  <tr key={book.id} className={`${i !== books.length - 1 ? "border-b border-border/30" : ""} hover:bg-muted/30 transition-colors`}>
                    <td className="px-6 py-4">
                       <div className="flex items-center gap-4">
                         <div className="h-14 w-10 rounded shadow-sm border overflow-hidden shrink-0 bg-muted">
                           <img 
                            src={book.coverImage && book.coverImage.startsWith("/") 
                              ? `${IMAGE_BASE_URL}${book.coverImage}` 
                              : (book.coverImage || "https://placehold.co/400x600?text=No+Cover")
                            } 
                            alt="" 
                            className="h-full w-full object-cover" 
                           />
                         </div>
                         <div className="flex flex-col min-w-0">
                           <span className="font-bold text-foreground text-sm truncate max-w-[200px] md:max-w-[300px]">{book.title}</span>
                           <span className="text-xs text-muted-foreground truncate">{book.author} — <span className="font-mono">{book.isbn}</span></span>
                         </div>
                       </div>
                    </td>
                    <td className="px-6 py-4">
                      <Badge variant="secondary" className="text-[9px] font-black uppercase tracking-[0.1em] px-2 py-0.5 rounded">
                        {book.category?.name || "Uncategorized"}
                      </Badge>
                    </td>
                    <td className="px-6 py-4 font-mono text-xs font-bold text-foreground">
                      {book.stock} <span className="text-muted-foreground/50 mx-1">/</span> {book.maxStock || book.stock}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-[9px] font-black uppercase tracking-widest border ${
                        book.stock > 0
                          ? "bg-emerald-100/40 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400 border-emerald-200/50"
                          : "bg-red-100/40 text-red-700 dark:bg-red-900/30 dark:text-red-400 border-red-200/50"
                      }`}>
                        {book.stock > 0 ? "Tersedia" : "Habis"}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Button 
                          variant="outline" 
                          size="icon" 
                          onClick={() => onNavigate("buku-edit", book.id)}
                          className="h-8 w-8 rounded-lg border-border/40 bg-white text-black hover:bg-zinc-100 shadow-sm transition-all"
                        >
                          <Pencil className="h-3.5 w-3.5" />
                        </Button>
                        <Button 
                          variant="outline" 
                          size="icon"
                          onClick={() => openDeleteConfirm(book.id)}
                          className="h-8 w-8 rounded-lg border-border/40 bg-white text-black hover:bg-red-50 hover:text-red-600 shadow-sm transition-all"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {meta && meta.totalPages > 1 && (
            <div className="px-6 py-4 border-t border-border/40 flex items-center justify-between bg-muted/5">
              <span className="text-xs text-muted-foreground font-medium uppercase tracking-widest">Halaman {meta.page} dari {meta.totalPages}</span>
              <div className="flex items-center gap-2">
                <Button 
                  variant="outline" 
                  size="sm" 
                  disabled={page === 1 || loading}
                  onClick={() => setPage(page - 1)}
                  className="h-8 w-8 p-0 rounded-lg"
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <Button 
                  variant="outline" 
                  size="sm" 
                  disabled={page === meta.totalPages || loading}
                  onClick={() => setPage(page + 1)}
                  className="h-8 w-8 p-0 rounded-lg"
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      <ModalConfirm
        isOpen={showDeleteConfirm}
        onClose={() => setShowDeleteConfirm(false)}
        onConfirm={handleDelete}
        isLoading={isDeleting}
        title="Hapus Buku"
        description="Apakah Anda yakin ingin menghapus buku ini? Tindakan ini tidak dapat dibatalkan dan data buku akan hilang permanen dari archive."
        confirmText="Hapus"
      />
    </div>
  )
}
