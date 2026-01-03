'use client'

import { useEffect } from 'react'

export default function AuthCallbackPage() {
  useEffect(() => {
    // The server route.ts will handle the session exchange
    // This page only exists to avoid 404
    window.location.href = '/auth/callback'
  }, [])

  return <p>Confirming your email…</p>
}
