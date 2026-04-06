// Testimonial component with a quote and user profile.

export function Testimonial() {
  return (
    <section className="py-32 bg-gray-50/50 dark:bg-gray-900/50 transition-colors relative overflow-hidden">
      {/* Subtle paper texture overlay */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.03] dark:opacity-[0.05] bg-[url('https://www.transparenttextures.com/patterns/natural-paper.png')]" />

      <div className="max-w-5xl mx-auto px-6 text-center space-y-12 relative z-10">
        <div className="space-y-4">
          <span className="text-6xl lg:text-8xl font-serif text-gray-200 dark:text-gray-800 leading-none">“</span>
          <blockquote className="text-3xl md:text-5xl lg:text-6xl font-black text-black dark:text-white leading-[0.9] tracking-tighter uppercase max-w-4xl mx-auto">
            I have always imagined that <span className="text-gray-400 dark:text-gray-600">Paradise</span> will be a kind of <span className="text-emerald-600/80 dark:text-emerald-500/80">Library.</span>
          </blockquote>
        </div>
        
        <div className="flex flex-col items-center gap-6">
          <div className="w-14 h-14 rounded-full border-2 border-black dark:border-white p-1 overflow-hidden">
             <div className="w-full h-full bg-black dark:bg-white rounded-full flex items-center justify-center">
                <span className="text-[10px] font-black text-white dark:text-black uppercase">JLB</span>
             </div>
          </div>
          <div className="space-y-1">
            <h4 className="text-xs font-black text-black dark:text-white uppercase tracking-[0.3em]">Jorge Luis Borges</h4>
            <p className="text-[10px] font-bold text-gray-500 dark:text-gray-400 uppercase tracking-widest">Penulis & Pustakawan Legendaris</p>
          </div>
        </div>
      </div>
    </section>
  )
}
