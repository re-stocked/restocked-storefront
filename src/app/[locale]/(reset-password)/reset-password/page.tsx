import { Card } from "@/components/atoms"
import { ProfilePasswordForm } from "@/components/molecules/ProfilePasswordForm/ProfilePasswordForm"

export default async function ResetPasswordPage({
  searchParams,
}: {
  searchParams: Promise<{ token: string }>
}) {
  const { token } = await searchParams

  return (
    <main className="container w-96 flex justify-center">
      <Card>
        <ProfilePasswordForm />
      </Card>
    </main>
  )
}
