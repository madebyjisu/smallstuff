import { Outlet } from 'react-router-dom'
import ScrollToTop from '../router/ScrollToTop'

export default function RootLayout() {
  return (
    <>
      <ScrollToTop />
      <header />
      <main className="inner">
        <Outlet />
      </main>
      <footer />
    </>
  )
}
