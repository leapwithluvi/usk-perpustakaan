import { StarIcon } from '../Icons'
import { ArrowRight } from "lucide-react"

// ─── Types ────────────────────────────────────────────────────────────────────
export interface Book {
  id: number
  title: string
  author: string
  genre: string
  status: 'TERSEDIA' | 'PENUH' | 'HABIS'
  rating: number
  pageCount: number
  returnDate?: string
  borrowers?: string[]
  coverImage?: string // URL gambar sampul
  coverGradient?: string
  coverText?: string
  coverSubText?: string
  coverAccent?: string
}

// ─── BookCard Component ───────────────────────────────────────────────────────
export const BookCard = ({ book }: { book: Book }) => {
  return (
    <div className="group perspective-1000 flex flex-col h-full">
      {/* Physical Book Cover */}
      <div 
        className={`relative aspect-[3/4.2] bg-white dark:bg-[#0A0A0A] border-gray-100 dark:border-white/5 border-[1.5px] rounded-sm shadow-sm transition-all duration-700 group-hover:-translate-y-4 group-hover:rotate-y-12 group-hover:shadow-2xl cursor-pointer overflow-hidden flex flex-col block-book bg-zinc-50/30`}
      >
        {/* Book Image Cover (if available) */}
        {book.coverImage && (
          <div className="absolute inset-0 z-0">
            <img 
              src={book.coverImage} 
              alt={book.title}
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            />
            {/* Dark overlay for text readability if needed */}
            <div className="absolute inset-0 bg-black/10 transition-opacity group-hover:opacity-0" />
          </div>
        )}

        {/* Spine Detail */}
        <div className="absolute left-0 top-0 bottom-0 w-1 bg-black/5 dark:bg-white/5 border-r border-black/10 dark:border-white/10 z-20" />
        <div className="absolute left-1 top-0 bottom-0 w-3 bg-gradient-to-r from-black/5 to-transparent dark:from-white/5 z-10 opacity-50" />

        {/* Page Layers (Right edge) */}
        <div className="absolute right-0 top-1 bottom-1 w-1 bg-white/60 dark:bg-black/60 border-l border-black/5 dark:border-white/5 rounded-l-[1px] z-10" />
        
        {/* Content Cover (Fallback or Overlay) */}
        <div className={`flex-1 flex flex-col justify-between p-6 lg:p-8 relative z-10 ${book.coverImage ? 'bg-gradient-to-t from-black/80 via-black/20 to-transparent' : ''}`}>
          <div className="space-y-6">
            <div className={`h-px w-6 ${book.coverImage ? 'bg-white' : 'bg-black dark:bg-white'} opacity-20`} />
            <h3 className={`text-xl lg:text-3xl font-black ${book.coverImage ? 'text-white' : 'text-black dark:text-white'} tracking-tighter leading-[0.85] uppercase group-hover:tracking-normal transition-all duration-700 break-words drop-shadow-sm`}>
              {book.title}
            </h3>
          </div>

          <div className="space-y-4">
             <div className="flex items-center gap-2">
                <div className={`h-4 w-4 rounded-full border ${book.coverImage ? 'border-white' : 'border-black dark:border-white'} opacity-20 flex items-center justify-center`}>
                    <div className={`h-1 w-1 ${book.coverImage ? 'bg-white' : 'bg-black dark:bg-white'} rounded-full`} />
                </div>
                <p className={`text-[9px] font-black uppercase tracking-[0.25em] ${book.coverImage ? 'text-white/80' : 'text-black/60 dark:text-white/50'}`}>
                  {book.author}
                </p>
             </div>
             
             <div className="flex items-center justify-between">
                <div className={`flex items-center gap-1.5 text-[8px] font-black uppercase tracking-widest ${book.status === 'TERSEDIA' ? 'text-emerald-500' : 'text-rose-500'}`}>
                    <div className={`h-1.5 w-1.5 rounded-full ${book.status === 'TERSEDIA' ? 'bg-emerald-500' : 'bg-rose-500'}`} />
                    {book.status}
                </div>
                <div className="flex items-center gap-1">
                    <StarIcon />
                    <span className={`text-[10px] font-bold ${book.coverImage ? 'text-white' : 'text-black dark:text-white'} opacity-70`}>{book.rating}</span>
                </div>
             </div>
          </div>
        </div>

        {/* Paper Texture Overlay */}
        <div className="absolute inset-0 pointer-events-none opacity-[0.04] dark:opacity-[0.06] bg-[url('https://www.transparenttextures.com/patterns/natural-paper.png')] z-30" />
      </div>
      
      {/* Interaction Bar (Appears on Hover) */}
      <div className="mt-5 space-y-4 opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all duration-500">
        <div className="flex items-center justify-between px-1">
          <div className="flex -space-x-2">
            {book.borrowers?.map((b, i) => (
              <div key={i} className="w-6 h-6 rounded-full bg-slate-950 border border-slate-800 flex items-center justify-center text-[8px] font-black text-slate-400">
                {b}
              </div>
            ))}
          </div>
          <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest">{book.pageCount} PAGES</span>
        </div>

        {book.status === 'TERSEDIA' ? (
          <button className="w-full h-11 rounded-lg bg-black dark:bg-white text-white dark:text-black hover:scale-[1.02] active:scale-95 transition-all text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-2 shadow-xl">
             Pinjam Sekarang <ArrowRight className="h-3 w-3" />
          </button>
        ) : (
          <button className="w-full h-11 rounded-lg border border-slate-800 text-slate-400 hover:bg-slate-900 transition-all text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-2">
             Ingatkan Saya
          </button>
        )}
      </div>
    </div>
  )
}
