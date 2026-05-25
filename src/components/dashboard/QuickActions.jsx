import { useNavigate } from "react-router-dom";
import { Receipt, Wallet, ChefHat } from "lucide-react";

const ACTIONS = [
  {
    id: "qa-transaction",
    icon: Receipt,
    label: "Transaction",
    path: "/transactions",
    color: "#fbbf24",
    glow: "rgba(251,191,36,0.25)",
    bg: "rgba(251,191,36,0.07)",
    border: "rgba(251,191,36,0.15)",
    hoverBorder: "rgba(251,191,36,0.35)",
  },
  {
    id: "qa-pocket",
    icon: Wallet,
    label: "Pocket",
    path: "/pockets",
    color: "#38bdf8",
    glow: "rgba(56,189,248,0.25)",
    bg: "rgba(56,189,248,0.07)",
    border: "rgba(56,189,248,0.15)",
    hoverBorder: "rgba(56,189,248,0.35)",
  },
  {
    id: "qa-production",
    icon: ChefHat,
    label: "Production",
    path: "/food-production",
    color: "#a78bfa",
    glow: "rgba(167,139,250,0.25)",
    bg: "rgba(167,139,250,0.07)",
    border: "rgba(167,139,250,0.15)",
    hoverBorder: "rgba(167,139,250,0.35)",
  },
];

function QuickActions() {
  const navigate = useNavigate();

  return (
    <div className="flex items-center justify-center gap-3 flex-wrap">
      {ACTIONS.map((action) => {
        const Icon = action.icon;
        return (
          <button
            key={action.id}
            id={action.id}
            onClick={() => navigate(action.path)}
            className="group flex items-center gap-2 px-4 py-2.5 rounded-xl font-medium text-sm transition-all duration-300 hover:-translate-y-0.5 active:scale-95"
            style={{
              background: action.bg,
              border: `1px solid ${action.border}`,
              color: action.color,
              fontFamily: "'Inter', sans-serif",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = action.hoverBorder;
              e.currentTarget.style.boxShadow = `0 6px 20px ${action.glow}`;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = action.border;
              e.currentTarget.style.boxShadow = "none";
            }}
          >
            <Icon
              size={15}
              strokeWidth={2}
              className="transition-transform duration-300 group-hover:scale-110"
            />
            <span className="tracking-wide">{action.label}</span>
          </button>
        );
      })}
    </div>
  );
}

export default QuickActions;
