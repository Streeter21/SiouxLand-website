import { createFileRoute } from '@tanstack/react-router'
import { useState, useRef, useEffect } from 'react'
import { useMutation, useQuery } from 'convex/react'
import { api } from '../../convex/_generated/api'

export const Route = createFileRoute('/admin')({
  component: AdminPage,
})

function AdminPage() {
  const [password, setPassword] = useState('')
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [activeTab, setActiveTab] = useState<'leads' | 'reviews' | 'gallery'>('leads')
  const [isDemoMode, setIsDemoMode] = useState(false)
  
  const [customUrl, setCustomUrl] = useState('')

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()
    if (password === 'siouxland123') {
      if (customUrl) {
        localStorage.setItem('CONVEX_OVERRIDE_URL', customUrl)
        window.location.reload()
      }
      setIsLoggedIn(true)
    } else {
      alert('Incorrect password')
    }
  }

  if (!isLoggedIn && !isDemoMode) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-md text-center">
          <form onSubmit={handleLogin} className="bg-white p-10 rounded-2xl shadow-2xl text-left">
            <h1 className="text-2xl font-black uppercase tracking-tighter mb-8 text-center text-slate-950">Owner Login</h1>
            <div className="space-y-6">
              <div>
                <label className="text-[10px] uppercase font-black text-slate-400 mb-2 block">Dashboard Password</label>
                <input 
                  type="password" 
                  placeholder="Enter password" 
                  autoFocus
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-6 py-4 focus:ring-2 focus:ring-blue-600 outline-none transition-all text-slate-900"
                />
              </div>

              <div className="pt-4">
                <button className="w-full bg-blue-600 text-white py-4 rounded-xl font-black uppercase tracking-widest hover:bg-blue-500 transition-all shadow-xl shadow-blue-600/20">
                  Enter Dashboard
                </button>
              </div>
            </div>
          </form>

          <div className="mt-12 space-y-4">
            <p className="text-slate-500 text-[10px] uppercase font-bold tracking-widest">Database still loading?</p>
            <button 
              onClick={() => setIsDemoMode(true)}
              className="bg-white/5 border border-white/10 text-white px-8 py-4 rounded-xl font-black uppercase tracking-widest text-[10px] hover:bg-white/10 transition-all w-full"
            >
              Try Demo Mode (No Database Needed)
            </button>
            <a href="/" className="block text-white/20 hover:text-white/50 text-[10px] uppercase tracking-[0.3em] font-bold transition-colors">← Back to Website</a>
          </div>
        </div>
      </div>
    )
  }

  if (isDemoMode) {
    return <DemoDashboard setIsDemoMode={setIsDemoMode} />
  }

  return (
    <AdminDashboard activeTab={activeTab} setActiveTab={setActiveTab} setIsLoggedIn={setIsLoggedIn} />
  )
}

