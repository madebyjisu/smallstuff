import { useState } from 'react';
import type { FormEvent } from 'react';
import { auth } from '../../firebase/config';
import { Input } from '../../components/Input';
import { Button } from '../../components/Button';
import '../scss/MyPage.scss';

// 반려견 정보 타입
interface PetInfo {
    name: string;
    chest: string;
    backLength: string;
    neck: string;
    weight: string;
    legLength: string;
}

// 반려견 정보 초기값
const initialPet: PetInfo = {
    name: '',
    chest: '',
    backLength: '',
    neck: '',
    weight: '',
    legLength: '',
};

export const MyPage = () => {

    // 현재 로그인한 사용자
    const user = auth.currentUser;

    const userName =
        user?.displayName ||
        user?.email?.split('@')[0] ||
        '회원';

    // 등록된 반려견 정보
    const [pet, setPet] = useState<PetInfo | null>(null);

    // 입력 중인 반려견 정보
    const [form, setForm] = useState<PetInfo>(initialPet);

    // 수정 상태
    const [isEditing, setIsEditing] = useState(false);

    // 오류 메시지
    const [error, setError] = useState('');

    // 반려견 정보 입력 항목
    const petFields = [
        { key: 'name', label: '이름', unit: '' },
        { key: 'chest', label: '가슴둘레', unit: 'cm' },
        { key: 'backLength', label: '등길이', unit: 'cm' },
        { key: 'neck', label: '목둘레', unit: 'cm' },
        { key: 'weight', label: '몸무게', unit: 'kg' },
        { key: 'legLength', label: '앞다리 길이', unit: 'cm' },
    ] as const;

    // 주문 상태
    const orderStatus = [
        { label: '입금대기', count: 0 },
        { label: '배송준비', count: 0 },
        { label: '배송중', count: 0 },
        { label: '배송완료', count: 0 },
    ];

    // 등록 또는 수정 화면 표시 여부
    const showForm = !pet || isEditing;

    // 반려견 정보 등록 및 저장
    const handleSave = (e: FormEvent<HTMLFormElement>) => {

        e.preventDefault();
        setError('');

        // 이름 입력 확인
        if (!form.name.trim()) {
            setError('반려견 이름을 입력해 주세요.');
            return;
        }

        // 치수가 입력된 항목만 숫자 확인
        const isValid = petFields.every((item) => {

            if (item.key === 'name') return true;

            const value = form[item.key];

            if (value.trim() === '') return true;

            return Number.isFinite(Number(value)) &&
                Number(value) > 0;
        });

        if (!isValid) {
            setError('치수는 0보다 큰 숫자로 입력해 주세요.');
            return;
        }

        // 반려견 치수가 하나라도 입력됐는지 확인
        const hasMeasurements = petFields.some(
            (item) =>
                item.key !== 'name' &&
                form[item.key].trim() !== ''
        );

        if (!hasMeasurements) {
            setError('반려견 치수를 하나 이상 입력해 주세요.');
            return;
        }

        setPet({
            ...form,
            name: form.name.trim(),
        });

        setIsEditing(false);
    };

    // 반려견 정보 수정
    const handleEdit = () => {

        if (!pet) return;

        setForm({ ...pet });
        setError('');
        setIsEditing(true);
    };

    // 수정 취소
    const handleCancel = () => {

        setForm(pet ? { ...pet } : initialPet);
        setError('');
        setIsEditing(false);
    };

    // 반려견 정보 영역 제목
    const petTitle = !pet
        ? '반려견 정보 등록'
        : isEditing
            ? '반려견 정보 수정'
            : '반려견 정보';

    // 반려견 정보 영역 안내 문구
    const petDescription = !pet
        ? '아직 등록된 반려견이 없어요. 치수를 등록하면 맞춤 상품 추천과 사이즈 비교에 사용할 수 있어요.'
        : isEditing
            ? '반려견의 치수가 달라졌다면 최신 값으로 수정해 주세요.'
            : '등록한 치수는 맞춤 상품 추천과 사이즈 비교에 사용돼요.';

    return (
        <div className="mypage-main">

            {/* 상단 프로필 영역 */}
            <section className="mypage-profile">

                {/* 회원 정보 */}
                <div className="member-info">

                    <div className="member-left">

                        <div className="member-avatar">
                            {userName.slice(-2)}
                        </div>

                        <div className="member-name">
                            <h2>{userName} 님</h2>

                            <p>회원 정보</p>
                        </div>

                    </div>

                    <div className="member-grade">
                        <p>White (기본등급)</p>
                    </div>

                </div>

                {/* 반려견 정보 */}
                <div className="pet-info">

                    <div className="pet-info-header">

                        <div className="pet-info-title">
                            <h2>{petTitle}</h2>
                            <p>{petDescription}</p>
                        </div>

                        {/* 등록 후 수정 버튼 */}
                        {pet && !isEditing && (
                            <Button
                                variant="outline"
                                width={170}
                                onClick={handleEdit}
                            >
                                수정
                            </Button>
                        )}

                    </div>

                    {/* 등록 및 수정 화면 */}
                    {showForm ? (

                        <form
                            className="pet-form"
                            onSubmit={handleSave}
                            noValidate
                        >

                            <div className="pet-fields">

                                {petFields.map((item) => (

                                    <div
                                        className="pet-field"
                                        key={item.key}
                                    >

                                        <label htmlFor={`pet-${item.key}`}>
                                            {item.label}
                                        </label>

                                        <div className="pet-input">

                                            <Input
                                                id={`pet-${item.key}`}
                                                type={
                                                    item.key === 'name'
                                                        ? 'text'
                                                        : 'number'
                                                }
                                                variant="measurement"
                                                placeholder={
                                                    item.key === 'name'
                                                        ? '이름 입력'
                                                        : '숫자 입력'
                                                }
                                                value={form[item.key]}
                                                onChange={(e) =>
                                                    setForm((prev) => ({
                                                        ...prev,
                                                        [item.key]: e.target.value,
                                                    }))
                                                }
                                            />

                                            {item.unit && (
                                                <span className="input-unit">
                                                    {item.unit}
                                                </span>
                                            )}

                                        </div>

                                    </div>
                                ))}

                            </div>

                            {/* 오류 메시지 */}
                            {error && (
                                <p className="pet-error" role="alert">
                                    {error}
                                </p>
                            )}

                            {/* 등록, 저장, 취소 버튼 */}
                            <div className="pet-actions">

                                {isEditing && (
                                    <Button
                                        variant="outline"
                                        width={170}
                                        onClick={handleCancel}
                                    >
                                        취소
                                    </Button>
                                )}

                                <Button
                                    type="submit"
                                    width={170}
                                >
                                    {pet ? '저장' : '등록'}
                                </Button>

                            </div>

                        </form>

                    ) : (

                        /* 등록된 반려견 정보 출력 */
                        <div className="pet-fields pet-values">

                            {petFields.map((item) => (

                                <div
                                    className="pet-value"
                                    key={item.key}
                                >

                                    <span>{item.label}</span>

                                    <strong>
                                        {pet?.[item.key]
                                            ? `${pet[item.key]} ${item.unit}`
                                            : '-'}
                                    </strong>

                                </div>
                            ))}

                        </div>
                    )}

                </div>

            </section>

            {/* 주문 조회 영역 */}
            <section className="mypage-orders">

                <div className="order-header">
                    <h2>주문 조회</h2>
                    <span>최근 3개월</span>
                </div>

                {/* 주문 상태별 개수 */}
                <div className="order-status">

                    {orderStatus.map((item) => (

                        <div
                            className="status-item"
                            key={item.label}
                        >
                            <span>{item.label}</span>
                            <strong>{item.count}</strong>
                        </div>

                    ))}

                </div>

                {/* 주문 내역 */}
                <div className="empty-orders">
                    주문 내역이 없습니다.
                </div>

            </section>

        </div>
    );
};