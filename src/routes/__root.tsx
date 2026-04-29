import { HeadContent, Link,
  Outlet,
  Scripts,
  createRootRouteWithContext } from '@tanstack/react-router'
import * as React from 'react'
import { useSuspenseQuery } from '@tanstack/react-query'
import { convexQuery } from '@convex-dev/react-query'
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
  const { data: socialLinks = {} } = useSuspenseQuery(
    convexQuery(api.settings.getSocialLinks, {}),
  )

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
          <div className="max-w-7xl mx-auto grid md:grid-cols-4 gap-12">
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
                Connect
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
                {socialLinks.jobber && (
                  <li>
                    <a
                      href={socialLinks.jobber}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 bg-blue-600/20 border border-blue-500/30 text-blue-400 hover:text-blue-300 hover:bg-blue-600/30 px-4 py-2 rounded transition-all"
                    >
                      <svg
                        className="w-4 h-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                        />
                      </svg>
                      <span className="text-xs font-bold uppercase tracking-wider">
                        Book Online
                      </span>
                    </a>
                  </li>
                )}
              </ul>
            </div>
            {Object.keys(socialLinks).length > 0 && (
              <div>
                <h4 className="text-white font-bold uppercase tracking-widest text-xs mb-6">
                  Follow Us
                </h4>
                <div className="flex flex-wrap gap-3">
                  {socialLinks.facebook && (
                    <a
                      href={socialLinks.facebook}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-10 h-10 bg-slate-800 hover:bg-blue-600 rounded-lg flex items-center justify-center transition-all"
                      title="Facebook"
                    >
                      <svg
                        className="w-5 h-5"
                        fill="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                      </svg>
                    </a>
                  )}
                  {socialLinks.instagram && (
                    <a
                      href={socialLinks.instagram}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-10 h-10 bg-slate-800 hover:bg-pink-600 rounded-lg flex items-center justify-center transition-all"
                      title="Instagram"
                    >
                      <svg
                        className="w-5 h-5"
                        fill="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                      </svg>
                    </a>
                  )}
                  {socialLinks.google && (
                    <a
                      href={socialLinks.google}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-10 h-10 bg-slate-800 hover:bg-red-600 rounded-lg flex items-center justify-center transition-all"
                      title="Google Business"
                    >
                      <svg
                        className="w-5 h-5"
                        fill="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.393 0 0 5.393 0 12s5.393 12 12.48 12c3.613 0 6.227-1.12 8.32-3.173 2.053-2.017 3.24-4.907 3.24-7.533 0-4.373-3.133-7.853-7.427-7.853h-.013z" />
                      </svg>
                    </a>
                  )}
                  {socialLinks.yelp && (
                    <a
                      href={socialLinks.yelp}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-10 h-10 bg-slate-800 hover:bg-red-500 rounded-lg flex items-center justify-center transition-all"
                      title="Yelp"
                    >
                      <svg
                        className="w-5 h-5"
                        fill="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path d="M12.008 3.275c-2.207 0-4.21.963-5.624 2.53-.572.635-1.004 1.367-1.29 2.185-.287.819-.297 1.693-.03 2.51.268.817.762 1.532 1.414 2.035l5.53-3.188a.75.75 0 01.528-.184c.299 0 .559.17.675.44l.025.044c.116.205.332.331.562.331s.447-.127.562-.332l.025-.044c.116-.21.376-.44.675-.44.2 0 .38.083.523.228l5.53 3.188c.652-.503 1.146-1.218 1.414-2.035.267-.817.257-1.691-.03-2.51a3.668 3.668 0 00-1.29-2.185c-1.414-1.567-3.417-2.53-5.624-2.53h-.033zm0 2.625c1.56 0 2.973.61 4.016 1.614.43.415.756.907.971 1.466.215.558.272 1.159.168 1.743-.103.584-.384 1.12-.791 1.515-.407.396-.942.669-1.535.775l-1.11-6.412 1.928 1.928c.294.294.769.294 1.063 0s.294-.769 0-1.063l-2.963-2.963a.75.75 0 00-1.06 0l-2.963 2.963c-.294.294-.294.769 0 1.063.147.147.339.22.53.22s.383-.073.53-.22l1.928-1.928-1.11 6.412a2.68 2.68 0 01-1.535-.775c-.407-.395-.688-.931-.791-1.515a2.668 2.668 0 01.168-1.743c.215-.559.541-1.05.971-1.466 1.044-1.004 2.457-1.614 4.016-1.614l.035-.004z" />
                      </svg>
                    </a>
                  )}
                  {socialLinks.nextdoor && (
                    <a
                      href={socialLinks.nextdoor}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-10 h-10 bg-slate-800 hover:bg-green-600 rounded-lg flex items-center justify-center transition-all"
                      title="Nextdoor"
                    >
                      <svg
                        className="w-5 h-5"
                        fill="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
                      </svg>
                    </a>
                  )}
                </div>
              </div>
            )}
          </div>
          <div className="max-w-7xl mx-auto mt-16 pt-8 border-t border-slate-900 text-center">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
              <p className="text-[10px] uppercase tracking-[0.3em] mb-2 md:mb-0">
                © {new Date().getFullYear()} SiouxLand Clean Out Crew. All
                rights reserved.
              </p>
              <Link
                to="/admin"
                className="inline-block bg-slate-900 border border-slate-800 text-slate-400 hover:text-blue-400 hover:border-blue-900 px-4 py-2 rounded text-[9px] uppercase tracking-[0.2em] transition-all"
              >
                Owner Login
              </Link>
            </div>
            <p className="text-[8px] text-slate-800 uppercase tracking-widest mt-2">
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
      <body>{children}</body>
    </html>
  )
}