function DemoDashboard({ setIsDemoMode }: { setIsDemoMode: (val: boolean) => void }) {
  const [activeTab, setActiveTab] = useState<'leads' | 'reviews' | 'gallery'>('leads')
  const [mockQuotes, setMockQuotes] = useState([
    {
      _id: '1',
      _creationTime: Date.now(),
      name: 'John Smith (Demo)',
      phone: '712-555-0123',
      email: 'john@example.com',
      description: 'I have a garage full of old tires and scrap metal that needs to go as soon as possible.',
      heavyObjects: true,
      stairs: false,
      smallSpaces: true,
      other: false,
      imageIds: [],
      status: 'pending',
      price: '',
      scheduledDate: ''
    },
    {
      _id: '2',
      _creationTime: Date.now() - 86400000,
      name: 'Sarah Miller (Demo)',
      phone: '712-555-9876',
      email: 'sarah.m@gmail.com',
      description: 'Need help clearing out a basement after a move. Mostly boxes and some old furniture.',
      heavyObjects: true,
      stairs: true,
      smallSpaces: false,
      other: false,
      imageIds: [],
      status: 'booked',
      price: '250',
      scheduledDate: '2023-12-25'
    }
  ])

  const updateQuote = (args: any) => {
    setMockQuotes(prev => prev.map(q => q._id === args.id ? { ...q, ...args } : q))
  }

  return (
    <div className="min-h-screen bg-slate-50 p-4 md:p-12 text-slate-900">
      <div className="max-w-7xl mx-auto">
        <div className="bg-blue-600 text-white p-4 rounded-xl mb-8 flex justify-between items-center shadow-lg">
          <p className="text-xs font-black uppercase tracking-widest">⚠️ You are in DEMO MODE. This data is not real.</p>
          <button onClick={() => setIsDemoMode(false)} className="bg-white text-blue-600 px-4 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest">Exit Demo</button>
        </div>

        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 gap-6">
          <div>
            <h1 className="text-4xl font-black uppercase tracking-tighter text-slate-950">Business Dashboard</h1>
            <div className="flex space-x-6 mt-4">
              <button onClick={() => setActiveTab('leads')} className={`text-xs font-black uppercase tracking-widest pb-2 border-b-2 transition-all ${activeTab === 'leads' ? 'border-blue-600 text-blue-600' : 'border-transparent text-slate-400'}`}>
                Leads ({mockQuotes.length})
              </button>
              <button className="text-xs font-black uppercase tracking-widest pb-2 border-b-2 border-transparent text-slate-300 cursor-not-allowed">Reviews (Locked in Demo)</button>
              <button className="text-xs font-black uppercase tracking-widest pb-2 border-b-2 border-transparent text-slate-300 cursor-not-allowed">Gallery (Locked in Demo)</button>
            </div>
          </div>
        </div>

        <div className="space-y-8">
          <div className="grid gap-6">
            {mockQuotes.map(quote => (
              <LeadCard key={quote._id} quote={quote} updateQuote={updateQuote} />
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

function AdminDashboard({ activeTab, setActiveTab, setIsLoggedIn }: { 
  activeTab: 'leads' | 'reviews' | 'gallery', 
  setActiveTab: (tab: 'leads' | 'reviews' | 'gallery') => void,
  setIsLoggedIn: (val: boolean) => void
}) {
  const quotes = useQuery(api.admin.list, {})
  const allReviews = useQuery(api.reviews.listAll, {})
  const galleryImages = useQuery(api.gallery.list, {})
  
  const [showTimeout, setShowTimeout] = useState(false)
  const [manualUrl, setManualUrl] = useState('')

  // Show a helper if it takes too long to load
  useEffect(() => {
    const timer = setTimeout(() => setShowTimeout(true), 5000)
    return () => clearTimeout(timer)
  }, [])

  const approveReview = useMutation(api.reviews.approve)
  const deleteReview = useMutation(api.reviews.remove)
  const generateUploadUrl = useMutation(api.quotes.generateUploadUrl)
  const addToGallery = useMutation(api.gallery.add)
  const deleteGalleryImage = useMutation(api.gallery.remove)
  const updateQuote = useMutation(api.admin.updateQuote)

  const galleryInputRef = useRef<HTMLInputElement>(null)

  const saveManualUrl = () => {
    if (manualUrl.includes('convex.cloud')) {
      localStorage.setItem('CONVEX_OVERRIDE_URL', manualUrl)
      window.location.reload()
    } else {
      alert('Please enter a valid Convex URL (starts with https:// and ends with .convex.cloud)')
    }
  }

  if (!quotes || !allReviews || !galleryImages) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-8 text-center text-white">
        <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mb-8" />
        <h2 className="text-xl font-black uppercase tracking-tighter mb-2">Connecting to Secure Database</h2>
        <p className="text-slate-500 text-xs uppercase tracking-[0.2em] font-bold mb-8">Verification in progress...</p>
        
        {showTimeout && (
          <div className="max-w-md bg-white/5 border border-white/10 p-8 rounded-2xl animate-in fade-in slide-in-from-bottom-4 duration-1000">
            <p className="text-sm text-slate-300 mb-6">It's taking longer than usual. This usually means the **Convex Database URL** is missing or incorrect in your settings.</p>
            
            <div className="space-y-4">
              <input 
                type="text" 
                placeholder="https://your-project.convex.cloud"
                value={manualUrl}
                onChange={(e) => setManualUrl(e.target.value)}
                className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-3 text-xs focus:ring-2 focus:ring-blue-600 outline-none text-white"
              />
              <button 
                onClick={saveManualUrl}
                className="w-full bg-blue-600 text-white py-3 rounded-xl font-black uppercase tracking-widest text-[10px] hover:bg-blue-500 transition-all"
              >
                Save & Connect
              </button>
            </div>
            
            <button 
              onClick={() => setIsLoggedIn(false)}
              className="mt-8 text-slate-500 text-[9px] uppercase tracking-widest hover:text-white transition-colors"
            >
              ← Back to Login
            </button>
          </div>
        )}
      </div>
    )
  }

  const handleGalleryUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return
    const file = e.target.files[0]
    
    try {
      const postUrl = await generateUploadUrl()
      const result = await fetch(postUrl, {
        method: "POST",
        headers: { "Content-Type": file.type },
        body: file,
      })
      const { storageId } = await result.json()
      await addToGallery({ storageId })
      alert('Image added to gallery!')
    } catch (error) {
      console.error("Gallery upload failed", error)
      alert('Upload failed')
    }
  }

  return (
    <div className="min-h-screen bg-slate-50 p-4 md:p-12 text-slate-900">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 gap-6">
          <div>
            <h1 className="text-4xl font-black uppercase tracking-tighter text-slate-950">Business Dashboard</h1>
            <div className="flex space-x-6 mt-4">
              <button 
                onClick={() => setActiveTab('leads')}
                className={`text-xs font-black uppercase tracking-widest pb-2 border-b-2 transition-all ${activeTab === 'leads' ? 'border-blue-600 text-blue-600' : 'border-transparent text-slate-400'}`}
              >
                Leads & Bookings ({quotes.length})
              </button>
              <button 
                onClick={() => setActiveTab('reviews')}
                className={`text-xs font-black uppercase tracking-widest pb-2 border-b-2 transition-all ${activeTab === 'reviews' ? 'border-blue-600 text-blue-600' : 'border-transparent text-slate-400'}`}
              >
                Reviews ({allReviews.length})
              </button>
              <button 
                onClick={() => setActiveTab('gallery')}
                className={`text-xs font-black uppercase tracking-widest pb-2 border-b-2 transition-all ${activeTab === 'gallery' ? 'border-blue-600 text-blue-600' : 'border-transparent text-slate-400'}`}
              >
                Gallery ({galleryImages.length})
              </button>
            </div>
          </div>
          <div className="flex items-center space-x-6">
             <div className="bg-white p-3 rounded-xl border border-slate-200 hidden md:block">
                <img 
                  src={`https://api.qrserver.com/v1/create-qr-code/?size=100x100&data=${encodeURIComponent('https://siouxlandcleanout.com')}`} 
                  alt="Business QR Code"
                  className="w-12 h-12"
                />
             </div>
             <button 
              onClick={() => setIsLoggedIn(false)}
              className="text-xs font-bold uppercase tracking-widest text-slate-400 hover:text-red-500"
            >
              Log Out
            </button>
          </div>
        </div>

        {activeTab === 'leads' && (
          <div className="space-y-8">
            <h2 className="text-xl font-black uppercase tracking-tighter flex items-center">
              <span className="w-2 h-2 bg-blue-600 rounded-full mr-3" />
              Manage Customers
            </h2>
            <div className="grid gap-6">
              {quotes.length === 0 ? (
                <div className="bg-white p-12 rounded-2xl border border-slate-200 text-center text-slate-400 italic">
                  No requests yet.
                </div>
              ) : (
                quotes.map(quote => (
                  <LeadCard key={quote._id} quote={quote} updateQuote={updateQuote} />
                ))
              )}
            </div>
          </div>
        )}

        {activeTab === 'reviews' && (
          <div className="space-y-6">
            <h2 className="text-xl font-black uppercase tracking-tighter flex items-center">
              <span className="w-2 h-2 bg-blue-600 rounded-full mr-3" />
              Manage Reviews
            </h2>
            <div className="grid md:grid-cols-2 gap-6">
              {allReviews.map(review => (
                <div key={review._id} className={`bg-white p-8 rounded-2xl border ${review.approved ? 'border-slate-200' : 'border-blue-200 bg-blue-50/20'} shadow-sm`}>
                   <div className="flex justify-between items-center mb-4">
                      <div className="flex text-yellow-400">
                        {Array.from({ length: review.rating }).map((_, i) => (
                          <svg key={i} className="w-4 h-4 fill-current" viewBox="0 0 20 20">
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                          </svg>
                        ))}
                      </div>
                      <span className={`text-[10px] font-black uppercase tracking-widest ${review.approved ? 'text-slate-400' : 'text-blue-600 animate-pulse'}`}>
                        {review.approved ? 'Public' : 'Pending Approval'}
                      </span>
                   </div>
                   <p className="text-slate-700 mb-6 font-medium italic">"{review.comment}"</p>
                   <div className="flex justify-between items-center">
                      <p className="text-[10px] font-black uppercase tracking-widest text-slate-500">— {review.name}</p>
                      <div className="flex space-x-3">
                        <button 
                          onClick={() => deleteReview({ id: review._id })}
                          className="text-[10px] font-black uppercase tracking-widest text-red-500 hover:text-red-700"
                        >
                          Delete
                        </button>
                        {!review.approved && (
                          <button 
                            onClick={() => approveReview({ id: review._id })}
                            className="bg-blue-600 text-white px-4 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest hover:bg-blue-500"
                          >
                            Approve
                          </button>
                        )}
                      </div>
                   </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'gallery' && (
          <div className="space-y-8">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-black uppercase tracking-tighter flex items-center">
                <span className="w-2 h-2 bg-blue-600 rounded-full mr-3" />
                Gallery Management
              </h2>
              <div>
                <input 
                  type="file" 
                  ref={galleryInputRef} 
                  onChange={handleGalleryUpload} 
                  className="hidden" 
                />
                <button 
                  onClick={() => galleryInputRef.current?.click()}
                  className="bg-blue-600 text-white px-6 py-3 rounded-xl text-xs font-black uppercase tracking-widest hover:bg-blue-500 transition-all shadow-xl shadow-blue-600/20"
                >
                  Upload New Photo
                </button>
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {galleryImages.map(img => (
                <div key={img._id} className="aspect-square rounded-xl overflow-hidden relative group border border-slate-200">
                  {img.url && <img src={img.url} className="w-full h-full object-cover" />}
                  <button 
                    onClick={() => {
                      if(confirm('Delete this image from the gallery?')) {
                        deleteGalleryImage({ id: img._id })
                      }
                    }}
                    className="absolute top-2 right-2 bg-red-600 text-white p-1.5 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

function LeadCard({ quote, updateQuote }: { quote: any, updateQuote: any }) {
  const [isEditing, setIsEditing] = useState(false)
  const [status, setStatus] = useState(quote.status || 'pending')
  const [date, setDate] = useState(quote.scheduledDate || '')
  const [price, setPrice] = useState(quote.price || '')

  const handleSave = async () => {
    await updateQuote({
      id: quote._id,
      status,
      scheduledDate: date,
      price,
    })
    setIsEditing(false)
  }

  return (
    <div className={`bg-white p-8 rounded-2xl border ${status === 'booked' ? 'border-blue-500 shadow-blue-100' : 'border-slate-200'} shadow-sm`}>
      <div className="flex flex-col md:flex-row justify-between items-start gap-6">
        <div className="flex-grow">
          <div className="flex items-center gap-3 mb-2">
            <h3 className="text-xl font-black uppercase tracking-tighter text-slate-950">{quote.name}</h3>
            <span className={`text-[10px] font-black uppercase tracking-widest px-2 py-1 rounded-md ${
              status === 'booked' ? 'bg-blue-600 text-white' : 
              status === 'completed' ? 'bg-green-100 text-green-700' :
              'bg-slate-100 text-slate-500'
            }`}>
              {status}
            </span>
          </div>
          <p className="text-sm font-bold text-blue-600 mb-1">{quote.phone} • {quote.email}</p>
          <p className="text-xs text-slate-400 mb-4">Requested on {new Date(quote._creationTime).toLocaleDateString()}</p>
          
          <div className="flex flex-wrap gap-2 mb-6">
            {quote.heavyObjects && <span className="text-[10px] bg-slate-50 text-slate-600 px-2 py-1 rounded-md font-bold">Heavy</span>}
            {quote.stairs && <span className="text-[10px] bg-slate-50 text-slate-600 px-2 py-1 rounded-md font-bold">Stairs</span>}
            {quote.smallSpaces && <span className="text-[10px] bg-slate-50 text-slate-600 px-2 py-1 rounded-md font-bold">Small Space</span>}
            {quote.other && <span className="text-[10px] bg-slate-50 text-slate-600 px-2 py-1 rounded-md font-bold">Special</span>}
          </div>

          <p className="text-sm text-slate-600 bg-slate-50 p-4 rounded-xl mb-6">
            {quote.description}
          </p>

          {quote.imageIds.length > 0 && (
            <div className="grid grid-cols-4 md:grid-cols-6 gap-2 mb-6">
               {quote.imageIds.map((id: any) => (
                 <QuoteImage key={id} storageId={id} />
               ))}
            </div>
          )}
        </div>

        <div className="w-full md:w-64 bg-slate-50 p-6 rounded-2xl border border-slate-100">
          <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-4">Job Management</h4>
          
          {isEditing ? (
            <div className="space-y-4">
              <div>
                <label className="text-[8px] font-black uppercase tracking-widest text-slate-400 block mb-1">Status</label>
                <select 
                  value={status} 
                  onChange={(e) => setStatus(e.target.value)}
                  className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-xs outline-none focus:ring-2 focus:ring-blue-600"
                >
                  <option value="pending">Pending</option>
                  <option value="booked">Booked</option>
                  <option value="completed">Completed</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              </div>
              <div>
                <label className="text-[8px] font-black uppercase tracking-widest text-slate-400 block mb-1">Date</label>
                <input 
                  type="date" 
                  value={date} 
                  onChange={(e) => setDate(e.target.value)}
                  className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-xs outline-none focus:ring-2 focus:ring-blue-600"
                />
              </div>
              <div>
                <label className="text-[8px] font-black uppercase tracking-widest text-slate-400 block mb-1">Price ($)</label>
                <input 
                  type="text" 
                  placeholder="e.g. 150"
                  value={price} 
                  onChange={(e) => setPrice(e.target.value)}
                  className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-xs outline-none focus:ring-2 focus:ring-blue-600"
                />
              </div>
              <div className="flex gap-2">
                <button 
                  onClick={handleSave}
                  className="flex-grow bg-blue-600 text-white py-2 rounded-lg text-[10px] font-black uppercase tracking-widest hover:bg-blue-700"
                >
                  Save
                </button>
                <button 
                  onClick={() => setIsEditing(false)}
                  className="bg-slate-200 text-slate-600 px-3 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest"
                >
                  X
                </button>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-[10px] font-bold text-slate-400">Scheduled:</span>
                <span className="text-xs font-black">{date || 'TBD'}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-[10px] font-bold text-slate-400">Price:</span>
                <span className="text-xs font-black text-green-600">{price ? `${price}` : 'No Quote'}</span>
              </div>
              <button 
                onClick={() => setIsEditing(true)}
                className="w-full border-2 border-blue-600 text-blue-600 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-blue-50 transition-all"
              >
                Organize / Book
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

function QuoteImage({ storageId }: { storageId: any }) {
  const url = useQuery(api.admin.getImageUrl, { storageId })
  if (!url) return <div className="aspect-square bg-slate-100 rounded-lg animate-pulse" />
  return (
    <a href={url} target="_blank" className="aspect-square rounded-lg overflow-hidden border border-slate-100 hover:opacity-80 transition-opacity">
      <img src={url} className="w-full h-full object-cover" />
    </a>
  )
}
