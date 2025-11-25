"use server"

import { sdk } from "../config"
import { HttpTypes } from "@medusajs/types"
import { revalidateTag } from "next/cache"
import {
  getAuthHeaders,
  getCacheTag,
  getCartId,
  removeAuthToken,
  removeCartId,
  setAuthToken,
} from "./cookies"
import { cookies } from "next/headers"

export const retrieveCustomer = async (token?: string): Promise<HttpTypes.StoreCustomer | null> => {
  const authHeaders = token ? { authorization: `Bearer ${token}` } : await getAuthHeaders()

  if (!authHeaders || Object.keys(authHeaders).length === 0) {
    return null
  }

  try {
    const cookieStore = await cookies()
    const cacheId = cookieStore.get('_medusa_cache_id')?.value
    const customerCacheTag = cacheId ? `customers-${cacheId}` : "customers"

    const { customer } = await sdk.client.fetch<{ customer: HttpTypes.StoreCustomer }>(`/store/customers/me`, {
      method: "GET",
      query: {
        fields: "*orders",
      },
      headers: {
        ...authHeaders,
      },
      next: { 
        tags: [customerCacheTag],
       revalidate: 0
      },
    })

    return customer ?? null
  } catch (err) {
    return null
  }
}

export const updateCustomer = async (body: HttpTypes.StoreUpdateCustomer) => {
  const headers = {
    ...(await getAuthHeaders()),
  }

  const updateRes = await sdk.store.customer
    .update(body, {}, headers)
    .then(({ customer }) => customer)
    .catch((err) => {
      throw new Error(err.message)
    })

  const cacheTag = await getCacheTag("customers")
  revalidateTag(cacheTag)

  return updateRes
}

export async function signup(formData: FormData) {
  const password = formData.get("password") as string
  const customerForm = {
    email: formData.get("email") as string,
    first_name: formData.get("first_name") as string,
    last_name: formData.get("last_name") as string,
    phone: formData.get("phone") as string,
  }

  try {
    const token = await sdk.auth.register("customer", "emailpass", {
      email: customerForm.email,
      password: password,
    })

    await setAuthToken(token as string)

    const headers = {
      ...(await getAuthHeaders()),
    }

    const { customer: createdCustomer } = await sdk.store.customer.create(
      customerForm,
      {},
      headers
    )

    const loginToken = await sdk.auth.login("customer", "emailpass", {
      email: customerForm.email,
      password,
    })

    await setAuthToken(loginToken as string)

    const customerCacheTag = await getCacheTag("customers")
    revalidateTag(customerCacheTag)

    await transferCart()

    return createdCustomer
  } catch (error: any) {
    return error.toString()
  }
}

export async function login(formData: FormData) {
  const email = formData.get("email") as string
  const password = formData.get("password") as string

  try {
    await sdk.auth
      .login("customer", "emailpass", { email, password })
      .then(async (token) => {
        await setAuthToken(token as string)
        const customerCacheTag = await getCacheTag("customers")
        revalidateTag(customerCacheTag)
      })
  } catch (error: any) {
    return error.toString()
  }

  try {
    await transferCart()
  } catch (error: any) {
    return error.toString()
  }
}

export async function signout() {
  await sdk.auth.logout()

  await removeAuthToken()

  const customerCacheTag = await getCacheTag("customers")
  revalidateTag(customerCacheTag)

  await removeCartId()

  const cartCacheTag = await getCacheTag("carts")
  revalidateTag(cartCacheTag)
}

export async function transferCart() {
  const cartId = await getCartId()

  if (!cartId) {
    return
  }

  const headers = await getAuthHeaders()

  await sdk.store.cart.transferCart(cartId, {}, headers)

  const cartCacheTag = await getCacheTag("carts")
  revalidateTag(cartCacheTag)
}

export const addCustomerAddress = async (formData: FormData): Promise<any> => {
  const address = {
    address_name: formData.get("address_name") as string,
    first_name: formData.get("first_name") as string,
    last_name: formData.get("last_name") as string,
    company: formData.get("company") as string,
    address_1: formData.get("address_1") as string,
    city: formData.get("city") as string,
    postal_code: formData.get("postal_code") as string,
    country_code: formData.get("country_code") as string,
    phone: formData.get("phone") as string,
    province: formData.get("province") as string,
    is_default_billing: Boolean(formData.get("isDefaultBilling")),
    is_default_shipping: Boolean(formData.get("isDefaultShipping")),
  }

  const headers = {
    ...(await getAuthHeaders()),
  }

  return sdk.store.customer
    .createAddress(address, {}, headers)
    .then(async ({ customer }) => {
      const customerCacheTag = await getCacheTag("customers")
      revalidateTag(customerCacheTag)
      return { success: true, error: null }
    })
    .catch((err) => {
      return { success: false, error: err.toString() }
    })
}

export const deleteCustomerAddress = async (
  addressId: string
): Promise<void> => {
  const headers = {
    ...(await getAuthHeaders()),
  }

  await sdk.store.customer
    .deleteAddress(addressId, headers)
    .then(async () => {
      const customerCacheTag = await getCacheTag("customers")
      revalidateTag(customerCacheTag)
      return { success: true, error: null }
    })
    .catch((err) => {
      return { success: false, error: err.toString() }
    })
}

export const updateCustomerAddress = async (
  formData: FormData
): Promise<any> => {
  const addressId = formData.get("addressId") as string

  if (!addressId) {
    return { success: false, error: "Address ID is required" }
  }

  const address = {
    address_name: formData.get("address_name") as string,
    first_name: formData.get("first_name") as string,
    last_name: formData.get("last_name") as string,
    company: formData.get("company") as string,
    address_1: formData.get("address_1") as string,
    address_2: formData.get("address_2") as string,
    city: formData.get("city") as string,
    postal_code: formData.get("postal_code") as string,
    province: formData.get("province") as string,
    country_code: formData.get("country_code") as string,
  } as HttpTypes.StoreUpdateCustomerAddress

  const phone = formData.get("phone") as string

  if (phone) {
    address.phone = phone
  }

  const headers = {
    ...(await getAuthHeaders()),
  }

  return sdk.store.customer
    .updateAddress(addressId, address, {}, headers)
    .then(async () => {
      const customerCacheTag = await getCacheTag("customers")
      revalidateTag(customerCacheTag)
      return { success: true, error: null }
    })
    .catch((err) => {
      return { success: false, error: err.toString() }
    })
}

export const updateCustomerPassword = async (
  password: string,
  token: string
): Promise<any> => {
  const res = await fetch(
    `${process.env.MEDUSA_BACKEND_URL}/auth/customer/emailpass/update`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ password }),
    }
  )
    .then(async () => {
      await removeAuthToken()
      const customerCacheTag = await getCacheTag("customers")
      revalidateTag(customerCacheTag)
      return { success: true, error: null }
    })
    .catch((err: any) => {
      return { success: false, error: err.toString() }
    })

  return res
}

export const sendResetPasswordEmail = async (email: string) => {
  const res = await sdk.auth
    .resetPassword("customer", "emailpass", {
      identifier: email,
    })
    .then(() => {
      return { success: true, error: null }
    })
    .catch((err: any) => {
      return { success: false, error: err.toString() }
    })

  return res
}
