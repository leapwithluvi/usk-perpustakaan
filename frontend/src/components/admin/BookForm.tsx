import { useState, useEffect } from "react"
import ReactQuill from "react-quill-new"
import "react-quill-new/dist/quill.snow.css"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
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
import { CalendarIcon, Upload, Loader2, Link as LinkIcon } from "lucide-react"
import { cn } from "@/lib/utils"

interface BookFormProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSubmit: (data: any) => void
  initialData?: any
  title: string
}

const categories = [
  { id: "1", name: "Pemrograman" },
  { id: "2", name: "Pengembangan Diri" },
  { id: "3", name: "Fiksi" },
  { id: "4", name: "Sains" },
]

export function BookForm({ open, onOpenChange, onSubmit, initialData, title }: BookFormProps) {
  const [formData, setFormData] = useState<any>({
    title: "",
    author: "",
    description: "",
    isbn: "",
    publishedDate: new Date(),
    categoryId: "",
    price: 0,
    stock: 1,
    coverImage: "",
  })

  const [isUploading, setIsUploading] = useState(false)
  const [useUrl, setUseUrl] = useState(true)

  useEffect(() => {
    if (initialData) {
      setFormData({
        ...initialData,
        publishedDate: initialData.publishedDate ? new Date(initialData.publishedDate) : new Date(),
      })
      if (initialData.coverImage?.startsWith("/uploads")) {
        setUseUrl(false)
      } else {
        setUseUrl(true)
      }
    } else {
      setFormData({
        title: "",
        author: "",
        description: "",
        isbn: "",
        publishedDate: new Date(),
        categoryId: "",
        price: 0,
        stock: 1,
        coverImage: "",
      })
    }
  }, [initialData, open])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type } = e.target
    setFormData((prev: any) => ({
      ...prev,
      [name]: type === "number" ? parseFloat(value) : value,
    }))
  }

  const handleSelectChange = (value: string) => {
    setFormData((prev: any) => ({ ...prev, categoryId: value }))
  }

  const handleDateChange = (date: Date | undefined) => {
    if (date) {
      setFormData((prev: any) => ({ ...prev, publishedDate: date }))
    }
  }

  const handleQuillChange = (content: string) => {
    setFormData((prev: any) => ({ ...prev, description: content }))
  }

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setIsUploading(true)
    const body = new FormData()
    body.append("image", file)

    try {
      // Simulasi upload ke endpoint yang kita buat sebelumnya
      // const response = await fetch("/api/upload/single", { method: "POST", body })
      // const result = await response.json()
      // setFormData((prev: any) => ({ ...prev, coverImage: result.data.url }))
      
      // MOCK UPLOAD for now
      setTimeout(() => {
        setFormData((prev: any) => ({ ...prev, coverImage: `/uploads/mock-${file.name}` }))
        setIsUploading(false)
      }, 1000)
    } catch (error) {
      console.error("Upload failed", error)
      setIsUploading(false)
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit(formData)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold uppercase tracking-tight">{title}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-6 py-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Judul & Penulis */}
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title" className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Judul Buku</Label>
                <Input
                  id="title"
                  name="title"
                  placeholder="Masukkan judul buku"
                  value={formData.title}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="author" className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Penulis</Label>
                <Input
                  id="author"
                  name="author"
                  placeholder="Nama penulis"
                  value={formData.author}
                  onChange={handleInputChange}
                  required
                />
              </div>
            </div>

            {/* ISBN & Kategori */}
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="isbn" className="text-xs font-bold uppercase tracking-widest text-muted-foreground">ISBN</Label>
                <Input
                  id="isbn"
                  name="isbn"
                  placeholder="978-..."
                  value={formData.isbn}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Kategori</Label>
                <Select value={formData.categoryId} onValueChange={handleSelectChange}>
                  <SelectTrigger>
                    <SelectValue placeholder="Pilih kategori" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((cat) => (
                      <SelectItem key={cat.id} value={cat.id}>{cat.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
             {/* Tanggal Terbit */}
             <div className="space-y-2 flex flex-col">
                <Label className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-1">Tanggal Terbit</Label>
                <Popover>
                  <PopoverTrigger
                    className={cn(
                      "w-full flex items-center justify-start text-left font-normal border border-input bg-background rounded-md px-3 h-8 text-sm hover:bg-muted/50 transition-colors",
                      !formData.publishedDate && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {formData.publishedDate ? format(formData.publishedDate, "PPP") : <span>Pilih tanggal</span>}
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={formData.publishedDate}
                      onSelect={handleDateChange}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>

              {/* Harga */}
              <div className="space-y-2">
                <Label htmlFor="price" className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Harga Pinjam (Rp)</Label>
                <Input
                  id="price"
                  name="price"
                  type="number"
                  value={formData.price}
                  onChange={handleInputChange}
                  required
                />
              </div>

              {/* Stok */}
              <div className="space-y-2">
                <Label htmlFor="stock" className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Stok</Label>
                <Input
                  id="stock"
                  name="stock"
                  type="number"
                  value={formData.stock}
                  onChange={handleInputChange}
                  required
                />
              </div>
          </div>

          {/* Cover Image */}
          <div className="space-y-4 border p-4 rounded-lg bg-muted/30">
            <div className="flex items-center justify-between">
              <Label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Cover Buku</Label>
              <div className="flex gap-2">
                <Button 
                  type="button" 
                  variant={useUrl ? "default" : "outline"} 
                  size="sm" 
                  onClick={() => setUseUrl(true)}
                  className="text-[10px] h-7 font-bold uppercase"
                >
                  <LinkIcon className="h-3 w-3 mr-1" /> URL
                </Button>
                <Button 
                  type="button" 
                  variant={!useUrl ? "default" : "outline"} 
                  size="sm" 
                  onClick={() => setUseUrl(false)}
                  className="text-[10px] h-7 font-bold uppercase"
                >
                  <Upload className="h-3 w-3 mr-1" /> Upload
                </Button>
              </div>
            </div>
            
            {useUrl ? (
              <Input
                placeholder="https://..."
                value={formData.coverImage}
                onChange={(e) => setFormData((prev: any) => ({ ...prev, coverImage: e.target.value }))}
              />
            ) : (
              <div className="flex items-center gap-4">
                <Input
                  type="file"
                  accept="image/*"
                  onChange={handleFileUpload}
                  className="text-xs cursor-pointer"
                />
                {isUploading && <Loader2 className="h-4 w-4 animate-spin" />}
              </div>
            )}
            
            {formData.coverImage && (
              <div className="mt-2 h-32 w-24 rounded border overflow-hidden">
                <img src={formData.coverImage} alt="Preview" className="h-full w-full object-cover" />
              </div>
            )}
          </div>

          {/* Sinopsis / Deskripsi (WYSIWYG) */}
          <div className="space-y-2">
            <Label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Sinopsis / Deskripsi</Label>
            <div className="h-[300px] mb-12">
              <ReactQuill
                theme="snow"
                value={formData.description}
                onChange={handleQuillChange}
                className="h-[250px] bg-background"
                placeholder="Tuliskan sinopsis atau deskripsi buku di sini..."
              />
            </div>
          </div>

          <DialogFooter className="mt-6">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)} className="font-bold uppercase tracking-widest text-xs">
              Batal
            </Button>
            <Button type="submit" className="font-bold uppercase tracking-widest text-xs">
              Simpan Buku
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
