import { useState, useEffect } from "react"
import { useParams } from "react-router-dom"
import ReactQuill from "react-quill-new"
import "react-quill-new/dist/quill.snow.css"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { toast } from "sonner"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Calendar } from "@/components/ui/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { format } from "date-fns"
import { CalendarIcon, Loader2, ArrowLeft, Save } from "lucide-react"
import { cn } from "@/lib/utils"
import { api, IMAGE_BASE_URL } from "@/lib/api"
import { Card, CardContent } from "@/components/ui/card"

interface AdminBukuFormPageProps {
  onBack: () => void
}

export function AdminBukuFormPage({ onBack }: AdminBukuFormPageProps) {
  const { id } = useParams<{ id: string }>()
  const [formData, setFormData] = useState<any>({
    title: "",
    author: "",
    description: "",
    isbn: "",
    publishedDate: new Date(),
    categoryId: "",
    stock: 1,
    maxStock: 1,
    pageCount: 0,
    year: new Date().getFullYear(),
    coverImage: "",
  })

  const [categories, setCategories] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [isUploading, setIsUploading] = useState(false)
  const [useUrl, setUseUrl] = useState(true)

  useEffect(() => {
    fetchCategories()
    if (id) {
      fetchBook(id)
    }
  }, [id])

  const fetchCategories = async () => {
    try {
      const res = await api.getCategories()
      setCategories(res.data)
    } catch (error) {
      console.error("Gagal mengambil kategori", error)
    }
  }

  const fetchBook = async (bookId: string) => {
    setLoading(true)
    try {
      const res = await api.getBookById(bookId)
      const book = res.data
      
      // Simpan ID kategori langsung untuk Select component
      const categoryId = book.categoryId || ""

      setFormData({
        title: book.title || "",
        author: book.author || "",
        description: book.description || "",
        isbn: book.isbn || "",
        publishedDate: book.publishedDate ? new Date(book.publishedDate) : new Date(),
        categoryId: categoryId,
        stock: book.stock || 0,
        maxStock: book.maxStock || book.stock || 0,
        pageCount: book.pageCount || 0,
        year: book.year || new Date().getFullYear(),
        coverImage: book.coverImage || "",
      })
      if (book.coverImage?.startsWith("http")) {
        setUseUrl(true)
      } else {
        setUseUrl(false)
      }
    } catch (error) {
      console.error("Gagal mengambil detail buku", error)
    } finally {
      setLoading(false)
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type } = e.target
    setFormData((prev: any) => ({
      ...prev,
      [name]: type === "number" ? parseInt(value) : value,
    }))
  }

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setIsUploading(true)
    try {
      const res = await api.uploadImage(file)
      setFormData((prev: any) => ({ ...prev, coverImage: res.data.url }))
    } catch (error) {
      toast.error("Gagal mengunggah gambar")
    } finally {
      setIsUploading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    
    const payload = {
      ...formData,
      categoryId: formData.categoryId,
      stock: parseInt(formData.stock),
      maxStock: parseInt(formData.maxStock || formData.stock),
      pageCount: parseInt(formData.pageCount || 0),
      year: parseInt(formData.year || new Date().getFullYear()),
    }

    try {
      if (id) {
        await api.updateBook(id, payload)
        toast.success("Data buku berhasil diperbarui")
      } else {
        await api.createBook(payload)
        toast.success("Buku baru berhasil ditambahkan ke koleksi")
      }
      onBack()
    } catch (error: any) {
      toast.error(error.message || "Gagal menyimpan buku. Periksa kembali input Anda.")
    } finally {
      setLoading(false)
    }
  }

  if (loading && id) {
    return (
      <div className="flex h-96 items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-6 p-6 md:p-8 max-w-5xl mx-auto">
      {/* Header Halaman */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button 
            type="button"
            onClick={onBack} 
            className="w-10 h-10 rounded-full border border-gray-200 dark:border-white/10 flex items-center justify-center hover:bg-gray-50 dark:hover:bg-white/5 transition-all"
          >
            <ArrowLeft className="h-4 w-4" />
          </button>
          <div>
            <h1 className="text-2xl font-black tracking-tight text-black dark:text-white uppercase leading-none mb-1">
              {id ? "Edit Data Karya" : "Tambah Karya Baru"}
            </h1>
            <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 dark:text-gray-600">Lengkapi informasi koleksi perpustakaan</p>
          </div>
        </div>
        <Button onClick={handleSubmit} disabled={loading} className="font-black uppercase tracking-[0.2em] text-[10px] h-12 px-8 bg-black dark:bg-white text-white dark:text-black rounded-2xl shadow-xl hover:scale-[1.02] active:scale-[0.98] transition-all">
          {loading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Save className="h-4 w-4 mr-2" />}
          Simpan Data
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Kolom Kiri: Form Utama */}
        <div className="lg:col-span-2 space-y-6">
          <Card className="rounded-[2rem] border-gray-100 dark:border-white/5 shadow-sm overflow-hidden">
            <CardContent className="p-8 space-y-8">
              <div className="space-y-6">
                <div className="space-y-3">
                  <Label htmlFor="title" className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 dark:text-gray-600 ml-1">Judul Lengkap</Label>
                  <Input
                    id="title"
                    name="title"
                    placeholder="Masukkan judul buku..."
                    value={formData.title}
                    onChange={handleInputChange}
                    className="h-14 rounded-2xl border-gray-100 dark:border-white/10 bg-gray-50/50 dark:bg-white/[0.02] font-bold text-base px-6 focus:ring-black dark:focus:ring-white"
                    required
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                   <div className="space-y-3">
                    <Label htmlFor="author" className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 dark:text-gray-600 ml-1">Penulis / Kreator</Label>
                    <Input
                      id="author"
                      name="author"
                      placeholder="Nama Lengkap Penulis"
                      value={formData.author}
                      onChange={handleInputChange}
                      className="h-14 rounded-2xl border-gray-100 dark:border-white/10 px-6 font-bold"
                      required
                    />
                  </div>
                  <div className="space-y-3">
                    <Label htmlFor="isbn" className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 dark:text-gray-600 ml-1">ISBN / Identitas</Label>
                    <Input
                      id="isbn"
                      name="isbn"
                      placeholder="978-XXXX-XXXX"
                      value={formData.isbn}
                      onChange={handleInputChange}
                      className="h-14 rounded-2xl border-gray-100 dark:border-white/10 px-6 font-bold"
                      required
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <Label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 dark:text-gray-600 ml-1">Sinopsis & Deskripsi</Label>
                <div className="min-h-[300px] rounded-2xl border border-gray-100 dark:border-white/10 overflow-hidden bg-gray-50/50 dark:bg-white/[0.02]">
                  <ReactQuill
                    theme="snow"
                    value={formData.description}
                    onChange={(val) => setFormData((p: any) => ({ ...p, description: val }))}
                    className="h-[250px]"
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4">
                  <div className="space-y-3">
                    <Label htmlFor="year" className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 dark:text-gray-600 ml-1">Tahun Terbit</Label>
                    <Input
                      type="number"
                      id="year"
                      name="year"
                      value={formData.year}
                      onChange={handleInputChange}
                      className="h-14 rounded-2xl border-gray-100 dark:border-white/10 px-6 font-bold"
                    />
                  </div>
                  <div className="space-y-3">
                    <Label htmlFor="pageCount" className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 dark:text-gray-600 ml-1">Jumlah Halaman</Label>
                    <Input
                      type="number"
                      id="pageCount"
                      name="pageCount"
                      value={formData.pageCount}
                      onChange={handleInputChange}
                      className="h-14 rounded-2xl border-gray-100 dark:border-white/10 px-6 font-bold"
                    />
                  </div>
                  <div className="space-y-3">
                    <Label htmlFor="maxStock" className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 dark:text-gray-600 ml-1">Total Koleksi</Label>
                    <Input
                      type="number"
                      id="maxStock"
                      name="maxStock"
                      value={formData.maxStock}
                      onChange={handleInputChange}
                      className="h-14 rounded-2xl border-gray-100 dark:border-white/10 px-6 font-bold"
                    />
                  </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Kolom Kanan: Metadata & Media */}
        <div className="space-y-6">
          <Card className="rounded-[2rem] border-gray-100 dark:border-white/5 shadow-sm overflow-hidden">
            <CardContent className="p-8 space-y-6">
              <div className="space-y-3">
                <Label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 dark:text-gray-600 ml-1">Kategori Koleksi</Label>
                <Select 
                  value={formData.categoryId} 
                  onValueChange={(val) => setFormData((p: any) => ({ ...p, categoryId: val }))}
                >
                  <SelectTrigger className="h-14 rounded-2xl border-gray-100 dark:border-white/10 px-6 font-bold">
                    <SelectValue placeholder="Pilih Kategori" />
                  </SelectTrigger>
                  <SelectContent className="rounded-2xl border-gray-100 dark:border-white/10">
                    {categories.map((cat) => (
                      <SelectItem key={cat.id} value={cat.id} className="rounded-xl font-bold py-3">
                        {cat.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-3">
                <Label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 dark:text-gray-600 ml-1">Tanggal Publikasi</Label>
                <Popover>
                  <PopoverTrigger>
                    <button type="button" className={cn(
                      "w-full flex items-center justify-between font-bold border border-gray-100 dark:border-white/10 bg-transparent rounded-2xl px-6 h-14 text-sm hover:bg-gray-50 dark:hover:bg-white/5 transition-all cursor-pointer",
                      !formData.publishedDate && "text-muted-foreground"
                    )}>
                      {formData.publishedDate ? format(formData.publishedDate, "PPP") : <span>Pilih Tanggal</span>}
                      <CalendarIcon className="h-4 w-4 text-gray-400" />
                    </button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0 rounded-3xl border-gray-100 dark:border-white/10 shadow-2xl" align="start">
                    <Calendar
                      mode="single"
                      selected={formData.publishedDate}
                      onSelect={(d) => d && setFormData((p: any) => ({ ...p, publishedDate: d }))}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>

              <div className="space-y-3">
                <Label htmlFor="stock" className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 dark:text-gray-600 ml-1">Stok Tersedia</Label>
                <Input 
                  type="number" 
                  id="stock" 
                  name="stock" 
                  value={formData.stock} 
                  onChange={handleInputChange} 
                  className="h-14 rounded-2xl border-gray-100 dark:border-white/10 px-6 font-bold"
                />
              </div>
            </CardContent>
          </Card>

          <Card className="rounded-[2rem] border-gray-100 dark:border-white/5 shadow-sm overflow-hidden">
            <CardContent className="p-8 space-y-6">
              <div className="flex items-center justify-between mb-2">
                <Label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 dark:text-gray-600 ml-1">Cover Visual</Label>
                <div className="flex bg-gray-100 dark:bg-white/5 p-1 rounded-full scale-90">
                  <button 
                    type="button"
                    onClick={() => setUseUrl(true)} 
                    className={cn("px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest transition-all", useUrl ? "bg-white dark:bg-white/10 shadow-sm" : "opacity-40")}
                  >
                    URL
                  </button>
                  <button 
                    type="button"
                    onClick={() => setUseUrl(false)} 
                    className={cn("px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest transition-all", !useUrl ? "bg-white dark:bg-white/10 shadow-sm" : "opacity-40")}
                  >
                    FILE
                  </button>
                </div>
              </div>

              {useUrl ? (
                <Input
                  placeholder="https://..."
                  value={formData.coverImage}
                  onChange={(e) => setFormData((p: any) => ({ ...p, coverImage: e.target.value }))}
                  className="h-11 rounded-xl border-gray-100 dark:border-white/10 px-4 text-xs font-medium"
                />
              ) : (
                <div className="flex items-center gap-3">
                  <Input type="file" onChange={handleFileUpload} className="text-[10px] h-11 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-[10px] file:font-black file:bg-black file:text-white dark:file:bg-white dark:file:text-black cursor-pointer" />
                  {isUploading && <Loader2 className="h-4 w-4 animate-spin text-gray-400" />}
                </div>
              )}

              {formData.coverImage && (
                <div className="aspect-[3/4] rounded-2xl border border-gray-100 dark:border-white/10 overflow-hidden bg-gray-50/50 dark:bg-white/[0.02] group relative shadow-inner">
                  <img 
                    src={formData.coverImage.startsWith("/") ? `${IMAGE_BASE_URL}${formData.coverImage}` : formData.coverImage} 
                    alt="Preview" 
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" 
                    key={formData.coverImage}
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-sm">
                    <button type="button" onClick={() => setFormData((p: any) => ({ ...p, coverImage: "" }))} className="px-6 py-2 bg-white text-black rounded-full text-[10px] font-black uppercase tracking-widest hover:scale-110 active:scale-95 transition-all">Hapus Media</button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
