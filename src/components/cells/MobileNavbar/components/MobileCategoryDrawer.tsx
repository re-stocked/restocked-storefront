"use client"

import { HttpTypes } from "@medusajs/types"
import { useEffect } from "react"
import { cn } from "@/lib/utils"
import LocalizedClientLink from "@/components/molecules/LocalizedLink/LocalizedLink"
import { CloseIcon } from "@/icons"

interface MobileCategoryDrawerProps {
  category: HttpTypes.StoreProductCategory
  isOpen: boolean
  onClose: () => void
  onLinkClick?: () => void
}

export const MobileCategoryDrawer = ({
  category,
  isOpen,
  onClose,
  onLinkClick,
}: MobileCategoryDrawerProps) => {
  const childCategories = category.category_children || []

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }

    return () => {
      document.body.style.overflow = ''
    }
  }, [isOpen])

  const handleLinkClick = () => {
    onLinkClick?.()
    onClose()
  }

  return (
    <>
      {/* Backdrop */}
      <div
        className={cn(
          'fixed inset-0 bg-primary/80 z-50 transition-opacity duration-300',
          isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        )}
        onClick={onClose}
      />

      {/* Drawer */}
      <div
        className={cn(
          'fixed inset-0 z-50 bg-primary transition-transform duration-300 ease-in-out',
          isOpen ? 'translate-x-0' : 'translate-x-full'
        )}
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b">
            <h2 className="heading-md uppercase text-primary">{category.name}</h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-secondary/10 rounded-sm transition-colors"
              aria-label="Close drawer"
            >
              <CloseIcon size={24} />
            </button>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto p-4">
            <nav className="flex flex-col gap-2">
              {childCategories.map((child) => (
                <LocalizedClientLink
                  key={child.id}
                  href={`/categories/${child.handle}`}
                  onClick={handleLinkClick}
                  className="label-md uppercase px-4 py-3 text-primary hover:bg-secondary/10 transition-colors rounded-sm"
                >
                  {child.name}
                </LocalizedClientLink>
              ))}
            </nav>
          </div>
        </div>
      </div>
    </>
  )
}

