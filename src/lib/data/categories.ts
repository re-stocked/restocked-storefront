import { sdk } from "@/lib/config"
import { HttpTypes } from "@medusajs/types"

interface CategoriesProps {
  query?: Record<string, any>
}

export const listCategories = async ({
  query,
}: Partial<CategoriesProps> = {}) => {
  const limit = query?.limit || 100

  const allCategories = await sdk.client
    .fetch<{
      product_categories: HttpTypes.StoreProductCategory[]
    }>("/store/product-categories", {
      query: {
        fields:
          "id,handle,name,rank,parent_category_id,category_children.id,category_children.name,category_children.handle,category_children.parent_category_id",
        include_descendants_tree: true,
        include_ancestors_tree: true,
        limit,
        ...query,
      },
      cache: "force-cache",
      next: { revalidate: 3600 },
    })
    .then(({ product_categories }) => product_categories)

  const parentCategories = allCategories.filter(
    (cat) => !cat.parent_category_id
  )

  const mainCategories = parentCategories.flatMap(
    (parent) => parent.category_children || []
  )

  return {
    parentCategories,
    categories: mainCategories,
  }
}

export const getCategoryByHandle = async (categoryHandle: string) => {
  return sdk.client
    .fetch<HttpTypes.StoreProductCategoryListResponse>(
      `/store/product-categories`,
      {
        query: {
          fields: "*category_children",
          handle: categoryHandle,
        },
        cache: "force-cache",
        next: { revalidate: 300 },
      }
    )
    .then(({ product_categories }) => product_categories[0])
}
