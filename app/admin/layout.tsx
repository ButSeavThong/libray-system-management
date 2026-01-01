import { AdminHeader } from '@/components/admin/header'
import { AdminSidebar } from '@/components/admin/sidebar'
import { Toaster } from '@/components/ui/toaster'
import { createClient } from '@/lib/supabase/server'
import { Analytics } from '@vercel/analytics/next'
import { Geist, Geist_Mono } from 'next/font/google'

const geist = Geist({
  subsets: ['latin'],
  variable: '--font-geist-sans',
})

const geistMono = Geist_Mono({
  subsets: ['latin'],
  variable: '--font-geist-mono',
})

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div lang='en' suppressHydrationWarning>
      <div
        className={`
          ${geist.variable}
          ${geistMono.variable}
          min-h-screen 
          bg-muted/40
          font-sans
          flex h-screen flex-row md:overflow-hidden
        `}
      >
        <AdminSidebar />

        <div className='grow md:overflow-y-auto'>{children}</div>
        {/* Global UI */}
        {/* <Toaster />
        <Analytics /> */}
      </div>
    </div>
  )
}
