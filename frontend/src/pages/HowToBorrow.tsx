import { ArrowRight, MessageCircle } from "lucide-react"
import { Footer } from "../components/Footer"

const steps = [
  {
    number: "01",
    title: "Ajukan Peminjaman",
    description: "Cari buku pilihan Anda di katalog dan klik tombol pinjam. Permintaan Anda akan dikirim ke sistem untuk diverifikasi oleh pustakawan.",
  },
  {
    number: "02",
    title: "Tunggu Verifikasi",
    description: "Pustakawan akan mengecek ketersediaan buku dan status keanggotaan Anda. Jika disetujui, Kode Pengambilan akan muncul di halaman profil Anda.",
  },
  {
    number: "03",
    title: "Ambil Buku",
    description: "Kunjungi perpustakaan dan tunjukkan Kode Pengambilan kepada petugas. Petugas akan memvalidasi kode tersebut dan memberikan buku fisik kepada Anda.",
  },
  {
    number: "04",
    title: "Simpan Kode Kembali",
    description: "Setelah buku diambil, sistem akan otomatis mengupdate profil Anda dengan Kode Pengembalian yang baru untuk digunakan nanti.",
  },
  {
    number: "05",
    title: "Proses Pengembalian",
    description: "Bawa buku ke perpustakaan saat ingin mengembalikan, sebutkan Kode Pengembalian Anda. Petugas akan menginput data dan proses selesai tanpa denda manual.",
  }
]

export const HowToBorrow = ({ onNavigate }: { onNavigate?: (path: string) => void }) => {
  return (
    <div className="min-h-screen bg-white dark:bg-gray-950 transition-colors">
      <div className="max-w-4xl mx-auto px-6 py-20 lg:py-32">
        {/* Header Section */}
        <div className="text-center space-y-6 mb-24">
          <div className="flex justify-center mb-4">
            <span className="px-4 py-1 rounded-full bg-gray-100 dark:bg-gray-900 text-[10px] font-black uppercase tracking-[0.3em] text-gray-500 dark:text-gray-400 border border-gray-200 dark:border-gray-800">
               GUIDE & PROCESS
            </span>
          </div>
          <h1 className="text-4xl lg:text-7xl font-black text-black dark:text-white uppercase tracking-tighter leading-[0.85]">
            Cara Pinjam <span className="text-gray-400 dark:text-gray-600 transition-colors">Buku</span>
          </h1>
          <p className="max-w-xl mx-auto text-sm lg:text-base text-gray-500 dark:text-gray-400 font-medium leading-relaxed">
            Kami telah menyederhanakan proses peminjaman agar Anda dapat fokus menikmati bacaan Anda. Ikuti langkah mudah berikut ini.
          </p>
        </div>

        {/* Steps Section */}
        <div className="space-y-16 lg:space-y-24">
          {steps.map((step, index) => (
            <div 
              key={index} 
              className="group flex flex-col md:flex-row gap-8 md:gap-16 items-start transition-all duration-500 hover:translate-x-2"
            >
              <div className="relative shrink-0">
                <span className="text-7xl lg:text-9xl font-black text-gray-200 dark:text-gray-800 transition-colors group-hover:text-black dark:group-hover:text-white leading-none tracking-tighter">
                  {step.number}
                </span>
              </div>

              <div className="space-y-4 pt-4 lg:pt-8">
                <h2 className="text-2xl lg:text-4xl font-black text-black dark:text-white uppercase tracking-tight">
                  {step.title}
                </h2>
                <p className="text-gray-500 dark:text-gray-400 text-sm lg:text-lg leading-relaxed max-w-2xl">
                  {step.description}
                </p>
                <div className="h-0.5 w-12 bg-black dark:bg-white transform origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-500" />
              </div>
            </div>
          ))}
        </div>

        {/* Contact Section */}
        <div className="mt-40 p-10 lg:p-16 bg-gray-50 dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-3xl relative overflow-hidden group">
          {/* Subtle paper texture */}
          <div className="absolute inset-0 pointer-events-none opacity-[0.03] dark:opacity-[0.05] bg-[url('https://www.transparenttextures.com/patterns/natural-paper.png')]" />
          
          <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-10">
            <div className="space-y-4 text-center lg:text-left">
              <h3 className="text-2xl lg:text-4xl font-black text-black dark:text-white uppercase tracking-tight">
                Punya Pertanyaan Lain?
              </h3>
              <p className="text-gray-500 dark:text-gray-400 text-sm lg:text-lg max-w-md">
                Jangan ragu untuk menghubungi petugas kami jika Anda mengalami kesulitan dalam proses peminjaman.
              </p>
            </div>

            <button 
              onClick={() => onNavigate?.('contact')}
              className="shrink-0 flex items-center gap-4 bg-black dark:bg-white text-white dark:text-black px-10 py-5 rounded-full font-black uppercase tracking-widest text-xs hover:scale-105 active:scale-95 transition-all shadow-2xl"
            >
              <MessageCircle className="h-4 w-4" />
              Hubungi Kontak
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
      <Footer onNavigate={onNavigate} />
    </div>
  )
}
