import { createFileRoute } from '@tanstack/react-router'
import { useState, useRef, useEffect, type FormEvent } from 'react'
import { useMutation } from 'convex/react'
import { useSuspenseQuery } from '@tanstack/react-query'
import { convexQuery } from '@convex-dev/react-query'
import { api } from '../../convex/_generated/api'

export const Route = createFileRoute('/admin')({
  component: AdminPage,
})

function AdminPage() {
  const [password, setPassword] = useState('')
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [activeTab, setActiveTab] = useState<'leads' | 'reviews' | 'gallery' | 'settings'>('leads')
  const [isDemoMode, setIsDemoMode] = useState(false)
  const [isVerifying, setIsVerifying] = useState(false)
  
  const verify = useMutation(api.admin.verifyPassword)

  useEffect(() => {
    const savedLogin = localStorage.getItem('siouxland_admin_logged_in')
    if (savedLogin === 'true') {
      setIsLoggedIn(true)
    }
  }, [])

  const handleLogin = async (e: FormEvent) => {
    e.preventDefault()
    setIsVerifying(true)
    try {
      const isValid = await verify({ password })
      if (isValid) {
        setIsLoggedIn(true)
        localStorage.setItem('siouxland_admin_logged_in', 'true')
      } else {
        alert('Incorrect password')
      }
    } catch (err) {
      console.error(err)
      alert('Error connecting to database. Please check your internet or Convex settings.')
    } finally {
      setIsVerifying(false)
    }
  }

  const handleLogout = () => {
    setIsLoggedIn(false)
    setIsDemoMode(false)
    localStorage.removeItem('siouxland_admin_logged_in')
  }

  if (isDemoMode) {
    return <DemoDashboard setIsDemoMode={setIsDemoMode} />
  }

  if (isLoggedIn) {
    return <AdminDashboard activeTab={activeTab} setActiveTab={setActiveTab} onLogout={handleLogout} />
  }

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center px-4 py-12">
      <div className="w-full max-w-md text-center">
        <div className="mb-8 p-4 bg-white/5 border border-white/10 rounded-xl text-left">
           <p className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-2 text-center">Cloud Connection Active</p>
           <p className="text-[9px] font-mono text-slate-600 break-all text-center">{import.meta.env.VITE_CONVEX_URL}</p>
        </div>

        <form onSubmit={handleLogin} className="bg-white p-10 rounded-3xl shadow-2xl text-left border-t-4 border-blue-600">
          <h1 className="text-3xl font-black uppercase tracking-tighter mb-2 text-center text-slate-950">Owner Access</h1>
          <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest text-center mb-8">SiouxLand Clean Out Crew</p>
          
          <div className="space-y-6">
            <div>
              <label className="text-[10px] uppercase font-black text-slate-400 mb-2 block">Admin Password</label>
              <input 
                type="password" 
                placeholder="••••••••" 
                autoFocus
                disabled={isVerifying}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-6 py-4 focus:ring-2 focus:ring-blue-600 outline-none transition-all text-slate-900 disabled:opacity-50"
              />
            </div>

            <div className="pt-4">
              <button 
                disabled={isVerifying}
                className="w-full bg-blue-600 text-white py-4 rounded-xl font-black uppercase tracking-widest hover:bg-blue-500 transition-all shadow-xl shadow-blue-600/20 disabled:bg-slate-400"
              >
                {isVerifying ? 'Verifying...' : 'Unlock Dashboard'}
              </button>
            </div>
          </div>
        </form>

        <div className="mt-12 space-y-4">
          <button 
            onClick={() => setIsDemoMode(true)}
            className="text-white/20 hover:text-white/50 text-[10px] uppercase tracking-widest font-black transition-all"
          >
            Launch Demo Mode (Simulation)
          </button>
          <a href="/" className="block text-white/10 hover:text-white/30 text-[10px] uppercase tracking-[0.3em] font-bold transition-colors">← Back to Site</a>
        </div>
      </div>
    </div>
  )
}

