import { Mail, MapPin, Phone, Clock } from "lucide-react"
import { Footer } from "../components/Footer"

export const Contact = ({ onNavigate }: { onNavigate?: (path: string) => void }) => {
  const contactInfo = [
    {
      icon: <MapPin className="h-5 w-5 text-gray-900 dark:text-white" />,
      label: "Alamat",
      value: "Jl. Tepian Pandan, Tenggarong, Kab. Kutai Kartanegara, Kalimantan Timur.",
      bg: "bg-gray-100 dark:bg-gray-800"
    },
    {
      icon: <Phone className="h-5 w-5 text-gray-900 dark:text-white" />,
      label: "Telepon",
      value: "(0541) 123456",
      bg: "bg-gray-100 dark:bg-gray-800"
    },
    {
      icon: <Mail className="h-5 w-5 text-gray-900 dark:text-white" />,
      label: "Email",
      value: "info@perpustakaanteknologi.id",
      bg: "bg-gray-100 dark:bg-gray-800"
    }
  ]

  const operatingHours = [
    { day: "Senin - Kamis", time: "08:00 - 15:30" },
    { day: "Jumat", time: "08:00 - 11:30" },
    { day: "Sabtu - Minggu", time: "Tutup", isClosed: true }
  ]

  return (
    <div className="min-h-screen bg-white dark:bg-gray-950 transition-colors">
      <div className="max-w-7xl mx-auto px-6 py-20 lg:py-32">
        {/* Header Section */}
        <div className="space-y-4 mb-16 lg:mb-24">
          <div className="flex items-center gap-3">
             <div className="w-12 h-[2px] bg-black dark:bg-white" />
             <span className="text-xs font-black uppercase tracking-[0.3em] text-black dark:text-white">
               HUBUNGI KAMI
             </span>
          </div>
          <h1 className="text-5xl lg:text-8xl font-black text-black dark:text-white uppercase tracking-tighter leading-[0.85]">
            Kami Siap Membantu <span className="text-gray-400 dark:text-gray-600 text-outline-gray-400 dark:text-outline-gray-600 transition-colors">Anda</span>
          </h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24">
          {/* Left Column: Contact info & Hours */}
          <div className="space-y-12">
            <div className="grid gap-6">
              {contactInfo.map((info, index) => (
                <div 
                  key={index} 
                  className={`flex flex-col sm:flex-row gap-4 sm:gap-6 p-6 sm:p-8 rounded-3xl border border-gray-100 dark:border-gray-800 transition-all hover:translate-x-2 group`}
                >
                  <div className={`shrink-0 w-12 h-12 rounded-2xl ${info.bg} flex items-center justify-center mx-auto sm:mx-0`}>
                  {info.icon}
                  </div>
                  <div className="space-y-1 text-center sm:text-left">
                    <h3 className="text-xs font-black text-black dark:text-white uppercase tracking-widest">{info.label}</h3>
                    <p className="text-gray-500 dark:text-gray-400 font-medium leading-relaxed break-words">
                      {info.value}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Operating Hours Card */}
            <div className="p-6 sm:p-10 rounded-[2.5rem] bg-gray-50 dark:bg-gray-900 border border-gray-100 dark:border-gray-800 space-y-6 sm:space-y-8">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-black dark:bg-white flex items-center justify-center">
                   <Clock className="h-5 w-5 text-white dark:text-black" />
                </div>
                <h3 className="text-xl font-black text-black dark:text-white uppercase tracking-tight">Jam Operasional</h3>
              </div>
              
              <div className="space-y-4">
                {operatingHours.map((row, index) => (
                  <div key={index} className="flex justify-between items-center py-4 border-b border-gray-200/50 dark:border-gray-800/50 last:border-0">
                    <span className="font-bold text-black dark:text-white uppercase text-xs tracking-widest">{row.day}</span>
                    <span className={`font-black text-xs tracking-widest uppercase ${row.isClosed ? 'text-red-500' : 'text-gray-500 dark:text-gray-400'}`}>
                      {row.time}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column: Map Placeholder */}
          <div className="relative group lg:h-full min-h-[500px]">
            <div className="absolute inset-0 bg-gray-100 dark:bg-gray-900 rounded-[3rem] border border-gray-100 dark:border-gray-800 overflow-hidden">
               {/* Decorative elements */}
               <div className="absolute inset-0 opacity-[0.03] dark:opacity-[0.07] bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]" />
               
               <div className="absolute inset-0 flex flex-col items-center justify-center p-12 text-center space-y-8">
                  <div className="w-24 h-24 rounded-full border-4 border-gray-200 dark:border-gray-800 flex items-center justify-center animate-pulse">
                     <MapPin className="h-10 w-10 text-gray-300 dark:text-gray-700" />
                  </div>
                  <div className="space-y-4 max-w-xs">
                    <div className="inline-block px-4 py-1.5 rounded-full bg-gray-200 dark:bg-gray-800 text-[10px] font-black text-black dark:text-white uppercase tracking-widest">
                       Lokasi Strategis
                    </div>
                    <h4 className="text-3xl font-black text-black dark:text-white uppercase tracking-tighter leading-none">
                      Google Maps Coming Soon
                    </h4>
                    <p className="text-gray-500 dark:text-gray-400 text-sm font-medium leading-relaxed">
                      Kunjungi kami langsung untuk pengalaman literasi yang lebih berkesan di pusat kota.
                    </p>
                  </div>
               </div>
            </div>
          </div>
        </div>
      </div>
      <Footer onNavigate={onNavigate} />
    </div>
  )
}
