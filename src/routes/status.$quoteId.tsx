import { createFileRoute, Link } from '@tanstack/react-router'
import { useState } from 'react'
import { useMutation } from 'convex/react'
import { useSuspenseQuery } from '@tanstack/react-query'
import { convexQuery } from '@convex-dev/react-query'
import { api } from '../../convex/_generated/api'
import type { Id } from '../../convex/_generated/dataModel'

export const Route = createFileRoute('/status/$quoteId')({
  component: StatusPage,
})

function StatusPage() {
  const { quoteId } = Route.useParams()
  const { data: quote } = useSuspenseQuery(convexQuery(api.quotes.get, { id: quoteId as Id<'quotes'> }))
  const customerAction = useMutation(api.quotes.customerAction)

  const [requestMessage, setRequestMessage] = useState('')
  const [showChangeForm, setShowChangeForm] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  if (!quote) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center p-4">
        <div className="bg-white p-12 rounded-2xl shadow-xl text-center max-w-md">
          <h1 className="text-2xl font-black uppercase mb-4">Quote Not Found</h1>
          <p className="text-slate-500 mb-8 text-sm">We couldn't find a quote with that ID. Please check the link or contact us.</p>
          <Link to="/" className="bg-blue-600 text-white px-8 py-3 rounded-xl font-bold uppercase tracking-widest text-[10px]">Return Home</Link>
        </div>
      </div>
    )
  }

  const handleAction = async (action: 'accept' | 'requestChange' | 'cancel') => {
    try {
      await customerAction({
        id: quote._id,
        action,
        message: (action === 'requestChange' || action === 'cancel') ? requestMessage : undefined
      })
      setSubmitted(true)
    } catch (err) {
      alert('Something went wrong')
    }
  }

  const isBooked = quote.status === 'booked' || quote.customerAccepted
  const isCancelled = quote.status === 'cancelled'

  return (
    <div className="bg-white min-h-screen pb-24">
      <div className="bg-slate-950 text-white py-16 px-4 text-center">
        <h1 className="text-3xl md:text-5xl font-black tracking-tighter uppercase mb-2">Quote Status</h1>
        <p className="text-blue-400 text-[10px] font-black uppercase tracking-[0.3em]">SiouxLand Clean Out Crew</p>
      </div>

      <div className="max-w-3xl mx-auto px-4 -mt-12">
        <div className="bg-white rounded-3xl shadow-2xl overflow-hidden border border-slate-100">
          <div className={`p-8 text-center border-b ${isBooked ? 'bg-green-50' : isCancelled ? 'bg-red-50' : 'bg-white'}`}>
             <span className={`text-[10px] font-black uppercase tracking-[0.2em] px-4 py-2 rounded-full ${
               isBooked ? 'bg-green-100 text-green-700' :
               isCancelled ? 'bg-red-100 text-red-700' :
               quote.price ? 'bg-blue-100 text-blue-700 animate-pulse' :
               'bg-slate-100 text-slate-500'
             }`}>
               {isBooked ? 'Job Booked & Confirmed' : 
                isCancelled ? 'Quote Cancelled' :
                quote.price ? 'Action Required: Owner has replied!' : 
                'Pending Review'}
             </span>
             <h2 className="text-2xl font-black uppercase tracking-tighter mt-6">
               {quote.name}
             </h2>
             <p className="text-slate-400 text-xs mt-1 uppercase tracking-widest">{quote.location}</p>
          </div>

          <div className="p-8 md:p-12 space-y-12">
            {isCancelled ? (
               <div className="bg-red-50/50 p-10 rounded-2xl border border-red-100 text-center">
                 <p className="text-sm font-bold text-red-900 mb-2">This quote has been cancelled.</p>
                 <p className="text-xs text-slate-500">If you changed your mind, please submit a new request or call us.</p>
               </div>
            ) : (quote.price || quote.scheduledDate) ? (
              <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-white p-8 rounded-2xl border border-slate-100 text-center">
                   <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Proposed Price</p>
                   <p className="text-4xl font-black text-slate-950">${quote.price || 'TBD'}</p>
                </div>
                <div className="bg-white p-8 rounded-2xl border border-slate-100 text-center">
                   <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Proposed Date</p>
                   <p className="text-2xl font-black text-slate-950">{quote.scheduledDate ? new Date(quote.scheduledDate).toLocaleDateString() : 'TBD'}</p>
                   {quote.scheduledTime && <p className="text-sm font-bold text-blue-600 mt-1">{quote.scheduledTime}</p>}
                </div>
              </div>
            ) : (
              <div className="bg-blue-50/50 p-10 rounded-2xl border border-blue-100 text-center">
                <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center mx-auto mb-6 shadow-sm">
                  <div className="w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
                </div>
                <p className="text-sm font-bold text-blue-900 mb-2">We are reviewing your photos and details.</p>
                <p className="text-xs text-slate-500">We will update this page with a price and date soon. Please check back later or wait for our text/call.</p>
              </div>
            )}

            {quote.price && !isBooked && !isCancelled && !submitted && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <button 
                    onClick={() => handleAction('accept')}
                    className="sm:col-span-3 bg-blue-600 text-white py-5 rounded-2xl font-black uppercase tracking-widest hover:bg-blue-500 transition-all shadow-xl shadow-blue-600/20"
                  >
                    Accept & Book Job
                  </button>
                  <button 
                    onClick={() => {
                      setShowChangeForm(true);
                      setRequestMessage("I'd like to request a different time: ");
                    }}
                    className="px-4 py-4 border-2 border-slate-200 rounded-2xl font-black uppercase tracking-widest text-[10px] text-slate-500 hover:border-blue-400 hover:text-blue-600 transition-all"
                  >
                    Time Change
                  </button>
                  <button 
                    onClick={() => {
                      setShowChangeForm(true);
                      setRequestMessage("I'd like to discuss the price: ");
                    }}
                    className="px-4 py-4 border-2 border-slate-200 rounded-2xl font-black uppercase tracking-widest text-[10px] text-slate-500 hover:border-blue-400 hover:text-blue-600 transition-all"
                  >
                    Price Change
                  </button>
                  <button 
                    onClick={() => {
                      if(confirm('Are you sure you want to cancel this request?')) {
                        handleAction('cancel');
                      }
                    }}
                    className="px-4 py-4 border-2 border-slate-200 rounded-2xl font-black uppercase tracking-widest text-[10px] text-red-300 hover:border-red-400 hover:text-red-500 transition-all"
                  >
                    Cancel Request
                  </button>
                </div>

                {showChangeForm && (
                  <div className="p-8 bg-white rounded-2xl border border-slate-200 animate-in fade-in slide-in-from-top-4">
                    <label className="text-[10px] font-black uppercase text-slate-400 mb-4 block">Details for your request:</label>
                    <textarea 
                      value={requestMessage}
                      onChange={(e) => setRequestMessage(e.target.value)}
                      autoFocus
                      placeholder="e.g. Can we do it on Tuesday instead? Or, is there any room on the price?"
                      className="w-full bg-white border border-slate-200 rounded-xl p-4 text-sm focus:ring-2 focus:ring-blue-600 outline-none mb-4 min-h-[100px]"
                    />
                    <div className="flex gap-4">
                      <button 
                        onClick={() => handleAction('requestChange')}
                        className="bg-slate-950 text-white px-8 py-3 rounded-lg font-black uppercase tracking-widest text-[10px]"
                      >
                        Send Request
                      </button>
                      <button 
                        onClick={() => setShowChangeForm(false)}
                        className="text-[10px] font-black uppercase text-slate-400 hover:text-slate-600"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}

            {submitted && (
              <div className="p-10 bg-green-50 rounded-2xl border border-green-100 text-center">
                <div className="w-12 h-12 bg-green-600 text-white rounded-full flex items-center justify-center mx-auto mb-6">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <p className="text-sm font-bold text-green-900 mb-2">Request Processed!</p>
                <p className="text-xs text-green-700">Thank you. We will contact you shortly to finalize the details.</p>
              </div>
            )}

            <div className="space-y-6 pt-8 border-t border-slate-100">
               <h3 className="text-xs font-black uppercase tracking-widest text-slate-400">Job Details Submitted</h3>
               <div className="space-y-4">
                 <div className="flex justify-between items-start border-b border-slate-50 pb-4">
                    <span className="text-xs font-bold text-slate-500">Service</span>
                    <span className="text-xs font-black uppercase">Standard Clean Out</span>
                 </div>
                 <div className="flex justify-between items-start border-b border-slate-50 pb-4">
                    <span className="text-xs font-bold text-slate-500">Location</span>
                    <span className="text-xs font-black uppercase">{quote.location}</span>
                 </div>
                 <div className="flex justify-between items-start border-b border-slate-50 pb-4">
                    <span className="text-xs font-bold text-slate-500">Contact</span>
                    <div className="text-right">
                      <p className="text-xs font-black">{quote.phone}</p>
                      <p className="text-[10px] text-slate-400">{quote.email}</p>
                    </div>
                 </div>
                 <div className="space-y-2">
                    <span className="text-xs font-bold text-slate-500">Description</span>
                    <p className="text-sm text-slate-700 leading-relaxed bg-white p-4 rounded-xl italic">
                      "{quote.description}"
                    </p>
                 </div>
               </div>
            </div>

            {quote.imageUrls && quote.imageUrls.length > 0 && (
              <div className="space-y-6">
                <h3 className="text-xs font-black uppercase tracking-widest text-slate-400">Photos of items</h3>
                <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
                  {quote.imageUrls.map((url: any, i: number) => (
                    <div key={i} className="aspect-square bg-slate-100 rounded-xl overflow-hidden border border-slate-100">
                      {url && <img src={url} className="w-full h-full object-cover" />}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
        
        <div className="mt-12 text-center">
          <p className="text-[10px] text-slate-400 uppercase tracking-widest font-bold">Accepted Payment Methods: Venmo • Check • Cash. Have questions? Text us at 712-281-5225</p>
        </div>
      </div>
    </div>
  )
}
