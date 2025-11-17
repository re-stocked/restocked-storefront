"use client"
import { HttpTypes } from "@medusajs/types"
import LocalizedClientLink from "@/components/molecules/LocalizedLink/LocalizedLink"
import { cn } from "@/lib/utils"
import { useParams } from "next/navigation"
import { CollapseIcon } from "@/icons"
import { useState, useMemo } from "react"
import {
  getActiveParentHandle,
  findParentCategoryHandle,
  filterCategoriesByParent,
} from "@/lib/helpers/category-utils"

interface CategoryNavbarProps {
  categories: HttpTypes.StoreProductCategory[]
  parentCategories?: HttpTypes.StoreProductCategory[]
  onClose?: (state: boolean) => void
}

export const CategoryNavbar = ({
  categories,
  parentCategories = [],
  onClose,
}: CategoryNavbarProps) => {
  const { category } = useParams<{ category?: string }>()
  const [hoveredCategory, setHoveredCategory] = useState<string | null>(null)

  const activeParentHandle = useMemo(
    () => getActiveParentHandle(category, categories, parentCategories),
    [category, parentCategories, categories]
  )

  const parentCategoryHandle = useMemo(
    () => findParentCategoryHandle(category, categories),
    [category, categories]
  )

  const filteredCategories = useMemo(
    () => filterCategoriesByParent(activeParentHandle, categories, parentCategories),
    [activeParentHandle, parentCategories, categories]
  )

  const handleClose = () => {
    if (onClose) {
      onClose(false)
    }
  }
console.log(filteredCategories,'filtered categories')
  return (
    <nav
      className="flex md:items-center flex-col md:flex-row md:overflow-x-auto md:scrollbar-hide md:max-w-full gap-2"
      aria-label="Category navigation"
    >
      <LocalizedClientLink
        href="/categories"
        onClick={handleClose}
        className={cn(
          "label-md uppercase px-2 my-1 md:my-0 flex items-center justify-between md:flex-shrink-0 text-primary"
        )}
      >
        All Products
      </LocalizedClientLink>

      {filteredCategories.map(({ id, handle, name, category_children }) => {
        const categoryUrl = `/categories/${handle}`
        const isActive = handle === category || handle === parentCategoryHandle

        return (
          <div
            key={id}
            className="relative md:flex-shrink-0"
            onMouseEnter={() => setHoveredCategory(id)}
            onMouseLeave={() => setHoveredCategory(null)}
          >
            <LocalizedClientLink
              href={categoryUrl}
              onClick={handleClose}
              className={cn(
                "label-md uppercase px-2 py-1 my-3 md:my-0 flex items-center justify-between md:whitespace-nowrap text-primary",
                isActive && "md:border-b md:border-primary"
              )}
            >
              {name}
              <CollapseIcon size={18} className="-rotate-90 md:hidden" />
            </LocalizedClientLink>

            {category_children &&
              category_children.length > 0 &&
              hoveredCategory === id && (
                <div className="hidden md:block absolute top-full left-0 bg-primary border shadow-lg rounded-sm min-w-[200px] z-50">
                  <div className="py-2">
                    {category_children.map((child) => {
                      const childUrl = `/categories/${child.handle}`

                      return (
                        <LocalizedClientLink
                          key={child.id}
                          href={childUrl}
                          className="block px-4 py-2 label-sm uppercase hover:bg-secondary/10"
                        >
                          {child.name}
                        </LocalizedClientLink>
                      )
                    })}
                  </div>
                </div>
              )}
          </div>
        )
      })}
    </nav>
  )
}
