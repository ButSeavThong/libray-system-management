"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export default function ConfirmEmailPage() {
  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    const confirm = async () => {
      // This reads token_hash & type=email automatically
      const { error } = await supabase.auth.verifyOtp({
        type: "email",
        token_hash: new URLSearchParams(window.location.search).get(
          "token_hash"
        )!,
      });

      if (error) {
        console.error(error);
        return;
      }

      router.replace("/books");
    };

    confirm();
  }, [router, supabase]);

  return <p>Confirming your email…</p>;
}
