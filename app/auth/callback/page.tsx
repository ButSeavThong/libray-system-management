'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

export default function AuthCallbackPage() {
  const router = useRouter()
  const supabase = createClient()

  useEffect(() => {
    const exchangeSession = async () => {
      const { error } = await supabase.auth.getSession()

      if (error) {
        console.error(error)
        return
      }

      // Supabase automatically exchanges the code in App Router
      router.replace('/books')
    }

    exchangeSession()
  }, [router, supabase])

  return <p>Confirming your email…</p>
}
