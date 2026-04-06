import { useState, useEffect } from "react"
import { Mail, Phone, MapPin, Clock, CheckCircle2, AlertCircle, Timer, Edit2, Check, X, Camera, LogOut, Loader2, BookOpen } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { api, IMAGE_BASE_URL } from "@/lib/api"
import { toast } from "sonner"

interface ProfilePageProps {
  user?: any
  onLogout?: () => void
}

export function ProfilePage({ user: propUser, onLogout }: ProfilePageProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [loading, setLoading] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [borrowings, setBorrowings] = useState<any[]>([])
  const [fetching, setFetching] = useState(true)
  
  const [formData, setFormData] = useState({
    name: propUser?.name || "",
    phone: propUser?.phone || "",
    location: propUser?.location || "",
    avatar: propUser?.avatar || ""
  })

  // Sinkronisasi formData jika propUser berubah
  useEffect(() => {
    if (propUser) {
      setFormData({
        name: propUser.name || "",
        phone: propUser.phone || "",
        location: propUser.location || "",
        avatar: propUser.avatar || ""
      })
    }
  }, [propUser])

  useEffect(() => {
    fetchMyBorrowings()
  }, [])

  const fetchMyBorrowings = async () => {
    setFetching(true)
    try {
      const res = await api.getMyBorrowings()
      setBorrowings(Array.isArray(res.data) ? res.data : [])
    } catch (error) {
      console.error("Gagal mengambil riwayat pinjaman", error)
      setBorrowings([])
    } finally {
      setFetching(false)
    }
  }

  const handleSave = async () => {
    if (!propUser?.id) return
    setLoading(true)
    try {
      await api.updateUser(propUser.id, formData)
      toast.success("Profil berhasil diperbarui. Silakan refresh halaman untuk memuat data terbaru di seluruh sistem.")
      setIsEditing(false)
    } catch (error: any) {
      toast.error(error.message || "Gagal memperbarui profil")
    } finally {
      setLoading(false)
    }
  }

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setUploading(true)
    try {
      const res = await api.uploadImage(file)
      setFormData(prev => ({ ...prev, avatar: res.data.url }))
      toast.success("Foto profil berhasil diunggah")
    } catch (error) {
      toast.error("Gagal mengunggah foto")
    } finally {
      setUploading(false)
    }
  }

  const getStatusDisplay = (status: string) => {
    switch (status) {
      case 'PENDING':
        return { label: 'Verifikasi', color: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400', icon: Timer }
      case 'APPROVED':
        return { label: 'Siap Ambil', color: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400', icon: AlertCircle }
      case 'BORROWED':
        return { label: 'Dipinjam', color: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400', icon: CheckCircle2 }
      case 'RETURNED':
        return { label: 'Selesai', color: 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400', icon: CheckCircle2 }
      case 'REJECTED':
        return { label: 'Ditolak', color: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400', icon: X }
      default:
        return { label: status, color: 'bg-gray-100 text-gray-700', icon: CheckCircle2 }
    }
  }

  const activeLoans = Array.isArray(borrowings) ? borrowings.filter(b => ['PENDING', 'APPROVED', 'BORROWED'].includes(b.status)) : []
  const historyLoans = Array.isArray(borrowings) ? borrowings.filter(b => b.status === 'RETURNED' || b.status === 'REJECTED') : []

  return (
    <div className="max-w-7xl mx-auto px-6 py-12 space-y-12 animate-in fade-in duration-700">
      {/* Profile Header */}
      <Card className="overflow-hidden border-border/40 shadow-xl bg-background/50 backdrop-blur-sm rounded-[2.5rem]">
        <CardContent className="p-10">
          <div className="flex flex-col md:flex-row items-center gap-10">
            <div className="relative group">
               <Avatar className="w-36 h-36 border-4 border-background ring-4 ring-muted shadow-2xl relative overflow-hidden">
                  {formData.avatar ? (
                    <img src={formData.avatar.startsWith('/') ? `${IMAGE_BASE_URL}${formData.avatar}` : formData.avatar} alt={formData.name} className="w-full h-full object-cover" />
                  ) : (
                    <AvatarFallback className="bg-muted text-5xl font-black">{formData.name ? formData.name.charAt(0).toUpperCase() : "?"}</AvatarFallback>
                  )}
                  {uploading && <div className="absolute inset-0 flex items-center justify-center bg-black/40"><Loader2 className="h-8 w-8 animate-spin text-white" /></div>}
               </Avatar>
               {isEditing && !uploading && (
                <label className="absolute inset-0 flex items-center justify-center bg-black/60 rounded-full text-white cursor-pointer opacity-0 group-hover:opacity-100 transition-all">
                  <Camera className="w-8 h-8" />
                  <input type="file" className="hidden" onChange={handleAvatarUpload} accept="image/*" />
                </label>
               )}
            </div>
            
            <div className="flex-1 text-center md:text-left space-y-6">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="space-y-1">
                  {isEditing ? (
                    <Input 
                      value={formData.name} 
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                      className="text-2xl font-black h-14 w-full max-w-md uppercase tracking-tighter rounded-2xl bg-muted/30 border-transparent focus:bg-background"
                    />
                  ) : (
                    <h2 className="text-4xl font-black tracking-tighter uppercase leading-none">{propUser?.name || "Atelier Member"}</h2>
                  )}
                  <p className="text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground opacity-60">ID: {propUser?.id || 'UNSET'}</p>
                </div>
                
                <div className="flex gap-3 justify-center">
                  {isEditing ? (
                    <>
                      <Button variant="outline" size="lg" onClick={() => { setIsEditing(false); setFormData({ name: propUser?.name || "", phone: propUser?.phone || "", location: propUser?.location || "", avatar: propUser?.avatar || "" }) }} className="rounded-2xl font-black uppercase tracking-widest text-[10px] h-12 px-6">
                        <X className="w-4 h-4 mr-2" /> Batal
                      </Button>
                      <Button size="lg" onClick={handleSave} disabled={loading} className="rounded-2xl font-black uppercase tracking-widest text-[10px] h-12 px-8 bg-black dark:bg-white text-white dark:text-black">
                        {loading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Check className="w-4 h-4 mr-2" />} Simpan
                      </Button>
                    </>
                  ) : (
                    <div className="flex gap-3">
                        <Button variant="outline" size="lg" onClick={() => setIsEditing(true)} className="rounded-2xl font-black uppercase tracking-widest text-[10px] h-12 px-8 border-border/60 hover:bg-muted">
                          <Edit2 className="w-4 h-4 mr-2" /> Edit Profil
                        </Button>
                        <Button variant="destructive" size="lg" onClick={onLogout} className="rounded-2xl font-black uppercase tracking-widest text-[10px] h-12 px-8 shadow-lg shadow-red-500/10">
                          <LogOut className="w-4 h-4 mr-2" /> Logout
                        </Button>
                    </div>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-2">
                <div className="space-y-4">
                  <div className="flex items-center gap-4 text-sm">
                    <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center shrink-0">
                      <Mail className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                    </div>
                    <div className="flex flex-col">
                       <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground opacity-50">Email Address</span>
                       <span className="font-bold">{propUser?.email}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 text-sm">
                    <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-900/20 flex items-center justify-center shrink-0">
                      <Phone className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                    </div>
                    <div className="flex flex-col flex-1">
                       <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground opacity-50">Phone Connection</span>
                       {isEditing ? (
                         <Input 
                           value={formData.phone} 
                           onChange={(e) => setFormData({...formData, phone: e.target.value})}
                           className="h-10 text-xs font-bold mt-1 rounded-xl bg-muted/30 border-transparent"
                           placeholder="08xx-xxxx-xxxx"
                         />
                       ) : <span className="font-bold">{propUser?.phone || "-"}</span>}
                    </div>
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="flex items-center gap-4 text-sm">
                    <div className="w-10 h-10 rounded-xl bg-amber-50 dark:bg-amber-900/20 flex items-center justify-center shrink-0">
                      <MapPin className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                    </div>
                    <div className="flex flex-col flex-1">
                       <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground opacity-50">Physical Location</span>
                       {isEditing ? (
                         <Input 
                           value={formData.location} 
                           onChange={(e) => setFormData({...formData, location: e.target.value})}
                           className="h-10 text-xs font-bold mt-1 rounded-xl bg-muted/30 border-transparent"
                           placeholder="City, Country"
                         />
                       ) : <span className="font-bold">{propUser?.location || "-"}</span>}
                    </div>
                  </div>
                  <div className="flex items-center gap-4 text-sm">
                    <div className="w-10 h-10 rounded-xl bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center shrink-0">
                      <Clock className="w-4 h-4 text-zinc-600 dark:text-zinc-400" />
                    </div>
                    <div className="flex flex-col">
                       <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground opacity-50">Access Status</span>
                       <span className="text-xs uppercase font-black tracking-widest">{propUser?.role === 'ADMIN' ? 'Imperial Architect' : 'Atelier Member'}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {[
          { label: "Buku Aktif", value: activeLoans.length.toString(), sub: "Sedang diproses / dipinjam", color: "text-blue-600" },
          { label: "Total Koleksi", value: historyLoans.length.toString(), sub: "Buku yang sudah terselesaikan", color: "text-emerald-600" }
        ].map((stat, i) => (
          <Card key={i} className="border-border/40 shadow-lg relative overflow-hidden rounded-3xl group">
            <CardContent className="p-10 flex items-center justify-between">
              <div className="space-y-2">
                <div className="text-xs font-black uppercase tracking-[0.3em] text-muted-foreground">{stat.label}</div>
                <div className="text-[10px] text-muted-foreground/60 uppercase font-bold tracking-widest">{stat.sub}</div>
              </div>
              <div className={`text-8xl font-black tracking-tighter opacity-[0.03] absolute right-10 top-1/2 -translate-y-1/2 group-hover:scale-110 transition-transform duration-700 ${stat.color}`}>{stat.value}</div>
              <div className="text-6xl font-black tracking-tighter relative z-10">{stat.value}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Main Sections Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* Active Loans */}
        <div className="lg:col-span-8 space-y-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
               <div className="w-12 h-1 px-4 bg-black dark:bg-white rounded-full" />
               <h3 className="text-3xl font-black uppercase tracking-tighter">Current Archives</h3>
            </div>
            <Badge variant="outline" className="border-border font-black tracking-[0.2em] text-[9px] px-3 py-1">ACTIVE SESSION</Badge>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {fetching ? (
               Array.from({ length: 2 }).map((_, i) => (
                 <div key={i} className="h-56 rounded-3xl bg-muted animate-pulse" />
               ))
            ) : activeLoans.length === 0 ? (
               <div className="col-span-full py-20 border border-dashed border-border rounded-[2.5rem] flex flex-col items-center justify-center text-center space-y-4">
                  <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center">
                    <BookOpen className="w-8 h-8 text-muted-foreground opacity-30" />
                  </div>
                  <div className="space-y-1">
                    <p className="font-black uppercase tracking-widest text-xs text-muted-foreground">Tidak Ada Peminjaman Aktif</p>
                    <p className="text-[10px] text-muted-foreground/60">Jelajahi katalog dan mulai bangun koleksi Anda.</p>
                  </div>
               </div>
            ) : activeLoans.map((loan) => {
              const display = getStatusDisplay(loan.status)
              const StatusIcon = display.icon
 
              return (
                <Card key={loan.id} className="overflow-hidden border-border/40 shadow-sm group hover:shadow-2xl hover:-translate-y-1 transition-all duration-500 rounded-[2rem] bg-background/50">
                  <CardContent className="p-0 flex h-52">
                    <div className="w-32 h-full relative overflow-hidden shrink-0 bg-muted">
                      <img 
                        src={loan.book.coverImage && loan.book.coverImage.startsWith('/') ? `${IMAGE_BASE_URL}${loan.book.coverImage}` : (loan.book.coverImage || "https://placehold.co/400x600")} 
                        alt={loan.book.title} 
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" 
                      />
                      <div className="absolute inset-0 bg-black/5" />
                    </div>
                    <div className="flex-1 p-6 flex flex-col justify-between overflow-hidden">
                      <div className="space-y-3">
                        <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest shadow-sm ${display.color}`}>
                          <StatusIcon className="w-3.5 h-3.5" />
                          {display.label}
                        </div>
                        <h4 className="font-black text-sm line-clamp-2 leading-tight uppercase group-hover:text-foreground transition-colors tracking-tight">{loan.book.title}</h4>
                      </div>
                      <div className="pt-5 border-t border-border/40 mt-2">
                        {loan.status === 'APPROVED' && loan.pickupCode && (
                          <div className="space-y-1">
                            <p className="text-[9px] font-black text-muted-foreground uppercase tracking-[0.2em] opacity-60">Verification Pickup</p>
                            <div className="text-2xl font-black tracking-widest text-blue-600 font-mono">{loan.pickupCode}</div>
                          </div>
                        )}
                        {loan.status === 'BORROWED' && loan.returnCode && (
                          <div className="space-y-1">
                            <p className="text-[9px] font-black text-muted-foreground uppercase tracking-[0.2em] opacity-60">Verification Return</p>
                            <div className="text-2xl font-black tracking-widest text-emerald-600 font-mono">{loan.returnCode}</div>
                          </div>
                        )}
                        {loan.status === 'PENDING' && (
                          <p className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/40 italic">Waiting approval...</p>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </div>

        {/* History Sidebar */}
        <div className="lg:col-span-4 space-y-8">
          <div className="flex items-center justify-between">
            <h3 className="text-3xl font-black uppercase tracking-tighter">Legacy</h3>
            <Badge variant="outline" className="border-border font-black tracking-[0.2em] text-[9px] px-3 py-1">FINISHED</Badge>
          </div>
          <div className="space-y-5">
            {fetching ? (
               Array.from({ length: 3 }).map((_, i) => (
                 <div key={i} className="h-20 rounded-2xl bg-muted animate-pulse" />
               ))
            ) : historyLoans.length === 0 ? (
               <div className="py-12 text-center border border-dashed border-border rounded-3xl opacity-30">
                  <p className="text-[10px] font-black uppercase tracking-widest">Belum ada riwayat</p>
               </div>
            ) : historyLoans.map((loan) => {
              return (
                <div key={loan.id} className="flex gap-5 p-5 rounded-[1.5rem] border border-border/40 bg-muted/20 hover:bg-background hover:shadow-xl transition-all duration-300 group">
                  <div className="w-14 h-20 rounded-xl overflow-hidden shrink-0 border border-border/40 shadow-sm relative">
                    <img 
                      src={loan.book.coverImage && loan.book.coverImage.startsWith('/') ? `${IMAGE_BASE_URL}${loan.book.coverImage}` : (loan.book.coverImage || "https://placehold.co/400x600")} 
                      className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500" 
                    />
                  </div>
                  <div className="flex-1 space-y-2 overflow-hidden flex flex-col justify-center">
                    <h5 className="font-black text-xs uppercase line-clamp-1 tracking-tight">{loan.book.title}</h5>
                    <div className="flex items-center justify-between">
                       <p className="text-[9px] text-muted-foreground font-black uppercase tracking-widest">{new Date(loan.updatedAt).toLocaleDateString()}</p>
                       <div className={`flex items-center gap-1.5 text-[9px] font-black uppercase tracking-widest ${loan.status === 'RETURNED' ? 'text-emerald-500' : 'text-red-500'}`}>
                         {loan.status === 'RETURNED' ? (
                           <><CheckCircle2 className="w-3 h-3" /> Returned</>
                         ) : (
                           <><X className="w-3 h-3" /> Rejected</>
                         )}
                       </div>
                    </div>
                  </div>
                </div>
              )
            })}
            <Button variant="ghost" className="w-full h-12 rounded-2xl text-[10px] font-black uppercase tracking-[0.3em] border border-dashed border-border/60 hover:border-foreground/20 transition-all">
              Jelajahi Arsip Lainnya
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
