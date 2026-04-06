import { useState, useEffect } from "react"
import { Input } from "@/components/ui/input"
import { Search, SlidersHorizontal } from "lucide-react"
import { api } from "@/lib/api"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

interface FiltersProps {
  searchQuery: string
  setSearchQuery: (val: string) => void
  selectedCategory: string
  setSelectedCategory: (val: string) => void
  status: string
  setStatus: (val: string) => void
  limit: number
  setLimit: (val: string) => void
}

export function Filters({ 
  searchQuery, 
  setSearchQuery, 
  selectedCategory, 
  setSelectedCategory,
  status,
  setStatus,
  limit,
  setLimit
}: FiltersProps) {
  const [categories, setCategories] = useState<any[]>([])

  useEffect(() => {
    fetchCategories()
  }, [])

  const fetchCategories = async () => {
    try {
      const res = await api.getCategories()
      setCategories(res.data)
    } catch (error) {
      console.error("Gagal mengambil kategori", error)
    }
  }

  return (
    <div className="flex flex-col md:flex-row items-end gap-6 pb-2 border-b border-gray-100 dark:border-gray-800 transition-colors">
      <div className="flex-1 w-full space-y-3">
        <label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 dark:text-gray-500">Cari di Arsip</label>
        <div className="relative group">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 dark:text-gray-500 group-focus-within:text-black dark:group-focus-within:text-white transition-colors" />
          <Input 
            placeholder="Cari berdasarkan judul, penulis, atau ISBN..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 h-12 border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950 shadow-sm focus-visible:ring-black dark:focus-visible:ring-white transition-all text-sm font-medium"
          />
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-4 w-full md:w-auto">
        <div className="space-y-3">
          <label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 dark:text-gray-500">Kategori</label>
          <Select 
            value={selectedCategory} 
            onValueChange={(val) => setSelectedCategory(val || "all")}
          >
            <SelectTrigger className="w-[160px] lg:w-[200px] h-12 border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950 shadow-sm hover:bg-gray-50 dark:hover:bg-gray-900 transition-colors text-xs font-bold uppercase tracking-widest">
              <div className="flex items-center gap-2">
                <SlidersHorizontal className="h-3 w-3" />
                <SelectValue placeholder="Semua" />
              </div>
            </SelectTrigger>
            <SelectContent className="bg-white dark:bg-gray-950 border-gray-200 dark:border-gray-800">
              <SelectItem value="all">Semua Koleksi</SelectItem>
              {categories.map(cat => (
                <SelectItem key={cat.id} value={cat.slug}>{cat.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-3">
          <label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 dark:text-gray-500">Status</label>
          <Select value={status} onValueChange={(val) => setStatus(val || "all")}>
            <SelectTrigger className="w-[130px] h-12 border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950 shadow-sm hover:bg-gray-50 dark:hover:bg-gray-900 transition-colors text-xs font-bold uppercase tracking-widest">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent className="bg-white dark:bg-gray-950 border-gray-200 dark:border-gray-800">
              <SelectItem value="all">Semua</SelectItem>
              <SelectItem value="tersedia">Tersedia</SelectItem>
              <SelectItem value="habis">Habis</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-3">
          <label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 dark:text-gray-500">Tampilkan</label>
          <Select value={limit.toString()} onValueChange={(val) => setLimit(val || "12")}>
            <SelectTrigger className="w-[100px] h-12 border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950 shadow-sm hover:bg-gray-50 dark:hover:bg-gray-900 transition-colors text-xs font-bold uppercase tracking-widest">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-white dark:bg-gray-950 border-gray-200 dark:border-gray-800">
              <SelectItem value="12">12</SelectItem>
              <SelectItem value="24">24</SelectItem>
              <SelectItem value="36">36</SelectItem>
              <SelectItem value="48">48</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  )
}
