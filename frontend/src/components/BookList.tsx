import { useState, useEffect } from "react"
import { BookShelf } from "./BookShelf"
import { api } from "@/lib/api"

interface BookListProps {
  categories: any[]
  onOpenGenre: (slug: string) => void
  onOpenBook: (slug: string) => void
}

export function BookList({ categories, onOpenGenre, onOpenBook }: BookListProps) {
  const [booksByCategory, setBooksByCategory] = useState<Record<string, any[]>>({})

  useEffect(() => {
    if (categories.length > 0) {
      fetchAllCategoryBooks()
    }
  }, [categories])

  const fetchAllCategoryBooks = async () => {
    const promises = categories.map(async (cat) => {
      try {
        const res = await api.getBooks({ categorySlug: cat.slug, limit: 10 })
        return { id: cat.id, books: res.data.data }
      } catch (error) {
        console.error(`Gagal mengambil buku untuk kategori ${cat.name}`, error)
        return { id: cat.id, books: [] }
      }
    })

    const results = await Promise.all(promises)
    const newBooksMap: Record<string, any[]> = {}
    results.forEach(res => {
      newBooksMap[res.id] = res.books
    })
    setBooksByCategory(newBooksMap)
  }

  return (
    <section className="py-24 max-w-7xl mx-auto px-6 space-y-24">
      <div className="space-y-4">
        <div className="flex items-center gap-3">
          <div className="h-0.5 w-10 bg-black dark:bg-white" />
          <span className="text-[10px] font-black tracking-[0.4em] uppercase text-gray-400">Arsip Koleksi</span>
        </div>
        <h2 className="text-4xl lg:text-6xl font-black text-black dark:text-white tracking-tighter uppercase leading-[0.85]">
          Eksplorasi <span className="text-gray-300 dark:text-gray-700">Dunia</span>
        </h2>
      </div>
      
      <div className="space-y-18">
        {categories.map((category) => (
          <BookShelf 
            key={category.id} 
            genre={category.name} 
            genreSlug={category.slug}
            books={booksByCategory[category.id] || []}
            onOpenGenre={onOpenGenre}
            onOpenBook={onOpenBook}
          />
        ))}
      </div>
    </section>
  )
}
