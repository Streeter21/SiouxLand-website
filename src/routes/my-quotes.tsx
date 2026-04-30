import { createFileRoute, Link, useNavigate } from '@tanstack/react-router'
import { useSuspenseQuery } from '@tanstack/react-query'
import { convexQuery } from '@convex-dev/react-query'
import { useAuthActions } from "@convex-dev/auth/react";
import { api } from '../../convex/_generated/api'
import { useConvexAuth } from "convex/react";
import { useEffect } from 'react';

export const Route = createFileRoute('/my-quotes')({
  component: MyQuotesPage,
})

function MyQuotesPage() {
  const { isAuthenticated, isLoading } = useConvexAuth();
  const navigate = useNavigate();
  const { signOut } = useAuthActions();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      navigate({ to: "/auth" });
    }
  }, [isAuthenticated, isLoading, navigate]);

  if (isLoading || !isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return <MyQuotesContent signOut={signOut} />;
}

function MyQuotesContent({ signOut }: { signOut: () => void }) {
  const { data: quotes } = useSuspenseQuery(convexQuery(api.quotes.listMyQuotes, {}));

  return (
    <div className="min-h-screen bg-white pb-20">
      {/* Header */}
      <div className="bg-white border-b border-slate-200 pt-12 pb-6 px-4">
        <div className="max-w-4xl mx-auto flex justify-between items-end">
          <div>
            <Link to="/" className="text-[10px] font-black uppercase tracking-[0.2em] text-blue-600 mb-2 block">← Back to Home</Link>
            <h1 className="text-3xl font-black uppercase tracking-tighter text-slate-900">My Quotes</h1>
            <p className="text-slate-500 text-sm font-medium mt-1">Track your service requests and approvals</p>
          </div>
          <button 
            onClick={() => signOut()}
            className="text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-red-600 transition-colors mb-2"
          >
            Sign Out
          </button>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 mt-8">
        {quotes.length === 0 ? (
          <div className="bg-white rounded-3xl p-12 text-center border border-slate-100 shadow-sm">
            <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-slate-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <h3 className="text-lg font-bold text-slate-900 mb-2">No quotes found</h3>
            <p className="text-slate-500 text-sm mb-8">You haven't requested any quotes yet.</p>
            <Link to="/book" className="inline-block bg-blue-600 text-white px-8 py-4 rounded-2xl font-black uppercase tracking-widest text-[10px] hover:bg-blue-700 transition-all shadow-lg shadow-blue-200">
              Request a Quote
            </Link>
          </div>
        ) : (
          <div className="grid gap-4">
            {quotes.map((quote) => (
              <div key={quote._id} className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm hover:shadow-md transition-all">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className={`text-[10px] font-black uppercase tracking-widest px-2 py-1 rounded-md ${
                        quote.status === 'completed' ? 'bg-green-100 text-green-700' :
                        quote.status === 'booked' ? 'bg-blue-100 text-blue-700' :
                        quote.status === 'cancelled' ? 'bg-red-100 text-red-700' :
                        'bg-amber-100 text-amber-700'
                      }`}>
                        {quote.status || 'pending'}
                      </span>
                      <span className="text-slate-300">•</span>
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                        {new Date(quote._creationTime).toLocaleDateString()}
                      </span>
                    </div>
                    <h3 className="font-bold text-slate-900 truncate max-w-md">{quote.description}</h3>
                  </div>
                  {quote.price && (
                    <div className="text-right">
                      <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 block mb-1">Estimated Price</span>
                      <span className="text-xl font-black text-blue-600">{quote.price}</span>
                    </div>
                  )}
                </div>

                {(quote.scheduledDate || quote.location) && (
                  <div className="grid grid-cols-2 gap-4 mt-6 pt-6 border-t border-slate-50">
                    {quote.scheduledDate && (
                      <div>
                        <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 block mb-1">Scheduled For</span>
                        <span className="text-xs font-bold text-slate-700">{quote.scheduledDate} {quote.scheduledTime}</span>
                      </div>
                    )}
                    {quote.location && (
                      <div>
                        <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 block mb-1">Service Location</span>
                        <span className="text-xs font-bold text-slate-700">{quote.location}</span>
                      </div>
                    )}
                  </div>
                )}
                
                {quote.status === 'booked' && !quote.customerAccepted && (
                  <div className="mt-6 p-4 bg-blue-50 rounded-2xl border border-blue-100 flex items-center justify-between">
                    <p className="text-xs font-bold text-blue-800">Please review and accept this quote to confirm booking.</p>
                    <button className="bg-blue-600 text-white px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-blue-700 transition-all">
                      Accept Quote
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
