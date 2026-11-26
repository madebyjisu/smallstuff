export interface Category {
  id: string
  name: string
  parentId: string | null
  kind: 'category' | 'collection'
  url: string
  pageUrls: string[]
  sourceCount: number
  productCount: number
}

export interface ProductImage {
  sourceUrl: string | null
  localPath: string | null
  usage: 'permission-unconfirmed' | 'unverified' | 'approved'
}

export interface OptionValue {
  id: string
  label: string
  price: number | null
  additionalPrice: number | null
  soldOut: boolean | null
}

export interface ClothingMeasurementsCm {
  neck: number | null
  chest: number | null
  backLength: number | null
}

export interface SizeOption extends OptionValue {
  measurementsCm: ClothingMeasurementsCm | null
}

export interface StairMeasurements {
  stepCount: number | null
  stepHeightsCm: Array<number | null> | null
  totalHeightCm: number | null
  widthCm: number | null
  depthCm: number | null
}

export interface ProductVariant {
  id: string
  sourceId: string
  sourceName: string
  sourceUrl: string
  listingUrl: string
  categoryIds: string[]
  color: string | null
  regularPrice: number | null
  salePrice: number | null
  displayPrice: number | null
  discountPercent: number | null
  soldOut: boolean | null
  saleStatus: 'listed' | 'sold-out' | 'scheduled'
  tags: string[]
  images: {
    representative: ProductImage
    additional: ProductImage[]
    detail: ProductImage[]
  }
  descriptionSummary: string | null
  descriptionReuse: 'permission-unconfirmed'
  materials: string[] | null
  care: string | null
  shippingPolicyUrl: string
  detailVerification: 'partially-verified' | 'listing-only'
  sizeOptions: SizeOption[] | null
  otherOptionGroups: Array<{ label: string; values: OptionValue[] }> | null
  stairs: StairMeasurements | null
  observedOn: string
  measurementSourceUrl: string | null
  possibleRelatedSourceIds: string[]
}

interface ProductRecord<Type, Variant extends ProductVariant> {
  id: string
  name: string
  type: Type
  groupingEvidence: string | null
  categoryIds: string[]
  defaultVariantId: string
  variants: Variant[]
}

export type Product =
  | ProductRecord<'clothing', ProductVariant & { stairs: null }>
  | ProductRecord<'stairs', ProductVariant & { stairs: StairMeasurements }>
  | ProductRecord<'other', ProductVariant & { stairs: null }>

export interface PurchaseOptionKey {
  productId: string
  variantId: string
  sizeOptionId: string | null
  otherOptions?: Array<{ groupLabel: string; optionId: string }>
}
