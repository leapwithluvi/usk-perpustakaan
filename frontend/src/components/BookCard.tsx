import { useState } from "react"
import { Card } from "@/components/ui/card"
import { ArrowRight } from "lucide-react"
import { IMAGE_BASE_URL } from "@/lib/api"

interface BookCardProps {
  title?: string
  author?: string
  status?: "tersedia" | "dipinjam"
  coverImage?: string
  onOpenDetails?: () => void
}

export function BookCard({ 
  title = "Judul Buku", 
  author = "Nama Penulis",
  status = "tersedia",
  coverImage,
  onOpenDetails
}: BookCardProps) {
  const [isLoaded, setIsLoaded] = useState(false)
  return (
    <div className="group perspective-1000 flex flex-col h-full">
      {/* Physical Book Cover */}
      <Card 
        onClick={onOpenDetails}
        className={`relative aspect-[3/4.2] bg-white dark:bg-[#0A0A0A] border-gray-100 dark:border-white/5 border-[1.5px] rounded-xl shadow-sm transition-all duration-700 group-hover:-translate-y-4 group-hover:rotate-y-12 group-hover:shadow-2xl cursor-pointer overflow-hidden flex flex-col block-book bg-zinc-50/30`}
      >
        {/* Book Image Cover (if available) */}
        {coverImage && (
          <div className="absolute inset-0 z-0 overflow-hidden rounded-xl">
            <img 
              src={coverImage.startsWith("/") 
                ? `${IMAGE_BASE_URL}${coverImage}` 
                : coverImage
              } 
              alt={title}
              onLoad={() => setIsLoaded(true)}
              className={`w-full h-full object-cover transition-all duration-1000 group-hover:scale-110 ${
                isLoaded ? 'opacity-100' : 'opacity-0'
              }`}
              onError={(e) => {
                (e.target as HTMLImageElement).src = "https://placehold.co/400x600?text=No+Cover"
                setIsLoaded(true)
              }}
            />
            {/* Shimmer effect while loading */}
            {!isLoaded && (
              <div className="absolute inset-0 bg-gray-200 dark:bg-gray-800 animate-pulse" />
            )}
            <div className={`absolute inset-0 bg-black/10 transition-opacity group-hover:opacity-0 ${isLoaded ? 'opacity-100' : 'opacity-0'}`} />
          </div>
        )}

        {/* Spine Detail */}
        <div className="absolute left-0 top-0 bottom-0 w-1 bg-black/5 dark:bg-white/5 border-r border-black/10 dark:border-white/10 z-20" />
        <div className="absolute left-1 top-0 bottom-0 w-3 bg-gradient-to-r from-black/5 to-transparent dark:from-white/5 z-10 opacity-50" />

        {/* Page Layers (Right edge) */}
        <div className="absolute right-0 top-1 bottom-1 w-1 bg-white/60 dark:bg-black/60 border-l border-black/5 dark:border-white/5 rounded-l-[1px] z-10" />
        
        {/* Content Cover (Fallback or Overlay) */}
        <div className={`flex-1 flex flex-col justify-between p-6 lg:p-8 relative z-10`}>
          {/* Gradient Overlay for Images */}
          {coverImage && (
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent z-[-1]" />
          )}

          <div className="space-y-6">
            <div className={`h-px w-6 ${coverImage ? 'bg-white' : 'bg-black dark:bg-white'} opacity-20`} />
            <h3 className={`text-xl lg:text-3xl font-black ${coverImage ? 'text-white' : 'text-black dark:text-white'} tracking-tighter leading-[0.85] uppercase group-hover:tracking-normal transition-all duration-700 break-words drop-shadow-sm`}>
              {title}
            </h3>
          </div>

          <div className="space-y-4">
             <div className="flex items-center gap-2">
                <div className={`h-4 w-4 rounded-full border ${coverImage ? 'border-white' : 'border-black dark:border-white'} opacity-20 flex items-center justify-center`}>
                    <div className={`h-1 w-1 ${coverImage ? 'bg-white' : 'bg-black dark:bg-white'} rounded-full`} />
                </div>
                <p className={`text-[9px] font-black uppercase tracking-[0.25em] ${coverImage ? 'text-white/80' : 'text-black/60 dark:text-white/50'}`}>
                  {author}
                </p>
             </div>
             
             <div className="flex items-center justify-between">
                <div className={`flex items-center gap-1.5 text-[8px] font-black uppercase tracking-widest ${status === 'tersedia' ? 'text-emerald-500' : 'text-rose-500'}`}>
                    <div className={`h-1.5 w-1.5 rounded-full ${status === 'tersedia' ? 'bg-emerald-500' : 'bg-rose-500'}`} />
                    {status}
                </div>
             </div>
          </div>
        </div>

        {/* Paper Texture Overlay */}
        <div className="absolute inset-0 pointer-events-none opacity-[0.04] dark:opacity-[0.06] bg-[url('https://www.transparenttextures.com/patterns/natural-paper.png')] z-30" />
      </Card>
      
      {/* Interaction Bar (Appears on Hover) */}
      <div className="mt-5 space-y-4 opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all duration-500">
        <button 
          onClick={onOpenDetails}
          className="w-full h-11 rounded-lg bg-black dark:bg-white text-white dark:text-black hover:scale-[1.02] active:scale-95 transition-all text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-2 shadow-xl"
        >
           Open Details <ArrowRight className="h-3 w-3" />
        </button>
      </div>
    </div>
  )
}
