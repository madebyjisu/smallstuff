export const paths = {
  home: '/',
  about: '/about',
  shop: '/shop',
  category: '/shop/:categoryId',
  product: '/product/:productId',
  lookbook: '/lookbook',
  board: '/board',
  search: '/search',
  fit: '/fit',
  login: '/login',
  signup: '/signup',
  findAccount: '/account/find',
  cart: '/cart',
  checkout: '/checkout',
  orderComplete: '/order/complete',
  wishlist: '/wishlist',
  my: '/my',
  pets: '/my/pets',
  myWishlist: '/my/wishlist',
  addresses: '/my/addresses',
  profile: '/my/profile',
  orders: '/my/orders',
  order: '/my/orders/:orderId',
  requests: '/my/requests',
  requestApplication: '/my/orders/:orderId/:requestType/apply',
  requestComplete: '/my/requests/:requestId/complete',
  inquiries: '/my/inquiries',
} as const

export const productPath = (productId: string) =>
  paths.product.replace(':productId', () => encodeURIComponent(productId))

export const categoryPath = (categoryId: string) =>
  paths.category.replace(':categoryId', () => encodeURIComponent(categoryId))
