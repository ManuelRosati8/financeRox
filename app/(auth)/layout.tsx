export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div style={{
      minHeight: "100vh",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      background: "radial-gradient(circle at top right, rgba(245,158,11,0.08), transparent 40%), var(--bg-primary)",
      padding: "max(24px, env(safe-area-inset-top)) 16px max(24px, env(safe-area-inset-bottom))",
    }}>
      <div 
        className="glass" 
        style={{ 
          width: "100%", 
          maxWidth: 420, 
          padding: "40px 32px", 
          borderRadius: 24,
          boxShadow: "0 24px 48px rgba(0,0,0,0.1), inset 0 1px 1px rgba(255,255,255,0.05)",
          position: "relative",
          overflow: "hidden"
        }}
      >
        <div style={{
          position: "absolute", top: -50, right: -50, width: 150, height: 150,
          background: "var(--accent)", filter: "blur(60px)", opacity: 0.15, borderRadius: "50%"
        }} />
        <div style={{ position: "relative", zIndex: 1 }}>
          {children}
        </div>
      </div>
    </div>
  );
}
