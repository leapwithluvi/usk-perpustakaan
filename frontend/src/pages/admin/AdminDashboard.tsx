import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  BookOpen,
  Users,
  ClipboardList,
  TrendingUp,
  Clock,
  CheckCircle2,
  XCircle,
  ArrowUpRight,
} from "lucide-react"
import { api } from "@/lib/api"

const statusConfig: Record<string, { label: string; className: string; icon: any }> = {
  PENDING:  { label: "Menunggu",   className: "bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-400 border-amber-200 dark:border-amber-800",  icon: Clock },
  APPROVED: { label: "Disetujui", className: "bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-400 border-blue-200 dark:border-blue-800", icon: CheckCircle2 },
  BORROWED: { label: "Dipinjam",  className: "bg-violet-100 text-violet-700 dark:bg-violet-900/40 dark:text-violet-400 border-violet-200 dark:border-violet-800", icon: BookOpen },
  RETURNED: { label: "Dikembalikan", className: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800", icon: CheckCircle2 },
  REJECTED: { label: "Ditolak",   className: "bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-400 border-red-200 dark:border-red-800", icon: XCircle },
}

export function AdminDashboard() {
  const [stats, setStats] = useState([
    { label: "Total Buku", value: "0", change: "Memuat...", icon: BookOpen, trend: "up" },
    { label: "Total Anggota", value: "0", change: "Memuat...", icon: Users, trend: "up" },
    { label: "Sedang Dipinjam", value: "0", change: "Memuat...", icon: ClipboardList, trend: "neutral" },
    { label: "Menunggu Diproses", value: "0", change: "Memuat...", icon: Clock, trend: "warn" },
  ])
  const [recentBorrowings, setRecentBorrowings] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchDashboardData()
  }, [])

  const fetchDashboardData = async () => {
    setLoading(true)
    try {
      const [statsRes, borrowRes] = await Promise.all([
        api.getDashboardStats(),
        api.getBorrowings({ limit: 5 })
      ])

      const { totalBooks, totalUsers, totalBorrowed, pendingBorrowings } = statsRes.data
      const recent = borrowRes.data.data || []

      setStats([
        { 
          label: "Total Buku", 
          value: totalBooks.toLocaleString(), 
          change: `+${totalBooks} koleksi arsip`, 
          icon: BookOpen, 
          trend: "up" 
        },
        { 
          label: "Total Anggota", 
          value: totalUsers.toLocaleString(), 
          change: "Anggota aktif", 
          icon: Users, 
          trend: "up" 
        },
        { 
          label: "Sedang Dipinjam", 
          value: totalBorrowed.toString(), 
          change: "Aktif saat ini", 
          icon: ClipboardList, 
          trend: "neutral" 
        },
        { 
          label: "Menunggu Diproses", 
          value: pendingBorrowings.toString(), 
          change: "Butuh tindakan", 
          icon: Clock, 
          trend: "warn" 
        },
      ])

      setRecentBorrowings(recent.map((b: any) => ({
        id: b.id?.toString().substring(0, 8) || "N/A",
        user: b.user?.name || "Anonim",
        book: b.book?.title || "Buku Dihapus",
        status: b.status,
        date: new Date(b.createdAt).toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' })
      })))
    } catch (error) {
      console.error("Gagal memuat dashboard:", error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex flex-col gap-8 p-6 md:p-8 animate-in fade-in duration-500">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-foreground">Dashboard Admin</h1>
        <p className="text-sm text-muted-foreground mt-1 text-zinc-500 font-medium uppercase tracking-[0.05em]">Selamat datang kembali. Ringkasan sistem real-time.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {stats.map((stat) => {
          const Icon = stat.icon
          return (
            <Card key={stat.label} className="border border-border/40 shadow-sm hover:shadow-md transition-all duration-300 rounded-2xl group">
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <p className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground mb-3 opacity-60 group-hover:opacity-100 transition-opacity">{stat.label}</p>
                    <p className="text-3xl font-black tracking-tighter text-foreground">{stat.value}</p>
                    <p className="text-[10px] font-medium text-muted-foreground mt-3 flex items-center gap-1.5">
                      {stat.trend === "up" && <TrendingUp className="h-3 w-3 text-emerald-500" />}
                      {stat.change}
                    </p>
                  </div>
                  <div className={`p-3 rounded-2xl transition-colors ${
                    stat.trend === "up" ? "bg-emerald-50 dark:bg-emerald-950/30 group-hover:bg-emerald-100" :
                    stat.trend === "warn" ? "bg-amber-50 dark:bg-amber-950/30 group-hover:bg-amber-100" :
                    "bg-zinc-100 dark:bg-zinc-900 group-hover:bg-zinc-200"
                  }`}>
                    <Icon className={`h-5 w-5 ${
                      stat.trend === "up" ? "text-emerald-600 dark:text-emerald-400" :
                      stat.trend === "warn" ? "text-amber-600 dark:text-amber-400" :
                      "text-zinc-500"
                    }`} />
                  </div>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Recent Borrowings Table */}
      <Card className="border border-border/40 shadow-sm rounded-2xl overflow-hidden">
        <CardHeader className="pb-4 border-b border-border/40 bg-zinc-50/50 dark:bg-zinc-900/20 px-6">
          <div className="flex items-center justify-between">
            <CardTitle className="text-[10px] font-black uppercase tracking-[0.2em] text-foreground opacity-70">
              Peminjaman Terbaru
            </CardTitle>
            <button className="text-[10px] font-black uppercase tracking-widest text-muted-foreground hover:text-foreground flex items-center gap-1.5 transition-colors">
              Lihat semua <ArrowUpRight className="h-3.5 w-3.5" />
            </button>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border/40 bg-zinc-50/30 dark:bg-zinc-900/10">
                  <th className="text-left text-[10px] font-black uppercase tracking-[0.15em] text-muted-foreground px-6 py-4">ID</th>
                  <th className="text-left text-[10px] font-black uppercase tracking-[0.15em] text-muted-foreground px-6 py-4">Anggota</th>
                  <th className="text-left text-[10px] font-black uppercase tracking-[0.15em] text-muted-foreground px-6 py-4">Buku</th>
                  <th className="text-left text-[10px] font-black uppercase tracking-[0.15em] text-muted-foreground px-6 py-4">Status</th>
                  <th className="text-left text-[10px] font-black uppercase tracking-[0.15em] text-muted-foreground px-6 py-4">Tanggal</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/20">
                {loading ? (
                   Array.from({ length: 5 }).map((_, i) => (
                    <tr key={i} className="animate-pulse">
                      <td colSpan={5} className="py-5 px-6"><div className="h-4 bg-muted rounded w-full" /></td>
                    </tr>
                  ))
                ) : recentBorrowings.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="py-12 text-center text-[10px] font-black uppercase tracking-widest text-muted-foreground opacity-50 italic">Belum ada riwayat peminjaman.</td>
                  </tr>
                ) : recentBorrowings.map((row) => {
                  const cfg = statusConfig[row.status] || statusConfig.PENDING
                  const StatusIcon = cfg.icon
                  return (
                    <tr key={row.id} className="hover:bg-muted/30 transition-colors">
                      <td className="px-6 py-4 font-mono text-[10px] text-muted-foreground font-bold">{row.id}</td>
                      <td className="px-6 py-4 font-black text-xs text-foreground uppercase tracking-tight">{row.user}</td>
                      <td className="px-6 py-4 text-xs font-semibold text-zinc-600 dark:text-zinc-400">{row.book}</td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest border shadow-sm ${cfg.className}`}>
                          <StatusIcon className="h-2.5 w-2.5" />
                          {cfg.label}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-[10px] font-bold text-muted-foreground uppercase opacity-70 whitespace-nowrap">{row.date}</td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
