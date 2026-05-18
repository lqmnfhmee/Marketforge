import AppRoutes from "./routes/AppRoutes";

function App() {
  return (
    <>
      {/* Background Layers */}
      <div className="viking-bg" />
      <div className="fog-layer" />
      <div className="ambient-overlay" />
      
      {/* App Content */}
      <div className="relative z-0">
        <AppRoutes />
      </div>
    </>
  );
}

export default App;