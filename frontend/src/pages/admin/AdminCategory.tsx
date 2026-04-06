import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Plus, Search, Pencil, Trash2, Tag } from "lucide-react"
import { api } from "@/lib/api"
import { toast } from "sonner"
import { ModalConfirm } from "@/components/ui/ModalConfirm"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"

export function AdminCategory() {
  const [categories, setCategories] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState("")
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingCategory, setEditingCategory] = useState<any>(null)
  const [formData, setFormData] = useState({ name: "" })
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const [categoryToDelete, setCategoryToDelete] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    fetchCategories()
  }, [])

  const fetchCategories = async () => {
    setLoading(true)
    try {
      const res = await api.getCategories()
      setCategories(res.data)
    } catch (error) {
      console.error("Gagal mengambil kategori:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleOpenDialog = (category?: any) => {
    if (category) {
      setEditingCategory(category)
      setFormData({ name: category.name })
    } else {
      setEditingCategory(null)
      setFormData({ name: "" })
    }
    setIsDialogOpen(true)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    try {
      if (editingCategory) {
        await api.updateCategory(editingCategory.id, formData)
        toast.success("Kategori berhasil diperbarui")
      } else {
        await api.createCategory(formData)
        toast.success("Kategori baru berhasil ditambahkan")
      }
      setIsDialogOpen(false)
      fetchCategories()
    } catch (error: any) {
      toast.error(error.message || "Gagal menyimpan kategori")
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDelete = async () => {
    if (!categoryToDelete) return
    setIsSubmitting(true)
    try {
      await api.deleteCategory(categoryToDelete)
      toast.success("Kategori berhasil dihapus")
      setShowDeleteConfirm(false)
      setCategoryToDelete(null)
      fetchCategories()
    } catch (error: any) {
      toast.error(error.message || "Gagal menghapus kategori")
    } finally {
      setIsSubmitting(false)
    }
  }

  const openDeleteConfirm = (id: string) => {
    setCategoryToDelete(id)
    setShowDeleteConfirm(true)
  }

  const filteredCategories = categories.filter(c => 
    c.name.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-black uppercase tracking-tighter text-black dark:text-white">Manajemen Kategori</h2>
          <p className="text-muted-foreground text-sm font-medium mt-1 uppercase tracking-widest text-[10px]">Atur klasifikasi koleksi buku archive</p>
        </div>
        <Button 
          onClick={() => handleOpenDialog()}
          className="bg-black dark:bg-white text-white dark:text-black hover:bg-zinc-800 dark:hover:bg-zinc-200 rounded-xl h-12 px-6 font-black uppercase tracking-widest text-[10px] shadow-xl shadow-black/5"
        >
          <Plus className="mr-2 h-4 w-4" /> Tambah Kategori
        </Button>
      </div>

      <Card className="border-border/40 shadow-sm rounded-2xl overflow-hidden">
        <CardHeader className="border-b border-border/40 bg-muted/20 px-6 py-4">
          <div className="relative max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input 
              placeholder="Cari kategori..." 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10 h-10 bg-background border-border/40 rounded-xl text-xs font-medium focus-visible:ring-1 focus-visible:ring-border"
            />
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-muted/30">
                  <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-muted-foreground border-b border-border/40">Nama Kategori</th>
                  <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-muted-foreground border-b border-border/40">ID Kategori</th>
                  <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-muted-foreground border-b border-border/40 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/40">
                {loading ? (
                  Array.from({ length: 5 }).map((_, i) => (
                    <tr key={i} className="animate-pulse">
                      <td className="px-6 py-4"><div className="h-4 bg-muted rounded w-32" /></td>
                      <td className="px-6 py-4"><div className="h-4 bg-muted rounded w-48" /></td>
                      <td className="px-6 py-4"><div className="h-8 bg-muted rounded w-20 ml-auto" /></td>
                    </tr>
                  ))
                ) : filteredCategories.length > 0 ? (
                  filteredCategories.map((category) => (
                    <tr key={category.id} className="group hover:bg-muted/20 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-lg bg-zinc-100 dark:bg-zinc-900 flex items-center justify-center border border-border/20">
                            <Tag className="h-3.5 w-3.5 text-zinc-500" />
                          </div>
                          <span className="font-bold text-sm text-foreground uppercase tracking-tight">{category.name}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <code className="text-[10px] font-mono text-muted-foreground bg-muted px-2 py-1 rounded-md">{category.id}</code>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex justify-end gap-2 transition-opacity">
                          <Button 
                            variant="outline" 
                            size="icon" 
                            onClick={() => handleOpenDialog(category)}
                            className="h-8 w-8 rounded-lg border-border/40 bg-white text-black hover:bg-zinc-100 shadow-sm transition-all"
                          >
                            <Pencil className="h-3.5 w-3.5" />
                          </Button>
                          <Button 
                            variant="outline" 
                            size="icon"
                            onClick={() => openDeleteConfirm(category.id)}
                            className="h-8 w-8 rounded-lg border-border/40 bg-white text-black hover:bg-red-50 hover:text-red-600 shadow-sm transition-all"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={3} className="px-6 py-12 text-center text-muted-foreground font-medium uppercase tracking-widest text-[10px]">
                      Tidak ada kategori ditemukan
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[425px] rounded-3xl border-border/40 shadow-2xl">
          <DialogHeader>
            <DialogTitle className="text-xl font-black uppercase tracking-tighter">
              {editingCategory ? "Edit Kategori" : "Tambah Kategori"}
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-6 py-4">
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground ml-1">Nama Kategori</label>
              <Input
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Contoh: Sains & Teknologi"
                className="h-12 bg-muted/30 border-transparent focus:bg-background focus:ring-1 focus:ring-border rounded-xl font-bold uppercase tracking-tight"
              />
            </div>
            <DialogFooter className="pt-4">
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => setIsDialogOpen(false)}
                className="rounded-xl h-11 px-6 font-bold uppercase tracking-widest text-[10px]"
              >
                Batal
              </Button>
              <Button 
                type="submit"
                disabled={isSubmitting}
                className="bg-black dark:bg-white text-white dark:text-black hover:bg-zinc-800 dark:hover:bg-zinc-200 rounded-xl h-11 px-8 font-black uppercase tracking-widest text-[10px]"
              >
                {isSubmitting ? "Memproses..." : (editingCategory ? "Simpan" : "Tambah")}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <ModalConfirm
        isOpen={showDeleteConfirm}
        onClose={() => setShowDeleteConfirm(false)}
        onConfirm={handleDelete}
        isLoading={isSubmitting}
        title="Hapus Kategori"
        description="Apakah Anda yakin ingin menghapus kategori ini? Seluruh buku dalam kategori ini mungkin akan terpengaruh."
        confirmText="Hapus"
      />
    </div>
  )
}
