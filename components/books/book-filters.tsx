"use client"

import { useRouter, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Filter, X } from "lucide-react"
import { Badge } from "@/components/ui/badge"

export function BookFilters({ categories }: { categories: string[] }) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const selectedCategory = searchParams.get("category")

  const handleCategoryChange = (value: string) => {
    const params = new URLSearchParams(searchParams.toString())

    if (value === "all") {
      params.delete("category")
    } else {
      params.set("category", value)
    }

    router.push(`/books?${params.toString()}`)
  }

  const clearFilters = () => {
    router.push("/books")
  }

  const hasFilters = selectedCategory || searchParams.get("search")

  return (
    <div className="flex items-center gap-2">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="sm" className="gap-2 bg-transparent">
            <Filter className="h-4 w-4" />
            Category
            {selectedCategory && <Badge variant="secondary">{selectedCategory}</Badge>}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-56">
          <DropdownMenuLabel>Filter by Category</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuRadioGroup value={selectedCategory || "all"} onValueChange={handleCategoryChange}>
            <DropdownMenuRadioItem value="all">All Categories</DropdownMenuRadioItem>
            {categories.map((category) => (
              <DropdownMenuRadioItem key={category} value={category}>
                {category}
              </DropdownMenuRadioItem>
            ))}
          </DropdownMenuRadioGroup>
        </DropdownMenuContent>
      </DropdownMenu>

      {hasFilters && (
        <Button variant="ghost" size="sm" onClick={clearFilters} className="gap-2">
          <X className="h-4 w-4" />
          Clear
        </Button>
      )}
    </div>
  )
}
