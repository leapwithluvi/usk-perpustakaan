import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Search } from "lucide-react"

export function Hero({ onSearch }: { onSearch?: (query: string) => void }) {
  const [query, setQuery] = useState("")

  const handleSearch = () => {
    if (query.trim()) {
      onSearch?.(query.trim())
    } else {
      onSearch?.("")
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSearch()
    }
  }
  return (
    <section className="relative px-6 py-20 flex flex-col md:flex-row items-center justify-between max-w-7xl mx-auto overflow-hidden">
      <div className="flex-1 space-y-8 z-10">
        <div className="space-y-4 max-w-lg">
          <h2 className="text-6xl md:text-7xl font-black tracking-tighter text-black dark:text-white leading-tight uppercase">
            Gerbang Intelektual <span className="text-gray-400 dark:text-gray-600">Anda.</span>
          </h2>
          <p className="text-gray-500 dark:text-gray-400 text-lg leading-relaxed font-medium">
            Temukan ribuan koleksi buku pilihan, pinjam secara digital, dan jemput inspirasi Anda langsung di pusat literasi kami.
          </p>
        </div>

        <div className="relative max-w-md">
          <div className="flex items-center px-4 py-1.5 bg-gray-100 dark:bg-gray-900 rounded-lg shadow-sm border border-gray-200 dark:border-gray-800 group focus-within:ring-2 focus-within:ring-black/5 dark:focus-within:ring-white/5 transition-all">
            <Search className="h-5 w-5 text-gray-400 dark:text-gray-500 mr-2" />
            <Input 
              placeholder="Search by title, author, or ISBN..." 
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={handleKeyDown}
              className="border-none bg-transparent shadow-none focus-visible:ring-0 text-gray-600 dark:text-gray-300 font-medium placeholder:text-gray-400"
            />
            <Button 
              onClick={handleSearch}
              className="bg-black dark:bg-white text-white dark:text-black hover:bg-black/90 dark:hover:bg-white/90 font-medium px-4 h-9 whitespace-nowrap"
            >
              search archive
            </Button>
          </div>
        </div>
      </div>

      <div className="flex-1 relative flex justify-center items-center h-[400px]">
        {/* Abstract shapes base on mockup */}
        <div className="relative w-full h-full flex items-center justify-center scale-110">
            {/* Dots */}
            <div className="absolute top-1/4 right-0 w-3 h-3 bg-black dark:bg-white rounded-full" />
            <div className="absolute bottom-1/4 left-0 w-3 h-3 bg-black dark:bg-white rounded-full" />

            {/* Geometric Shapes */}
            <div className="grid grid-cols-2 gap-4">
                <div className="w-24 h-24 border-2 border-black dark:border-white rounded-full flex items-center justify-center">
                    <div className="w-24 h-24 border-2 border-black dark:border-white rounded-full absolute" />
                </div>
                <div className="w-24 h-24 bg-black dark:bg-white" />
                <div className="w-24 h-24 bg-black dark:bg-white flex items-center justify-center overflow-hidden">
                    <div className="w-full h-full bg-black dark:bg-white" />
                </div>
                <div className="w-28 h-28 border-2 border-black dark:border-white flex items-center justify-center">
                    <div className="w-full h-full border-b-[28px] border-l-[28px] border-b-transparent border-l-black dark:border-l-white rotate-45 transform origin-top-left" 
                        style={{ width: '0', height: '0', borderLeft: '56px solid transparent', borderRight: '56px solid transparent', borderBottom: '112px solid black' }}
                    />
                </div>
            </div>
            
            {/* Triangle & Circle detail */}
            <div className="absolute inset-0 flex items-center justify-center -z-10 text-black dark:text-white">
                 <svg width="300" height="300" viewBox="0 0 300 300" fill="none" xmlns="http://www.w3.org/2000/svg" className="opacity-80">
                    <circle cx="100" cy="100" r="40" stroke="currentColor" strokeWidth="2"/>
                    <rect x="180" y="80" width="80" height="80" fill="currentColor"/>
                    <circle cx="180" cy="200" r="40" stroke="currentColor" strokeWidth="2"/>
                    <path d="M140 120 L220 200 L140 200 Z" stroke="currentColor" strokeWidth="2"/>
                 </svg>
            </div>
        </div>
      </div>
    </section>
  )
}
