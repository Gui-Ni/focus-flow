"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export default function CallbackPage() {
  const router = useRouter();

  useEffect(() => {
    const handleCallback = async () => {
      const supabase = createClient();
      
      // This will exchange the auth code for a session
      const { data, error } = await supabase.auth.getSession();
      
      if (error) {
        console.error("Callback error:", error);
        router.push("/login?error=callback_error");
        return;
      }

      if (data.session) {
        // Session created successfully, redirect to app
        router.push("/app");
      } else {
        // No session, redirect to login
        router.push("/login");
      }
    };

    handleCallback();
  }, [router]);

  return (
    <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center">
      <div className="text-white">Completing sign in...</div>
    </div>
  );
}
