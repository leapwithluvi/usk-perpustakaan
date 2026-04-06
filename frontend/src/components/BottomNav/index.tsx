import { HomeIcon, BookIcon, BookmarkIcon, UserIcon } from '../Icons'

export const BottomNav = ({ activeNav, onSelect }: { activeNav: string; onSelect: (id: string) => void }) => {
  return (
    <div className="fixed bottom-0 left-0 right-0 md:hidden px-2 pb-6 z-50">
      <div className="bg-[#0b0e14]/90 backdrop-blur-xl border border-slate-800/50 rounded-3xl flex items-center justify-around py-3">
        <button 
          onClick={() => onSelect('beranda')}
          className={`${activeNav === 'beranda' ? 'text-white' : 'text-slate-500'} flex flex-col items-center gap-1`}
        >
          <HomeIcon /><span className="text-[9px]">Beranda</span>
        </button>
        <button 
          onClick={() => onSelect('catalog')}
          className={`${activeNav === 'catalog' ? 'text-white' : 'text-slate-500'} flex flex-col items-center gap-1`}
        >
          <BookIcon /><span className="text-[9px]">Buku</span>
        </button>
        <button 
          onClick={() => onSelect('tersimpan')}
          className={`${activeNav === 'tersimpan' ? 'text-white' : 'text-slate-500'} flex flex-col items-center gap-1`}
        >
          <BookmarkIcon /><span className="text-[9px]">Tersimpan</span>
        </button>
        <button 
          onClick={() => onSelect('profil')}
          className={`${activeNav === 'profil' ? 'text-white' : 'text-slate-500'} flex flex-col items-center gap-1`}
        >
          <UserIcon /><span className="text-[9px]">Profil</span>
        </button>
      </div>
    </div>
  )
}
