import { Outlet, useNavigate, useLocation } from "react-router-dom"
import { IMAGE_BASE_URL } from "@/lib/api"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarProvider,
  SidebarInset,
  SidebarTrigger
} from "@/components/ui/sidebar"
import {
  LayoutDashboard,
  BookOpen,
  Users,
  User,
  ClipboardList,
  LogOut,
} from "lucide-react"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { ModeToggle } from "@/components/ModeToggle"

interface AdminLayoutProps {
  user: any
  onExit: () => void
}

export function AdminLayout({ user, onExit }: AdminLayoutProps) {
  const navigate = useNavigate()
  const location = useLocation()
  const handleLogout = () => {
    onExit()
  }

  const menuItems = [
    { title: "Dashboard", icon: LayoutDashboard, path: "/admin" },
    { title: "Koleksi Buku", icon: BookOpen, path: "/admin/buku" },
    { title: "Kategori", icon: ClipboardList, path: "/admin/kategori" },
    { title: "Profil Saya", icon: User, path: "/admin/profile" },
    { title: "Anggota", icon: Users, path: "/admin/user" },
    { title: "Peminjaman", icon: ClipboardList, path: "/admin/pinjaman" },
  ]

  const activeItem = menuItems.find(item => 
    item.path === location.pathname || 
    (item.path !== "/admin" && location.pathname.startsWith(item.path))
  )

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full bg-muted/30">
        <Sidebar className="border-r border-border/40">
          <SidebarHeader className="h-16 flex items-center px-6 border-b border-border/40">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-foreground flex items-center justify-center">
                <BookOpen className="h-5 w-5 text-background" />
              </div>
              <span className="font-bold tracking-tighter uppercase text-sm">Admin Atelier</span>
            </div>
          </SidebarHeader>
          <SidebarContent className="p-3">
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton 
                    isActive={activeItem?.title === item.title}
                    onClick={() => navigate(item.path)}
                    className="h-11 rounded-xl px-4 transition-all duration-300"
                  >
                    <item.icon className="h-4 w-4" />
                    <span className="font-semibold text-xs uppercase tracking-widest ml-2">{item.title}</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarContent>
          <SidebarFooter className="p-3 border-t border-border/40">
            <SidebarMenu>
               <SidebarMenuItem>
                <SidebarMenuButton 
                  onClick={handleLogout}
                  className="h-11 rounded-xl px-4 text-muted-foreground hover:text-foreground hover:bg-muted"
                >
                  <LogOut className="h-4 w-4" />
                  <span className="font-semibold text-xs uppercase tracking-widest ml-2">Keluar</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarFooter>
        </Sidebar>

        <SidebarInset className="flex flex-col flex-1 min-w-0">
          {/* Header */}
          <header className="h-16 flex items-center justify-between px-8 border-b border-border/40 bg-background/50 backdrop-blur-md sticky top-0 z-10">
             <div className="flex items-center gap-4">
                <SidebarTrigger className="text-muted-foreground hover:text-foreground transition-colors" />
                <div className="hidden sm:block h-4 w-px bg-border" />
                <div className="flex items-center gap-2">
                   <p className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground opacity-50">Sistem</p>
                   <p className="text-[10px] font-black uppercase tracking-[0.2em] text-foreground">{activeItem?.title || "Overview"}</p>
                </div>
             </div>
             
             <div className="flex items-center gap-4">
                <ModeToggle />
                <div className="h-8 w-px bg-border/40 mx-2" />
                <div 
                  className="flex items-center gap-3 cursor-pointer hover:opacity-80 transition-opacity"
                  onClick={() => navigate('/admin/profile')}
                >
                   <Avatar className="h-8 w-8 border border-border/40 ring-2 ring-background">
                     {user?.avatar ? (
                       <img src={user.avatar.startsWith('/') ? `${IMAGE_BASE_URL}${user.avatar}` : user.avatar} alt={user.name} className="h-full w-full object-cover" />
                     ) : (
                       <AvatarFallback className="text-xs font-black bg-foreground text-background">
                         {(user?.name || "A").substring(0, 1).toUpperCase()}
                       </AvatarFallback>
                     )}
                   </Avatar>
                   <div className="text-right hidden sm:block">
                      <p className="text-[10px] font-black uppercase tracking-widest leading-none mb-1">{user?.name || "Super Admin"}</p>
                      <p className="text-[9px] font-bold text-muted-foreground leading-none">{user?.email || "admin@example.com"}</p>
                   </div>
                </div>
             </div>
          </header>

          {/* Main Content Area */}
          <main className="flex-1 overflow-y-auto bg-muted/10 p-0 md:p-6">
            <div className="bg-background min-h-full rounded-2xl md:rounded-3xl border border-border/40 overflow-hidden shadow-sm">
                <Outlet />
            </div>
          </main>
        </SidebarInset>
      </div>
    </SidebarProvider>
  )
}
