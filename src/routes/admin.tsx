import { Link, createFileRoute } from '@tanstack/react-router'
import { useEffect, useRef, useState } from 'react'
import { useMutation } from 'convex/react'
import { useQuery } from '@tanstack/react-query'
import { convexQuery } from '@convex-dev/react-query'
import { api } from '../../convex/_generated/api'
import type { ChangeEvent, FormEvent } from 'react'

export const Route = createFileRoute('/admin')({
  component: AdminPage,
})

function AdminPage() {
  const [password, setPassword] = useState('')
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [activeTab, setActiveTab] = useState<
    'leads' | 'reviews' | 'gallery' | 'settings'
  >('leads')
  const [isDemoMode, setIsDemoMode] = useState(false)
  const [isVerifying, setIsVerifying] = useState(false)
  const [failCount, setFailCount] = useState(0)
  const [lastError, setLastError] = useState<string | null>(null)

  const verify = useMutation(api.admin.verifyPassword)
  const resetPwd = useMutation(api.admin.resetPassword)
  const { data: backendStatus } = useQuery(convexQuery(api.admin.getBackendStatus, {}))

  useEffect(() => {
    const savedLogin = localStorage.getItem('siouxland_admin_logged_in')
    if (savedLogin === 'true') {
      setIsLoggedIn(true)
    }
  }, [])

  const handleLogin = async (e: FormEvent) => {
    e.preventDefault()
    setIsVerifying(true)
    setLastError(null)
    try {
      const isValid = await verify({ password })
      if (isValid) {
        setIsLoggedIn(true)
        setFailCount(0)
        localStorage.setItem('siouxland_admin_logged_in', 'true')
      } else {
        setFailCount((prev) => prev + 1)
        setLastError('Incorrect password. Please try the default.')
      }
    } catch (err: any) {
      console.error(err)
      setLastError(
        err.message || 'Network Error: Could not reach the business database.',
      )
    } finally {
      setIsVerifying(false)
    }
  }

  const handleRecovery = async () => {
    const secret = window.prompt('Enter Recovery Key (RECOVER_ACCESS_2024):')
    if (secret) {
      const msg = await resetPwd({ secret })
      alert(msg)
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
    return (
      <AdminDashboard
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onLogout={handleLogout}
        backendStatus={backendStatus}
      />
    )
  }

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center px-4 py-12">
      <div className="w-full max-w-md text-center">
        <div className="mb-12 p-6 bg-blue-600/10 border border-blue-500/20 rounded-3xl text-left backdrop-blur-sm">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <p className="text-[10px] font-black uppercase tracking-widest text-blue-400">
              Database Connection: {backendStatus ? backendStatus : 'v1.2.7-auth ACTIVE'}
            </p>
          </div>
          <p className="text-[8px] font-mono text-slate-500 break-all leading-relaxed opacity-50">
            CONVEX_URL:{' '}
            {import.meta.env.VITE_CONVEX_URL || 'Using Safety Fallback'}
          </p>
        </div>

        <form
          onSubmit={handleLogin}
          className="bg-white p-10 rounded-[2.5rem] shadow-[0_35px_60px_-15px_rgba(0,0,0,0.5)] text-left border-t-8 border-blue-600 relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 w-32 h-32 bg-blue-50 rounded-full -mr-16 -mt-16"></div>

          <h1 className="text-4xl font-black uppercase tracking-tighter mb-2 text-slate-950 relative">
            Owner Access
          </h1>
          <p className="text-[10px] text-slate-400 font-bold uppercase tracking-[0.3em] mb-12 relative">
            SiouxLand Clean Out Crew | v1.2.8-DEPLOYED-ACCOUNTS
          </p>

          <div className="space-y-8">
            <div>
              <label className="text-[10px] uppercase font-black text-slate-400 mb-3 block tracking-widest">
                Admin Password
              </label>
              <input
                type="password"
                placeholder="••••••••"
                autoFocus
                disabled={isVerifying}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className={`w-full bg-slate-50 border-2 ${lastError ? 'border-red-500' : 'border-slate-100'} rounded-2xl px-6 py-5 focus:border-blue-600 focus:ring-0 outline-none transition-all text-lg font-bold text-slate-900 disabled:opacity-50 shadow-inner`}
              />
              {lastError && (
                <p className="text-[10px] text-red-500 font-bold uppercase tracking-widest mt-3 animate-bounce">
                  ⚠ {lastError}
                </p>
              )}
            </div>

            <div className="pt-4">
              <button
                type="submit"
                disabled={isVerifying}
                className="w-full bg-blue-600 text-white py-5 rounded-2xl font-black uppercase tracking-widest text-sm hover:bg-blue-500 transition-all shadow-2xl shadow-blue-600/40 active:scale-95 disabled:bg-slate-400"
              >
                {isVerifying ? 'Authenticating...' : 'Unlock Portal'}
              </button>
            </div>
          </div>
        </form>

        <div className="mt-12 space-y-6">
          {failCount > 1 && (
            <button
              onClick={handleRecovery}
              className="block w-full text-blue-500 hover:text-blue-400 text-[10px] uppercase tracking-widest font-black transition-all bg-white/5 py-3 rounded-xl border border-white/5"
            >
              Forgot Password? Click to Recover
            </button>
          )}

          <button
            onClick={() => setIsDemoMode(true)}
            className="text-white/20 hover:text-white/50 text-[10px] uppercase tracking-widest font-black transition-all"
          >
            Launch Site Simulator
          </button>

          <Link
            to="/"
            className="block text-white/10 hover:text-white/30 text-[10px] uppercase tracking-[0.3em] font-bold transition-colors"
          >
            ← Exit to Public Site
          </Link>
        </div>
      </div>
    </div>
  )
}

