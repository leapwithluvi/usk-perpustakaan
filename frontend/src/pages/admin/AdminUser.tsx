import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Search, ShieldCheck, User } from "lucide-react"
import { api } from "@/lib/api"

export function AdminUser() {
  const [users, setUsers] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState("")

  useEffect(() => {
    fetchUsers()
  }, [])

  const fetchUsers = async () => {
    setLoading(true)
    try {
      const res = await api.getUsers()
      setUsers(res.data.data) // Updated to match standardized { data, meta }
    } catch (error) {
      console.error("Gagal mengambil data anggota:", error)
    } finally {
      setLoading(false)
    }
  }

  const filteredUsers = users.filter(u => 
    u.name.toLowerCase().includes(search.toLowerCase()) || 
    u.email.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="flex flex-col gap-8 p-6 md:p-8 animate-in fade-in duration-500">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-foreground uppercase tracking-tighter">Manajemen Anggota</h1>
        <p className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground mt-1 opacity-70">Lihat dan kelola seluruh rekaman data anggota perpustakaan.</p>
      </div>

      <Card className="border border-border/40 shadow-sm rounded-2xl overflow-hidden bg-background">
        <CardHeader className="pb-4 border-b border-border/40 bg-zinc-50/50 dark:bg-zinc-900/20 px-6">
          <div className="relative max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
            <Input 
              placeholder="Cari nama atau email..." 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9 h-10 bg-background border-border/40 rounded-xl text-xs font-medium focus-visible:ring-1 focus-visible:ring-border" 
            />
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border/40 bg-zinc-50/30 dark:bg-zinc-900/10">
                  <th className="text-left text-[10px] font-black uppercase tracking-[0.15em] text-muted-foreground px-6 py-4">Informasi Anggota</th>
                  <th className="text-left text-[10px] font-black uppercase tracking-[0.15em] text-muted-foreground px-6 py-4">Peran</th>
                  <th className="text-left text-[10px] font-black uppercase tracking-[0.15em] text-muted-foreground px-6 py-4 text-center">Pinjaman</th>
                  <th className="text-left text-[10px] font-black uppercase tracking-[0.15em] text-muted-foreground px-6 py-4">Terdaftar Sejak</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/20">
                {loading ? (
                   Array.from({ length: 5 }).map((_, i) => (
                    <tr key={i} className="animate-pulse">
                      <td colSpan={4} className="py-5 px-6"><div className="h-4 bg-muted rounded w-full" /></td>
                    </tr>
                  ))
                ) : filteredUsers.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="py-20 text-center text-[10px] font-black uppercase tracking-widest text-muted-foreground opacity-50 italic">Tidak ada anggota ditemukan.</td>
                  </tr>
                ) : filteredUsers.map((user) => (
                  <tr key={user.id} className="hover:bg-muted/20 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <Avatar className="h-9 w-9 rounded-xl border border-border/40">
                          <AvatarFallback className="text-[10px] font-black bg-zinc-100 dark:bg-zinc-900 text-zinc-600 dark:text-zinc-400">
                            {user.name.charAt(0).toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-black text-xs text-foreground uppercase tracking-tight">{user.name}</p>
                          <p className="text-[10px] font-medium text-muted-foreground font-mono opacity-60 lowercase">{user.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <Badge variant="outline" className={`text-[9px] font-black uppercase tracking-widest gap-1.5 px-2 py-1 rounded-lg border-border/40 ${
                        user.role === "ADMIN" ? "bg-black text-white dark:bg-white dark:text-black" : "bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400"
                      }`}>
                        {user.role === "ADMIN" ? <ShieldCheck className="h-2.5 w-2.5" /> : <User className="h-2.5 w-2.5" />}
                        {user.role}
                      </Badge>
                    </td>
                    <td className="px-6 py-4 text-center">
                       <span className="text-[10px] font-black text-foreground bg-muted/50 px-2.5 py-1 rounded-lg border border-border/20">
                         {user._count?.borrowings || 0}
                       </span>
                    </td>
                    <td className="px-6 py-4 text-[10px] font-bold text-muted-foreground uppercase opacity-70 whitespace-nowrap">
                      {new Date(user.createdAt).toLocaleDateString('id-ID', { month: 'short', year: 'numeric' })}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
