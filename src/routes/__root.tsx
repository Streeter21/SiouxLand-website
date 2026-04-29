import {
  HeadContent,
  Link,
  Outlet,
  Scripts,
  createRootRouteWithContext,
} from '@tanstack/react-router'
import * as React from 'react'
import { useConvexAuth, useQuery } from 'convex/react'
import { api } from '../../convex/_generated/api'
import type { QueryClient } from '@tanstack/react-query'
import appCss from '~/styles/app.css?url'

export const Route = createRootRouteWithContext<{
  queryClient: QueryClient
}>()({
  head: () => ({
    meta: [
      { charSet: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { title: 'SiouxLand Clean Out Crew | #1 Junk Removal & Estate Clean Outs' },
      { name: 'description', content: 'Professional junk removal, estate clean outs, and debris removal in SiouxLand. Serving Sioux City and surrounding areas. Fast, reliable, locally owned. Book your free quote today!' },
      { name: 'keywords', content: 'junk removal Sioux City, clean out crew SiouxLand, estate clean outs, debris removal, furniture removal, hauling services Siouxland' },
      { property: 'og:title', content: 'SiouxLand Clean Out Crew | Fast & Reliable Junk Removal' },
      { property: 'og:description', content: 'Professional clean out services in Sioux City and SiouxLand. Estate clean outs, junk removal, and more. Local, reliable, and affordable.' },
      { property: 'og:type', content: 'website' },
      { property: 'og:url', content: 'https://siouxlandcleanout.com' },
      { property: 'og:image', content: 'https://siouxlandcleanout.com/logo.svg' },
      { name: 'twitter:card', content: 'summary_large_image' },
      { name: 'twitter:title', content: 'SiouxLand Clean Out Crew | Junk Removal' },
      { name: 'twitter:description', content: 'Fast, reliable junk removal in Sioux City. Locally owned.' },
    ],
    links: [
      { rel: 'stylesheet', href: appCss },
      { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
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
  const { isAuthenticated } = useConvexAuth()
  const settingsRaw = useQuery(api.admin.getSettings, {})
  const settings = settingsRaw || []

  const facebookUrl = settings.find(s => s.key === 'facebook')?.value
  const instagramUrl = settings.find(s => s.key === 'instagram')?.value
  const twitterUrl = settings.find(s => s.key === 'twitter')?.value

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
              {isAuthenticated ? (
                <Link to={"/dashboard" as any} className="hover:text-blue-400 transition-colors [&.active]:text-blue-400 border border-blue-900 px-3 py-1 rounded">My Account</Link>
              ) : (
                <Link to={"/login" as any} className="hover:text-blue-400 transition-colors [&.active]:text-blue-400">Login</Link>
              )}
              <a href="tel:7122815225" className="bg-blue-600 px-4 py-2 rounded-sm hover:bg-blue-500 transition-all font-bold">
                712-281-5225
              </a>
            </div>
            
            {/* Mobile Nav Button */}
            <div className="md:hidden flex items-center gap-3">
               {isAuthenticated ? (
                 <Link to={"/dashboard" as any} className="text-white">
                   <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
                 </Link>
               ) : (
                 <Link to={"/login" as any} className="text-[10px] uppercase font-bold tracking-widest">Login</Link>
               )}
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
              <p className="text-sm leading-relaxed max-w-xs mb-8">
                Professional junk removal and clean out services serving the greater SiouxLand area. Locally owned, reliably operated.
              </p>
              
              <div className="flex space-x-4">
                {facebookUrl && (
                  <a href={facebookUrl} target="_blank" rel="noopener noreferrer" className="bg-slate-900 p-3 rounded-full hover:bg-blue-600 hover:text-white transition-all">
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
                  </a>
                )}
                {instagramUrl && (
                  <a href={instagramUrl} target="_blank" rel="noopener noreferrer" className="bg-slate-900 p-3 rounded-full hover:bg-pink-600 hover:text-white transition-all">
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg>
                  </a>
                )}
                {twitterUrl && (
                  <a href={twitterUrl} target="_blank" rel="noopener noreferrer" className="bg-slate-900 p-3 rounded-full hover:bg-slate-100 hover:text-black transition-all">
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
                  </a>
                )}
              </div>
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
                <li className="pt-6">
                  <Link to="/admin" className="inline-block bg-slate-900 border border-slate-800 text-slate-400 hover:text-blue-400 hover:border-blue-900 px-4 py-2 rounded text-[9px] uppercase tracking-[0.2em] transition-all">
                    Owner Login
                  </Link>
                </li>
                <li className="text-xs italic mt-2 text-slate-500 font-medium tracking-wide uppercase">New Local Business</li>
              </ul>
            </div>
          </div>
            <div className="max-w-7xl mx-auto mt-16 pt-8 border-t border-slate-900 text-center">
              <p className="text-[10px] uppercase tracking-[0.3em] mb-2">
                © {new Date().getFullYear()} SiouxLand Clean Out Crew. All rights reserved.
              </p>
              <p className="text-[8px] text-slate-800 uppercase tracking-widest">
                v1.2.0-stable
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
