import { Outlet } from 'react-router-dom';
import { MyPageSidebar } from '../components/MyPageSidebar';
import './scss/MyPageLayout.scss';

export default function MyPageLayout() {
    return (
        <div className="inner--account mypage-layout">

            {/* 마이페이지 공통 사이드바 */}
            <MyPageSidebar />

            {/* 메뉴에 따라 변경되는 콘텐츠 */}
            <section className="mypage-content">
                <Outlet />
            </section>

        </div>
    );
}