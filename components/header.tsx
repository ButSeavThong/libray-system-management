import { Library } from "lucide-react";
import Link from "next/link";
import { MainNav } from "./layout/main-nav";
import { UserNav } from "./layout/user-nav";
import { UserProfile } from "@/lib/auth";

interface headerProp {
  user: UserProfile
}

export default function Header({ user }: headerProp) {
  return (
    <header className='sticky top-0 z-50 border-b bg-card/95 backdrop-blur supports-backdrop-filter:bg-card/60'>
      <div className='container mx-auto flex h-16 items-center justify-between px-4'>
        <div className='flex items-center gap-8'>
          <Link href='/books' className='flex items-center gap-2'>
            <Library className='h-6 w-6 text-primary' />
            <span className='text-lg font-semibold'>E-Library System</span>
          </Link>
          <MainNav />
        </div>
        <UserNav user={user} />
      </div>
    </header>
  )
}