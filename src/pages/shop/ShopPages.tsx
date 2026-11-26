import { useParams } from 'react-router-dom'
import categories from '../../data/categories.json'
import products from '../../data/products.json'
import NotFoundPage from '../system/NotFoundPage'

export function CategoryPage() {
  const { categoryId } = useParams()
  const category = categories.find(item => item.id === categoryId)
  return category ? <h1>Shop · {category.name}</h1> : <NotFoundPage />
}

export function ProductPage() {
  const { productId } = useParams()
  const product = products.find(item => item.id === productId)
  return product ? <h1>{product.name}</h1> : <NotFoundPage />
}
