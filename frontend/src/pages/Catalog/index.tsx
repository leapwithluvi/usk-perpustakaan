import { useState } from 'react'
import { BookCard } from '../../components/BookCard'
import { books } from '../../data/books'
import { GridIcon, ListIcon, BellIcon, SearchIcon } from '../../components/Icons'

const categories = ['All Artifacts', 'Sci-Fi', 'Mystery', 'Bisnis', 'Philosophy', 'Technology', 'Poetry']

export const Catalog = ({ 
  searchQuery, 
  setSearchQuery,
  onOpenBook
}: { 
  searchQuery: string;
  setSearchQuery: (val: string) => void;
  onOpenBook?: (id: number) => void;
}) => {
  const [activeCategory, setActiveCategory] = useState('All Artifacts')

  const filteredBooks = books.filter((b) => {
    const matchCat = activeCategory === 'All Artifacts' || b.genre === activeCategory
    const matchSearch = b.title.toLowerCase().includes(searchQuery.toLowerCase())
      || b.author.toLowerCase().includes(searchQuery.toLowerCase())
    return matchCat && matchSearch
  })

  return (
    <div className="flex-1 flex flex-col">
      {/* ── Mobile Header ── */}
      <div className="md:hidden flex items-center justify-between px-5 pt-10 pb-4">
        <h1 className="text-white font-bold text-lg">Archive</h1>
        <div className="flex items-center gap-3">
          <button className="text-slate-400"><BellIcon /></button>
          <div className="w-8 h-8 rounded-full bg-indigo-600" />
        </div>
      </div>

      {/* ── Hero/Header Section ── */}
      <div className="px-5 lg:px-10 pt-8 lg:pt-12 pb-6">
        <div className="hidden md:block mb-1">
          <span className="text-[10px] font-black text-emerald-500 tracking-[0.4em] uppercase opacity-70">Atelier Archives</span>
        </div>
        <h2 className="text-black dark:text-white text-3xl lg:text-6xl font-black leading-[0.85] tracking-tighter uppercase transition-colors">
          Curated <span className="text-gray-300 dark:text-gray-700">Artifacts</span>
        </h2>
      </div>

      {/* ── Search Bar Mobile ── */}
      <div className="px-5 md:hidden mb-6">
        <div className="flex items-center gap-3 bg-slate-900 border border-slate-800 rounded-2xl px-4 py-3.5">
          <SearchIcon />
          <input 
            type="text" 
            placeholder="Search..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="bg-transparent outline-none text-sm text-slate-300 w-full placeholder:text-slate-600" 
          />
        </div>
      </div>

      {/* ── Filter Bar ── */}
      <div className="px-5 lg:px-10 mb-12 flex items-center justify-between">
        <div className="flex items-center gap-4 overflow-x-auto scrollbar-hide pb-2 lg:pb-0">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`shrink-0 px-2 py-1 text-[10px] font-black tracking-[0.2em] transition-all border-b-2 uppercase ${
                activeCategory === cat
                  ? 'border-black dark:border-white text-black dark:text-white'
                  : 'border-transparent text-gray-400 dark:text-gray-600 hover:text-black dark:hover:text-white'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
        <div className="hidden md:flex items-center gap-6 ml-6">
          <button className="text-black dark:text-white p-1 hover:opacity-50 transition-opacity"><GridIcon /></button>
          <button className="text-gray-300 dark:text-gray-800 p-1 hover:text-black dark:hover:text-white transition-all"><ListIcon /></button>
        </div>
      </div>

      {/* ── Book Grid ── */}
      <div className="px-5 lg:px-10 pb-32">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 gap-x-6 gap-y-10 lg:gap-x-10 lg:gap-y-12">
          {filteredBooks.map((book, i) => (
            <BookCard 
              key={`${book.id}-${i}`} 
              title={book.title}
              author={book.author}
              status={book.status.toLowerCase() as "tersedia" | "dipinjam"}
              coverImage={book.coverImage}
              onOpenDetails={() => onOpenBook?.(book.id)}
            />
          ))}
        </div>

        <div className="mt-20 flex flex-col items-center gap-8">
          <button className="px-12 py-4 rounded-2xl border border-slate-800 text-slate-500 font-bold text-xs tracking-[0.2em] hover:bg-slate-900 transition-all uppercase">
            Deepen the Search
          </button>
          <span className="text-[10px] text-slate-700 font-bold tracking-[0.2em] uppercase">Displaying 8 of 1,248 artifacts</span>
        </div>
      </div>
    </div>
  )
}
