import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { useAuthActions } from "@convex-dev/auth/react";
import { useState } from "react";

export const Route = createFileRoute('/auth')({
  component: AuthPage,
})

function AuthPage() {
  const { signIn } = useAuthActions();
  const [step, setStep] = useState<"signIn" | "signUp">("signIn");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setLoading(true);
    const formData = new FormData(event.currentTarget);
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;
    const name = formData.get("name") as string;
    
    if (step === "signUp") {
      const confirmPassword = formData.get("confirmPassword") as string;
      if (password !== confirmPassword) {
        setError("Passwords do not match.");
        setLoading(false);
        return;
      }
    }

    try {
      if (step === "signUp") {
        await signIn("password", {
          email,
          password,
          name,
          flow: "signUp",
        });
      } else {
        await signIn("password", {
          email,
          password,
          flow: "signIn",
        });
      }
      navigate({ to: "/" });
    } catch (e: any) {
      console.error("Auth Error Object:", e);
      const errorMsg = (e.message || "").toLowerCase();
      if (errorMsg.includes("already exists") || errorMsg.includes("409") || errorMsg.includes("conflict")) {
        setError("An account with this email already exists. Try logging in instead.");
      } else if (errorMsg.includes("invalid password") || errorMsg.includes("too short")) {
        setError("Password must be at least 8 characters.");
      } else if (errorMsg.includes("invalid credentials") || errorMsg.includes("401") || errorMsg.includes("unauthorized")) {
        setError(step === "signIn" ? "Invalid email or password." : "Error creating account. Please try again.");
      } else {
        setError("Authentication failed. " + (e.message || "Please check your details and try again."));
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-white flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <h1 className="text-3xl font-black uppercase tracking-tighter text-slate-800">
          SiouxLand Clean Out
        </h1>
        <div className="mt-6 flex justify-center p-1 bg-slate-100 rounded-xl max-w-[240px] mx-auto">
          <button
            onClick={() => setStep("signIn")}
            className={`flex-1 py-2 text-[10px] font-black uppercase tracking-widest rounded-lg transition-all ${step === "signIn" ? "bg-white text-blue-600 shadow-sm" : "text-slate-500 hover:text-slate-700"}`}
          >
            Login
          </button>
          <button
            onClick={() => setStep("signUp")}
            className={`flex-1 py-2 text-[10px] font-black uppercase tracking-widest rounded-lg transition-all ${step === "signUp" ? "bg-white text-blue-600 shadow-sm" : "text-slate-500 hover:text-slate-700"}`}
          >
            Sign Up
          </button>
        </div>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow-xl shadow-slate-100/50 sm:rounded-2xl sm:px-10 border border-slate-100">
          <form className="space-y-6" onSubmit={handleSubmit}>
            {step === "signUp" && (
              <div>
                <label className="block text-xs font-black uppercase tracking-widest text-slate-500 mb-2">
                  Full Name
                </label>
                <input
                  name="name"
                  type="text"
                  required
                  className="block w-full px-4 py-3 bg-white border border-slate-200 rounded-xl text-slate-900 focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-all outline-none"
                  placeholder="John Doe"
                />
              </div>
            )}
            <div>
              <label className="block text-xs font-black uppercase tracking-widest text-slate-500 mb-2">
                Email Address
              </label>
              <input
                name="email"
                type="email"
                required
                className="block w-full px-4 py-3 bg-white border border-slate-200 rounded-xl text-slate-900 focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-all outline-none"
                placeholder="you@example.com"
              />
            </div>

            <div>
              <label className="block text-xs font-black uppercase tracking-widest text-slate-500 mb-2">
                {step === "signUp" ? "Create Password" : "Password"}
              </label>
              <input
                name="password"
                type="password"
                required
                className="block w-full px-4 py-3 bg-white border border-slate-200 rounded-xl text-slate-900 focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-all outline-none"
                placeholder="••••••••"
              />
            </div>

            {step === "signUp" && (
              <div>
                <label className="block text-xs font-black uppercase tracking-widest text-slate-500 mb-2">
                  Confirm Password
                </label>
                <input
                  name="confirmPassword"
                  type="password"
                  required
                  className="block w-full px-4 py-3 bg-white border border-slate-200 rounded-xl text-slate-900 focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-all outline-none"
                  placeholder="••••••••"
                />
              </div>
            )}

            <input name="flow" value={step} type="hidden" />

            {error && (
              <div className="p-3 bg-red-50 border border-red-100 text-red-600 text-xs font-bold rounded-xl text-center">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full flex justify-center py-4 px-4 border border-transparent rounded-xl shadow-sm text-xs font-black uppercase tracking-widest text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 transition-all"
            >
              {loading ? "Please wait..." : step === "signIn" ? "Login" : "Sign Up"}
            </button>
          </form>

          <div className="mt-6">
            <button
              onClick={() => setStep(step === "signIn" ? "signUp" : "signIn")}
              className="w-full text-center text-xs font-bold uppercase tracking-widest text-slate-400 hover:text-blue-600 transition-colors"
            >
              {step === "signIn" ? "Don't have an account? Sign Up" : "Already have an account? Log In"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
