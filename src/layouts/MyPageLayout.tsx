import { Outlet } from 'react-router-dom'

export default function MyPageLayout() {
  return (
    <div className="inner--account">
      <aside />
      <section>
        <Outlet />
      </section>
    </div>
  )
}
