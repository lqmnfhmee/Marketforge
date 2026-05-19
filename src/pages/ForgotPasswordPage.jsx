import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../components/context/AuthContext";
import toast from "react-hot-toast";

function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  
  const { resetPassword } = useAuth();

  const handleResetPassword = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");
    
    if (!email) {
      toast.error("Please enter your email address.");
      return setError("Please enter your email address.");
    }

    setLoading(true);
    const loadingToast = toast.loading("Sending reset link...");
    
    try {
      const { error } = await resetPassword(email);
      if (error) throw error;
      toast.dismiss(loadingToast);
      toast.success("Password reset link sent to your email");
      setMessage("Password reset link has been sent to your email.");
    } catch (err) {
      toast.dismiss(loadingToast);
      toast.error(err.message || "Failed to send reset link");
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-transparent flex items-center justify-center p-4">
      <div className="max-w-md w-full form-panel">
        <div className="relative z-10">
          <h1 
            className="text-4xl font-bold mb-2 text-center tracking-wide"
            style={{ 
              fontFamily: "'Cinzel', serif", 
              background: "linear-gradient(to right, #fbbf24, #d97706)", 
              WebkitBackgroundClip: "text", 
              WebkitTextFillColor: "transparent" 
            }}
          >
            Marketforge
          </h1>
          <h2 className="text-[11px] font-bold text-gray-500 uppercase tracking-widest mb-8 text-center" style={{ fontFamily: "'Inter', sans-serif" }}>
            Reset Password
          </h2>
          
          {error && (
            <div className="bg-[#9f1239]/10 border border-[#9f1239]/50 text-[#f43f5e] rounded-xl p-3 mb-6 text-sm flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[#f43f5e]"></span>
              {error}
            </div>
          )}

          {message && (
            <div className="bg-[#10b981]/10 border border-[#10b981]/50 text-[#34d399] rounded-xl p-3 mb-6 text-sm flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[#34d399]"></span>
              {message}
            </div>
          )}

          <form onSubmit={handleResetPassword} className="space-y-6">
            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Email Address</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="input-fantasy"
                placeholder="you@example.com"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full mt-2"
            >
              {loading ? "Sending link..." : "Send Reset Link"}
            </button>
          </form>

          <div className="mt-8 text-center text-sm font-[Inter]">
            <Link to="/login" className="text-[#fbbf24] hover:text-[#fcd34d] transition-colors font-medium drop-shadow-[0_0_8px_rgba(251,191,36,0.2)]">
              Back to sign in
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ForgotPasswordPage;
