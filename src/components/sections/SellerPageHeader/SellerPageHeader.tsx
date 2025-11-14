import { SellerFooter, SellerHeading } from "@/components/organisms"
import { HttpTypes } from "@medusajs/types"

export const SellerPageHeader = ({
  header = false,
  seller,
  user,
}: {
  header?: boolean
  seller: any
  user: HttpTypes.StoreCustomer | null
}) => {
  return (
    <div className="border rounded-sm">
      <SellerHeading header seller={seller} user={user} />
      <div className="p-4 pb-0">
      <p
        dangerouslySetInnerHTML={{
          __html: seller.description,
        }}
        className="label-md"
      />
      </div>
      <SellerFooter seller={seller} />
    </div>
  )
}
