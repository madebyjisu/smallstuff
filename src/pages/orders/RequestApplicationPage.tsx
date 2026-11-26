import { useParams } from 'react-router-dom'
import NotFoundPage from '../system/NotFoundPage'

export default function RequestApplicationPage() {
  const { requestType } = useParams()
  if (requestType === 'exchange') return <h1>Exchange request</h1>
  if (requestType === 'return') return <h1>Return request</h1>
  return <NotFoundPage />
}
