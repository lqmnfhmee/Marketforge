import { Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "../components/context/AuthContext";
import GoldPage from "../pages/GoldPage";
import TransactionsPage from "../pages/TransactionsPage";
import PocketsPage from "../pages/PocketsPage";
import CreatePocketPage from "../pages/CreatePocketPage";
import PocketDetailsPage from "../pages/PocketDetailsPage";
import FoodProductionPage from "../pages/FoodProductionPage";
import Dashboard from "../pages/Dashboard";
import LoginPage from "../pages/LoginPage";
import RegisterPage from "../pages/RegisterPage";
import ForgotPasswordPage from "../pages/ForgotPasswordPage";
import ProductionPlanner from "../pages/ProductionPlanner";

function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();
  
  if (loading) {
    return <div className="min-h-screen bg-[#0f172a] flex items-center justify-center text-white">Loading...</div>;
  }
  
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  
  return children;
}

function AppRoutes() {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/forgot-password" element={<ForgotPasswordPage />} />

      {/* Protected Routes */}
      <Route path="/" element={
        <ProtectedRoute>
          <Dashboard />
        </ProtectedRoute>
      } />
      <Route path="/gold" element={
        <ProtectedRoute>
          <GoldPage />
        </ProtectedRoute>
      } />
      <Route path="/transactions" element={
        <ProtectedRoute>
          <TransactionsPage />
        </ProtectedRoute>
      } />
      <Route path="/pockets" element={
        <ProtectedRoute>
          <PocketsPage />
        </ProtectedRoute>
      } />
      <Route path="/pockets/create" element={
        <ProtectedRoute>
          <CreatePocketPage />
        </ProtectedRoute>
      } />
      <Route path="/pockets/:id" element={
        <ProtectedRoute>
          <PocketDetailsPage />
        </ProtectedRoute>
      } />
      <Route path="/food-production" element={
        <ProtectedRoute>
          <FoodProductionPage />
        </ProtectedRoute>
      } />
      <Route path="/production-planner" element={
        <ProtectedRoute>
          <ProductionPlanner />
        </ProtectedRoute>
      } />
      {/* Fallback Redirect */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default AppRoutes;