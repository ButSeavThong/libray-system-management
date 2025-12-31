import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Library, BookOpen, Users, ShieldCheck } from 'lucide-react'
import { getCurrentUser } from '@/lib/auth'
import { redirect } from 'next/navigation'

export default async function LandingPage() {
  const user = await getCurrentUser()

  if (user) {
    if (user.role === 'ADMIN') {
      redirect('/admin')
    } else {
      redirect('/books')
    }
  }

  const cardItems = [
    {
      id: 'user-portal',
      icon: BookOpen,
      title: 'Customer Portal',
      des: 'Browse the collection, borrow books with a single click, and manage your current book borrows.',
    },
    {
      id: 'admin-controls',
      icon: ShieldCheck,
      title: 'Admin Controls',
      des: 'Powerful dashboard for managing inventory, tracking overdue books, and monitoring system stats.',
    },
    {
      id: 'user-management',
      icon: Users,
      title: 'User Management',
      des: 'Secure authentication system with role-based access for both members and library staff.',
    },
  ]

  return (
    <div className='flex min-h-screen flex-col'>
      <header className='px-4 lg:px-6 h-16 flex items-center border-b bg-background backdrop-blur-sm sticky top-0'>
        <Link className='flex items-center justify-center gap-2' href='/'>
          <Library className='h-6 w-6 text-primary' />
          <span className='font-bold text-xl'>E-Library System</span>
        </Link>
        <nav className='ml-auto flex gap-4 sm:gap-6'>
          <Link
            className='text-sm font-medium hover:underline underline-offset-4'
            href='/auth/login'
          >
            Login
          </Link>
          <Link
            className='text-sm font-medium hover:underline underline-offset-4'
            href='/auth/register'
          >
            Register
          </Link>
        </nav>
      </header>
      <main className='flex-1'>
        <section className='w-full py-12 md:py-24 lg:py-20 xl:py-20 bg-muted/40'>
          <div className='container px-4 md:px-6 mx-auto'>
            <div className='flex flex-col items-center space-y-8 text-center'>
              <div className='space-y-4'>
                <h1 className='text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl/none'>
                  Library Management System
                </h1>
                <p className='mx-auto max-w-175 text-muted-foreground md:text-xl'>
                  A web platform for managing book collections, borrow
                  transactions, and administrative tasks.
                </p>
              </div>
              <div className='space-x-4'>
                <Button asChild size='lg'>
                  <Link href='/auth/register'>Get Started</Link>
                </Button>
                <Button variant='outline' size='lg' asChild>
                  <Link href='/auth/login'>Login</Link>
                </Button>
              </div>
            </div>
          </div>
        </section>
        <section className='w-full py-12 md:py-24 lg:py-24'>
          <div className='container px-4 md:px-6 mx-auto'>
            <div className='grid gap-5 sm:grid-cols-2 lg:grid-cols-3'>
              {cardItems.map(item => {
                const Icon = item.icon
                return (
                  <div
                    key={item.id}
                    className='flex flex-col items-center space-y-2 py-6 px-4 border  rounded-xl bg-background hover:shadow-lg'
                  >
                    <Icon className='h-12 w-12 text-primary mb-2' />
                    <h3 className='text-xl font-bold'>{item.title}</h3>
                    <p className='text-center text-muted-foreground'>
                      {item.des}
                    </p>
                  </div>
                )
              })}
            </div>
          </div>
        </section>
      </main>
      <footer className='flex flex-col gap-2 sm:flex-row py-6 w-full shrink-0 items-center px-4 md:px-6 border-t'>
        <p className='text-xs text-muted-foreground'>
          © 2025 LibManager Inc. All rights reserved.
        </p>
        <nav className='sm:ml-auto flex gap-4 sm:gap-6'>
          <Link className='text-xs hover:underline underline-offset-4' href='#'>
            Terms of Service
          </Link>
          <Link className='text-xs hover:underline underline-offset-4' href='#'>
            Privacy
          </Link>
        </nav>
      </footer>
    </div>
  )
}
