import { useState, useEffect } from "react"
import { Hero } from "@/components/Hero"
import { Stats } from "@/components/Stats"
import { BookList } from "@/components/BookList"
import { Testimonial } from "@/components/Testimonial"
import { Footer } from "@/components/Footer"
import { api } from "@/lib/api"

interface LandingPageProps {
  onNavigate: (path: string) => void
  onOpenBook: (slug: string) => void
  onOpenGenre: (slug: string) => void
}

export function LandingPage({ onNavigate, onOpenBook, onOpenGenre }: LandingPageProps) {
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
    <div className="min-h-screen bg-white dark:bg-gray-950 font-sans text-gray-900 dark:text-gray-100 selection:bg-black selection:text-white transition-colors">
      <main>
        <Hero onSearch={(q) => onNavigate?.(`catalog?search=${q}`)} />
        <Stats />
        <BookList 
          categories={categories} 
          onOpenBook={onOpenBook} 
          onOpenGenre={onOpenGenre} 
        />
        <Testimonial />
      </main>
      <Footer onNavigate={onNavigate} />
    </div>
  )
}
