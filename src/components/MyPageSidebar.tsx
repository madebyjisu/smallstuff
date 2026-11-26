import { NavLink } from 'react-router-dom';
import { paths } from '../router/paths';
import './scss/MyPageSidebar.scss';

export const MyPageSidebar = () => {

    // 마이페이지 사이드 메뉴
    const menus = [
        { name: '주문 조회', path: paths.my },
        { name: '위시 리스트', path: paths.myWishlist },
        { name: 'White (기본등급)', path: null },
        { name: '재입고/오픈 알림', path: null },
        { name: '구매평', path: null },
        { name: '1:1 문의', path: paths.inquiries },
        { name: '정보 수정', path: paths.profile },
        { name: '회원탈퇴', path: null },
    ];

    return (
        <aside className="mypage-sidebar">
            <nav>
                <ul>
                    {menus.map((item) => (
                        <li key={item.name}>
                            {item.path ? (
                                <NavLink
                                    to={item.path}
                                    end={item.path === paths.my}
                                    className={({ isActive }) =>
                                        isActive ? 'active' : ''
                                    }
                                >
                                    {item.name}
                                </NavLink>
                            ) : (
                                <span>{item.name}</span>
                            )}
                        </li>
                    ))}
                </ul>
            </nav>
        </aside>
    );
};