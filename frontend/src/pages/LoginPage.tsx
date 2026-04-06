import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { LogIn, Loader2, Mail, Lock, ArrowRight, Book } from "lucide-react"
import { api, setAuthToken } from "@/lib/api"

interface LoginPageProps {
  onSuccess: (user: any) => void
  onSwitchToRegister: () => void
  onBack: () => void
}

export function LoginPage({ onSuccess, onSwitchToRegister, onBack }: LoginPageProps) {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")
    
    try {
      const res = await api.login({ email, password })
      setAuthToken(res.data.tokens.accessToken)
      onSuccess(res.data.user)
    } catch (err: any) {
      setError(err.message || "Email atau password salah")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-8">
      <Card className="w-full max-w-md border-gray-100 dark:border-gray-800 shadow-2xl bg-white/80 dark:bg-gray-950/80 backdrop-blur-xl">
        <CardHeader className="space-y-1 text-center pt-8 pb-4">
          <div className="mx-auto w-12 h-12 rounded-2xl bg-foreground flex items-center justify-center mb-4 shadow-lg">
            <Book className="h-6 w-6 text-background" />
          </div>
          <CardTitle className="text-2xl font-black tracking-tighter uppercase">Selamat Datang</CardTitle>
          <CardDescription className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
            Masuk ke Akun Digital Atelier
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6 pb-8">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Email</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input 
                  id="email" 
                  type="email" 
                  placeholder="name@example.com" 
                  className="pl-10 h-11 bg-muted/30 border-gray-100 dark:border-gray-800 focus:ring-2 focus:ring-foreground/10"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
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
                  placeholder="••••••••" 
                  className="pl-10 h-11 bg-muted/30 border-gray-100 dark:border-gray-800 focus:ring-2 focus:ring-foreground/10"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required 
                />
              </div>
            </div>

            {error && <p className="text-xs font-bold text-destructive bg-destructive/10 p-3 rounded-lg border border-destructive/20 text-center uppercase tracking-wide">{error}</p>}

            <Button type="submit" className="w-full h-11 font-black uppercase tracking-widest text-xs mt-2" disabled={loading}>
              {loading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <LogIn className="h-4 w-4 mr-2" />}
              Masuk Sekarang
            </Button>
          </form>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-border" />
            </div>
            <div className="relative flex justify-center text-[10px] uppercase font-black tracking-widest">
              <span className="bg-background px-4 text-muted-foreground">Atau</span>
            </div>
          </div>

          <div className="text-center space-y-4">
            <p className="text-xs text-muted-foreground font-medium">
              Belum punya akun?{" "}
              <button onClick={onSwitchToRegister} className="text-foreground font-black uppercase hover:underline underline-offset-4">Daftar Gratis</button>
            </p>
            <button onClick={onBack} className="text-[10px] font-black uppercase tracking-widest text-muted-foreground hover:text-foreground flex items-center justify-center gap-1 mx-auto transition-colors">
              Kembali ke Beranda <ArrowRight className="h-3 w-3" />
            </button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
