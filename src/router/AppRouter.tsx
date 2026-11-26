import { lazy, Suspense } from 'react'
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import RootLayout from '../layouts/RootLayout'
import MyPageLayout from '../layouts/MyPageLayout'

import RequestApplicationPage from '../pages/orders/RequestApplicationPage'
import NotFoundPage from '../pages/system/NotFoundPage'
import PageTitle from '../pages/system/PageTitle'
import ProtectedRoute from './ProtectedRoute'
import { paths } from './paths'

const CategoryPage = lazy(() => import('../pages/shop/ShopPages').then(module => ({ default: module.CategoryPage })))
const ProductPage = lazy(() => import('../pages/shop/ShopPages').then(module => ({ default: module.ProductPage })))

export default function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<RootLayout />}>
          <Route index element={<PageTitle title="Home" />} />
          <Route path={paths.about} element={<PageTitle title="About us" />} />
          <Route path={paths.shop} element={<PageTitle title="Shop" />} />
          <Route path={paths.category} element={<Suspense fallback={<p role="status">Loading category...</p>}><CategoryPage /></Suspense>} />
          <Route path={paths.product} element={<Suspense fallback={<p role="status">Loading product...</p>}><ProductPage /></Suspense>} />
          <Route path={paths.lookbook} element={<PageTitle title="Lookbook" />} />
          <Route path={paths.board} element={<PageTitle title="Board" />} />
          <Route path={paths.search} element={<PageTitle title="Search results" />} />
          <Route path={paths.fit} element={<PageTitle title="Find the right fit" />} />
          <Route path={paths.login} element={<PageTitle title="Log in" />} />
          <Route path={paths.signup} element={<PageTitle title="Sign up" />} />
          <Route path={paths.findAccount} element={<PageTitle title="Find your account" />} />
          <Route path={paths.cart} element={<PageTitle title="Cart" />} />
          <Route path={paths.wishlist} element={<Navigate to={paths.myWishlist} replace />} />
          <Route element={<ProtectedRoute />}>
            <Route path={paths.checkout} element={<PageTitle title="Checkout" />} />
            <Route path={paths.orderComplete} element={<PageTitle title="Order complete" />} />
            <Route path={paths.my} element={<MyPageLayout />}>
              <Route index element={<PageTitle title="My page" />} />
              <Route path={paths.pets} element={<PageTitle title="Pet profiles" />} />
              <Route path={paths.myWishlist} element={<PageTitle title="Wishlist" />} />
              <Route path={paths.addresses} element={<PageTitle title="Saved addresses" />} />
              <Route path={paths.profile} element={<PageTitle title="Edit profile" />} />
              <Route path={paths.orders} element={<PageTitle title="Orders" />} />
              <Route path={paths.order} element={<PageTitle title="Order details" />} />
              <Route path={paths.requestApplication} element={<RequestApplicationPage />} />
              <Route path={paths.requests} element={<PageTitle title="Exchanges and returns" />} />
              <Route path={paths.requestComplete} element={<PageTitle title="Request received" />} />
              <Route path={paths.inquiries} element={<PageTitle title="Customer inquiries" />} />
            </Route>
          </Route>
          <Route path="*" element={<NotFoundPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}
