import { useState } from 'react';
import { Input } from './Input';
import { Button } from './Button';
import { SectionTitle } from './SectionTitle';
import type {
    Product,
    ProductVariant,
} from '../types/product';
import './scss/ProductSizeInfo.scss';

interface ProductSizeInfoProps {
    productType: Product['type'];
    selectedVariant: ProductVariant;
    sizeId: string;
}

export const ProductSizeInfo = ({
    productType,
    selectedVariant,
    sizeId,
}: ProductSizeInfoProps) => {

    // 반려견 치수 입력 상태
    const [measurements, setMeasurements] = useState({
        neck: '',
        chest: '',
        backLength: '',
        legLength: '',
        furnitureHeight: '',
    });

    // 입력창 수정 상태
    const [isEditing, setIsEditing] = useState(true);

    // 상품 종류 확인
    const isClothing = productType === 'clothing';
    const isStairs = productType === 'stairs';

    // 의류와 계단이 아닌 상품은 출력하지 않음
    if (!isClothing && !isStairs) return null;

    // 상품 사이즈 정보
    const sizes = selectedVariant.sizeOptions || [];

    // 현재 선택한 사이즈
    const selectedSize = sizes.find(
        (item) => item.id === sizeId
    );

    // 계단 실측값
    const stairs = selectedVariant.stairs;

    // 치수 출력
    const formatCm = (value: number | null | undefined) => {
        return value == null ? '-' : `${value}cm`;
    };

    // 입력된 문자열을 숫자로 변환
    const toNumber = (value: string) => {
        const number = Number(value);

        return value.trim() !== '' &&
            Number.isFinite(number) &&
            number > 0
            ? number
            : null;
    };

    // 반려견 치수에 가까운 사이즈 찾기
    const getRecommendedSize = () => {

        const neck = toNumber(measurements.neck);
        const chest = toNumber(measurements.chest);
        const back = toNumber(measurements.backLength);

        // 치수가 모두 입력되지 않은 경우
        if (neck === null || chest === null || back === null) {
            return undefined;
        }

        // 목둘레와 가슴둘레에 여유가 있는 사이즈 찾기
        const candidates = sizes.flatMap((item) => {

            const m = item.measurementsCm;

            // 실측 데이터가 없는 사이즈 제외
            if (
                !m ||
                m.neck === null ||
                m.chest === null ||
                m.backLength === null
            ) {
                return [];
            }

            // 목둘레 또는 가슴둘레에 여유가 없는 사이즈 제외
            if (m.neck <= neck || m.chest <= chest) {
                return [];
            }

            // 치수 차이가 작을수록 높은 적합도
            // 가슴둘레 차이에 가중치 2 적용
            const score =
                Math.abs(m.neck - neck) / neck +
                Math.abs(m.chest - chest) / chest * 2 +
                Math.abs(m.backLength - back) / back;

            return [{ size: item, score }];
        });

        // 치수 차이가 가장 적은 사이즈 반환
        candidates.sort((a, b) => a.score - b.score);

        return candidates[0]?.size;
    };

    // 추천 사이즈 가져오기
    const recommendedSize = isClothing && !isEditing
        ? getRecommendedSize()
        : undefined;

    // 비교하기 전에는 기존 선택 사이즈 표시
    // 비교하기를 누르면 추천 사이즈로 비교
    const comparisonSize = isEditing
        ? selectedSize
        : recommendedSize;

    // 비교할 옷의 실측값
    const clothing = comparisonSize?.measurementsCm;


    // 상품 치수와 반려견 치수의 차이 계산
    const getDifference = (
        productValue: number | null | undefined,
        dogValue: string
    ) => {
        const value = toNumber(dogValue);

        if (productValue == null || value == null) {
            return '-';
        }

        const difference = Number(
            (productValue - value).toFixed(1)
        );

        return `${difference > 0 ? '+' : ''}${difference}cm`;
    };

    // 계단 중 가장 높은 단 높이
    const stepHeights = stairs?.stepHeightsCm || [];

    const maxStepHeight =
        stepHeights.length > 0 &&
            stepHeights.every((item) => item !== null)
            ? Math.max(
                ...stepHeights.map((item) => item ?? 0)
            )
            : null;

    // 의류 상품 비교 항목
    const clothingRows = [
        {
            label: '목둘레',
            myValue: measurements.neck,
            productValue: clothing?.neck,
        },
        {
            label: '가슴둘레',
            myValue: measurements.chest,
            productValue: clothing?.chest,
        },
        {
            label: '등길이',
            myValue: measurements.backLength,
            productValue: clothing?.backLength,
        },
    ];

    // 계단 상품 비교 항목
    const stairsRows = [
        {
            label: '앞다리 / 최대 단 높이',
            myValue: measurements.legLength,
            productValue: maxStepHeight,
        },
        {
            label: '소파·침대 / 전체 높이',
            myValue: measurements.furnitureHeight,
            productValue: stairs?.totalHeightCm,
        },
    ];

    // 상품 종류에 따른 비교 항목
    const compareRows = isClothing
        ? clothingRows
        : stairsRows;

    // 상품 종류에 따른 입력 항목
    const clothingFields = [
        { key: 'neck', label: '목둘레' },
        { key: 'chest', label: '가슴둘레' },
        { key: 'backLength', label: '등길이' },
    ] as const;

    const stairsFields = [
        { key: 'legLength', label: '앞다리 길이' },
        { key: 'furnitureHeight', label: '소파·침대 높이' },
    ] as const;

    const fields = isClothing
        ? clothingFields
        : stairsFields;

    // 치수 입력 완료 여부
    const isValid = fields.every(
        (item) => toNumber(measurements[item.key]) !== null
    );

    return (
        <section
            className="product-size-info"
            id="detail-size-section"
        >

            {/* 상품 실측표 */}
            <SectionTitle
                title={isClothing ? 'size' : 'size info'}
            />

            <div className="size-info-content">

                {/* 치수 측정 안내 */}
                <div className="measurement-guide">
                    <p>
                        {isClothing
                            ? '가슴둘레 / 등길이 / 목둘레'
                            : '한 단 높이 / 전체 높이 / 폭'}
                    </p>
                </div>

                {/* 실측표 영역 */}
                <div className="size-table-area">
                    <h3>상품 실측표</h3>

                    {isClothing ? (
                        sizes.length > 0 ? (
                            <div className="table-scroll">
                                <table className="size-table">
                                    <thead>
                                        <tr>
                                            <th>사이즈</th>

                                            {sizes.map((item) => (
                                                <th
                                                    key={item.id}
                                                    className={
                                                        item.id === comparisonSize?.id
                                                            ? 'selected-size'
                                                            : ''
                                                    }
                                                >
                                                    {item.label}
                                                </th>
                                            ))}
                                        </tr>
                                    </thead>

                                    <tbody>
                                        <tr>
                                            <th>목둘레</th>
                                            {sizes.map((item) => (
                                                <td
                                                    key={item.id}
                                                    className={
                                                        item.id === comparisonSize?.id
                                                            ? 'selected-size'
                                                            : ''
                                                    }
                                                >
                                                    {formatCm(
                                                        item.measurementsCm?.neck
                                                    )}
                                                </td>
                                            ))}
                                        </tr>

                                        <tr>
                                            <th>가슴둘레</th>
                                            {sizes.map((item) => (
                                                <td
                                                    key={item.id}
                                                    className={
                                                        item.id === comparisonSize?.id
                                                            ? 'selected-size'
                                                            : ''
                                                    }
                                                >
                                                    {formatCm(
                                                        item.measurementsCm?.chest
                                                    )}
                                                </td>
                                            ))}
                                        </tr>

                                        <tr>
                                            <th>등길이</th>
                                            {sizes.map((item) => (
                                                <td
                                                    key={item.id}
                                                    className={
                                                        item.id === comparisonSize?.id
                                                            ? 'selected-size'
                                                            : ''
                                                    }
                                                >
                                                    {formatCm(
                                                        item.measurementsCm?.backLength
                                                    )}
                                                </td>
                                            ))}
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        ) : (
                            <p>등록된 사이즈 정보가 없습니다.</p>
                        )
                    ) : (
                        <div className="table-scroll">
                            <table className="size-table">
                                <thead>
                                    <tr>
                                        <th>가로 (W)</th>
                                        <th>깊이 (D)</th>
                                        <th>전체 높이 (H)</th>
                                        <th>최대 단 높이</th>
                                    </tr>
                                </thead>

                                <tbody>
                                    <tr>
                                        <td>{formatCm(stairs?.widthCm)}</td>
                                        <td>{formatCm(stairs?.depthCm)}</td>
                                        <td>{formatCm(stairs?.totalHeightCm)}</td>
                                        <td>{formatCm(maxStepHeight)}</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    )}

                    <p className="size-notice">
                        상품 실측값이며, 측정 방법에 따라
                        차이가 있을 수 있습니다.
                        '-'는 확인되지 않은 치수입니다.
                    </p>
                </div>
            </div>

            {/* 반려견 치수 비교 */}
            <section className="measurement-section">

                <SectionTitle
                    title={isClothing
                        ? '우리 강아지 실측과 비교하기'
                        : '우리 강아지와 집의 높이 비교'
                    }
                />

                <div className="measurement-box">

                    {/* 입력한 반려견 정보 */}
                    <div className="measurement-header">
                        <div className="measurement-summary">
                            {fields.map((item) => (
                                <span key={item.key}>
                                    {item.label}{' '}
                                    {formatCm(
                                        toNumber(measurements[item.key])
                                    )}
                                </span>
                            ))}
                        </div>

                        {!isEditing && (
                            <Button
                                variant="outline"
                                width={248}
                                onClick={() => setIsEditing(true)}
                            >
                                치수 수정
                            </Button>
                        )}
                    </div>

                    {/* 반려견 치수 입력 */}
                    {isEditing && (
                        <div className="measurement-form">

                            <div className="measurement-fields">
                                {fields.map((item) => (
                                    <div
                                        className="measurement-field"
                                        key={item.key}
                                    >
                                        <label htmlFor={`pet-${item.key}`}>
                                            {item.label}
                                        </label>

                                        <div className="measurement-input">
                                            <Input
                                                id={`pet-${item.key}`}
                                                type="number"
                                                variant="measurement"
                                                placeholder="치수 입력"
                                                value={measurements[item.key]}
                                                onChange={(e) =>
                                                    setMeasurements((prev) => ({
                                                        ...prev,
                                                        [item.key]: e.target.value,
                                                    }))
                                                }
                                            />

                                            <span>cm</span>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <Button
                                width={248}
                                disabled={!isValid}
                                onClick={() => setIsEditing(false)}
                            >
                                비교하기
                            </Button>
                        </div>
                    )}

                    {/* 추천 사이즈 안내 */}
                    {isClothing && !isEditing && (
                        <div className="size-recommendation">
                            {recommendedSize ? (
                                <>
                                    <h3>
                                        추천 사이즈 {recommendedSize.label}
                                    </h3>

                                    <p>
                                        입력한 치수와 가장 가까운 비교 후보입니다.
                                    </p>

                                    {recommendedSize.soldOut === true && (
                                        <p className="size-sold-out">
                                            현재 해당 사이즈는 품절입니다.
                                        </p>
                                    )}
                                </>
                            ) : (
                                <p>
                                    입력한 치수에 해당하는 사이즈를
                                    확인하기 어렵습니다.
                                </p>
                            )}
                        </div>
                    )}

                    {/* 실측 비교 결과 */}
                    <div
                        className="table-scroll"
                        hidden={isEditing || (isClothing && !comparisonSize)}
                    >
                        <table className="compare-table">
                            <thead>
                                <tr>
                                    <th>비교 항목</th>
                                    <th>
                                        {isClothing
                                            ? '우리 강아지'
                                            : '우리 강아지·집'}
                                    </th>
                                    <th>
                                        {isClothing
                                            ? `옷 ${comparisonSize?.label || ''} 사이즈`
                                            : '계단'}
                                    </th>
                                    <th>차이</th>
                                </tr>
                            </thead>

                            <tbody>
                                {compareRows.map((item) => (
                                    <tr key={item.label}>
                                        <th>{item.label}</th>

                                        <td>
                                            {formatCm(
                                                toNumber(item.myValue)
                                            )}
                                        </td>

                                        <td>
                                            {formatCm(item.productValue)}
                                        </td>

                                        <td>
                                            {getDifference(
                                                item.productValue,
                                                item.myValue
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {/* 비교 안내 */}
                    <p className="compare-notice">
                        {isClothing
                            ? '소재와 신축성에 따라 실제 착용감은 달라질 수 있습니다.'
                            : '계단과 반려견·생활 공간의 높이 차이를 확인해 주세요.'
                        }
                    </p>
                </div>
            </section>
        </section>
    );
};