function AdminDashboard({
  activeTab,
  setActiveTab,
  onLogout,
  backendStatus,
}: {
  activeTab: 'leads' | 'reviews' | 'gallery' | 'settings'
  setActiveTab: (tab: 'leads' | 'reviews' | 'gallery' | 'settings') => void
  onLogout: () => void
  backendStatus?: string
}) {
  const { data: quotesRaw, error: quotesError } = useQuery(convexQuery(api.admin.list, {}))
  const { data: allReviewsRaw, error: reviewsError } = useQuery(convexQuery(api.reviews.listAll, {}))
  const { data: galleryImagesRaw, error: galleryError } = useQuery(convexQuery(api.gallery.list, {}))
  const { data: socialLinksRaw } = useQuery(
    convexQuery(api.admin.getSocialLinks, {}),
  )

  const hasError = quotesError || reviewsError || galleryError

  const quotes = quotesRaw || []
  const allReviews = allReviewsRaw || []
  const galleryImages = galleryImagesRaw || []

  // Settings tab state
  const [oldPassword, setOldPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [isChanging, setIsChanging] = useState(false)
  
  const [jobberUrl, setJobberUrl] = useState('')
  const [facebookUrl, setFacebookUrl] = useState('')
  const [instagramUrl, setInstagramUrl] = useState('')
  const [tiktokUrl, setTiktokUrl] = useState('')
  const [isSavingLinks, setIsSavingLinks] = useState(false)

  // Sync social links from database
  useEffect(() => {
    if (socialLinksRaw) {
      setJobberUrl(socialLinksRaw.jobber || '')
      setFacebookUrl(socialLinksRaw.facebook || '')
      setInstagramUrl(socialLinksRaw.instagram || '')
      setTiktokUrl(socialLinksRaw.tiktok || '')
    }
  }, [socialLinksRaw])

  const changePwd = useMutation(api.admin.changePassword)
  const updateQuote = useMutation(api.admin.updateQuote)
  const approveReview = useMutation(api.reviews.approve)
  const deleteReview = useMutation(api.reviews.remove)
  const generateUploadUrl = useMutation(api.quotes.generateUploadUrl)
  const addToGallery = useMutation(api.gallery.add)
  const deleteGalleryImage = useMutation(api.gallery.remove)
  const updateSocialLinks = useMutation(api.admin.updateSocialLinks)

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

  if (hasError) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-8">
        <h2 className="text-xl font-bold text-red-600 mb-4">Dashboard Error</h2>
        <p className="text-slate-600 mb-8">We couldn't load some of your business data.</p>
        <div className="bg-red-50 p-4 rounded-xl border border-red-100 mb-8 text-xs font-mono max-w-lg overflow-auto">
          {quotesError && <p>Quotes: {quotesError.message}</p>}
          {reviewsError && <p>Reviews: {reviewsError.message}</p>}
          {galleryError && <p>Gallery: {galleryError.message}</p>}
        </div>
        <button onClick={() => window.location.reload()} className="bg-blue-600 text-white px-8 py-3 rounded-xl font-bold">Try Refreshing</button>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      {/* Top Header */}
      <div className="bg-slate-950 text-white p-6 md:px-12 flex flex-col md:flex-row justify-between items-center gap-6 border-b-4 border-blue-600">
        <div className="flex items-center gap-4">
          <div className="bg-blue-600 p-2 rounded-lg">
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
              />
            </svg>
          </div>
          <div>
            <h1 className="text-xl font-black uppercase tracking-tighter">
              Business Dashboard
            </h1>
            <p className="text-[9px] font-bold text-slate-500 uppercase tracking-widest">
              SiouxLand COC Admin Portal | {backendStatus || 'v1.2.7-auth ACTIVE'}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-6">
          <button
            onClick={onLogout}
            className="text-[10px] font-black uppercase tracking-widest text-slate-500 hover:text-red-500 transition-colors"
          >
            Log Out Account
          </button>
        </div>
      </div>

      {/* Main Tabs */}
      <div className="bg-white border-b border-slate-200 sticky top-0 z-40 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 overflow-x-auto">
          <div className="flex space-x-8">
            {[
              { id: 'leads', label: 'Leads & Bookings', count: quotes.length, loading: quotesRaw === undefined },
              { id: 'reviews', label: 'Reviews', count: allReviews.length, loading: allReviewsRaw === undefined },
              {
                id: 'gallery',
                label: 'Photo Gallery',
                count: galleryImages.length,
                loading: galleryImagesRaw === undefined
              },
              { id: 'settings', label: 'Business Settings', count: null, loading: false },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`py-6 text-[10px] font-black uppercase tracking-[0.2em] whitespace-nowrap transition-all border-b-4 ${activeTab === tab.id ? 'border-blue-600 text-blue-600' : 'border-transparent text-slate-400 hover:text-slate-600'}`}
              >
                {tab.label}{' '}
                {tab.loading ? (
                  <span className="ml-2 inline-block w-2 h-2 bg-blue-200 rounded-full animate-pulse"></span>
                ) : tab.count !== null && (
                  <span
                    className={`ml-2 px-2 py-0.5 rounded-full text-[8px] ${activeTab === tab.id ? 'bg-blue-100 text-blue-600' : 'bg-slate-100 text-slate-400'}`}
                  >
                    {tab.count}
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-6 md:p-12">
        {activeTab === 'leads' && (
          quotesRaw === undefined ? (
            <LoadingState message="Loading leads..." />
          ) : (
            <div className="grid gap-8">
              {quotes.length === 0 ? (
                <div className="bg-white p-20 rounded-3xl border border-slate-200 text-center italic text-slate-400">
                  No leads found in database.
                </div>
              ) : (
                quotes.map((quote) => (
                  <LeadCard
                    key={quote._id}
                    quote={quote}
                    updateQuote={updateQuote}
                  />
                ))
              )}
            </div>
          )
        )}

        {activeTab === 'reviews' && (
          allReviewsRaw === undefined ? (
            <LoadingState message="Loading reviews..." />
          ) : (
            <div className="grid md:grid-cols-2 gap-8">
              {allReviews.length === 0 ? (
                 <div className="col-span-full bg-white p-20 rounded-3xl border border-slate-200 text-center italic text-slate-400">
                  No reviews submitted yet.
                </div>
              ) : allReviews.map((review) => (
                <div
                  key={review._id}
                  className={`bg-white p-8 rounded-3xl border ${review.approved ? 'border-slate-200 shadow-sm' : 'border-blue-200 bg-blue-50/20 shadow-md'}`}
                >
                  <div className="flex justify-between items-center mb-6">
                    <div className="flex flex-col gap-1">
                      <span
                        className={`text-[9px] font-black uppercase tracking-widest px-2 py-1 rounded w-fit ${review.approved ? 'bg-slate-100 text-slate-400' : 'bg-blue-600 text-white animate-pulse'}`}
                      >
                        {review.approved ? 'Live' : 'Pending Approval'}
                      </span>
                      {review.userEmail && (
                        <span className="text-[8px] text-blue-600 font-bold uppercase tracking-widest">
                          Verified Account: {review.userEmail}
                        </span>
                      )}
                    </div>
                    <button
                      onClick={() => deleteReview({ id: review._id })}
                      className="text-red-400 hover:text-red-600 text-[10px] uppercase font-black transition-colors"
                    >
                      Delete
                    </button>
                  </div>
                  <p className="text-slate-700 italic font-medium leading-relaxed mb-6">
                    "{review.comment}"
                  </p>
                  <div className="flex justify-between items-end">
                    <p className="text-[10px] font-black uppercase tracking-widest text-slate-500">
                      — {review.name}
                    </p>
                    {!review.approved && (
                      <button
                        onClick={() => approveReview({ id: review._id })}
                        className="bg-blue-600 text-white px-6 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-blue-700"
                      >
                        Approve
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )
        )}

        {activeTab === 'gallery' && (
          galleryImagesRaw === undefined ? (
            <LoadingState message="Loading gallery..." />
          ) : (
            <div className="space-y-12">
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-black uppercase tracking-tighter">
                  Manage Gallery
                </h2>
                <input
                  type="file"
                  ref={galleryInputRef}
                  onChange={async (e: ChangeEvent<HTMLInputElement>) => {
                    const maybeFile = e.target.files?.item(0)
                    if (maybeFile == null) return
                    const file: File = maybeFile
                    const postUrl = await generateUploadUrl()
                    const result = await fetch(postUrl, {
                      method: 'POST',
                      headers: { 'Content-Type': file.type },
                      body: file,
                    })
                    const { storageId } = await result.json()
                    await addToGallery({ storageId })
                    alert('Uploaded!')
                  }}
                  className="hidden"
                />
                <button
                  onClick={() => galleryInputRef.current?.click()}
                  className="bg-blue-600 text-white px-8 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-xl shadow-blue-600/20 hover:bg-blue-500 transition-all"
                >
                  Add New Photo
                </button>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                {galleryImages.length === 0 ? (
                  <div className="col-span-full bg-white p-20 rounded-3xl border border-slate-200 text-center italic text-slate-400">
                    Your gallery is empty.
                  </div>
                ) : galleryImages.map((img) => (
                  <div
                    key={img._id}
                    className="aspect-square rounded-2xl overflow-hidden relative group border-2 border-slate-100 shadow-sm"
                  >
                    {img.url && (
                      <img src={img.url} className="w-full h-full object-cover" />
                    )}
                    <button
                      onClick={() =>
                        window.confirm('Permanent Delete?') &&
                        deleteGalleryImage({ id: img._id })
                      }
                      className="absolute top-2 right-2 bg-red-600 text-white p-2 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity shadow-lg"
                    >
                      <svg
                        className="w-3 h-3"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                        />
                      </svg>
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )
        )}

        {activeTab === 'settings' && (
          <div className="space-y-12">
            <h2 className="text-2xl font-black uppercase tracking-tighter">
              Business & Security
            </h2>
            <div className="max-w-md bg-white p-10 rounded-3xl border border-slate-200 shadow-xl relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-2 bg-blue-600"></div>
              <form onSubmit={handlePasswordChange} className="space-y-8">
                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">
                  Update Portal Password
                </p>
                <div>
                  <label className="text-[10px] font-black uppercase text-slate-500 mb-2 block tracking-widest">
                    Current Password
                  </label>
                  <input
                    type="password"
                    required
                    value={oldPassword}
                    onChange={(e) => setOldPassword(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-4 text-sm focus:ring-2 focus:ring-blue-600 outline-none transition-all"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-black uppercase text-slate-500 mb-2 block tracking-widest">
                    New Secret Password
                  </label>
                  <input
                    type="password"
                    required
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-4 text-sm focus:ring-2 focus:ring-blue-600 outline-none transition-all"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-black uppercase text-slate-500 mb-2 block tracking-widest">
                    Confirm New Password
                  </label>
                  <input
                    type="password"
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-4 text-sm focus:ring-2 focus:ring-blue-600 outline-none transition-all"
                  />
                </div>
                <button
                  disabled={isChanging}
                  className="w-full bg-blue-600 text-white py-5 rounded-2xl font-black uppercase tracking-[0.2em] shadow-xl shadow-blue-600/20 hover:bg-blue-500 transition-all disabled:bg-slate-300"
                >
                  {isChanging ? 'Saving Changes...' : 'Update Password'}
                </button>
              </form>
            </div>

            <h2 className="text-2xl font-black uppercase tracking-tighter">
              Social Media Links
            </h2>
            <div className="max-w-md bg-white p-10 rounded-3xl border border-slate-200 shadow-xl relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-2 bg-green-600"></div>
              <form
                onSubmit={async (e) => {
                  e.preventDefault()
                  setIsSavingLinks(true)
                  try {
                    await updateSocialLinks({
                      jobber: jobberUrl || undefined,
                      facebook: facebookUrl || undefined,
                      instagram: instagramUrl || undefined,
                      tiktok: tiktokUrl || undefined,
                    })
                    alert('Social links updated!')
                  } catch (err) {
                    alert('Error updating links')
                  } finally {
                    setIsSavingLinks(false)
                  }
                }}
                className="space-y-8"
              >
                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">
                  Manage External Links
                </p>
                <div>
                  <label className="text-[10px] font-black uppercase text-slate-500 mb-2 block tracking-widest">
                    Jobber URL
                  </label>
                  <input
                    type="url"
                    value={jobberUrl}
                    onChange={(e) => setJobberUrl(e.target.value)}
                    placeholder="https://app.jobber.com/..."
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-4 text-sm focus:ring-2 focus:ring-green-600 outline-none transition-all"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-black uppercase text-slate-500 mb-2 block tracking-widest">
                    Facebook Page URL
                  </label>
                  <input
                    type="url"
                    value={facebookUrl}
                    onChange={(e) => setFacebookUrl(e.target.value)}
                    placeholder="https://www.facebook.com/..."
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-4 text-sm focus:ring-2 focus:ring-green-600 outline-none transition-all"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-black uppercase text-slate-500 mb-2 block tracking-widest">
                    Instagram URL
                  </label>
                  <input
                    type="url"
                    value={instagramUrl}
                    onChange={(e) => setInstagramUrl(e.target.value)}
                    placeholder="https://www.instagram.com/..."
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-4 text-sm focus:ring-2 focus:ring-green-600 outline-none transition-all"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-black uppercase text-slate-500 mb-2 block tracking-widest">
                    TikTok URL
                  </label>
                  <input
                    type="url"
                    value={tiktokUrl}
                    onChange={(e) => setTiktokUrl(e.target.value)}
                    placeholder="https://www.tiktok.com/@..."
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-4 text-sm focus:ring-2 focus:ring-green-600 outline-none transition-all"
                  />
                </div>
                <button
                  type="submit"
                  disabled={isSavingLinks}
                  className="w-full bg-green-600 text-white py-5 rounded-2xl font-black uppercase tracking-[0.2em] shadow-xl shadow-blue-600/20 hover:bg-green-500 transition-all disabled:bg-slate-300"
                >
                  {isSavingLinks ? 'Saving...' : 'Save Social Links'}
                </button>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

function LoadingState({ message }: { message: string }) {
  return (
    <div className="py-24 text-center">
      <div className="inline-block w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
      <p className="mt-4 text-[10px] font-black uppercase tracking-widest text-slate-400">
        {message}
      </p>
    </div>
  )
}

function DemoDashboard({
  setIsDemoMode,
}: {
  setIsDemoMode: (val: boolean) => void
}) {
  return (
    <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-8 text-white text-center">
      <div className="w-20 h-20 bg-blue-600 rounded-full flex items-center justify-center mb-8 shadow-2xl shadow-blue-600/40 animate-pulse">
        <svg
          className="w-10 h-10"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M13 10V3L4 14h7v7l9-11h-7z"
          />
        </svg>
      </div>
      <h1 className="text-4xl font-black uppercase tracking-tighter mb-4 italic text-blue-400">
        Owner Demo Mode
      </h1>
      <p className="text-slate-500 max-w-sm mb-12 uppercase text-[10px] font-bold tracking-[0.3em] leading-relaxed">
        This is a sandbox simulation. No data is saved to your cloud account
        while in this mode.
      </p>
      <button
        onClick={() => setIsDemoMode(false)}
        className="bg-white text-slate-950 px-12 py-4 rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-blue-400 hover:text-white transition-all shadow-2xl"
      >
        Return to Real Portal
      </button>
    </div>
  )
}

function LeadCard({ quote, updateQuote }: { quote: any; updateQuote: any }) {
  const [isEditing, setIsEditing] = useState(false)
  const [status, setStatus] = useState(quote.status || 'pending')
  const [date, setDate] = useState(quote.scheduledDate || '')
  const [price, setPrice] = useState(quote.price || '')

  const handleSave = async () => {
    await updateQuote({ id: quote._id, status, scheduledDate: date, price })
    setIsEditing(false)
  }

  return (
    <div
      className={`bg-white p-8 md:p-12 rounded-[2.5rem] border ${status === 'booked' ? 'border-blue-600 shadow-2xl shadow-blue-100' : 'border-slate-100 shadow-sm'} transition-all`}
    >
      <div className="flex flex-col lg:flex-row justify-between items-start gap-8">
        <div className="flex-grow space-y-6">
          <div className="flex flex-wrap items-center gap-4">
            <h3 className="text-2xl font-black uppercase tracking-tighter text-slate-950">
              {quote.name}
            </h3>
            <span
              className={`text-[9px] font-black uppercase tracking-widest px-3 py-1 rounded-full ${
                status === 'booked'
                  ? 'bg-blue-600 text-white'
                  : status === 'completed'
                    ? 'bg-green-100 text-green-700'
                    : status === 'cancelled'
                      ? 'bg-red-100 text-red-700'
                      : status === 'change_requested'
                        ? 'bg-amber-100 text-amber-700'
                        : 'bg-slate-100 text-slate-400'
              }`}
            >
              {status.replace('_', ' ')}
            </span>
            {quote.customerAccepted && (
              <span className="text-[9px] bg-green-500 text-white px-3 py-1 rounded-full font-black uppercase tracking-widest animate-pulse shadow-lg shadow-green-500/20">
                ✓ Customer Approved
              </span>
            )}
            {quote.userId && (
              <span className="text-[9px] border border-blue-600 text-blue-600 px-3 py-1 rounded-full font-black uppercase tracking-widest">
                Account: {quote.userEmail}
              </span>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-slate-50 px-6 py-4 rounded-2xl border border-slate-100">
              <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest mb-1">
                Customer Contact
              </p>
              <p className="text-sm font-bold text-blue-600">{quote.phone}</p>
              <p className="text-xs font-medium text-slate-400">
                {quote.email}
              </p>
            </div>
            <div className="bg-slate-50 px-6 py-4 rounded-2xl border border-slate-100">
              <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest mb-1">
                Job Location
              </p>
              <p className="text-sm font-black uppercase text-slate-950 flex items-center gap-2">
                <span className="text-blue-600">📍</span>
                {quote.location || 'Not Specified'}
              </p>
            </div>
          </div>

          {quote.customerNotes && (
            <div className="bg-amber-50 border border-amber-100 p-6 rounded-3xl">
              <p className="text-[8px] font-black text-amber-600 uppercase tracking-widest mb-2 text-center">
                Message from Customer
              </p>
              <p className="text-sm text-amber-950 italic font-medium leading-relaxed">
                "{quote.customerNotes}"
              </p>
            </div>
          )}

          <div className="bg-slate-50 p-6 rounded-3xl border border-slate-100">
            <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest mb-3">
              Job Description
            </p>
            <p className="text-sm text-slate-600 font-medium leading-relaxed italic">
              "{quote.description}"
            </p>
            <p className="text-[9px] text-slate-300 mt-4 uppercase font-bold tracking-widest italic">
              Received: {new Date(quote._creationTime).toLocaleDateString()}
            </p>
          </div>
        </div>

        <div className="w-full lg:w-80 space-y-6">
          <div className="bg-slate-950 text-white p-8 rounded-[2rem] shadow-2xl relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-32 h-32 bg-blue-600/10 rounded-full -mr-16 -mt-16 group-hover:scale-110 transition-transform"></div>
            <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-blue-400 mb-6">
              Finalized Quote
            </h4>

            {isEditing ? (
              <div className="space-y-4">
                <div className="space-y-1">
                  <label className="text-[8px] uppercase font-black text-slate-500 tracking-widest">
                    Pricing ($)
                  </label>
                  <input
                    type="text"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-xs outline-none focus:ring-1 focus:ring-blue-600"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[8px] uppercase font-black text-slate-500 tracking-widest">
                    Job Date
                  </label>
                  <input
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-xs outline-none focus:ring-1 focus:ring-blue-600"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[8px] uppercase font-black text-slate-500 tracking-widest">
                    Workflow Status
                  </label>
                  <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-xs outline-none focus:ring-1 focus:ring-blue-600"
                  >
                    <option value="pending" className="text-black">
                      Pending
                    </option>
                    <option value="booked" className="text-black">
                      Booked
                    </option>
                    <option value="change_requested" className="text-black">
                      Change Requested
                    </option>
                    <option value="completed" className="text-black">
                      Completed
                    </option>
                    <option value="cancelled" className="text-black">
                      Cancelled
                    </option>
                  </select>
                </div>
                <div className="flex gap-2 pt-2">
                  <button
                    onClick={handleSave}
                    className="flex-grow bg-blue-600 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest"
                  >
                    Save
                  </button>
                  <button
                    onClick={() => setIsEditing(false)}
                    className="bg-white/10 px-4 py-3 rounded-xl text-[10px] font-black"
                  >
                    X
                  </button>
                </div>
              </div>
            ) : (
              <div className="space-y-6">
                <div className="flex justify-between items-end border-b border-white/5 pb-4">
                  <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                    Amount
                  </span>
                  <span className="text-3xl font-black text-green-400 italic">
                    ${price || '---'}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                    Scheduled
                  </span>
                  <span className="text-xs font-black uppercase italic">
                    {date || 'TBD'}
                  </span>
                </div>
                <button
                  onClick={() => setIsEditing(true)}
                  className="w-full border-2 border-blue-600 text-blue-400 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-blue-600 hover:text-white transition-all mt-4"
                >
                  Full Edit
                </button>
              </div>
            )}
          </div>
          
          {!isEditing && (
            <div className="bg-blue-50 border border-blue-100 p-6 rounded-[2rem] space-y-4">
              <p className="text-[10px] font-black uppercase tracking-widest text-blue-600">Quick Quote / Fast Reply</p>
              <div className="flex gap-2">
                <div className="relative flex-grow">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-blue-400 font-bold">$</span>
                  <input 
                    type="text" 
                    placeholder="Enter Price"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    className="w-full bg-white border border-blue-200 rounded-xl pl-8 pr-4 py-3 text-sm focus:ring-2 focus:ring-blue-600 outline-none"
                  />
                </div>
                <button 
                  onClick={handleSave}
                  className="bg-blue-600 text-white px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-blue-700 transition-all shadow-lg shadow-blue-200"
                >
                  Send
                </button>
              </div>
              <p className="text-[9px] text-blue-400 font-medium italic">Setting a price here will notify the customer instantly via their dashboard.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default AdminPage
