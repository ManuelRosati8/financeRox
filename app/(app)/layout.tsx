import { Sidebar } from "@/components/layout/Sidebar";
import { MobileNav } from "@/components/layout/MobileNav";
import { QuickAddFAB } from "@/components/ui/QuickAddFAB";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ display: "flex", minHeight: "100vh", background: "var(--bg-base)" }}>
      <Sidebar />
      <MobileNav />
      <main
        className="main-content"
        style={{
          marginLeft: 230,
          flex: 1,
          padding: "28px 32px",
          maxWidth: "calc(100% - 230px)",
          minHeight: "100vh",
          transition: "margin 0.25s ease",
        }}
      >
        {children}
      </main>
      <QuickAddFAB />
    </div>
  );
}
