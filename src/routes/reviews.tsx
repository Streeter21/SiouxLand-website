import { createFileRoute, Link } from '@tanstack/react-router'
import { useState } from 'react'
import { useMutation, useConvexAuth } from 'convex/react'
import { useQuery } from '@tanstack/react-query'
import { convexQuery } from '@convex-dev/react-query'
import { api } from '../../convex/_generated/api'

export const Route = createFileRoute('/reviews')({
  component: ReviewsPage,
})

function ReviewsPage() {
  const { isAuthenticated } = useConvexAuth()
  const submitReview = useMutation(api.reviews.submit)

  const [formData, setFormData] = useState({
    name: '',
    rating: 5,
    comment: '',
  })
  const [submitted, setSubmitted] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e: any) => {
    e.preventDefault()
    setIsSubmitting(true)
    try {
      await submitReview(formData)
      setSubmitted(true)
      setFormData({ name: formData.name, rating: 5, comment: '' })
    } catch (error: any) {
      console.error(error)
      alert(`Submission failed: ${error.message || "Unknown error"}`)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="bg-white min-h-screen text-slate-900">
      <div className="bg-slate-950 text-white py-20 px-4 text-center">
        <h1 className="text-4xl md:text-6xl font-black tracking-tighter uppercase mb-4">Customer Reviews</h1>
        <p className="text-slate-400 max-w-2xl mx-auto uppercase tracking-widest text-xs font-bold">
          See what your neighbors in SiouxLand have to say about our work.
        </p>
      </div>

      <section className="py-24 px-4 md:px-8 max-w-6xl mx-auto">
        <div className="grid md:grid-cols-3 gap-16">
          {/* Review List */}
          <div className="md:col-span-2 space-y-12">
            <ReviewList />
          </div>

          {/* Review Form */}
          <div className="md:sticky md:top-32 h-fit">
            <div className="bg-slate-950 text-white p-8 md:p-10 rounded-2xl shadow-2xl">
              <h3 className="text-2xl font-black uppercase tracking-tighter mb-2">Leave a Review</h3>
              {!isAuthenticated && (
                <p className="text-[10px] text-slate-500 uppercase tracking-widest font-bold mb-6">
                  <Link to="/auth" className="text-blue-400 hover:underline">Login</Link> to post as a verified customer
                </p>
              )}
              
              {submitted ? (
                <div className="text-center py-8">
                  <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-6">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <p className="text-sm font-bold uppercase tracking-widest mb-2">Review Submitted!</p>
                  <p className="text-slate-400 text-xs">It will appear on the site once approved by the owner.</p>
                  <button 
                    onClick={() => setSubmitted(false)}
                    className="mt-8 text-[10px] uppercase tracking-[0.2em] font-black text-blue-400 hover:text-blue-300 transition-colors"
                  >
                    Post another
                  </button>
                </div>
              ) : (
                <form className="space-y-6" onSubmit={handleSubmit}>
                  <div className="space-y-2">
                    <label className="text-[10px] uppercase tracking-[0.2em] font-black text-slate-400">Your Name</label>
                    <input 
                      required
                      type="text" 
                      value={formData.name}
                      onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                      className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-blue-600 outline-none transition-all text-white"
                      placeholder="Name"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] uppercase tracking-[0.2em] font-black text-slate-400">Rating</label>
                    <div className="flex space-x-2">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          type="button"
                          onClick={() => setFormData(prev => ({ ...prev, rating: star }))}
                          className={`w-8 h-8 flex items-center justify-center rounded-lg transition-all ${
                            formData.rating >= star ? 'bg-blue-600 text-white' : 'bg-slate-800 text-slate-500'
                          }`}
                        >
                          {star}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] uppercase tracking-[0.2em] font-black text-slate-400">Your Feedback</label>
                    <textarea 
                      required
                      value={formData.comment}
                      onChange={(e) => setFormData(prev => ({ ...prev, comment: e.target.value }))}
                      className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-3 text-sm min-h-[120px] focus:ring-2 focus:ring-blue-600 outline-none transition-all text-white"
                      placeholder="How was our service?"
                    />
                  </div>

                  <button 
                    type="submit" 
                    disabled={isSubmitting}
                    className="w-full bg-blue-600 text-white py-4 rounded-xl font-black uppercase tracking-[0.2em] text-xs hover:bg-blue-500 transition-all shadow-lg shadow-blue-900/40 disabled:bg-slate-800"
                  >
                    {isSubmitting ? "Posting..." : "Post Review"}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

function ReviewList() {
  const { data: reviews, isLoading, isError } = useQuery(convexQuery(api.reviews.list, {}))

  if (isLoading) {
    return (
      <div className="py-20 text-center">
        <div className="animate-pulse flex space-x-4 justify-center">
          <div className="rounded-full bg-slate-200 h-10 w-10"></div>
        </div>
      </div>
    )
  }

  if (isError || !reviews || reviews.length === 0) {
    return (
      <div className="bg-white border border-slate-100 p-12 text-center rounded-2xl">
        <p className="text-slate-400 italic">No reviews yet. Be the first to tell us how we did!</p>
      </div>
    )
  }

  return (
    <div className="grid gap-8">
      {reviews.map((review: any) => (
        <div key={review._id} className="bg-white border border-slate-100 p-8 rounded-2xl shadow-sm hover:shadow-md transition-shadow">
          <div className="flex text-yellow-400 mb-4">
            {Array.from({ length: review.rating }).map((_, i) => (
              <svg key={i} className="w-5 h-5 fill-current" viewBox="0 0 20 20">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
            ))}
          </div>
          <p className="text-lg text-slate-800 mb-6 font-medium leading-relaxed">"{review.comment}"</p>
          <p className="text-slate-500 font-bold uppercase tracking-widest text-[10px]">— {review.name}</p>
        </div>
      ))}
    </div>
  )
}
