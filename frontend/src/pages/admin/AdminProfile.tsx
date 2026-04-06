import { useState } from "react"
import { User, Mail, Shield, Clock, Save, Key, Phone, MapPin, Loader2, Camera } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { api, IMAGE_BASE_URL } from "@/lib/api"
import { toast } from "sonner"

export function AdminProfile({ user: initialUser }: { user: any }) {
  const [loading, setLoading] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [formData, setFormData] = useState({
    name: initialUser?.name || "",
    phone: initialUser?.phone || "",
    location: initialUser?.location || "",
    avatar: initialUser?.avatar || "",
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }))
  }

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setUploading(true)
    try {
      const res = await api.uploadImage(file)
      const url = res.data.url
      setFormData(prev => ({ ...prev, avatar: url }))
      toast.success("Foto profil berhasil diunggah")
    } catch (error) {
      toast.error("Gagal mengunggah foto")
    } finally {
      setUploading(false)
    }
  }

  const handleSave = async () => {
    if (!initialUser?.id) return
    setLoading(true)
    try {
      await api.updateUser(initialUser.id, formData)
      toast.success("Profil Anda berhasil diperbarui. Silakan refresh untuk melihat perubahan di header.")
    } catch (error: any) {
      toast.error(error.message || "Gagal memperbarui profil")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex flex-col gap-8 p-6 md:p-8 animate-in fade-in duration-500">
      {/* Header Halaman */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-foreground uppercase tracking-tighter">Profil Administrator</h1>
        <p className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground mt-1 opacity-70">
          Kelola informasi akun dan pengaturan identitas publik Anda.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Kolom Kiri: Info Profil & Avatar */}
        <div className="lg:col-span-4 space-y-6">
          <Card className="border border-border/40 shadow-sm rounded-3xl overflow-hidden">
            <div className="h-24 bg-gradient-to-r from-zinc-900 to-zinc-800 dark:from-zinc-100 dark:to-zinc-300" />
            <CardContent className="px-6 pb-8 -mt-12 text-center">
              <div className="relative inline-block group">
                 <Avatar className="h-24 w-24 border-4 border-background mx-auto shadow-xl">
                    {formData.avatar ? (
                      <img src={formData.avatar.startsWith('/') ? `${IMAGE_BASE_URL}${formData.avatar}` : formData.avatar} alt={formData.name} className="h-full w-full object-cover" />
                    ) : (
                      <AvatarFallback className="text-2xl font-black bg-foreground text-background">
                        {formData.name?.charAt(0) || "A"}
                      </AvatarFallback>
                    )}
                 </Avatar>
                 <label className="absolute inset-0 flex items-center justify-center bg-black/60 rounded-full opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                    <Camera className="h-6 w-6 text-white" />
                    <input type="file" className="hidden" onChange={handleAvatarUpload} accept="image/*" />
                 </label>
                 {uploading && <div className="absolute inset-0 flex items-center justify-center bg-black/20 rounded-full"><Loader2 className="h-6 w-6 animate-spin text-white" /></div>}
              </div>
              <div className="mt-4 space-y-1">
                <h3 className="text-lg font-black uppercase tracking-tight">{initialUser?.name || "Super Admin"}</h3>
                <p className="text-[9px] font-bold text-muted-foreground uppercase tracking-[0.2em]">{initialUser?.role || "ADMINISTRATOR"}</p>
              </div>
              <div className="mt-6 flex flex-wrap justify-center gap-2">
                 <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 dark:bg-emerald-950/30 dark:text-emerald-400 text-[10px] font-black uppercase tracking-widest border border-emerald-100 dark:border-emerald-800">
                    <Shield className="h-3 w-3" /> Akses Penuh Sistem
                 </span>
              </div>
            </CardContent>
          </Card>

          <Card className="border border-border/40 shadow-sm rounded-3xl">
            <CardHeader className="pb-2">
              <CardTitle className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground opacity-70">
                Informasi Registrasi
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between py-2 border-b border-border/20">
                <div className="flex items-center gap-3">
                  <Clock className="h-4 w-4 text-muted-foreground" />
                  <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Bergabung Sejak</span>
                </div>
                <span className="text-[10px] font-black uppercase tracking-widest">{initialUser?.createdAt ? new Date(initialUser.createdAt).toLocaleDateString('id-ID') : '-'}</span>
              </div>
              <div className="flex items-center justify-between py-2">
                <div className="flex items-center gap-3">
                  <Shield className="h-4 w-4 text-muted-foreground" />
                  <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Verifikasi</span>
                </div>
                <span className="text-[10px] font-black text-emerald-500 uppercase tracking-widest">Digital Atelier</span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Kolom Kanan: Form Pengaturan Akun */}
        <div className="lg:col-span-8 space-y-6">
          <Card className="border border-border/40 shadow-sm rounded-[2.5rem] overflow-hidden">
            <CardHeader className="bg-zinc-50/50 dark:bg-zinc-900/20 border-b border-border/40 p-8">
              <CardTitle className="text-[10px] font-black uppercase tracking-[0.2em] text-foreground">
                Informasi Identitas & Kontak
              </CardTitle>
            </CardHeader>
            <CardContent className="p-10 space-y-10">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-3">
                  <label className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground ml-1">Nama Lengkap</label>
                  <div className="relative">
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input 
                      name="name"
                      value={formData.name} 
                      onChange={handleChange}
                      placeholder="Masukkan nama lengkap"
                      className="pl-12 h-14 rounded-2xl bg-muted/30 border-transparent focus:bg-background transition-all font-bold text-sm"
                    />
                  </div>
                </div>
                <div className="space-y-3">
                  <label className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground ml-1">Nomor Telepon</label>
                  <div className="relative">
                    <Phone className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input 
                      name="phone"
                      value={formData.phone} 
                      onChange={handleChange}
                      placeholder="08xx-xxxx-xxxx"
                      className="pl-12 h-14 rounded-2xl bg-muted/30 border-transparent focus:bg-background transition-all font-bold text-sm"
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-3">
                  <label className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground ml-1">Lokasi / Alamat</label>
                  <div className="relative">
                    <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input 
                      name="location"
                      value={formData.location} 
                      onChange={handleChange}
                      placeholder="Contoh: Jakarta, Indonesia"
                      className="pl-12 h-14 rounded-2xl bg-muted/30 border-transparent focus:bg-background transition-all font-bold text-sm"
                    />
                  </div>
                </div>
                <div className="space-y-3">
                  <label className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground ml-1">Email (Terkunci)</label>
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground/30" />
                    <Input 
                      value={initialUser?.email} 
                      readOnly 
                      disabled
                      className="pl-12 h-14 rounded-2xl bg-muted/50 border-transparent font-bold text-sm opacity-50 cursor-not-allowed"
                    />
                  </div>
                </div>
              </div>

              <div className="flex justify-end pt-4">
                <Button 
                  onClick={handleSave}
                  disabled={loading}
                  className="rounded-2xl h-14 px-10 font-black uppercase tracking-[0.2em] text-[10px] shadow-2xl bg-black dark:bg-white text-white dark:text-black hover:scale-[1.02] active:scale-[0.98] transition-all"
                >
                  {loading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Save className="h-4 w-4 mr-2" />}
                  Simpan Perubahan
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card className="border border-border/40 shadow-sm rounded-3xl overflow-hidden border-dashed">
            <CardHeader className="p-8">
               <CardTitle className="text-[10px] font-black uppercase tracking-[0.2em] text-amber-600 dark:text-amber-400">
                Keamanan & Akses
              </CardTitle>
            </CardHeader>
            <CardContent className="p-8 pt-0 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="h-12 w-12 rounded-2xl bg-amber-50 dark:bg-amber-900/30 flex items-center justify-center">
                  <Key className="h-6 w-6 text-amber-600 dark:text-amber-400" />
                </div>
                <div>
                  <h4 className="text-sm font-black uppercase tracking-tight">Kredensial Sesi</h4>
                  <p className="text-[10px] text-muted-foreground font-black uppercase tracking-widest opacity-60">Ubah sandi login untuk keamanan archive luar.</p>
                </div>
              </div>
              <Button variant="outline" className="rounded-xl h-11 px-6 font-black uppercase tracking-widest text-[10px]">Ubah Password</Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
