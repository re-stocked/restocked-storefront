'use server'

import Image from "next/image"
import { HttpTypes } from "@medusajs/types"
import { cookies } from "next/headers"
import { unstable_noStore as noStore } from 'next/cache'

import { CartDropdown, MobileNavbar, Navbar } from "@/components/cells"
import { HeartIcon, MessageIcon } from "@/icons"
import { listCategories } from "@/lib/data/categories"
import { PARENT_CATEGORIES } from "@/const"
import { UserDropdown } from "@/components/cells/UserDropdown/UserDropdown"
import { retrieveCustomer } from "@/lib/data/customer"
import { getUserWishlists } from "@/lib/data/wishlist"
import { Wishlist } from "@/types/wishlist"
import { Badge } from "@/components/atoms"
import CountrySelector from "@/components/molecules/CountrySelector/CountrySelector"
import { listRegions } from "@/lib/data/regions"
import LocalizedClientLink from "@/components/molecules/LocalizedLink/LocalizedLink"
import { MessageButton } from "@/components/molecules/MessageButton/MessageButton"
import { SellNowButton } from "@/components/cells/SellNowButton/SellNowButton"

export const Header = async () => {
  // Force dynamic rendering
  noStore()
  
  const cookieStore = await cookies()
  const token = cookieStore.get("_medusa_jwt")?.value

  console.log('---TOKEN HEADER ---', token)
  
  let user = null

  if (token) {
    user = await retrieveCustomer(token).catch(() => null)
  }

  const isLoggedIn = Boolean(user)
  let wishlist: Wishlist[] = []
  
  if (user) {
    const response = await getUserWishlists()
    wishlist = response.wishlists
  }
  
  const regions = await listRegions()

  const wishlistCount = wishlist?.[0]?.products.length || 0

  const { categories, parentCategories } = (await listCategories({
    headingCategories: PARENT_CATEGORIES,
  })) as {
    categories: HttpTypes.StoreProductCategory[]
    parentCategories: HttpTypes.StoreProductCategory[]
  }

  return (
    <header>
      <div className="flex py-2 lg:px-8 px-4">
        <div className="flex items-center lg:w-1/3">
          <MobileNavbar
            parentCategories={parentCategories}
            childrenCategories={categories}
          />
          <div className="hidden lg:block">
            <SellNowButton />
          </div>
        </div>
        <div className="flex lg:justify-center lg:w-1/3 items-center pl-4 lg:pl-0">
          <LocalizedClientLink href="/" className="text-2xl font-bold">
            <Image
              src="/Logo.svg"
              width={126}
              height={40}
              alt="Logo"
              priority
            />
          </LocalizedClientLink>
        </div>
        <div className="flex items-center justify-end gap-2 lg:gap-4 w-full lg:w-1/3 py-2">
          <CountrySelector regions={regions} />
          {user && <MessageButton />}
          <UserDropdown isLoggedIn={isLoggedIn} />
          {user && (
            <LocalizedClientLink href="/user/wishlist" className="relative">
              <HeartIcon size={20} />
              {Boolean(wishlistCount) && (
                <Badge className="absolute -top-2 -right-2 w-4 h-4 p-0">
                  {wishlistCount}
                </Badge>
              )}
            </LocalizedClientLink>
          )}

          <CartDropdown />
        </div>
      </div>
      <Navbar categories={categories} />
    </header>
  )
}