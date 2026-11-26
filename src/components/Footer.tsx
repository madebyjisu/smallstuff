import { Link } from 'react-router-dom';
import { paths } from '../router/paths';
import './scss/Footer.scss';

export const Footer = () => {
    return (
        <footer className="footer">

            {/* 풋터 상단 */}
            <div className="footer-top">
                <div className="inner">

                    {/* 카카오톡 채널 */}
                    <div className="footer-section">
                        <h3>Keep in touch</h3>

                        <p className="footer-description">
                            카카오톡 채널에서 5% 할인 혜택과 새 소식을 받아보세요.
                        </p>

                        <a
                            href="https://pf.kakao.com/_Hxnxlxod"
                            target="_blank"
                            rel="noreferrer"
                            className="button button--outline kakao-button"
                        >
                            Kakaotalk
                        </a>
                    </div>

                    {/* 고객지원 */}
                    <div className="footer-section">
                        <h3>Online support</h3>

                        <div className="footer-links">
                            <a
                                href="https://b2bsmallstuff.imweb.me/"
                                target="_blank"
                                rel="noreferrer"
                            >
                                B2B mall
                            </a>

                            <a
                                href="https://smallstuff.imweb.me/Notice/?bmode=view&idx=167163707&t=board"
                                target="_blank"
                                rel="noreferrer"
                            >
                                Membership
                            </a>

                            <a
                                href="https://smallstuff.imweb.me/Notice/?bmode=view&idx=167160251&t=board"
                                target="_blank"
                                rel="noreferrer"
                            >
                                Shipping and returns
                            </a>

                            <span>Global shipping</span>
                        </div>
                    </div>

                    {/* 브랜드 소개 */}
                    <div className="footer-section">
                        <h3>About us</h3>

                        <div className="footer-links">
                            <Link to={paths.about}>
                                About Small stuff
                            </Link>

                            <Link to={paths.lookbook}>
                                Lookbook
                            </Link>

                            <a
                                href="https://smallstuff.imweb.me/Ambassador"
                                target="_blank"
                                rel="noreferrer"
                            >
                                Ambassador
                            </a>
                        </div>
                    </div>

                    {/* SNS */}
                    <div className="footer-section">
                        <h3>Connect with Small stuff</h3>

                        <div className="footer-links">
                            <a
                                href="https://www.instagram.com/smallstuff_official/"
                                target="_blank"
                                rel="noreferrer"
                            >
                                Instagram
                            </a>

                            <a
                                href="https://www.youtube.com/@smallstuff_official"
                                target="_blank"
                                rel="noreferrer"
                            >
                                Youtube
                            </a>

                            <a
                                href="https://kr.pinterest.com/smallstuff_official/"
                                target="_blank"
                                rel="noreferrer"
                            >
                                Pinterest
                            </a>

                            <a
                                href="https://blog.naver.com/smallstuff_official"
                                target="_blank"
                                rel="noreferrer"
                            >
                                Naver blog
                            </a>
                        </div>
                    </div>
                </div>
            </div>

            {/* 풋터 하단 */}
            <div className="footer-bottom">
                <div className="inner">

                    {/* 하단 메뉴 및 이용약관 */}
                    <div className="footer-menu">
                        <nav className="footer-nav">
                            <Link to={paths.about}>About us</Link>
                            <Link to={paths.shop}>Shop</Link>
                            <Link to={paths.lookbook}>Lookbook</Link>
                            <Link to={paths.board}>Board</Link>
                        </nav>

                        <div className="footer-policy">
                            <a
                                href="https://smallstuff.kr/?mode=policy"
                                target="_blank"
                                rel="noreferrer"
                            >
                                이용약관
                            </a>

                            <a
                                href="https://smallstuff.kr/?mode=privacy"
                                target="_blank"
                                rel="noreferrer"
                                className="privacy"
                            >
                                개인정보처리방침
                            </a>
                        </div>
                    </div>

                    {/* 사업자 정보 */}
                    <p className="company-name">
                        스몰스터프 small stuff
                    </p>

                    <div className="company-info">
                        <p>
                            상호명 주식회사 스몰스터프
                            {' · '}
                            대표자 양다솜
                            {' · '}
                            사업장주소 서울 용산구 회나무로26길 12
                            (이태원동, 삼원휘트니스) 101
                            {' · '}
                            연락처 02-2231-8277
                            {' · '}
                            사업자등록번호 744-88-02334
                        </p>

                        <p>
                            통신판매업 신고 제2022-서울용산-1134호
                            {' · '}
                            대표자 이메일 info@smallstuff.kr
                            {' · '}
                            호스팅 제공자 (주)아임웹
                        </p>
                    </div>

                    <p className="copyright">
                        Copyright ⓒ 2026 스몰스터프 small stuff All rights reserved.
                    </p>
                </div>
            </div>
        </footer>
    );
};