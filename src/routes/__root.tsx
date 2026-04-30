import {
  HeadContent,
  Link,
  Outlet,
  Scripts,
  createRootRouteWithContext,
} from '@tanstack/react-router'
import * as React from 'react'
import type { QueryClient } from '@tanstack/react-query'
import appCss from '~/styles/app.css?url'
import { useQuery } from '@tanstack/react-query'
import { convexQuery } from '@convex-dev/react-query'
import { api } from '../../convex/_generated/api'

export const Route = createRootRouteWithContext<{
  queryClient: QueryClient
}>()({
  head: () => ({
    meta: [
      { charSet: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      {
        title: 'SiouxLand Clean Out Crew | #1 Junk Removal & Estate Clean Outs',
      },
      {
        name: 'description',
        content:
          'Professional junk removal, estate clean outs, and debris removal in SiouxLand. Serving Sioux City and surrounding areas. Fast, reliable, locally owned. Book your free quote today!',
      },
      {
        name: 'keywords',
        content:
          'junk removal Sioux City, clean out crew SiouxLand, estate clean outs, debris removal, furniture removal, hauling services Siouxland',
      },
      {
        property: 'og:title',
        content: 'SiouxLand Clean Out Crew | Fast & Reliable Junk Removal',
      },
      {
        property: 'og:description',
        content:
          'Professional clean out services in Sioux City and SiouxLand. Estate clean outs, junk removal, and more. Local, reliable, and affordable.',
      },
      { property: 'og:type', content: 'website' },
      { property: 'og:url', content: 'https://siouxlandcleanout.com' },
      {
        property: 'og:image',
        content: 'https://siouxlandcleanout.com/logo.svg',
      },
      { name: 'twitter:card', content: 'summary_large_image' },
      {
        name: 'twitter:title',
        content: 'SiouxLand Clean Out Crew | Junk Removal',
      },
      {
        name: 'twitter:description',
        content: 'Fast, reliable junk removal in Sioux City. Locally owned.',
      },
    ],
    links: [
      { rel: 'stylesheet', href: appCss },
      { rel: 'icon', type: 'image/svg+xml', href: '/logo.svg' },
      { rel: 'alternate icon', type: 'image/x-icon', href: '/favicon.ico' },
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
  const { data: socialLinksRaw } = useQuery(
    convexQuery(api.admin.getSocialLinks, {}),
  )
  const socialLinks = socialLinksRaw || { jobber: '', facebook: '', instagram: '', tiktok: '' }

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
                SiouxLand{' '}
                <span className="font-extrabold tracking-normal text-blue-400">
                  Clean Out Crew
                </span>
              </h1>
            </Link>

            <div className="hidden md:flex items-center space-x-8 text-xs uppercase tracking-[0.2em]">
              <Link
                to="/"
                className="hover:text-blue-400 transition-colors [&.active]:text-blue-400"
              >
                Home
              </Link>
              <Link
                to="/book"
                className="hover:text-blue-400 transition-colors [&.active]:text-blue-400"
              >
                Book Now
              </Link>
              <Link
                to="/reviews"
                className="hover:text-blue-400 transition-colors [&.active]:text-blue-400"
              >
                Reviews
              </Link>
              <Link
                to="/my-quotes"
                className="hover:text-blue-400 transition-colors [&.active]:text-blue-400"
              >
                Account
              </Link>
              <a
                href="tel:7122815225"
                className="bg-blue-600 px-4 py-2 rounded-sm hover:bg-blue-500 transition-all font-bold"
              >
                712-281-5225
              </a>
            </div>

            {/* Mobile Nav Button */}
            <div className="md:hidden">
              <Link
                to="/book"
                className="bg-blue-600 px-3 py-1.5 rounded-sm text-[10px] uppercase font-bold"
              >
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
                <span className="font-bold uppercase tracking-widest text-sm">
                  SiouxLand COC
                </span>
              </div>
              <p className="text-sm leading-relaxed max-w-xs">
                Professional junk removal and clean out services serving the
                greater SiouxLand area. Locally owned, reliably operated.
              </p>
            </div>
            <div>
              <h4 className="text-white font-bold uppercase tracking-widest text-xs mb-6">
                Navigation
              </h4>
              <ul className="space-y-4 text-sm">
                <li>
                  <Link to="/" className="hover:text-white transition-colors">
                    Home
                  </Link>
                </li>
                <li>
                  <Link
                    to="/book"
                    className="hover:text-white transition-colors"
                  >
                    Book a Cleaning
                  </Link>
                </li>
                <li>
                  <Link
                    to="/reviews"
                    className="hover:text-white transition-colors"
                  >
                    Customer Reviews
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-bold uppercase tracking-widest text-xs mb-6">
                Payment Methods
              </h4>
              <ul className="space-y-4 text-sm">
                <li className="flex items-center space-x-2">
                  <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                  <span>Venmo</span>
                </li>
                <li className="flex items-center space-x-2">
                  <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                  <span>Check</span>
                </li>
                <li className="flex items-center space-x-2">
                  <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                  <span>Cash</span>
                </li>
              </ul>
              <div className="mt-8 pt-8 border-t border-slate-900">
                <h4 className="text-white font-bold uppercase tracking-widest text-xs mb-6">
                  Contact
                </h4>
                <ul className="space-y-4 text-sm">
                  <li>
                    <a
                      href="tel:7122815225"
                      className="hover:text-white transition-colors"
                    >
                      712-281-5225
                    </a>
                  </li>
                  <li>
                    <a
                      href="mailto:siouxlandcoc@gmail.com"
                      className="hover:text-white transition-colors"
                    >
                      siouxlandcoc@gmail.com
                    </a>
                  </li>
                  {(socialLinks.jobber || socialLinks.facebook || socialLinks.instagram || socialLinks.tiktok) && (
                    <li className="pt-2 flex flex-wrap gap-3">
                      {socialLinks.jobber && socialLinks.jobber !== '' && (
                        <a
                          href={socialLinks.jobber}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="bg-green-600/20 hover:bg-green-600/40 text-green-400 px-3 py-1.5 rounded text-xs font-bold uppercase tracking-wider transition-colors"
                        >
                          Jobber
                        </a>
                      )}
                      {socialLinks.facebook && socialLinks.facebook !== '' && (
                        <a
                          href={socialLinks.facebook}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="bg-blue-600/20 hover:bg-blue-600/40 text-blue-400 px-3 py-1.5 rounded text-xs font-bold uppercase tracking-wider transition-colors"
                        >
                          Facebook
                        </a>
                      )}
                      {socialLinks.instagram && socialLinks.instagram !== '' && (
                        <a
                          href={socialLinks.instagram}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="bg-pink-600/20 hover:bg-pink-600/40 text-pink-400 px-3 py-1.5 rounded text-xs font-bold uppercase tracking-wider transition-colors"
                        >
                          Instagram
                        </a>
                      )}
                      {socialLinks.tiktok && socialLinks.tiktok !== '' && (
                        <a
                          href={socialLinks.tiktok}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="bg-slate-600/20 hover:bg-slate-600/40 text-white px-3 py-1.5 rounded text-xs font-bold uppercase tracking-wider transition-colors"
                        >
                          TikTok
                        </a>
                      )}
                    </li>
                  )}
                  <li className="pt-6">
                    <Link
                      to="/admin"
                      className="inline-block bg-slate-900 border border-slate-800 text-slate-400 hover:text-blue-400 hover:border-blue-900 px-4 py-2 rounded text-[9px] uppercase tracking-[0.2em] transition-all"
                    >
                      Owner Login
                    </Link>
                  </li>
                  <li className="text-xs italic mt-2 text-slate-500 font-medium tracking-wide uppercase">
                    New Local Business
                  </li>
                </ul>
              </div>
            </div>
          </div>
          <div className="max-w-7xl mx-auto mt-16 pt-8 border-t border-slate-900 text-center">
            <p className="text-[10px] uppercase tracking-[0.3em] mb-2">
              © {new Date().getFullYear()} SiouxLand Clean Out Crew. All rights
              reserved.
            </p>
            <p className="text-[8px] text-slate-800 uppercase tracking-widest">
              v1.3.0-FIX-AUTH-LOGO
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
      <body>{children}</body>
    </html>
  )
}
