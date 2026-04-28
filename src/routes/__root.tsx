import { Link, Outlet } from '@tanstack/react-router'
import {
  HeadContent,
  Scripts,
  createRootRouteWithContext,
} from '@tanstack/react-router'
import * as React from 'react'
import type { QueryClient } from '@tanstack/react-query'
import appCss from '~/styles/app.css?url'

export const Route = createRootRouteWithContext<{
  queryClient: QueryClient
}>()({
  head: () => ({
    meta: [
      { charSet: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { title: 'SiouxLand Clean Out Crew | Junk Removal & Clean Outs' },
      { name: 'description', content: 'Professional junk removal and clean out services in SiouxLand. Fast, reliable, and locally owned. Book your free quote today!' },
      { property: 'og:image', content: '/logo.svg' },
    ],
    links: [
      { rel: 'stylesheet', href: appCss },
      { rel: 'icon', type: 'image/svg+xml', href: '/logo.svg' },
      { rel: 'apple-touch-icon', href: '/logo.svg' },
    ],
  }),
  component: RootComponent,
})

function TruckLogo() {
  return (
    <svg 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="1.5" 
      strokeLinecap="round" 
      strokeLinejoin="round" 
      className="w-8 h-8"
    >
      <path d="M14 18V6a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v11a1 1 0 0 0 1 1h2" />
      <path d="M15 18H9" />
      <path d="M19 18h2a1 1 0 0 0 1-1v-5l-4-4h-3v10" />
      <circle cx="7" cy="18" r="2" />
      <circle cx="17" cy="18" r="2" />
    </svg>
  )
}

function RootComponent() {
  return (
    <RootDocument>
      <div className="min-h-screen bg-slate-50 text-slate-900 font-sans">
        <nav className="bg-slate-950 text-white py-4 px-4 md:px-8 sticky top-0 z-50 shadow-xl">
          <div className="max-w-7xl mx-auto flex justify-between items-center">
            <Link to="/" className="flex items-center space-x-3 group">
              <div className="text-blue-400 group-hover:text-blue-300 transition-colors">
                <TruckLogo />
              </div>
              <h1 className="text-lg md:text-xl font-light tracking-[0.1em] uppercase">
                SiouxLand <span className="font-extrabold tracking-normal text-blue-400">Clean Out Crew</span>
              </h1>
            </Link>
            
            <div className="hidden md:flex items-center space-x-8 text-xs uppercase tracking-[0.2em]">
              <Link to="/" className="hover:text-blue-400 transition-colors [&.active]:text-blue-400">Home</Link>
              <Link to="/book" className="hover:text-blue-400 transition-colors [&.active]:text-blue-400">Book Now</Link>
              <Link to="/reviews" className="hover:text-blue-400 transition-colors [&.active]:text-blue-400">Reviews</Link>
              <a href="tel:7122815225" className="bg-blue-600 px-4 py-2 rounded-sm hover:bg-blue-500 transition-all font-bold">
                712-281-5225
              </a>
            </div>
            
            {/* Mobile Nav Button */}
            <div className="md:hidden">
               <Link to="/book" className="bg-blue-600 px-3 py-1.5 rounded-sm text-[10px] uppercase font-bold">
                 Book
               </Link>
            </div>
          </div>
        </nav>

        <main>
          <Outlet />
        </main>

        <footer className="bg-slate-950 text-slate-400 py-16 px-4 md:px-8 border-t border-slate-900">
          <div className="max-w-7xl mx-auto grid md:grid-cols-3 gap-12">
            <div>
              <div className="flex items-center space-x-2 text-white mb-6">
                <TruckLogo />
                <span className="font-bold uppercase tracking-widest text-sm">SiouxLand COC</span>
              </div>
              <p className="text-sm leading-relaxed max-w-xs">
                Professional junk removal and clean out services serving the greater SiouxLand area. Locally owned, reliably operated.
              </p>
            </div>
            <div>
              <h4 className="text-white font-bold uppercase tracking-widest text-xs mb-6">Navigation</h4>
              <ul className="space-y-4 text-sm">
                <li><Link to="/" className="hover:text-white transition-colors">Home</Link></li>
                <li><Link to="/book" className="hover:text-white transition-colors">Book a Cleaning</Link></li>
                <li><Link to="/reviews" className="hover:text-white transition-colors">Customer Reviews</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-bold uppercase tracking-widest text-xs mb-6">Contact</h4>
              <ul className="space-y-4 text-sm">
                <li><a href="tel:7122815225" className="hover:text-white transition-colors">712-281-5225</a></li>
                <li><a href="mailto:siouxlandcoc@gmail.com" className="hover:text-white transition-colors">siouxlandcoc@gmail.com</a></li>
                <li><Link to="/admin" className="text-[10px] text-slate-700 hover:text-slate-500 transition-colors uppercase tracking-[0.2em] mt-8 block">Owner Login</Link></li>
                <li className="text-xs italic mt-2 text-slate-500 font-medium tracking-wide uppercase">New Local Business</li>
              </ul>
            </div>
          </div>
          <div className="max-w-7xl mx-auto mt-16 pt-8 border-t border-slate-900 text-center">
            <p className="text-[10px] uppercase tracking-[0.3em]">
              © {new Date().getFullYear()} SiouxLand Clean Out Crew. All rights reserved.
            </p>
          </div>
        </footer>
      </div>
      <Scripts />
    </RootDocument>
  )
}

function RootDocument({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
      </body>
    </html>
  )
}
