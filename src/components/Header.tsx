import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { paths, categoryPath } from '../router/paths';
import { ICONS } from '../constants/icons';
import categories from '../data/categories.json';
import './scss/Header.scss';

export const Header = () => {
    const location = useLocation();

    // 메인 페이지 여부 확인
    const isHome = location.pathname === paths.home;

    // 상단 공지 표시 여부
    const [showNotice, setShowNotice] = useState(() => {
        const hiddenUntil = localStorage.getItem('noticeHiddenUntil');

        return !hiddenUntil || Date.now() > Number(hiddenUntil);
    });

    // 24시간 동안 공지 숨기기
    const handleCloseNotice = () => {
        const tomorrow = Date.now() + 24 * 60 * 60 * 1000;

        localStorage.setItem('noticeHiddenUntil', String(tomorrow));
        setShowNotice(false);
    };

    // 드롭다운 메뉴 상태
    const [openMenu, setOpenMenu] = useState('');

    const handleMenu = (menu: string) => {
        setOpenMenu(openMenu === menu ? '' : menu);
    };

    // 대분류 카테고리 가져오기
    const mainCategories = categories.filter(
        (item) => item.parentId === null
    );

    return (
        <header className="header">

            {/* 메인 페이지 상단 공지 */}
            {isHome && showNotice && (
                <div className="header-notice">
                    <div className="inner">
                        <a
                            href="https://pf.kakao.com/_Hxnxlxod"
                            target="_blank"
                            rel="noreferrer"
                        >
                            카카오 채널을 추가하고 5% 할인 혜택을 받아보세요.
                        </a>

                        <button
                            type="button"
                            onClick={handleCloseNotice}
                        >
                            1일 동안 보지 않음
                            <img src={ICONS.close} alt="" />
                        </button>
                    </div>
                </div>
            )}

            {/* 공통 헤더 */}
            <div className="header-main">
                <div className="inner">

                    {/* 로고 및 주메뉴 */}
                    <div className="header-left">
                        <Link to={paths.home} className="logo">
                            <img src={ICONS.logo} alt="small stuff" />
                        </Link>

                        <nav className="gnb">
                            <Link to={paths.about}>
                                About us
                            </Link>

                            {/* Shop 드롭다운 */}
                            <div className="menu-item">
                                <button
                                    type="button"
                                    aria-expanded={openMenu === 'shop'}
                                    onClick={() => handleMenu('shop')}
                                >
                                    Shop
                                    <img
                                        src={ICONS.chevronDown}
                                        alt=""
                                    />
                                </button>

                                {openMenu === 'shop' && (
                                    <div className="dropdown-menu">
                                        <Link
                                            to={paths.shop}
                                            onClick={() => setOpenMenu('')}
                                        >
                                            All
                                        </Link>

                                        {mainCategories.map((item) => (
                                            <Link
                                                key={item.id}
                                                to={categoryPath(item.id)}
                                                onClick={() => setOpenMenu('')}
                                            >
                                                {item.name}
                                            </Link>
                                        ))}
                                    </div>
                                )}
                            </div>

                            <Link to={paths.lookbook}>
                                Lookbook
                            </Link>

                            <div className="menu-item">
                                <button
                                    type="button"
                                    aria-expanded={openMenu === 'board'}
                                    onClick={() => handleMenu('board')}
                                >
                                    Board
                                    <img
                                        src={ICONS.chevronDown}
                                        alt=""
                                    />
                                </button>

                                {openMenu === 'board' && (
                                    <div className="dropdown-menu">
                                        <Link
                                            to={paths.board}
                                            onClick={() => setOpenMenu('')}
                                        >
                                            Board
                                        </Link>
                                    </div>
                                )}
                            </div>

                            <Link
                                to={paths.fit}
                                className="fit-link"
                            >
                                맞춤 상품 찾기
                            </Link>
                        </nav>
                    </div>

                    {/* 우측 유틸리티 메뉴 */}
                    <nav className="header-right">
                        <Link to={paths.search}>
                            <img src={ICONS.search} alt="" />
                            Search
                        </Link>

                        <Link to={paths.login}>
                            Login
                        </Link>

                        <Link to={paths.my}>
                            Mypage
                        </Link>

                        <Link to={paths.cart}>
                            Cart
                            <span className="cart-count">0</span>
                        </Link>

                        <div className="menu-item">
                            <button
                                type="button"
                                aria-expanded={openMenu === 'language'}
                                onClick={() => handleMenu('language')}
                            >
                                KR
                                <img
                                    src={ICONS.chevronDown}
                                    alt=""
                                />
                            </button>

                            {openMenu === 'language' && (
                                <div className="dropdown-menu">
                                    <button
                                        type="button"
                                        onClick={() => setOpenMenu('')}
                                    >
                                        KR
                                    </button>
                                </div>
                            )}
                        </div>
                    </nav>
                </div>
            </div>
        </header>
    );
};