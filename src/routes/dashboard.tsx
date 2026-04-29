import { createFileRoute, Link, useNavigate } from '@tanstack/react-router'
import { useQuery } from 'convex/react'
import { useAuthActions } from '@convex-dev/auth/react'
import { api } from '../../convex/_generated/api'

export const Route = createFileRoute('/dashboard' as any)({
  component: CustomerDashboard,
})

function CustomerDashboard() {
  const quotes = useQuery(api.quotes.listMyQuotes, {})
  const { signOut } = useAuthActions()
  const navigate = useNavigate()

  const handleSignOut = async () => {
    await signOut()
    navigate({ to: '/' })
  }

  if (quotes === undefined) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4 md:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12">
          <div>
            <h1 className="text-4xl font-black uppercase tracking-tighter text-slate-950">My Bookings</h1>
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-[0.3em]">Track your clean out status</p>
          </div>
          <button 
            onClick={handleSignOut}
            className="text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-red-500 transition-colors"
          >
            Sign Out
          </button>
        </div>

        {quotes.length === 0 ? (
          <div className="bg-white p-12 rounded-[2.5rem] border border-slate-100 shadow-sm text-center">
            <p className="text-slate-500 font-medium mb-8">You haven't requested any quotes yet.</p>
            <Link 
              to="/book" 
              className="inline-block bg-blue-600 text-white px-8 py-4 rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-blue-500 transition-all shadow-lg shadow-blue-600/20"
            >
              Book a Cleaning Now
            </Link>
          </div>
        ) : (
          <div className="grid gap-6">
            {quotes.map((quote: any) => (
              <Link 
                key={quote._id} 
                to="/status/$quoteId" 
                params={{ quoteId: quote._id }}
                className="bg-white p-8 rounded-[2rem] border border-slate-100 shadow-sm hover:shadow-md transition-all flex flex-col md:flex-row justify-between items-start md:items-center gap-6 group"
              >
                <div className="space-y-2">
                  <div className="flex items-center gap-3">
                    <h3 className="text-xl font-black uppercase tracking-tighter text-slate-950 group-hover:text-blue-600 transition-colors">
                      {new Date(quote._creationTime).toLocaleDateString()}
                    </h3>
                    <span className={`text-[8px] font-black uppercase tracking-widest px-2 py-1 rounded-full ${
                      quote.status === 'booked' ? 'bg-blue-600 text-white' : 
                      quote.status === 'completed' ? 'bg-green-100 text-green-700' :
                      quote.status === 'cancelled' ? 'bg-red-100 text-red-700' :
                      'bg-slate-100 text-slate-400'
                    }`}>
                      {quote.status || 'pending'}
                    </span>
                  </div>
                  <p className="text-sm text-slate-500 line-clamp-1 max-w-md italic">"{quote.description}"</p>
                </div>
                <div className="flex items-center gap-8 w-full md:w-auto justify-between border-t md:border-t-0 pt-4 md:pt-0">
                  <div className="text-right">
                    <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest mb-1">Quote Price</p>
                    <p className="text-lg font-black text-slate-950">${quote.price || '---'}</p>
                  </div>
                  <div className="text-blue-600 group-hover:translate-x-1 transition-transform">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
