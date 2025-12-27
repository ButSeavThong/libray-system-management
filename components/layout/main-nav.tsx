"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Library, BookOpen, User } from "lucide-react"

const navItems = [
  {
    title: "Browse",
    href: "/books",
    icon: Library,
  },
  {
    title: "My Borrows",
    href: "/my-borrows",
    icon: BookOpen,
  },
  {
    title: "Profile",
    href: "/profile",
    icon: User,
  },
]

export function MainNav() {
  const pathname = usePathname()

  return (
    <nav className="flex items-center gap-1">
      {navItems.map((item) => (
        <Link
          key={item.href}
          href={item.href}
          className={cn(
            "flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground",
            pathname === item.href ? "bg-accent text-accent-foreground" : "text-muted-foreground",
          )}
        >
          <item.icon className="h-4 w-4" />
          {item.title}
        </Link>
      ))}
    </nav>
  )
}
