import { LoginForm } from "@/components/molecules"
import { retrieveCustomer } from "@/lib/data/customer"
import { redirect } from "next/navigation"

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ sessionExpired?: string; sessionRequired?: string }>
}) {
  const user = await retrieveCustomer()
  const params = await searchParams

  if (user) {
    redirect("/user")
  }

  return <LoginForm />
}

