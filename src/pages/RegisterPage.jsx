import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../components/context/AuthContext";
import toast from "react-hot-toast";

function RegisterPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  
  const { signUp } = useAuth();
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    setError("");
    
    if (password !== confirmPassword) {
      toast.error("Passwords do not match.");
      return setError("Passwords do not match.");
    }
    
    if (!email || !password || !confirmPassword) {
      toast.error("Please fill in all fields.");
      return setError("Please fill in all fields.");
    }

    setLoading(true);
    const loadingToast = toast.loading("Creating account...");
    
    try {
      const { error } = await signUp(email, password);
      if (error) throw error;
      toast.dismiss(loadingToast);
      toast.success("Account created successfully");
      navigate("/login");
    } catch (err) {
      toast.dismiss(loadingToast);
      toast.error(err.message || "Failed to create account");
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0b0f19] flex items-center justify-center p-4">
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
            Albion Finance
          </h1>
          <h2 className="text-[11px] font-bold text-gray-500 uppercase tracking-widest mb-8 text-center" style={{ fontFamily: "'Inter', sans-serif" }}>
            Create Guild Account
          </h2>
          
          {error && (
            <div className="bg-[#9f1239]/10 border border-[#9f1239]/50 text-[#f43f5e] rounded-xl p-3 mb-6 text-sm flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[#f43f5e]"></span>
              {error}
            </div>
          )}

          <form onSubmit={handleRegister} className="space-y-6">
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

            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="input-fantasy"
                placeholder="••••••••"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Confirm Password</label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                className="input-fantasy"
                placeholder="••••••••"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full mt-2"
            >
              {loading ? "Creating account..." : "Sign Up"}
            </button>
          </form>

          <div className="mt-8 text-center text-sm font-[Inter]">
            <span className="text-slate-400">Already have an account? </span>
            <Link to="/login" className="text-[#fbbf24] hover:text-[#fcd34d] transition-colors font-medium drop-shadow-[0_0_8px_rgba(251,191,36,0.2)]">
              Sign in
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default RegisterPage;
