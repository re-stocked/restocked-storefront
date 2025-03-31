import { SellerTabs } from "@/components/organisms"
import { SellerPageHeader } from "@/components/sections"
import { getSellerByHandle } from "@/lib/data/seller"

export default async function SellerPage({
  params,
  searchParams,
}: {
  params: { params: string[] }
  searchParams: Promise<{
    [key: string]: string | string[] | undefined
  }>
}) {
  const urlParams = await params.params

  const seller = await getSellerByHandle(urlParams[0]!)

  console.log({ seller })

  const tab = urlParams[1] || ""

  if (!seller) {
    return null
  }

  return (
    <main className="container">
      <SellerPageHeader seller={seller} />
      <SellerTabs
        tab={tab ? tab : "all"}
        seller={seller.id}
        searchParams={searchParams}
      />
    </main>
  )
}
