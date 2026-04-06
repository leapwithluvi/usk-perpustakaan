import { Share2, Globe, Link, Mail } from "lucide-react"

export function Footer({ onNavigate }: { onNavigate?: (path: string) => void }) {
  return (
    <footer className="py-20 border-t border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-950 transition-colors">
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-12">
        <div className="col-span-1 md:col-span-2 space-y-8">
          <div className="space-y-4">
            <h2 className="text-xl font-bold tracking-tighter text-black dark:text-white uppercase">DIGITAL ATELIER</h2>
            <div className="space-y-1">
                <p className="text-xs font-bold uppercase tracking-widest text-gray-400 dark:text-gray-500">Tentang Kami</p>
                <h3 className="text-2xl font-bold text-black dark:text-white">Siap untuk memulai?</h3>
            </div>
            <p className="text-gray-500 dark:text-gray-400 text-sm max-w-sm leading-relaxed font-medium">
              Digital Atelier adalah ruang kolaborasi antara teknologi dan literatur. Kami hadir untuk memudahkan akses pengetahuan bagi semua orang, menghubungkan pembaca dengan karya-karya terbaik dari seluruh dunia.
            </p>
          </div>
          
          <div className="flex items-center gap-4 text-gray-400 dark:text-gray-500">
             <Share2 className="h-5 w-5 hover:text-black dark:hover:text-white cursor-pointer transition-colors" />
             <Globe className="h-5 w-5 hover:text-black dark:hover:text-white cursor-pointer transition-colors" />
             <Link className="h-5 w-5 hover:text-black dark:hover:text-white cursor-pointer transition-colors" />
             <Mail className="h-5 w-5 hover:text-black dark:hover:text-white cursor-pointer transition-colors" />
          </div>
        </div>

        <div className="space-y-6">
          <h4 className="text-xs font-bold uppercase tracking-widest text-gray-400 dark:text-gray-500">Navigasi</h4>
          <ul className="space-y-4">
            {[
              { name: "Beranda", page: "landing" },
              { name: "Katalog", page: "catalog" },
              { name: "Cara Pinjam", page: "howtoborrow" },
              { name: "Kontak", page: "contact" }
            ].map((item, i) => (
              <li key={i}>
                <button 
                  onClick={() => onNavigate?.(item.page as any)}
                  className="text-sm font-medium text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-white transition-colors"
                >
                  {item.name}
                </button>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 mt-20 pt-8 border-t border-gray-100 dark:border-gray-800 flex flex-col md:flex-row justify-between items-center gap-4">
        <p className="text-xs font-medium text-gray-400 dark:text-gray-500">© 2026</p>
        <div className="flex gap-6">
          <a href="#" className="text-xs font-medium text-gray-400 dark:text-gray-500 hover:text-black dark:hover:text-white">Privacy</a>
          <a href="#" className="text-xs font-medium text-gray-400 dark:text-gray-500 hover:text-black dark:hover:text-white">Terms</a>
        </div>
      </div>
    </footer>
  )
}
