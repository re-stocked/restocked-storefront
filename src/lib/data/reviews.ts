"use server"
import { revalidatePath } from "next/cache"
import { sdk } from "../config"
import { getAuthHeaders } from "./cookies"
import { HttpTypes } from "@medusajs/types"

export type Review = {
  id: string
  seller: {
    id: string
    name: string
    photo: string
  }
  reference: string
  customer_note: string
  rating: number
  updated_at: string
}

export type Order = HttpTypes.StoreOrder & {
  seller: { id: string; name: string; reviews?: any[] }
  reviews: any[]
}

const getReviews = async () => {
  const headers = {
    ...(await getAuthHeaders()),
  }

  const reviews = await sdk.client.fetch("/store/reviews", {
    headers,
    query: { fields: "*seller,+customer.id,+order_id" },
    method: "GET",
  })

  return reviews as { reviews: Review[] }
}

const createReview = async (review: any) => {
  // LOG: This will appear in Vercel logs
  console.log("=== CREATE REVIEW CALLED ===")
  console.log("Received:", JSON.stringify(review))
  console.log("Is Array?", Array.isArray(review))
  
  const headers = {
    ...(await getAuthHeaders()),
    "Content-Type": "application/json",
    "x-publishable-api-key": process.env
      .NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY as string,
  }

  // Ensure we're sending a single review object, not an array
  const reviewData = Array.isArray(review) ? review[0] : review
  console.log("Sending:", JSON.stringify(reviewData))

  const response = await fetch(
    `${process.env.MEDUSA_BACKEND_URL}/store/reviews`,
    {
      headers,
      method: "POST",
      body: JSON.stringify(reviewData),
    }
  )
  
  console.log("Backend response status:", response.status)
  console.log("Backend response ok:", response.ok)
  
  const result = await response.json()
  console.log("Backend response data:", JSON.stringify(result))
  
  // Revalidate all review-related paths
  revalidatePath("/user/reviews", "page")
  revalidatePath("/user/reviews/written", "page")
  revalidatePath("/user/orders", "page")
  
  return result
}

export { getReviews, createReview }
