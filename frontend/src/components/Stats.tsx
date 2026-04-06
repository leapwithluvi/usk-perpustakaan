export function Stats() {
  const stats = [
    { label: "Koleksi Terkurasi", value: "1.250+", sub: "Buku & Manuskrip" },
    { label: "Pembaca Aktif", value: "480+", sub: "Anggota Mingguan" },
    { label: "Genre Spesialis", value: "12+", sub: "Kategori Kurasi" },
    { label: "Ketersediaan", value: "98%", sub: "Akses Digital 24/7" },
  ]

  return (
    <section className="py-24 border-y border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-950 transition-colors">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-12 lg:gap-16">
          {stats.map((stat, i) => (
            <div key={i} className="text-center group">
              <div className="space-y-2">
                <span className="block text-4xl lg:text-6xl font-black text-black dark:text-white uppercase tracking-tighter leading-none group-hover:scale-105 transition-transform duration-500">
                  {stat.value}
                </span>
                <div className="space-y-1">
                  <span className="block text-[10px] font-black text-black dark:text-white uppercase tracking-[0.2em]">
                    {stat.label}
                  </span>
                  <span className="block text-[8px] font-bold text-gray-400 dark:text-gray-600 uppercase tracking-widest">
                    {stat.sub}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
