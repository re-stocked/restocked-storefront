import { getRequestConfig } from "next-intl/server"
import Cookies from "js-cookie"

const locale =
  Cookies.get("NEXT_LOCALE") || process.env.NEXT_PUBLIC_DEFAULT_REGION || "pl"

export default getRequestConfig(async () => {
  return {
    locale,
    messages: (await import(`../translations/gb.json`)).default,
  }
})
