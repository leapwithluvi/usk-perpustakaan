import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { CheckCircle2, Clock, BookOpen, XCircle, RotateCcw, Key, Loader2 } from "lucide-react"
import { api, IMAGE_BASE_URL } from "@/lib/api"
import { toast } from "sonner"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"

type Status = "ALL" | "PENDING" | "APPROVED" | "BORROWED" | "RETURNED" | "REJECTED"

const tabs: { label: string; value: Status; icon: any }[] = [
  { label: "Semua",       value: "ALL",      icon: RotateCcw },
  { label: "Menunggu",    value: "PENDING",  icon: Clock },
  { label: "Disetujui",  value: "APPROVED", icon: CheckCircle2 },
  { label: "Dipinjam",   value: "BORROWED", icon: BookOpen },
  { label: "Dikembalikan", value: "RETURNED", icon: CheckCircle2 },
  { label: "Ditolak",    value: "REJECTED", icon: XCircle },
]

const statusConfig: Record<string, { label: string; className: string }> = {
  PENDING:  { label: "Menunggu",      className: "bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-400 border-amber-200 dark:border-amber-800" },
  APPROVED: { label: "Disetujui",    className: "bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-400 border-blue-200 dark:border-blue-800" },
  BORROWED: { label: "Dipinjam",     className: "bg-violet-100 text-violet-700 dark:bg-violet-900/40 dark:text-violet-400 border-violet-200 dark:border-violet-800" },
  RETURNED: { label: "Dikembalikan", className: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800" },
  REJECTED: { label: "Ditolak",      className: "bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-400 border-red-200 dark:border-red-800" },
}

export function AdminPinjaman() {
  const [activeTab, setActiveTab] = useState<Status>("ALL")
  const [borrowings, setBorrowings] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [isUpdating, setIsUpdating] = useState(false)
  
  // Modal State
  const [codeModal, setCodeModal] = useState({
    isOpen: false,
    id: "",
    status: "",
    title: "",
    value: ""
  })

  useEffect(() => {
    fetchBorrowings()
  }, [activeTab])

  const fetchBorrowings = async () => {
    setLoading(true)
    try {
      const res = await api.getBorrowings({ 
        status: activeTab === "ALL" ? undefined : activeTab,
        limit: 50 
      })
      setBorrowings(res.data.data)
    } catch (error) {
      console.error("Gagal mengambil data pinjaman:", error)
      toast.error("Gagal memuat data pinjaman")
    } finally {
      setLoading(false)
    }
  }

  const handleUpdateStatus = async (id: string, status: string, code?: string) => {
    setIsUpdating(true)
    try {
      await api.updateBorrowing(id, { status, code })
      toast.success(`Status peminjaman berhasil diubah ke ${status}`)
      setCodeModal(prev => ({ ...prev, isOpen: false, value: "" }))
      fetchBorrowings()
    } catch (error: any) {
      toast.error(error.message || "Gagal memperbarui status")
    } finally {
      setIsUpdating(false)
    }
  }

  const openCodeModal = (id: string, status: string, title: string) => {
    setCodeModal({
      isOpen: true,
      id,
      status,
      title,
      value: ""
    })
  }

  return (
    <div className="flex flex-col gap-8 p-6 md:p-8 animate-in fade-in duration-500">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-foreground uppercase tracking-tighter">Manajemen Pinjaman</h1>
        <p className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground mt-1 opacity-70">Proses pengajuan, setujui, dan pantau pengembalian koleksi arsip.</p>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-1 overflow-x-auto pb-1 scrollbar-hide">
        {tabs.map((tab) => {
            const TabIcon = tab.icon
            return (
              <button
                key={tab.value}
                onClick={() => setActiveTab(tab.value)}
                className={`inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all whitespace-nowrap border border-transparent ${
                  activeTab === tab.value
                    ? "bg-black dark:bg-white text-white dark:text-black shadow-lg shadow-black/5"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                }`}
              >
                <TabIcon className="h-3 w-3" />
                {tab.label}
              </button>
            )
          })}
      </div>

      <Card className="border border-border/40 shadow-sm rounded-2xl overflow-hidden bg-background">
        <CardContent className="p-0">
          {loading ? (
            <div className="py-20 flex flex-col items-center justify-center gap-4">
              <div className="w-8 h-8 border-4 border-zinc-200 border-t-zinc-800 rounded-full animate-spin dark:border-zinc-800 dark:border-t-zinc-200" />
              <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground animate-pulse">Menghubungkan ke arsip...</p>
            </div>
          ) : borrowings.length === 0 ? (
            <div className="py-20 text-center flex flex-col items-center justify-center gap-2">
              <XCircle className="h-8 w-8 text-muted-foreground/30" />
              <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Tidak ada rekaman untuk klasifikasi ini.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border/40 bg-zinc-50/50 dark:bg-zinc-900/20">
                    <th className="text-left text-[10px] font-black uppercase tracking-[0.15em] text-muted-foreground px-6 py-4">ID</th>
                    <th className="text-left text-[10px] font-black uppercase tracking-[0.15em] text-muted-foreground px-6 py-4">Peminjam</th>
                    <th className="text-left text-[10px] font-black uppercase tracking-[0.15em] text-muted-foreground px-6 py-4">Buku</th>
                    <th className="text-left text-[10px] font-black uppercase tracking-[0.15em] text-muted-foreground px-6 py-4">Jatuh Tempo</th>
                    <th className="text-left text-[10px] font-black uppercase tracking-[0.15em] text-muted-foreground px-6 py-4">Status</th>
                    <th className="text-right text-[10px] font-black uppercase tracking-[0.15em] text-muted-foreground px-6 py-4">Manajemen</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/20">
                  {borrowings.map((row) => {
                    const cfg = statusConfig[row.status] || statusConfig.PENDING
                    return (
                      <tr key={row.id} className="hover:bg-muted/20 transition-colors">
                        <td className="px-6 py-4 font-mono text-[10px] text-muted-foreground font-bold">{row.id?.toString().substring(0, 8) || "N/A"}</td>
                        <td className="px-6 py-4 font-black text-xs text-foreground uppercase tracking-tight">{row.user?.name || "Anonim"}</td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="h-10 w-7 rounded shadow-sm border overflow-hidden shrink-0 bg-muted">
                              <img 
                                src={row.book?.coverImage && row.book.coverImage.startsWith("/") 
                                  ? `${IMAGE_BASE_URL}${row.book.coverImage}` 
                                  : (row.book?.coverImage || "https://placehold.co/400x600?text=No+Cover")
                                } 
                                alt="" 
                                className="h-full w-full object-cover" 
                              />
                            </div>
                            <span className="text-xs font-semibold text-zinc-600 dark:text-zinc-400 max-w-[200px] truncate">{row.book?.title || "Buku Dihapus"}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-[10px] font-bold text-muted-foreground uppercase opacity-70">
                          {row.dueDate ? new Date(row.dueDate).toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' }) : "-"}
                        </td>
                        <td className="px-6 py-4">
                          <span className={`inline-flex px-2.5 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest border shadow-sm ${cfg.className}`}>
                            {cfg.label}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <div className="flex justify-end gap-2">
                             {row.status === 'PENDING' && (
                               <Button 
                                 onClick={() => handleUpdateStatus(row.id, 'APPROVED')}
                                 className="h-8 bg-black text-white dark:bg-white dark:text-black text-[9px] font-black uppercase tracking-widest rounded-lg px-4"
                               >
                                 Setujui
                               </Button>
                             )}
                             {row.status === 'APPROVED' && (
                               <Button 
                                 onClick={() => openCodeModal(row.id, 'BORROWED', 'Kode Pengambilan')}
                                 className="h-8 bg-blue-600 text-white text-[9px] font-black uppercase tracking-widest rounded-lg px-4 flex items-center gap-1.5"
                               >
                                 <Key className="h-3 w-3" /> Konfirmasi Ambil
                               </Button>
                             )}
                             {row.status === 'BORROWED' && (
                               <Button 
                                 onClick={() => openCodeModal(row.id, 'RETURNED', 'Kode Pengembalian')}
                                 className="h-8 bg-emerald-600 text-white text-[9px] font-black uppercase tracking-widest rounded-lg px-4 flex items-center gap-1.5"
                               >
                                 <RotateCcw className="h-3 w-3" /> Konfirmasi Kembali
                               </Button>
                             )}
                             <Button variant="ghost" size="sm" className="h-8 text-[10px] font-black uppercase tracking-widest border border-border/40 rounded-lg">Detail</Button>
                          </div>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Code Input Modal */}
      <Dialog 
        open={codeModal.isOpen} 
        onOpenChange={(open) => !open && setCodeModal(prev => ({ ...prev, isOpen: false }))}
      >
        <DialogContent className="sm:max-w-[400px] border-none shadow-2xl rounded-[2rem] p-8 space-y-6 bg-white dark:bg-gray-950">
          <DialogHeader className="space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center text-blue-600 dark:text-blue-400">
               <Key className="h-6 w-6" />
            </div>
            <div className="space-y-1">
              <DialogTitle className="text-2xl font-black uppercase tracking-tighter">
                {codeModal.title}
              </DialogTitle>
              <DialogDescription className="text-xs font-bold text-muted-foreground uppercase tracking-widest opacity-60">
                Verifikasi Transaksi Arsip
              </DialogDescription>
            </div>
          </DialogHeader>

          <div className="space-y-4 py-2">
            <p className="text-sm font-medium text-gray-500 dark:text-gray-400 leading-relaxed">
              Masukkan kode verifikasi yang diberikan oleh anggota untuk melanjutkan proses 
              <span className="font-black text-foreground mx-1">{codeModal.status === "BORROWED" ? "PENGAMBILAN" : "PENGEMBALIAN"}</span>.
            </p>
            <Input 
              placeholder="Contoh: ATX-12345"
              value={codeModal.value}
              onChange={(e) => setCodeModal(prev => ({ ...prev, value: e.target.value.toUpperCase() }))}
              onKeyDown={(e) => e.key === "Enter" && handleUpdateStatus(codeModal.id, codeModal.status, codeModal.value)}
              className="h-14 rounded-2xl border-gray-100 dark:border-white/10 bg-gray-50/50 dark:bg-white/5 font-mono text-lg tracking-widest text-center focus-visible:ring-black dark:focus-visible:ring-white transition-all uppercase"
              autoFocus
            />
          </div>

          <DialogFooter className="flex gap-3 sm:gap-3 flex-row pt-2">
            <Button
              variant="outline"
              onClick={() => setCodeModal(prev => ({ ...prev, isOpen: false }))}
              disabled={isUpdating}
              className="flex-1 h-14 rounded-2xl border-gray-100 dark:border-white/10 font-bold uppercase tracking-widest text-[10px] hover:bg-gray-50 dark:hover:bg-white/5 transition-all"
            >
              Batal
            </Button>
            <Button
              onClick={() => handleUpdateStatus(codeModal.id, codeModal.status, codeModal.value)}
              disabled={isUpdating || !codeModal.value.trim()}
              className="flex-1 h-14 rounded-2xl bg-black dark:bg-white text-white dark:text-black font-bold uppercase tracking-widest text-[10px] shadow-lg shadow-black/10 transition-all active:scale-95"
            >
              {isUpdating ? <Loader2 className="h-4 w-4 animate-spin" /> : "Verifikasi"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
