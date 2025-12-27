"use client"

import { useRouter, useSearchParams } from "next/navigation"
import { Input } from "@/components/ui/input"
import { Search } from "lucide-react"
import { useState, useTransition } from "react"

export function BookSearch() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [isPending, startTransition] = useTransition()
  const [search, setSearch] = useState(searchParams.get("search") || "")

  const handleSearch = (value: string) => {
    setSearch(value)
    const params = new URLSearchParams(searchParams.toString())

    if (value) {
      params.set("search", value)
    } else {
      params.delete("search")
    }

    startTransition(() => {
      router.push(`/books?${params.toString()}`)
    })
  }

  return (
    <div className="relative flex-1 lg:max-w-md">
      <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
      <Input
        placeholder="Search books by title or author..."
        value={search}
        onChange={(e) => handleSearch(e.target.value)}
        className="pl-9"
        disabled={isPending}
      />
    </div>
  )
}