function AdminDashboard({ activeTab, setActiveTab, onLogout }: { 
  activeTab: 'leads' | 'reviews' | 'gallery' | 'settings', 
  setActiveTab: (tab: 'leads' | 'reviews' | 'gallery' | 'settings') => void,
  onLogout: () => void
}) {
  const { data: quotes } = useSuspenseQuery(convexQuery(api.admin.list, {}))
  const { data: allReviews } = useSuspenseQuery(convexQuery(api.reviews.listAll, {}))
  const { data: galleryImages } = useSuspenseQuery(convexQuery(api.gallery.list, {}))

  // Settings tab state
  const [oldPassword, setOldPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [isChanging, setIsChanging] = useState(false)

  const changePwd = useMutation(api.admin.changePassword)
  const updateQuote = useMutation(api.admin.updateQuote)
  const approveReview = useMutation(api.reviews.approve)
  const deleteReview = useMutation(api.reviews.remove)
  const generateUploadUrl = useMutation(api.quotes.generateUploadUrl)
  const addToGallery = useMutation(api.gallery.add)
  const deleteGalleryImage = useMutation(api.gallery.remove)

  const galleryInputRef = useRef<HTMLInputElement>(null)

  const handlePasswordChange = async (e: FormEvent) => {
    e.preventDefault()
    if (newPassword !== confirmPassword) {
      alert('New passwords do not match')
      return
    }
    setIsChanging(true)
    try {
      const result = await changePwd({ oldPassword, newPassword })
      if (result.success) {
        alert('Password Updated!')
        setOldPassword('')
        setNewPassword('')
        setConfirmPassword('')
      } else {
        alert(result.message)
      }
    } catch (err) {
      alert('Error updating password')
    } finally {
      setIsChanging(false)
    }
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      {/* Top Header */}
      <div className="bg-slate-950 text-white p-6 md:px-12 flex flex-col md:flex-row justify-between items-center gap-6 border-b-4 border-blue-600">
         <div className="flex items-center gap-4">
            <div className="bg-blue-600 p-2 rounded-lg">
               <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>
            </div>
            <div>
               <h1 className="text-xl font-black uppercase tracking-tighter">Business Dashboard</h1>
               <p className="text-[9px] font-bold text-slate-500 uppercase tracking-widest">SiouxLand COC Admin Portal</p>
            </div>
         </div>
         <div className="flex items-center gap-6">
            <button onClick={onLogout} className="text-[10px] font-black uppercase tracking-widest text-slate-500 hover:text-red-500 transition-colors">Log Out Account</button>
         </div>
      </div>

      {/* Main Tabs */}
      <div className="bg-white border-b border-slate-200 sticky top-0 z-40">
         <div className="max-w-7xl mx-auto px-6 overflow-x-auto">
            <div className="flex space-x-8">
               {[
                 { id: 'leads', label: 'Leads & Bookings', count: quotes.length },
                 { id: 'reviews', label: 'Reviews', count: allReviews.length },
                 { id: 'gallery', label: 'Photo Gallery', count: galleryImages.length },
                 { id: 'settings', label: 'Security Settings', count: null }
               ].map(tab => (
                 <button 
                   key={tab.id}
                   onClick={() => setActiveTab(tab.id as any)}
                   className={`py-6 text-[10px] font-black uppercase tracking-[0.2em] whitespace-nowrap transition-all border-b-2 ${activeTab === tab.id ? 'border-blue-600 text-blue-600' : 'border-transparent text-slate-400 hover:text-slate-600'}`}
                 >
                   {tab.label} {tab.count !== null && <span className={`ml-2 px-2 py-0.5 rounded-full text-[8px] ${activeTab === tab.id ? 'bg-blue-100 text-blue-600' : 'bg-slate-100 text-slate-400'}`}>{tab.count}</span>}
                 </button>
               ))}
            </div>
         </div>
      </div>

      <div className="max-w-7xl mx-auto p-6 md:p-12">
        {activeTab === 'leads' && (
          <div className="grid gap-8">
            {quotes.length === 0 ? (
               <div className="bg-white p-20 rounded-3xl border border-slate-200 text-center italic text-slate-400">No leads found in database.</div>
            ) : (
               quotes.map(quote => (
                 <LeadCard key={quote._id} quote={quote} updateQuote={updateQuote} />
               ))
            )}
          </div>
        )}

        {activeTab === 'reviews' && (
          <div className="grid md:grid-cols-2 gap-8">
            {allReviews.map(review => (
              <div key={review._id} className={`bg-white p-8 rounded-3xl border ${review.approved ? 'border-slate-200 shadow-sm' : 'border-blue-200 bg-blue-50/20 shadow-md'}`}>
                 <div className="flex justify-between items-center mb-6">
                    <span className={`text-[9px] font-black uppercase tracking-widest px-2 py-1 rounded ${review.approved ? 'bg-slate-100 text-slate-400' : 'bg-blue-600 text-white animate-pulse'}`}>{review.approved ? 'Live' : 'Pending Approval'}</span>
                    <button onClick={() => deleteReview({ id: review._id })} className="text-red-400 hover:text-red-600 text-[10px] uppercase font-black transition-colors">Delete</button>
                 </div>
                 <p className="text-slate-700 italic font-medium leading-relaxed mb-6">"{review.comment}"</p>
                 <div className="flex justify-between items-end">
                    <p className="text-[10px] font-black uppercase tracking-widest text-slate-500">— {review.name}</p>
                    {!review.approved && (
                      <button onClick={() => approveReview({ id: review._id })} className="bg-blue-600 text-white px-6 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-blue-700">Approve</button>
                    )}
                 </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'gallery' && (
          <div className="space-y-12">
            <div className="flex justify-between items-center">
               <h2 className="text-2xl font-black uppercase tracking-tighter">Manage Gallery</h2>
               <input type="file" ref={galleryInputRef} onChange={async (e) => {
                 if (e.target.files && e.target.files[0]) {
                   const file = e.target.files[0]
                   const postUrl = await generateUploadUrl()
                   const result = await fetch(postUrl, {
                     method: "POST",
                     headers: { "Content-Type": file.type },
                     body: file,
                   })
                   const { storageId } = await result.json()
                   await addToGallery({ storageId })
                   alert('Uploaded!')
                 }
               }} className="hidden" />
               <button onClick={() => galleryInputRef.current?.click()} className="bg-blue-600 text-white px-8 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-xl shadow-blue-600/20 hover:bg-blue-500 transition-all">Add New Photo</button>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {galleryImages.map(img => (
                <div key={img._id} className="aspect-square rounded-2xl overflow-hidden relative group border-2 border-slate-100 shadow-sm">
                  {img.url && <img src={img.url} className="w-full h-full object-cover" />}
                  <button 
                    onClick={() => window.confirm('Permanent Delete?') && deleteGalleryImage({ id: img._id })} 
                    className="absolute top-2 right-2 bg-red-600 text-white p-2 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity shadow-lg"
                  >
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'settings' && (
          <div className="space-y-12">
            <h2 className="text-2xl font-black uppercase tracking-tighter">Security Settings</h2>
            <div className="max-w-md bg-white p-10 rounded-3xl border border-slate-200 shadow-xl relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-2 bg-blue-600"></div>
              <form onSubmit={handlePasswordChange} className="space-y-8">
                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Update Portal Password</p>
                <div>
                  <label className="text-[10px] font-black uppercase text-slate-500 mb-2 block tracking-widest">Current Password</label>
                  <input type="password" required value={oldPassword} onChange={(e) => setOldPassword(e.target.value)} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-4 text-sm focus:ring-2 focus:ring-blue-600 outline-none transition-all" />
                </div>
                <div>
                  <label className="text-[10px] font-black uppercase text-slate-500 mb-2 block tracking-widest">New Secret Password</label>
                  <input type="password" required value={newPassword} onChange={(e) => setNewPassword(e.target.value)} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-4 text-sm focus:ring-2 focus:ring-blue-600 outline-none transition-all" />
                </div>
                <div>
                  <label className="text-[10px] font-black uppercase text-slate-500 mb-2 block tracking-widest">Confirm New Password</label>
                  <input type="password" required value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-4 text-sm focus:ring-2 focus:ring-blue-600 outline-none transition-all" />
                </div>
                <button 
                  disabled={isChanging}
                  className="w-full bg-blue-600 text-white py-5 rounded-2xl font-black uppercase tracking-[0.2em] shadow-xl shadow-blue-600/20 hover:bg-blue-500 transition-all disabled:bg-slate-300"
                >
                  {isChanging ? 'Saving Changes...' : 'Update Password'}
                </button>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

function DemoDashboard({ setIsDemoMode }: { setIsDemoMode: (val: boolean) => void }) {
  return (
    <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-8 text-white text-center">
      <div className="w-20 h-20 bg-blue-600 rounded-full flex items-center justify-center mb-8 shadow-2xl shadow-blue-600/40 animate-pulse">
         <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
      </div>
      <h1 className="text-4xl font-black uppercase tracking-tighter mb-4 italic text-blue-400">Owner Demo Mode</h1>
      <p className="text-slate-500 max-w-sm mb-12 uppercase text-[10px] font-bold tracking-[0.3em] leading-relaxed">This is a sandbox simulation. No data is saved to your cloud account while in this mode.</p>
      <button onClick={() => setIsDemoMode(false)} className="bg-white text-slate-950 px-12 py-4 rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-blue-400 hover:text-white transition-all shadow-2xl">Return to Real Portal</button>
    </div>
  )
}

function LeadCard({ quote, updateQuote }: { quote: any, updateQuote: any }) {
  const [isEditing, setIsEditing] = useState(false)
  const [status, setStatus] = useState(quote.status || 'pending')
  const [date, setDate] = useState(quote.scheduledDate || '')
  const [price, setPrice] = useState(quote.price || '')

  const handleSave = async () => {
    await updateQuote({ id: quote._id, status, scheduledDate: date, price })
    setIsEditing(false)
  }

  return (
    <div className={`bg-white p-8 md:p-12 rounded-[2.5rem] border ${status === 'booked' ? 'border-blue-600 shadow-2xl shadow-blue-100' : 'border-slate-100 shadow-sm'} transition-all`}>
      <div className="flex flex-col lg:flex-row justify-between items-start gap-8">
        <div className="flex-grow space-y-6">
          <div className="flex flex-wrap items-center gap-4">
            <h3 className="text-2xl font-black uppercase tracking-tighter text-slate-950">{quote.name}</h3>
            <span className={`text-[9px] font-black uppercase tracking-widest px-3 py-1 rounded-full ${
              status === 'booked' ? 'bg-blue-600 text-white' : 
              status === 'completed' ? 'bg-green-100 text-green-700' :
              status === 'cancelled' ? 'bg-red-100 text-red-700' :
              status === 'change_requested' ? 'bg-amber-100 text-amber-700' :
              'bg-slate-100 text-slate-400'
            }`}>
              {status.replace('_', ' ')}
            </span>
            {quote.customerAccepted && (
              <span className="text-[9px] bg-green-500 text-white px-3 py-1 rounded-full font-black uppercase tracking-widest animate-pulse shadow-lg shadow-green-500/20">✓ Customer Approved</span>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
             <div className="bg-slate-50 px-6 py-4 rounded-2xl border border-slate-100">
                <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest mb-1">Customer Contact</p>
                <p className="text-sm font-bold text-blue-600">{quote.phone}</p>
                <p className="text-xs font-medium text-slate-400">{quote.email}</p>
             </div>
             <div className="bg-slate-50 px-6 py-4 rounded-2xl border border-slate-100">
                <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest mb-1">Job Location</p>
                <p className="text-sm font-black uppercase text-slate-950 flex items-center gap-2">
                   <span className="text-blue-600">📍</span>
                   {quote.location || 'Not Specified'}
                </p>
             </div>
          </div>
          
          {quote.customerNotes && (
             <div className="bg-amber-50 border border-amber-100 p-6 rounded-3xl">
                <p className="text-[8px] font-black text-amber-600 uppercase tracking-widest mb-2 text-center">Message from Customer</p>
                <p className="text-sm text-amber-950 italic font-medium leading-relaxed">"{quote.customerNotes}"</p>
             </div>
          )}

          <div className="bg-slate-50 p-6 rounded-3xl border border-slate-100">
             <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest mb-3">Job Description</p>
             <p className="text-sm text-slate-600 font-medium leading-relaxed italic">"{quote.description}"</p>
             <p className="text-[9px] text-slate-300 mt-4 uppercase font-bold tracking-widest italic">Received: {new Date(quote._creationTime).toLocaleDateString()}</p>
          </div>
        </div>

        <div className="w-full lg:w-80 space-y-6">
          <div className="bg-slate-950 text-white p-8 rounded-[2rem] shadow-2xl relative overflow-hidden group">
             <div className="absolute top-0 right-0 w-32 h-32 bg-blue-600/10 rounded-full -mr-16 -mt-16 group-hover:scale-110 transition-transform"></div>
             <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-blue-400 mb-6">Finalized Quote</h4>
             
             {isEditing ? (
               <div className="space-y-4">
                  <div className="space-y-1">
                     <label className="text-[8px] uppercase font-black text-slate-500 tracking-widest">Pricing ($)</label>
                     <input type="text" value={price} onChange={e => setPrice(e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-xs outline-none focus:ring-1 focus:ring-blue-600" />
                  </div>
                  <div className="space-y-1">
                     <label className="text-[8px] uppercase font-black text-slate-500 tracking-widest">Job Date</label>
                     <input type="date" value={date} onChange={e => setDate(e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-xs outline-none focus:ring-1 focus:ring-blue-600" />
                  </div>
                  <div className="space-y-1">
                     <label className="text-[8px] uppercase font-black text-slate-500 tracking-widest">Workflow Status</label>
                     <select value={status} onChange={e => setStatus(e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-xs outline-none focus:ring-1 focus:ring-blue-600">
                        <option value="pending" className="text-black">Pending</option>
                        <option value="booked" className="text-black">Booked</option>
                        <option value="change_requested" className="text-black">Change Requested</option>
                        <option value="completed" className="text-black">Completed</option>
                        <option value="cancelled" className="text-black">Cancelled</option>
                     </select>
                  </div>
                  <div className="flex gap-2 pt-2">
                     <button onClick={handleSave} className="flex-grow bg-blue-600 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest">Save</button>
                     <button onClick={() => setIsEditing(false)} className="bg-white/10 px-4 py-3 rounded-xl text-[10px] font-black">X</button>
                  </div>
               </div>
             ) : (
               <div className="space-y-6">
                  <div className="flex justify-between items-end border-b border-white/5 pb-4">
                     <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Amount</span>
                     <span className="text-3xl font-black text-green-400 italic">${price || '---'}</span>
                  </div>
                  <div className="flex justify-between items-center">
                     <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Scheduled</span>
                     <span className="text-xs font-black uppercase italic">{date || 'TBD'}</span>
                  </div>
                  <button onClick={() => setIsEditing(true)} className="w-full border-2 border-blue-600 text-blue-400 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-blue-600 hover:text-white transition-all mt-4">Edit / Update Quote</button>
               </div>
             )}
          </div>
        </div>
      </div>
    </div>
  )
}
