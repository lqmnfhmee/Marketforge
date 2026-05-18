import {
  LayoutDashboard,
  Receipt,
  ChefHat,
  Wallet,
  LogOut,
  Menu,
  X,
  User
} from "lucide-react";

import { useAuth } from "../components/context/AuthContext";
import { useNavigate, useLocation } from "react-router-dom";
import { useState } from "react";

function Sidebar() {
  const navigate = useNavigate();
  const location = useLocation();
  const { signOut, user } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleLogout = async () => {
    try {
      await signOut();
      navigate("/login");
    } catch (error) {
      console.error("Logout failed", error);
    }
  };

  const menuSections = [
    {
      title: "FINANCE",
      items: [
        { icon: LayoutDashboard, label: "Dashboard", path: "/" },
        { icon: Receipt, label: "Transactions", path: "/transactions" },
      ]
    },
    {
      title: "PRODUCTION",
      items: [
        { icon: ChefHat, label: "Food Prod.", path: "/food-production" },
      ]
    },
    {
      title: "SAVINGS",
      items: [
        { icon: Wallet, label: "Pockets", path: "/pockets" },
      ]
    }
  ];

  const allMenuItems = menuSections.flatMap(section => section.items);

  const handleNav = (path) => {
    navigate(path);
    setMobileOpen(false);
  };

  const userEmail = user?.email || "guest@albion.com";
  const username = userEmail.split("@")[0];

  return (
    <>
      {/* ── Desktop Sidebar ── */}
      <aside
        className="
          hidden lg:flex
          w-[260px] h-screen
          bg-[#03050a]/95 backdrop-blur-xl text-gray-300
          border-r border-[rgba(251,191,36,0.08)]
          p-6 sticky top-0
          flex-col shrink-0
          font-[Inter]
          relative
          overflow-hidden
        "
        style={{
          boxShadow: "10px 0 30px rgba(0,0,0,0.5), inset -1px 0 0 rgba(251,191,36,0.05)"
        }}
      >
        {/* Subtle Norse pattern & glow overlays */}
        <div className="absolute inset-0 pointer-events-none opacity-[0.02] z-0" 
             style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M20 0l20 20-20 20L0 20z' fill='%23fbbf24' fill-rule='evenodd'/%3E%3C/svg%3E")` }}>
        </div>
        <div className="absolute -top-32 -left-32 w-64 h-64 bg-amber-500/5 blur-[80px] rounded-full pointer-events-none z-0" />
        <div className="absolute bottom-0 right-0 w-full h-1/2 bg-gradient-to-t from-black/50 to-transparent pointer-events-none z-0" />

        <div className="relative z-10 flex flex-col h-full">
          {/* Title */}
        <div className="mb-8">
          <h1 
            className="text-2xl font-bold tracking-wide" 
            style={{ 
              fontFamily: "'Cinzel', serif", 
              background: "linear-gradient(to right, #fbbf24, #d97706)", 
              WebkitBackgroundClip: "text", 
              WebkitTextFillColor: "transparent" 
            }}
          >
            Albion Finance
          </h1>
          <p className="text-[10px] uppercase tracking-widest text-[#9ca3af] mt-1 font-medium">
            Guild Management Interface
          </p>
        </div>

        {/* Navigation */}
        <nav className="flex-1 space-y-6 overflow-y-auto pr-2 custom-scrollbar">
          {menuSections.map((section, sIdx) => (
            <div key={sIdx}>
              <div className="flex items-center mb-3 ml-2 gap-2">
                <h2 className="text-[10px] font-bold uppercase tracking-widest text-slate-500">
                  {section.title}
                </h2>
                <div className="h-px flex-1 bg-gradient-to-r from-amber-500/20 to-transparent"></div>
              </div>
              <div className="space-y-1">
                {section.items.map((item, index) => {
                  const Icon = item.icon;
                  const isActive = location.pathname === item.path;
                  return (
                    <button
                      key={index}
                      onClick={() => navigate(item.path)}
                      className={`
                        group w-full flex items-center gap-3 px-3 py-2.5 rounded-xl
                        transition-all duration-300 ease-out text-sm font-medium
                        relative overflow-hidden
                        ${isActive
                          ? "bg-gradient-to-r from-[rgba(251,191,36,0.1)] to-transparent text-white border-l-2 border-[#fbbf24] shadow-[inset_1px_0_0_rgba(251,191,36,0.5)]"
                          : "hover:bg-[#111827]/80 text-[#9ca3af] hover:text-gray-200 border-l-2 border-transparent hover:translate-x-1"
                        }
                      `}
                    >
                      {isActive && (
                        <div className="absolute inset-0 bg-gradient-to-r from-[#fbbf24]/5 to-transparent blur-md rounded-xl pointer-events-none"></div>
                      )}
                      
                      <div className={`
                        flex items-center justify-center p-1.5 rounded-lg transition-all duration-300 relative z-10
                        ${isActive ? "bg-[#fbbf24]/15 text-[#fbbf24] shadow-[0_0_15px_rgba(251,191,36,0.2)]" : "bg-[#1a1f2e]/80 group-hover:bg-[#1f2937] text-gray-400 group-hover:text-gray-300 border border-white/5"}
                      `}>
                        <Icon size={16} />
                      </div>
                      
                      <span className="relative z-10 tracking-wide">{item.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </nav>

        {/* Footer: User Profile */}
        <div className="mt-auto pt-6 border-t border-[rgba(251,191,36,0.08)] relative z-10">
          <div className="flex items-center gap-3 mb-4 px-2">
            <div className="w-9 h-9 rounded-full bg-[#111827] border border-[rgba(251,191,36,0.2)] flex items-center justify-center flex-shrink-0 text-[#fbbf24] shadow-[0_0_15px_rgba(251,191,36,0.1)]">
              <User size={18} />
            </div>
            <div className="overflow-hidden">
              <p className="text-sm font-medium text-slate-200 truncate">{username}</p>
              <p className="text-[10px] text-slate-500 truncate">{userEmail}</p>
            </div>
          </div>
          
          <button
            onClick={handleLogout}
            className="
              group w-full flex items-center justify-center gap-2 p-2.5 rounded-xl
              transition-all duration-300 border border-white/5 bg-[#0b101c]
              hover:bg-[#111827] hover:border-red-900/30 hover:text-red-400 text-slate-400 text-sm font-medium hover:shadow-[0_4px_20px_rgba(159,18,57,0.15)]
            "
          >
            <LogOut size={16} className="group-hover:scale-110 transition-transform" />
            <span className="tracking-wide">Sign Out</span>
          </button>
        </div>
        </div>
      </aside>

      {/* ── Mobile: Top Header Bar ── */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-40 bg-[#03050a]/90 backdrop-blur-md flex items-center justify-between px-4 py-3 border-b border-[rgba(251,191,36,0.08)] shadow-[0_4px_30px_rgba(0,0,0,0.8)]">
        <h1 
          className="text-lg font-bold tracking-wide"
          style={{ 
            fontFamily: "'Cinzel', serif", 
            background: "linear-gradient(to right, #fbbf24, #d97706)", 
            WebkitBackgroundClip: "text", 
            WebkitTextFillColor: "transparent" 
          }}
        >
          Albion Finance
        </h1>
        <button
          onClick={() => setMobileOpen(true)}
          className="p-2 text-[#9ca3af] rounded-lg hover:bg-[#1a1f2e] hover:text-white transition"
          aria-label="Open menu"
        >
          <Menu size={22} />
        </button>
      </div>

      {/* ── Mobile: Drawer Overlay ── */}
      {mobileOpen && (
        <div
          className="lg:hidden fixed inset-0 z-50 flex font-[Inter]"
          onClick={() => setMobileOpen(false)}
        >
          {/* Backdrop */}
          <div className="absolute inset-0 bg-black/80 backdrop-blur-sm transition-opacity" />

          {/* Drawer Panel */}
          <div
            className="relative w-[260px] h-full bg-[#03050a]/95 backdrop-blur-xl border-r border-[rgba(251,191,36,0.08)] flex flex-col p-6 shadow-[20px_0_50px_rgba(0,0,0,0.9)] overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="absolute inset-0 pointer-events-none opacity-[0.02] z-0" 
                 style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M20 0l20 20-20 20L0 20z' fill='%23fbbf24' fill-rule='evenodd'/%3E%3C/svg%3E")` }}>
            </div>
            <div className="absolute -top-32 -left-32 w-64 h-64 bg-amber-500/5 blur-[80px] rounded-full pointer-events-none z-0" />
            
            <div className="relative z-10 flex flex-col h-full">
            {/* Header */}
            <div className="flex items-center justify-between mb-8">
              <div>
                <h1 
                  className="text-xl font-bold tracking-wide"
                  style={{ 
                    fontFamily: "'Cinzel', serif", 
                    background: "linear-gradient(to right, #fbbf24, #d97706)", 
                    WebkitBackgroundClip: "text", 
                    WebkitTextFillColor: "transparent" 
                  }}
                >
                  Albion Finance
                </h1>
                <p className="text-[9px] uppercase tracking-widest text-[#9ca3af] mt-1 font-medium">
                  Guild Management
                </p>
              </div>
              <button
                onClick={() => setMobileOpen(false)}
                className="p-1.5 text-gray-500 hover:text-white rounded-lg hover:bg-[#1a1f2e] transition"
                aria-label="Close menu"
              >
                <X size={20} />
              </button>
            </div>

            {/* Navigation */}
            <nav className="flex-1 space-y-6 overflow-y-auto pr-1 custom-scrollbar">
              {menuSections.map((section, sIdx) => (
                <div key={sIdx}>
                  <div className="flex items-center mb-3 ml-2 gap-2">
                    <h2 className="text-[10px] font-bold uppercase tracking-widest text-slate-500">
                      {section.title}
                    </h2>
                    <div className="h-px flex-1 bg-gradient-to-r from-amber-500/20 to-transparent"></div>
                  </div>
                  <div className="space-y-1">
                    {section.items.map((item, index) => {
                      const Icon = item.icon;
                      const isActive = location.pathname === item.path;
                      return (
                        <button
                          key={index}
                          onClick={() => handleNav(item.path)}
                          className={`
                            group w-full flex items-center gap-3 px-3 py-2.5 rounded-xl
                            transition-all duration-300 ease-out text-sm font-medium
                            ${isActive
                              ? "bg-gradient-to-r from-[rgba(251,191,36,0.1)] to-transparent text-white border-l-2 border-[#fbbf24] shadow-[inset_1px_0_0_rgba(251,191,36,0.5)]"
                              : "hover:bg-[#111827]/80 text-[#9ca3af] hover:text-gray-200 border-l-2 border-transparent hover:translate-x-1"
                            }
                          `}
                        >
                          <div className={`
                            flex items-center justify-center p-1.5 rounded-lg transition-colors
                            ${isActive ? "bg-[#fbbf24]/15 text-[#fbbf24] shadow-[0_0_15px_rgba(251,191,36,0.2)]" : "bg-[#1a1f2e]/80 group-hover:bg-[#1f2937] text-gray-400 group-hover:text-gray-300 border border-white/5"}
                          `}>
                            <Icon size={16} />
                          </div>
                          <span className="tracking-wide">{item.label}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))}
            </nav>

            {/* Footer */}
            <div className="mt-auto pt-6 border-t border-[rgba(251,191,36,0.08)]">
              <div className="flex items-center gap-3 mb-4 px-2">
                <div className="w-9 h-9 rounded-full bg-[#111827] border border-[rgba(251,191,36,0.2)] flex items-center justify-center flex-shrink-0 text-[#fbbf24] shadow-[0_0_15px_rgba(251,191,36,0.1)]">
                  <User size={18} />
                </div>
                <div className="overflow-hidden">
                  <p className="text-sm font-medium text-slate-200 truncate">{username}</p>
                  <p className="text-[10px] text-slate-500 truncate">{userEmail}</p>
                </div>
              </div>
              
              <button
                onClick={handleLogout}
                className="
                  w-full flex items-center justify-center gap-2 p-2.5 rounded-xl
                  transition-all duration-300 border border-white/5 bg-[#0b101c]
                  hover:bg-[#111827] hover:border-red-900/30 hover:text-red-400 text-slate-400 text-sm font-medium hover:shadow-[0_4px_20px_rgba(159,18,57,0.15)]
                "
              >
                <LogOut size={16} />
                <span className="tracking-wide">Sign Out</span>
              </button>
            </div>
            </div>
          </div>
        </div>
      )}

      {/* ── Mobile: Bottom Nav Bar ── */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#03050a]/95 backdrop-blur-md border-t border-[rgba(251,191,36,0.08)] flex items-center justify-around py-2 px-1 pb-[env(safe-area-inset-bottom)] shadow-[0_-10px_40px_rgba(0,0,0,0.8)]">
        {allMenuItems.map((item, index) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;
          return (
            <button
              key={index}
              onClick={() => navigate(item.path)}
              className={`
                flex flex-col items-center gap-1 px-3 py-2 rounded-xl transition-all duration-300
                ${isActive ? "text-[#fbbf24]" : "text-gray-500 hover:text-gray-300"}
              `}
            >
              <div className={`
                p-1.5 rounded-full transition-all duration-300
                ${isActive ? "bg-[#fbbf24]/10 shadow-[0_0_10px_rgba(255,215,0,0.2)]" : "bg-transparent"}
              `}>
                <Icon size={20} className={isActive ? "drop-shadow-[0_0_8px_rgba(255,215,0,0.5)]" : ""} />
              </div>
              <span className={`text-[10px] font-medium leading-none ${isActive ? "text-white" : ""}`}>{item.label}</span>
            </button>
          );
        })}
      </nav>
    </>
  );
}

export default Sidebar;