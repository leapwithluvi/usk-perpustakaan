import { useRef, useState, useEffect } from "react"
import { BookCard } from "./BookCard"
import { ChevronRight, ChevronLeft } from "lucide-react"

interface BookShelfProps {
  genre: string
  genreSlug: string
  books: any[]
  onOpenGenre: (slug: string) => void
  onOpenBook: (slug: string) => void
}

export function BookShelf({ genre, genreSlug, books, onOpenGenre, onOpenBook }: BookShelfProps) {
  const scrollRef = useRef<HTMLDivElement>(null)
  const [showLeft, setShowLeft] = useState(false)
  const [showRight, setShowRight] = useState(true)

  const checkScroll = () => {
    if (!scrollRef.current) return
    const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current
    setShowLeft(scrollLeft > 20)
    setShowRight(scrollLeft < scrollWidth - clientWidth - 20)
  }

  useEffect(() => {
    const el = scrollRef.current
    if (el) {
      el.addEventListener('scroll', checkScroll)
      checkScroll()
      return () => el.removeEventListener('scroll', checkScroll)
    }
  }, [books])

  const scroll = (dir: 'left' | 'right') => {
    if (!scrollRef.current) return
    const scrollAmount = 600
    scrollRef.current.scrollBy({
      left: dir === 'left' ? -scrollAmount : scrollAmount,
      behavior: 'smooth'
    })
  }

  if (books.length === 0) return null

  return (
    <section className="space-y-8 relative">
      <div className="flex items-center justify-between group cursor-pointer" onClick={() => onOpenGenre(genreSlug)}>
        <div className="space-y-1">
          <h2 className="text-2xl lg:text-3xl font-black text-black dark:text-white tracking-tighter uppercase leading-none">
            {genre}
          </h2>
          <div className="h-0.5 w-12 bg-black dark:bg-white scale-x-100 group-hover:scale-x-150 transition-transform origin-left duration-500" />
        </div>
        
        <button className="flex items-center gap-2 text-[10px] font-black tracking-[0.2em] uppercase text-gray-400 group-hover:text-black dark:group-hover:text-white transition-colors">
          Lihat Semua
          <ChevronRight className="w-3 h-3 translate-x-0 group-hover:translate-x-1 transition-transform" />
        </button>
      </div>

      <div className="relative group/shelf">
        {/* Navigation Buttons */}
        {showLeft && (
          <button 
            onClick={(e) => { e.stopPropagation(); scroll('left'); }}
            className="absolute left-0 top-1/2 -translate-y-1/2 z-30 w-12 h-12 rounded-full bg-white dark:bg-gray-900 border-2 border-gray-100 dark:border-gray-800 shadow-2xl flex items-center justify-center hover:bg-black dark:hover:bg-white hover:text-white dark:hover:text-black transition-all duration-300 -translate-x-1/2"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
        )}

        {showRight && (
          <button 
            onClick={(e) => { e.stopPropagation(); scroll('right'); }}
            className="absolute right-0 top-1/2 -translate-y-1/2 z-30 w-12 h-12 rounded-full bg-white dark:bg-gray-900 border-2 border-gray-100 dark:border-gray-800 shadow-2xl flex items-center justify-center hover:bg-black dark:hover:bg-white hover:text-white dark:hover:text-black transition-all duration-300 translate-x-1/2"
          >
            <ChevronRight className="w-6 h-6" />
          </button>
        )}

        {/* Scroll Container */}
        <div 
          ref={scrollRef}
          className="flex gap-6 lg:gap-10 overflow-x-auto pb-8 scrollbar-hide snap-x snap-mandatory"
        >
          {books.map((book) => (
            <div key={book.id} className="shrink-0 w-[240px] lg:w-[280px] snap-start">
              <BookCard 
                title={book.title}
                author={book.author}
                status={book.stock > 0 ? "tersedia" : "dipinjam"}
                coverImage={book.coverImage}
                onOpenDetails={() => onOpenBook(book.slug)}
              />
            </div>
          ))}
          
          {/* View More Card */}
          <div 
            onClick={() => onOpenGenre(genreSlug)}
            className="shrink-0 w-[240px] lg:w-[280px] snap-start flex flex-col items-center justify-center border-2 border-dashed border-gray-200 dark:border-gray-800 rounded-xl hover:border-black dark:hover:border-white transition-colors cursor-pointer group/more"
          >
            <div className="w-12 h-12 rounded-full bg-gray-50 dark:bg-gray-900 flex items-center justify-center group-hover/more:bg-black dark:group-hover/more:bg-white transition-colors">
              <ChevronRight className="w-6 h-6 text-gray-400 group-hover/more:text-white dark:group-hover/more:text-black" />
            </div>
            <span className="mt-4 text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 group-hover/more:text-black dark:group-hover/more:text-white transition-colors">
              Lainnya di {genre}
            </span>
          </div>
        </div>

        {/* Shadow Overlays */}
        <div className="absolute top-0 right-0 bottom-8 w-20 bg-gradient-to-l from-white dark:from-gray-950 to-transparent pointer-events-none opacity-0 group-hover/shelf:opacity-100 transition-opacity z-10" />
      </div>
    </section>
  )
}
