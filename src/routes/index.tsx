import { createFileRoute, Link } from '@tanstack/react-router'
import { api } from '../../convex/_generated/api'
import { useSuspenseQuery } from '@tanstack/react-query'
import { convexQuery } from '@convex-dev/react-query'
import * as React from 'react'
import { Suspense } from 'react'

export const Route = createFileRoute('/')({
  component: HomePage,
})

function HomePage() {
  return (
    <div>
      {/* Hero Section */}
      <section className="bg-slate-950 text-white py-24 md:py-32 px-4 md:px-8 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-blue-500 via-transparent to-transparent opacity-50" />
        </div>
        
        <div className="max-w-6xl mx-auto relative z-10">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <div>
              <span className="text-blue-400 font-bold tracking-[0.3em] uppercase text-xs mb-6 block">
                Serving SiouxLand
              </span>
              <h2 className="text-5xl md:text-8xl font-black leading-none mb-8 tracking-tighter">
                CLEAN SPACE.<br />
                <span className="text-blue-400">CLEAR MIND.</span>
              </h2>
              <p className="text-lg md:text-xl text-slate-400 mb-10 max-w-md leading-relaxed">
                We handle the heavy lifting so you don't have to. Professional, local, and ready to clear your clutter.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link 
                  to="/book" 
                  className="bg-blue-600 text-white px-10 py-5 text-center rounded-sm font-black uppercase tracking-widest hover:bg-blue-500 transition-all shadow-xl shadow-blue-900/20"
                >
                  Book Your Clean Out
                </Link>
                <a 
                  href="tel:7122815225" 
                  className="border border-slate-700 bg-slate-900/50 backdrop-blur-sm px-10 py-5 text-center rounded-sm font-black uppercase tracking-widest hover:bg-slate-800 transition-all"
                >
                  Call Now
                </a>
              </div>
            </div>
            <div className="hidden md:block">
               <div className="aspect-square bg-blue-950/20 border border-blue-900/30 rounded-3xl p-12 relative">
                  <div className="absolute -top-12 -right-12 w-64 h-64 bg-blue-600/10 rounded-full blur-3xl" />
                  <div className="relative z-10 flex flex-col justify-center h-full text-center">
                    <p className="text-4xl italic text-blue-400 font-serif mb-6 leading-tight">
                      "Professional, fast, and completely stress-free."
                    </p>
                    <p className="font-bold uppercase tracking-widest text-sm">— SiouxLand Clean Out Crew</p>
                  </div>
               </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats/Features */}
      <section className="py-24 bg-white border-b border-slate-100">
        <div className="max-w-6xl mx-auto px-4 md:px-8">
          <div className="grid md:grid-cols-3 gap-12 text-center md:text-left">
            <div className="space-y-4">
              <div className="w-12 h-1 bg-blue-600 mx-auto md:mx-0" />
              <h4 className="text-xl font-bold uppercase tracking-tighter">New Business Energy</h4>
              <p className="text-slate-500 text-sm leading-relaxed text-balance">We're hungry to earn your business. Expect 110% effort and attention to detail on every single job.</p>
            </div>
            <div className="space-y-4">
              <div className="w-12 h-1 bg-blue-600 mx-auto md:mx-0" />
              <h4 className="text-xl font-bold uppercase tracking-tighter">Local Roots</h4>
              <p className="text-slate-500 text-sm leading-relaxed text-balance">Not a franchise. We're your neighbors in SiouxLand, committed to keeping our community clean.</p>
            </div>
            <div className="space-y-4">
              <div className="w-12 h-1 bg-blue-600 mx-auto md:mx-0" />
              <h4 className="text-xl font-bold uppercase tracking-tighter">No Hidden Fees</h4>
              <p className="text-slate-500 text-sm leading-relaxed text-balance">What we quote is what you pay. Send us photos of your job for a clear, upfront estimate today.</p>
            </div>
          </div>
        </div>
      </section>

      <Suspense fallback={
        <div className="py-24 text-center">
          <div className="animate-pulse flex space-x-4 justify-center">
            <div className="rounded-full bg-slate-200 h-10 w-10"></div>
          </div>
        </div>
      }>
        <GallerySection />
      </Suspense>

      {/* Call to Action */}
      <section className="py-24 bg-blue-600 text-white text-center px-4 relative overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-white/5 rounded-full blur-[120px] pointer-events-none" />
        <div className="max-w-3xl mx-auto relative z-10 flex flex-col items-center">
          <div className="bg-white p-4 rounded-3xl mb-12 shadow-2xl rotate-3 hover:rotate-0 transition-transform duration-500 hidden md:block">
            <img 
              src={`https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent('https://siouxlandcleanout.com')}`} 
              alt="Scan to Book"
              className="w-32 h-32"
            />
            <p className="text-blue-600 font-black text-[10px] mt-2 uppercase tracking-widest">Scan to Book</p>
          </div>
          <h3 className="text-4xl md:text-6xl font-black tracking-tighter uppercase mb-8">Ready to reclaim<br />your space?</h3>
          <Link 
            to="/book" 
            className="inline-block bg-white text-blue-600 px-12 py-5 rounded-full font-black uppercase tracking-widest hover:bg-slate-100 transition-all shadow-2xl hover:scale-105 active:scale-95"
          >
            Get A Free Quote
          </Link>
        </div>
      </section>
    </div>
  )
}

function GallerySection() {
  const { data: galleryImages } = useSuspenseQuery(convexQuery(api.gallery.list, {}))
  
  return (
    <section id="gallery" className="py-24 bg-slate-50 px-4 md:px-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
          <div>
            <span className="text-blue-600 font-bold tracking-[0.2em] uppercase text-[10px] mb-4 block">Work Portfolio</span>
            <h3 className="text-4xl md:text-5xl font-black tracking-tighter uppercase">Our Recent <span className="text-blue-600">Clean Outs</span></h3>
          </div>
          <Link to="/book" className="text-sm font-bold uppercase tracking-widest text-slate-400 hover:text-blue-600 transition-colors flex items-center">
            Send us your job photos →
          </Link>
        </div>
        
        {!galleryImages || galleryImages.length === 0 ? (
          <div className="bg-white border border-slate-200 py-32 text-center rounded-sm shadow-sm">
            <p className="text-slate-400 italic font-medium">Starting our journey! Check back soon for job photos.</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
             {galleryImages.slice(0, 8).map(img => (
               <div key={img._id} className="aspect-[4/5] bg-slate-200 overflow-hidden rounded-xl group relative shadow-lg">
                 {img.url ? (
                   <img 
                     src={img.url} 
                     alt={img.caption || "Job photo"} 
                     className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" 
                   />
                 ) : (
                   <div className="w-full h-full flex items-center justify-center text-slate-400 italic text-sm">
                     Loading...
                   </div>
                 )}
                 <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
               </div>
             ))}
          </div>
        )}
      </div>
    </section>
  )
}
