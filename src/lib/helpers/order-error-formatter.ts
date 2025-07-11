import { HttpTypes } from "@medusajs/types"

export const orderErrorFormatter = (error: any, cart: HttpTypes.StoreCart) => {
  if (error.message === "NEXT_REDIRECT") {
    return null
  }

  if (error.message.includes("Not enough stock available")) {
    return "Not enough stock available"
  }

  return error.message
}
