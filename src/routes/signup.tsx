import { createFileRoute, Link, useNavigate } from '@tanstack/react-router'
import { useState, type FormEvent } from 'react'
import { useAuthActions } from '@convex-dev/auth/react'

export const Route = createFileRoute('/signup' as any)({
  component: SignupPage,
})

function SignupPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [name, setName] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const { signIn } = useAuthActions()
  const navigate = useNavigate()

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)
    try {
      const formData = new FormData()
      formData.append('email', email)
      formData.append('password', password)
      formData.append('name', name)
      formData.append('flow', 'signUp')
      
      await signIn('password', formData)
      navigate({ to: '/dashboard' as any })
    } catch (err: any) {
      setError(err.message || 'Failed to sign up. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center px-4 py-12">
      <div className="max-w-md w-full bg-white p-10 rounded-[2.5rem] shadow-xl border-t-8 border-blue-600">
        <h1 className="text-3xl font-black uppercase tracking-tighter mb-2 text-slate-950">Create Account</h1>
        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-[0.3em] mb-8">Join the SiouxLand COC Community</p>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="text-[10px] uppercase font-black text-slate-400 mb-2 block tracking-widest">Full Name</label>
            <input 
              type="text" 
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-6 py-4 focus:border-blue-600 focus:ring-0 outline-none transition-all text-sm font-bold"
              placeholder="John Doe"
            />
          </div>
          <div>
            <label className="text-[10px] uppercase font-black text-slate-400 mb-2 block tracking-widest">Email Address</label>
            <input 
              type="email" 
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-6 py-4 focus:border-blue-600 focus:ring-0 outline-none transition-all text-sm font-bold"
              placeholder="john@example.com"
            />
          </div>
          <div>
            <label className="text-[10px] uppercase font-black text-slate-400 mb-2 block tracking-widest">Password</label>
            <input 
              type="password" 
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-6 py-4 focus:border-blue-600 focus:ring-0 outline-none transition-all text-sm font-bold"
              placeholder="••••••••"
            />
          </div>
          
          {error && (
            <p className="text-[10px] text-red-500 font-bold uppercase tracking-widest mt-2">
              ⚠ {error}
            </p>
          )}

          <button 
            type="submit"
            disabled={isLoading}
            className="w-full bg-blue-600 text-white py-5 rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-blue-500 transition-all shadow-lg shadow-blue-600/20 active:scale-[0.98] disabled:opacity-50"
          >
            {isLoading ? 'Creating Account...' : 'Sign Up'}
          </button>
        </form>
        
        <p className="mt-8 text-center text-xs text-slate-500 font-medium">
          Already have an account?{' '}
          <Link to={"/login" as any} className="text-blue-600 font-black hover:underline uppercase tracking-widest text-[10px]">
            Log In
          </Link>
        </p>
      </div>
    </div>
  )
}
