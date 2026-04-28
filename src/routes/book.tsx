import { createFileRoute } from '@tanstack/react-router'
import { useState, useRef } from 'react'
import { useMutation } from 'convex/react'
import { api } from '../../convex/_generated/api'

export const Route = createFileRoute('/book')({
  component: BookPage,
})

function BookPage() {
  const submitQuote = useMutation(api.quotes.submit)
  const generateUploadUrl = useMutation(api.quotes.generateUploadUrl)

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    description: '',
    heavyObjects: false,
    stairs: false,
    smallSpaces: false,
    other: false,
  })
  const [selectedFiles, setSelectedFiles] = useState<File[]>([])
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setSelectedFiles(prev => [...prev, ...Array.from(e.target.files!)])
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const imageIds = []
      for (const file of selectedFiles) {
        const postUrl = await generateUploadUrl()
        const result = await fetch(postUrl, {
          method: "POST",
          headers: { "Content-Type": file.type },
          body: file,
        })
        const { storageId } = await result.json()
        imageIds.push(storageId)
      }

      await submitQuote({
        ...formData,
        imageIds,
      })
      setSubmitted(true)
      setFormData({
        name: '',
        email: '',
        phone: '',
        description: '',
        heavyObjects: false,
        stairs: false,
        smallSpaces: false,
        other: false,
      })
      setSelectedFiles([])
    } catch (error) {
      console.error("Submission failed", error)
      alert("Something went wrong. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="bg-white min-h-screen">
      <div className="bg-slate-950 text-white py-20 px-4 text-center">
        <h1 className="text-4xl md:text-6xl font-black tracking-tighter uppercase mb-4">Book Your Clean Out</h1>
        <p className="text-slate-400 max-w-2xl mx-auto uppercase tracking-widest text-xs font-bold">
          Send us details and photos for a free, no-obligation quote.
        </p>
      </div>

      <section className="py-24 px-4 md:px-8">
        <div className="max-w-3xl mx-auto bg-white border border-slate-100 rounded-2xl shadow-2xl overflow-hidden">
          <div className="p-8 md:p-12">
            {submitted ? (
              <div className="py-20 text-center">
                <div className="w-20 h-20 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-8">
                  <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <h4 className="text-3xl font-black uppercase tracking-tighter mb-4">Request Received!</h4>
                <p className="text-slate-600 mb-8">Thanks for reaching out. We'll review your job and contact you within 24 hours.</p>
                <button 
                  onClick={() => setSubmitted(false)}
                  className="bg-slate-950 text-white px-8 py-4 rounded-full font-bold uppercase tracking-widest text-xs hover:bg-slate-800 transition-all"
                >
                  Send Another Request
                </button>
              </div>
            ) : (
              <form className="space-y-10" onSubmit={handleSubmit}>
                <div className="grid md:grid-cols-2 gap-8">
                  <div className="space-y-3">
                    <label className="text-[10px] uppercase tracking-[0.2em] font-black text-slate-400">Full Name</label>
                    <input 
                      required
                      type="text" 
                      value={formData.name}
                      onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                      className="w-full bg-slate-50 border-none rounded-xl px-6 py-4 focus:ring-2 focus:ring-blue-600 outline-none transition-all"
                      placeholder="Enter your name"
                    />
                  </div>
                  <div className="space-y-3">
                    <label className="text-[10px] uppercase tracking-[0.2em] font-black text-slate-400">Phone Number</label>
                    <input 
                      required
                      type="tel" 
                      value={formData.phone}
                      onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                      className="w-full bg-slate-50 border-none rounded-xl px-6 py-4 focus:ring-2 focus:ring-blue-600 outline-none transition-all"
                      placeholder="(712) 000-0000"
                    />
                  </div>
                </div>

                <div className="space-y-3">
                  <label className="text-[10px] uppercase tracking-[0.2em] font-black text-slate-400">Email Address</label>
                  <input 
                    required
                    type="email" 
                    value={formData.email}
                    onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                    className="w-full bg-slate-50 border-none rounded-xl px-6 py-4 focus:ring-2 focus:ring-blue-600 outline-none transition-all"
                    placeholder="you@example.com"
                  />
                </div>

                <div className="space-y-6">
                  <label className="text-[10px] uppercase tracking-[0.2em] font-black text-slate-400 block">Job Factors (Check all that apply)</label>
                  <div className="grid grid-cols-2 gap-4">
                    {[
                      { id: 'heavyObjects', label: 'Heavy Objects' },
                      { id: 'stairs', label: 'Stairs Involved' },
                      { id: 'smallSpaces', label: 'Small Spaces' },
                      { id: 'other', label: 'Other Special Case' }
                    ].map(item => (
                      <label key={item.id} className="flex items-center p-4 bg-slate-50 rounded-xl cursor-pointer hover:bg-slate-100 transition-colors group">
                        <input 
                          type="checkbox" 
                          checked={(formData as any)[item.id]}
                          onChange={(e) => setFormData(prev => ({ ...prev, [item.id]: e.target.checked }))}
                          className="w-5 h-5 text-blue-600 border-slate-300 rounded focus:ring-blue-500" 
                        />
                        <span className="ml-4 text-sm font-bold text-slate-600 group-hover:text-slate-900">{item.label}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div className="space-y-3">
                  <label className="text-[10px] uppercase tracking-[0.2em] font-black text-slate-400">What needs to go?</label>
                  <textarea 
                    required
                    value={formData.description}
                    onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                    className="w-full bg-slate-50 border-none rounded-xl px-6 py-4 min-h-[160px] focus:ring-2 focus:ring-blue-600 outline-none transition-all"
                    placeholder="Describe the items or the space you need cleared..."
                  />
                </div>

                <div className="space-y-3">
                  <label className="text-[10px] uppercase tracking-[0.2em] font-black text-slate-400">Add Photos (Recommended)</label>
                  <div 
                    onClick={() => fileInputRef.current?.click()}
                    className="border-2 border-dashed border-slate-200 rounded-2xl p-12 text-center hover:border-blue-400 transition-all cursor-pointer bg-slate-50/50"
                  >
                    <input 
                      type="file" 
                      multiple 
                      ref={fileInputRef} 
                      onChange={handleFileChange} 
                      className="hidden" 
                    />
                    <div className="w-16 h-16 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <p className="font-bold text-slate-700">
                      {selectedFiles.length > 0 
                        ? `${selectedFiles.length} photos selected` 
                        : "Click to upload job photos"}
                    </p>
                    <p className="text-slate-400 text-xs mt-2 uppercase tracking-widest">Helps us give you a faster quote</p>
                  </div>
                </div>

                <button 
                  type="submit" 
                  disabled={isSubmitting}
                  className="w-full bg-blue-600 text-white py-6 rounded-xl font-black uppercase tracking-[0.2em] hover:bg-blue-500 transition-all shadow-xl shadow-blue-600/20 disabled:bg-slate-300 disabled:shadow-none"
                >
                  {isSubmitting ? "Sending Request..." : "Request Quote"}
                </button>
              </form>
            )}
          </div>
        </div>
      </section>
    </div>
  )
}
