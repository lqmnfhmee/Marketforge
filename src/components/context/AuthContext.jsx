import React, { createContext, useContext, useState, useEffect } from "react";
import { supabase } from "../../lib/supabase";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check active sessions and sets the user
    const checkSession = async () => {
      const { data: { session }, error } = await supabase.auth.getSession();
      setUser(session?.user || null);
      setLoading(false);
    };
    checkSession();

    // Listen for changes on auth state (log in, log out, etc.)
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user || null);
      setLoading(false);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  // Auth functions
  const signUp = async (email, password) => {
    return await supabase.auth.signUp({
      email,
      password,
    });
  };

  const signIn = async (email, password) => {
    return await supabase.auth.signInWithPassword({
      email,
      password,
    });
  };

  const signOut = async () => {
    return await supabase.auth.signOut();
  };

  const resetPassword = async (email) => {
    return await supabase.auth.resetPasswordForEmail(email);
  };

  const value = {
    user,
    loading,
    signUp,
    signIn,
    signOut,
    resetPassword,
  };

  if (loading) {
    return (
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          minHeight: "100vh",
          backgroundColor: "#0f172a",
        }}
      >
        <div
          style={{
            width: 48,
            height: 48,
            border: "4px solid #1e293b",
            borderTop: "4px solid #7c3aed",
            borderRadius: "50%",
            animation: "spin 0.8s linear infinite",
          }}
        />
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
