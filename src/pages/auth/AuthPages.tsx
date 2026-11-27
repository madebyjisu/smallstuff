import { useState } from 'react';
import type { FormEvent } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';

import {
    signInWithEmailAndPassword,
    createUserWithEmailAndPassword,
    signInWithPopup,
    sendPasswordResetEmail,
    updateProfile,
} from 'firebase/auth';

import { FirebaseError } from 'firebase/app';
import { auth, googleProvider } from '../../firebase/config';

import { Input } from '../../components/Input';
import { Button } from '../../components/Button';
import { SectionTitle } from '../../components/SectionTitle';
import { paths } from '../../router/paths';

import '../scss/AuthPages.scss';

interface AuthPageProps {
    mode: 'login' | 'signup' | 'find';
}

const AuthPage = ({ mode }: AuthPageProps) => {

    const navigate = useNavigate();
    const location = useLocation();

    // 페이지 종류
    const isLogin = mode === 'login';
    const isSignup = mode === 'signup';
    const isFind = mode === 'find';

    // 입력값 관리
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    // 오류 및 안내 메시지
    const [error, setError] = useState('');
    const [message, setMessage] = useState('');

    // 요청 처리 상태
    const [loading, setLoading] = useState(false);

    // 로그인 전 접근하려고 했던 페이지
    const returnTo = location.state?.returnTo;

    // 로그인 성공 후 이동
    const redirectAfterLogin = () => {

        const isSafePath =
            typeof returnTo === 'string' &&
            returnTo.startsWith('/') &&
            !returnTo.startsWith('//') &&
            !returnTo.includes('\\');

        navigate(
            isSafePath ? returnTo : paths.home,
            { replace: true }
        );
    };

    // Firebase 오류 메시지 변환
    const getErrorMessage = (err: unknown) => {

        if (!(err instanceof FirebaseError)) {
            return '오류가 발생했습니다. 다시 시도해 주세요.';
        }

        switch (err.code) {

            case 'auth/invalid-email':
                return '올바른 이메일을 입력해 주세요.';

            case 'auth/invalid-credential':
            case 'auth/user-not-found':
            case 'auth/wrong-password':
                return '이메일 또는 비밀번호를 확인해 주세요.';

            case 'auth/email-already-in-use':
                return '이미 가입된 이메일입니다.';

            case 'auth/weak-password':
                return '비밀번호를 6자 이상 입력해 주세요.';

            case 'auth/popup-closed-by-user':
                return 'Google 로그인이 취소되었습니다.';

            case 'auth/popup-blocked':
                return '브라우저에서 팝업을 허용해 주세요.';

            case 'auth/unauthorized-domain':
                return 'Firebase 승인 도메인 설정을 확인해 주세요.';

            case 'auth/operation-not-allowed':
                return 'Firebase 로그인 제공업체 설정을 확인해 주세요.';

            case 'auth/network-request-failed':
                return '네트워크 연결을 확인해 주세요.';

            case 'auth/too-many-requests':
                return '잠시 후 다시 시도해 주세요.';

            default:
                return '요청을 처리하지 못했습니다. 다시 시도해 주세요.';
        }
    };

    // 이메일 로그인 및 회원가입
    const handleSubmit = async (
        e: FormEvent<HTMLFormElement>
    ) => {

        e.preventDefault();

        if (loading) return;

        setError('');
        setMessage('');

        const cleanEmail = email.trim();

        // 공통 입력값 확인
        if (!cleanEmail) {
            setError('이메일을 입력해 주세요.');
            return;
        }

        if (!isFind && !password) {
            setError('비밀번호를 입력해 주세요.');
            return;
        }

        // 회원가입 입력값 확인
        if (isSignup) {

            if (!name.trim()) {
                setError('이름을 입력해 주세요.');
                return;
            }

            if (password.length < 6) {
                setError('비밀번호를 6자 이상 입력해 주세요.');
                return;
            }

            if (password !== confirmPassword) {
                setError('비밀번호가 일치하지 않습니다.');
                return;
            }
        }

        setLoading(true);

        try {

            // 이메일 로그인
            if (isLogin) {

                await signInWithEmailAndPassword(
                    auth,
                    cleanEmail,
                    password
                );

                redirectAfterLogin();
            }

            // 이메일 회원가입
            if (isSignup) {

                const result =
                    await createUserWithEmailAndPassword(
                        auth,
                        cleanEmail,
                        password
                    );

                // 사용자 이름 등록
                try {
                    await updateProfile(result.user, {
                        displayName: name.trim(),
                    });
                } catch {
                    setMessage(
                        '회원가입은 완료되었으나 이름을 저장하지 못했습니다.'
                    );
                    return;
                }

                redirectAfterLogin();
            }

            // 비밀번호 재설정 이메일 발송
            if (isFind) {

                await sendPasswordResetEmail(
                    auth,
                    cleanEmail
                );

                setMessage(
                    '가입된 계정이라면 비밀번호 재설정 메일이 발송됩니다.'
                );
            }

        } catch (err) {
            setError(getErrorMessage(err));

        } finally {
            setLoading(false);
        }
    };

    // Google 로그인
    const handleGoogleLogin = async () => {

        if (loading) return;

        setError('');
        setLoading(true);

        try {

            await signInWithPopup(
                auth,
                googleProvider
            );

            redirectAfterLogin();

        } catch (err) {
            setError(getErrorMessage(err));

        } finally {
            setLoading(false);
        }
    };

    // 페이지별 제목
    const title = isLogin
        ? 'Login'
        : isSignup
            ? 'Join'
            : '비밀번호 찾기';

    return (
        <div className="auth-page inner">

            <div className="auth-container">

                <SectionTitle
                    title={title}
                    align="center"
                    size="large"
                />

                <form
                    className="auth-form"
                    onSubmit={handleSubmit}
                >

                    {/* 회원가입 이름 입력 */}
                    {isSignup && (
                        <div className="auth-field">

                            <label htmlFor="auth-name">
                                이름
                            </label>

                            <Input
                                id="auth-name"
                                placeholder="이름"
                                value={name}
                                onChange={(e) =>
                                    setName(e.target.value)
                                }
                                required
                            />

                        </div>
                    )}

                    {/* 이메일 입력 */}
                    <div className="auth-field">

                        <label htmlFor="auth-email">
                            이메일
                        </label>

                        <Input
                            id="auth-email"
                            type="email"
                            placeholder="이메일"
                            value={email}
                            onChange={(e) =>
                                setEmail(e.target.value)
                            }
                            required
                        />

                    </div>

                    {/* 비밀번호 입력 */}
                    {!isFind && (
                        <div className="auth-field">

                            <label htmlFor="auth-password">
                                비밀번호
                            </label>

                            <Input
                                id="auth-password"
                                type="password"
                                placeholder="비밀번호"
                                value={password}
                                onChange={(e) =>
                                    setPassword(e.target.value)
                                }
                                required
                            />

                        </div>
                    )}

                    {/* 회원가입 비밀번호 확인 */}
                    {isSignup && (
                        <div className="auth-field">

                            <label htmlFor="auth-confirm">
                                비밀번호 확인
                            </label>

                            <Input
                                id="auth-confirm"
                                type="password"
                                placeholder="비밀번호 확인"
                                value={confirmPassword}
                                onChange={(e) =>
                                    setConfirmPassword(e.target.value)
                                }
                                required
                            />

                        </div>
                    )}

                    {/* 오류 메시지 */}
                    {error && (
                        <p className="auth-error" role="alert">
                            {error}
                        </p>
                    )}

                    {/* 처리 완료 메시지 */}
                    {message && (
                        <p className="auth-message" role="status">
                            {message}
                        </p>
                    )}

                    {/* 페이지별 실행 버튼 */}
                    <Button
                        type="submit"
                        width="100%"
                        disabled={loading}
                    >
                        {loading
                            ? '처리 중...'
                            : isLogin
                                ? '로그인'
                                : isSignup
                                    ? '회원가입'
                                    : '비밀번호 재설정 메일 보내기'}
                    </Button>

                </form>

                {/* Google 로그인 */}
                {isLogin && (
                    <div className="social-login">

                        <div className="auth-divider">
                            <span>또는</span>
                        </div>

                        <Button
                            variant="outline"
                            width="100%"
                            disabled={loading}
                            onClick={handleGoogleLogin}
                        >
                            Google로 로그인
                        </Button>

                    </div>
                )}

                {/* 하단 계정 관련 메뉴 */}
                <div className="auth-links">

                    {isLogin ? (
                        <>
                            <Link
                                to={paths.signup}
                                state={location.state}
                            >
                                회원가입
                            </Link>

                            <span>|</span>

                            <Link
                                to={paths.findAccount}
                                state={location.state}
                            >
                                비밀번호 찾기
                            </Link>
                        </>
                    ) : (
                        <Link
                            to={paths.login}
                            state={location.state}
                        >
                            로그인으로 돌아가기
                        </Link>
                    )}

                </div>
            </div>
        </div>
    );
};

// 로그인 페이지
export const LoginPage = () => {
    return <AuthPage key="login" mode="login" />;
};

// 회원가입 페이지
export const SignupPage = () => {
    return <AuthPage key="signup" mode="signup" />;
};

// 비밀번호 찾기 페이지
export const FindAccountPage = () => {
    return <AuthPage key="find" mode="find" />;
};