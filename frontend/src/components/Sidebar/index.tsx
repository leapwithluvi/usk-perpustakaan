
import { 
  DashboardIcon, 
  BookIcon, 
  CirculationIcon, 
  MembersIcon, 
  ReportsIcon, 
  UserIcon, 
  MoonIcon, 
  BellIcon 
} from '../Icons'

const SidebarItem = ({ icon, label, active, onClick }: { icon: React.ReactNode; label: string; active?: boolean; onClick?: () => void }) => (
  <button 
    onClick={onClick}
    className={`w-full flex items-center gap-3 px-6 py-3.5 transition-all text-sm font-medium ${
      active ? 'text-white bg-white/5' : 'text-slate-500 hover:text-slate-300'
    }`}
  >
    <div className={`transition-transform ${active ? 'scale-110 text-indigo-400' : ''}`}>{icon}</div>
    {label}
  </button>
)

export const Sidebar = ({ activeNav, onSelect }: { activeNav: string; onSelect: (id: string) => void }) => {
  return (
    <aside className="hidden md:flex flex-col w-64 h-screen border-r border-slate-900 sticky top-0 bg-[#0b0e14]">
      <div className="p-8 pb-12">
        <h1 className="text-white text-xl font-bold tracking-tight">Nocturnal Archive</h1>
        <p className="text-[10px] text-slate-500 font-bold tracking-[0.2em] mt-1">DIGITAL ATELIER</p>
      </div>

      <nav className="flex-1">
        <SidebarItem icon={<DashboardIcon />} label="Dashboard" active={activeNav === 'dashboard'} onClick={() => onSelect('dashboard')} />
        <SidebarItem icon={<BookIcon />} label="Catalog" active={activeNav === 'catalog'} onClick={() => onSelect('catalog')} />
        <SidebarItem icon={<CirculationIcon />} label="Circulation" active={activeNav === 'circulation'} onClick={() => onSelect('circulation')} />
        <SidebarItem icon={<MembersIcon />} label="Members" active={activeNav === 'members'} onClick={() => onSelect('members')} />
        <SidebarItem icon={<ReportsIcon />} label="Reports" active={activeNav === 'reports'} onClick={() => onSelect('reports')} />
      </nav>

      <div className="p-6 space-y-4">
        <button className="w-full py-4 rounded-2xl bg-indigo-600 hover:bg-indigo-500 transition-all text-white text-sm font-bold shadow-lg shadow-indigo-600/20">
          Add New Artifact
        </button>
        <div className="flex items-center justify-between px-2 pt-4">
          <button className="text-slate-500 hover:text-white transition-colors"><UserIcon /></button>
          <button className="text-slate-500 hover:text-white transition-colors"><MoonIcon /></button>
          <button className="text-slate-500 hover:text-white transition-colors"><BellIcon /></button>
        </div>
      </div>
    </aside>
  )
}
