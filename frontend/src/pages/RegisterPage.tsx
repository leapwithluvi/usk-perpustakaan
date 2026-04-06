import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { UserPlus, Loader2, Mail, Lock, User, ArrowLeft, ShieldCheck } from "lucide-react"
import { api } from "@/lib/api"
import { toast } from "sonner"

interface RegisterPageProps {
  onSuccess: () => void
  onSwitchToLogin: () => void
  onBack: () => void
}

export function RegisterPage({ onSuccess, onSwitchToLogin, onBack }: RegisterPageProps) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")
    
    try {
      await api.register(formData)
      toast.success("Registrasi berhasil! Silakan masuk.")
      onSuccess()
    } catch (err: any) {
      setError(err.message || "Gagal mendaftar. Email mungkin sudah digunakan.")
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({ ...prev, [e.target.id]: e.target.value }))
  }

  return (
    <div className="min-h-[80vh] flex items-center justify-center p-6">
      <Card className="w-full max-w-md border-gray-100 dark:border-gray-800 shadow-2xl bg-white/80 dark:bg-gray-950/80 backdrop-blur-xl">
        <CardHeader className="space-y-1 text-center pt-8 pb-4">
          <div className="mx-auto w-12 h-12 rounded-2xl bg-foreground flex items-center justify-center mb-4 shadow-lg">
            <ShieldCheck className="h-6 w-6 text-background" />
          </div>
          <CardTitle className="text-2xl font-black tracking-tighter uppercase">Bergabung Sekarang</CardTitle>
          <CardDescription className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
            Dapatkan Akses Penuh ke Digital Atelier
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6 pb-8">
          <form onSubmit={handleSubmit} className="space-y-4">
             <div className="space-y-2">
              <Label htmlFor="name" className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Nama Lengkap</Label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input 
                  id="name" 
                  placeholder="John Doe" 
                  className="pl-10 h-11 bg-muted/30 border-gray-100 dark:border-gray-800 focus:ring-2 focus:ring-foreground/10"
                  value={formData.name}
                  onChange={handleChange}
                  required 
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="email" className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Email</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input 
                  id="email" 
                  type="email" 
                  placeholder="name@example.com" 
                  className="pl-10 h-11 bg-muted/30 border-gray-100 dark:border-gray-800 focus:ring-2 focus:ring-foreground/10"
                  value={formData.email}
                  onChange={handleChange}
                  required 
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="password" className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Password</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input 
                  id="password" 
                  type="password" 
                  placeholder="Min. 8 Karakter" 
                  className="pl-10 h-11 bg-muted/30 border-gray-100 dark:border-gray-800 focus:ring-2 focus:ring-foreground/10"
                  value={formData.password}
                  onChange={handleChange}
                  required 
                />
              </div>
            </div>

            {error && <p className="text-xs font-bold text-destructive bg-destructive/10 p-3 rounded-lg border border-destructive/20 text-center uppercase tracking-wide">{error}</p>}

            <Button type="submit" className="w-full h-11 font-black uppercase tracking-widest text-xs mt-2" disabled={loading}>
              {loading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <UserPlus className="h-4 w-4 mr-2" />}
              Daftar Akun Baru
            </Button>
          </form>

          <div className="text-center space-y-4">
            <p className="text-xs text-muted-foreground font-medium">
              Sudah punya akun?{" "}
              <button onClick={onSwitchToLogin} className="text-foreground font-black uppercase hover:underline underline-offset-4">Masuk</button>
            </p>
            <button onClick={onBack} className="text-[10px] font-black uppercase tracking-widest text-muted-foreground hover:text-foreground flex items-center justify-center gap-1 mx-auto transition-colors">
              <ArrowLeft className="h-3 w-3" /> Kembali ke Login
            </button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
