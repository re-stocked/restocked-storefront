import { defineRouting } from "next-intl/routing"
import { createNavigation } from "next-intl/navigation"
import Cookies from "js-cookie"

const region =
  Cookies.get("NEXT_LOCALE") || process.env.NEXT_PUBLIC_DEFAULT_REGION || "pl"

export const routing = defineRouting({
  locales: [region],
  defaultLocale: region,
  localeDetection: false,
  alternateLinks: false,
  // localePrefix: "never", // Comment this line to show locale in pathname
})

export const { Link, redirect, usePathname, useRouter } =
  createNavigation(routing)
