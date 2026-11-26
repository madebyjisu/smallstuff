import { onAuthStateChanged } from 'firebase/auth'
import { useEffect, useState } from 'react'
import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { auth } from '../firebase/config'
import { paths } from './paths'

type AuthStatus = 'loading' | 'signed-in' | 'signed-out'

export default function ProtectedRoute() {
  const [status, setStatus] = useState<AuthStatus>('loading')
  const { pathname, search, hash } = useLocation()

  useEffect(() => onAuthStateChanged(auth, user => {
    setStatus(user ? 'signed-in' : 'signed-out')
  }), [])

  if (status === 'loading') return <p role="status">Checking sign-in status...</p>

  if (status === 'signed-out') {
    return <Navigate to={paths.login} replace state={{ returnTo: pathname + search + hash }} />
  }

  return <Outlet />
}
