import { SearchIcon } from '../Icons'

export const TopNav = ({ searchQuery, setSearchQuery }: { searchQuery: string; setSearchQuery: (val: string) => void }) => {
  return (
    <header className="hidden md:flex items-center justify-between px-10 py-6 border-b border-slate-900 sticky top-0 bg-[#0b0e14]/90 backdrop-blur-xl z-50">
      <div className="flex items-center gap-4 bg-slate-900/50 border border-slate-800 rounded-full px-5 py-2.5 w-96">
        <SearchIcon />
        <input 
          type="text" 
          placeholder="Search archives..." 
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="bg-transparent border-none outline-none text-sm text-slate-300 w-full placeholder:text-slate-600" 
        />
      </div>

      <nav className="flex items-center gap-10">
        {['COLLECTIONS', 'ARCHIVES', 'RESERVATIONS'].map((link) => (
          <a key={link} href="#" className="text-[11px] font-bold tracking-[0.2em] text-slate-500 hover:text-white transition-colors">{link}</a>
        ))}
        <div className="w-9 h-9 rounded-full bg-slate-800 overflow-hidden border border-slate-700">
          <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Archivist" alt="Avatar" className="w-full h-full object-cover" />
        </div>
      </nav>
    </header>
  )
}
