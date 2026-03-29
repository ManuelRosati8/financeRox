import { createClient } from "@/lib/supabase/server";
import { LandingHeader } from "@/components/landing/LandingHeader";
import { LandingContent } from "@/components/landing/LandingContent";

export default async function LandingPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  const isLoggedIn = !!user;

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "var(--bg-base)",
        color: "var(--text-primary)",
        fontFamily: "'Inter', sans-serif",
      }}
    >
      <LandingHeader isLoggedIn={isLoggedIn} />
      <LandingContent isLoggedIn={isLoggedIn} />
    </div>
  );
}
