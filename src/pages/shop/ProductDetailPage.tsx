import { useState } from 'react';
import {
    Link,
    useParams,
    useSearchParams,
} from 'react-router-dom';

import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination } from 'swiper/modules';

import { Button } from '../../components/Button';
import { Select } from '../../components/Select';
import { ICONS } from '../../constants/icons';
import { paths, categoryPath } from '../../router/paths';

import type {
    Product,
    ProductVariant,
} from '../../types/product';

import productData from '../../data/products.json';
import categories from '../../data/categories.json';
import NotFoundPage from '../system/NotFoundPage';

import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

import '../scss/ProductDetailPage.scss';
import { ProductSizeInfo } from '../../components/ProductSizeInfo';
import { SectionTitle } from '../../components/SectionTitle';

export const ProductDetailPage = () => {

    // URL에서 상품 ID 가져오기
    const { productId } = useParams();

    // URL에서 선택한 색상 옵션 가져오기
    const [searchParams, setSearchParams] = useSearchParams();
    const variantId = searchParams.get('variant');

    const products = productData as Product[];

    // 현재 상품 찾기
    const product = products.find(
        (item) => item.id === productId
    );

    if (!product) return <NotFoundPage />;

    // 선택한 색상 또는 기본 색상 가져오기
    const selectedVariant = product.variants.find(
        (item) => item.id === variantId
    ) || product.variants.find(
        (item) => item.id === product.defaultVariantId
    ) || product.variants[0];

    if (!selectedVariant) return <NotFoundPage />;

    // 색상 변경
    const handleColor = (value: string) => {
        setSearchParams(
            { variant: value },
            { replace: true }
        );
    };

    return (
        <ProductDetailContent
            key={`${product.id}-${selectedVariant.id}`}
            product={product}
            selectedVariant={selectedVariant}
            onColorChange={handleColor}
        />
    );
};

interface ProductDetailContentProps {
    product: Product;
    selectedVariant: ProductVariant;
    onColorChange: (value: string) => void;
}

const ProductDetailContent = ({
    product,
    selectedVariant,
    onColorChange,
}: ProductDetailContentProps) => {

    // 사이즈, 배송 옵션, 수량 상태
    const [sizeId, setSizeId] = useState('');
    const [shippingId, setShippingId] = useState('');
    const [count, setCount] = useState(1);

    // 현재 상품의 가격 정보
    const price = selectedVariant.displayPrice;
    const regularPrice = selectedVariant.regularPrice;
    const discountPercent = selectedVariant.discountPercent;

    const isDiscount =
        regularPrice !== null &&
        price !== null &&
        regularPrice > price;

    // 상품 품절 여부
    const isSoldOut =
        selectedVariant.soldOut === true ||
        selectedVariant.saleStatus === 'sold-out';

    // 색상 드롭다운 옵션
    const colorOptions = product.variants.map((item) => ({
        value: item.id,
        label: item.color || item.sourceName,
    }));

    // 사이즈 드롭다운 옵션
    const sizeOptions = selectedVariant.sizeOptions || [];

    // 현재 선택한 사이즈
    const selectedSize = sizeOptions.find(
        (item) => item.id === sizeId
    );

    // 배송 옵션
    const shippingOptions =
        selectedVariant.otherOptionGroups?.find(
            (item) => item.label === 'Shipping'
        )?.values || [];

    const selectedShipping = shippingOptions.find(
        (item) => item.id === shippingId
    );

    // 선택한 옵션의 추가 금액
    const sizePrice = selectedSize?.additionalPrice || 0;
    const shippingPrice =
        selectedShipping?.additionalPrice || 0;

    // 옵션이 반영된 상품 단가
    const unitPrice =
        price !== null
            ? price + sizePrice + shippingPrice
            : null;

    // 총 상품 금액
    const totalPrice =
        unitPrice !== null
            ? unitPrice * count
            : null;

    // 필요한 옵션을 모두 선택했는지 확인
    const isOptionSelected =
        (sizeOptions.length === 0 || !!selectedSize) &&
        (shippingOptions.length === 0 || !!selectedShipping);

    // 상품 이미지 배열
    const images = [
        selectedVariant.images.representative,
        ...selectedVariant.images.additional,
    ]
        .map((item) => item.localPath || item.sourceUrl)
        .filter((url): url is string => Boolean(url));

    // 중복 이미지 제거
    const productImages = [...new Set(images)];

    // 상품 상세 이미지
    const detailImages = [
        ...new Set(
            selectedVariant.images.detail
                .map((item) => item.localPath || item.sourceUrl)
                .filter((url): url is string => Boolean(url))
        ),
    ];

    // 상품의 대분류 카테고리
    const mainCategory = categories.find(
        (item) =>
            item.parentId === null &&
            item.kind === 'category' &&
            product.categoryIds.includes(item.id)
    );

    // 상품의 소분류 카테고리
    const subCategory = categories.find(
        (item) =>
            item.parentId === mainCategory?.id &&
            product.categoryIds.includes(item.id)
    );

    // 수량 감소
    const onMinus = () => {
        setCount((prev) => Math.max(1, prev - 1));
    };

    // 수량 증가
    const onPlus = () => {
        setCount((prev) => prev + 1);
    };

    // 가격 출력 형식
    const formatPrice = (value: number | null) => {
        return value !== null
            ? `${value.toLocaleString()}원`
            : '가격 확인 필요';
    };

    // 상품 상세 인덱스 메뉴
    const detailMenus = [
        { id: 'detail-description-section', name: '상세정보' },

        // 의류 또는 계단인 경우 사이즈 정보 표시
        ...(product.type === 'clothing' ||
            product.type === 'stairs'
            ? [{ id: 'detail-size-section', name: '사이즈 정보' }]
            : []),

        { id: 'detail-review-section', name: '구매평' },
        { id: 'detail-qna-section', name: 'Q&A' },
    ];

    return (
        <div className="product-detail-page inner">

            {/* 현재 페이지 경로 */}
            <div className="breadcrumb">
                <Link to={paths.home}>Home</Link>
                <span>/</span>
                <Link to={paths.shop}>Shop</Link>

                {mainCategory && (
                    <>
                        <span>/</span>
                        <Link to={categoryPath(mainCategory.id)}>
                            {mainCategory.name}
                        </Link>
                    </>
                )}

                {subCategory && (
                    <>
                        <span>/</span>
                        <Link to={categoryPath(subCategory.id)}>
                            {subCategory.name}
                        </Link>
                    </>
                )}
            </div>

            {/* 상품 상세 상단 */}
            <section className="detail-top">

                {/* 상품 이미지 슬라이드 */}
                <div className="detail-gallery">

                    {productImages.length > 0 ? (
                        <Swiper
                            modules={[Navigation, Pagination]}
                            slidesPerView={1}
                            navigation={productImages.length > 1}
                            pagination={{ clickable: true }}
                        >
                            {productImages.map((url, index) => (
                                <SwiperSlide key={url}>
                                    <img
                                        src={url}
                                        alt={`${product.name} ${index + 1}`}
                                    />
                                </SwiperSlide>
                            ))}
                        </Swiper>
                    ) : (
                        <div className="empty-image">
                            상품 이미지
                        </div>
                    )}
                </div>

                {/* 오른쪽 상품 정보 */}
                <div className="detail-information">

                    <div className="detail-summary">
                        <h1>{product.name}</h1>

                        {/* 가격 */}
                        <div className="detail-price">

                            {isDiscount && (
                                <span className="original-price">
                                    {formatPrice(regularPrice)}
                                </span>
                            )}

                            <div className="selling-price">
                                {isDiscount &&
                                    discountPercent !== null && (
                                        <span className="discount">
                                            {discountPercent}%
                                        </span>
                                    )}

                                <strong>
                                    {formatPrice(price)}
                                </strong>
                            </div>
                        </div>

                        {/* 상품 설명 */}
                        {selectedVariant.descriptionSummary && (
                            <p className="detail-description">
                                {selectedVariant.descriptionSummary}
                            </p>
                        )}

                        {/* 배송 안내 */}
                        <div className="shipping-info">
                            <strong>배송</strong>

                            <a
                                href={selectedVariant.shippingPolicyUrl}
                                target="_blank"
                                rel="noreferrer"
                            >
                                배송 및 교환·반품 안내
                            </a>
                        </div>
                    </div>

                    {/* 상품 옵션 선택 */}
                    <div className="detail-options">

                        {/* 색상 선택 */}
                        {(product.variants.length > 1 ||
                            selectedVariant.color) && (
                                <div className="option-field">
                                    <label htmlFor="detail-color">
                                        color *
                                    </label>

                                    <Select
                                        id="detail-color"
                                        options={colorOptions}
                                        value={selectedVariant.id}
                                        onChange={(e) =>
                                            onColorChange(e.target.value)
                                        }
                                    />
                                </div>
                            )}

                        {/* 사이즈 선택 */}
                        {sizeOptions.length > 0 && (
                            <div className="option-field">
                                <label htmlFor="detail-size">
                                    size *
                                </label>

                                <Select
                                    id="detail-size"
                                    placeholder="사이즈를 선택해 주세요."
                                    options={sizeOptions.map((item) => ({
                                        value: item.id,

                                        // 추가 금액 및 품절 여부 표시
                                        label:
                                            item.label +
                                            (item.additionalPrice
                                                ? ` (${item.additionalPrice > 0 ? '+' : ''}${item.additionalPrice.toLocaleString()}원)`
                                                : '') +
                                            (item.soldOut ? ' (품절)' : ''),

                                        disabled: item.soldOut === true,
                                    }))}
                                    value={sizeId}
                                    onChange={(e) =>
                                        setSizeId(e.target.value)
                                    }
                                />
                            </div>
                        )}

                        {/* 배송 옵션 선택 */}
                        {shippingOptions.length > 0 && (
                            <div className="option-field">
                                <label htmlFor="detail-shipping">
                                    배송 옵션 *
                                </label>

                                <Select
                                    id="detail-shipping"
                                    placeholder="배송 옵션을 선택해 주세요."
                                    options={shippingOptions.map((item) => ({
                                        value: item.id,
                                        label: item.label,
                                        disabled: item.soldOut === true,
                                    }))}
                                    value={shippingId}
                                    onChange={(e) =>
                                        setShippingId(e.target.value)
                                    }
                                />
                            </div>
                        )}
                    </div>

                    {/* 선택한 상품 및 수량 */}
                    <div className="selected-products">

                        {isOptionSelected && !isSoldOut && (
                            <div className="selected-product">
                                <div className="selected-name">
                                    {[
                                        selectedVariant.color || product.name,
                                        selectedSize?.label,
                                        selectedShipping?.label,
                                    ].filter(Boolean).join(' / ')}
                                </div>

                                <div className="selected-bottom">

                                    {/* 수량 조절 */}
                                    <div className="quantity-control">
                                        <button
                                            type="button"
                                            onClick={onMinus}
                                            disabled={count === 1}
                                            aria-label="수량 감소"
                                        >
                                            <img src={ICONS.minus} alt="" />
                                        </button>

                                        <span>{count}</span>

                                        <button
                                            type="button"
                                            onClick={onPlus}
                                            aria-label="수량 증가"
                                        >
                                            <img src={ICONS.plus} alt="" />
                                        </button>
                                    </div>

                                    <span>
                                        {formatPrice(totalPrice)}
                                    </span>
                                </div>
                            </div>
                        )}

                        {/* 총 상품 금액 */}
                        <div className="total-price">
                            <span>
                                총 상품금액
                                ({isOptionSelected && !isSoldOut
                                    ? count : 0}개)
                            </span>

                            <strong>
                                {isOptionSelected && !isSoldOut
                                    ? formatPrice(totalPrice)
                                    : '0원'}
                            </strong>
                        </div>
                    </div>

                    {/* 주문 버튼 */}
                    {/* 장바구니 및 결제 기능 구현 시 연결 */}
                    <div className="detail-actions">
                        <Button
                            variant="outline"
                            width="100%"
                            disabled
                        >
                            장바구니
                        </Button>

                        <Button
                            variant="outline"
                            width="100%"
                            disabled
                        >
                            선물하기
                        </Button>

                        <Button
                            width="100%"
                            disabled
                        >
                            {isSoldOut ? '품절' : '구매하기'}
                        </Button>
                    </div>
                </div>
            </section>

            {/* 상품 상세 인덱스 */}
            <nav className="detail-index" aria-label="상품 상세 메뉴">
                {detailMenus.map((item) => (
                    <button
                        key={item.id}
                        type="button"
                        onClick={() =>
                            document.getElementById(item.id)?.scrollIntoView({
                                behavior: 'smooth',
                                block: 'start',
                            })
                        }
                    >
                        {item.name}
                    </button>
                ))}
            </nav>

            {/* 상품 상세 이미지 */}
            <section
                className="detail-body"
                id="detail-description-section"
            >

                {detailImages.map((url, index) => (
                    <img
                        key={url}
                        src={url}
                        alt={`${product.name} 상세 정보 ${index + 1}`}
                        loading="lazy"
                    />
                ))}

                {/* 소재 정보 */}
                {selectedVariant.materials?.length ? (
                    <div className="detail-materials">
                        <h2>소재</h2>
                        <p>
                            {selectedVariant.materials.join(', ')}
                        </p>
                    </div>
                ) : null}

                {/* 관리 방법 */}
                {selectedVariant.care && (
                    <div className="detail-materials">
                        <h2>관리 방법</h2>
                        <p>{selectedVariant.care}</p>
                    </div>
                )}
            </section>

            {/* 상품 실측표 및 반려견 치수 비교 */}
            <ProductSizeInfo
                productType={product.type}
                selectedVariant={selectedVariant}
                sizeId={sizeId}
            />

            {/* 구매평 */}
            <section
                className="detail-review"
                id="detail-review-section"
            >
                <SectionTitle title="구매평" />

                <div className="detail-board-content">
                    <a
                        href={selectedVariant.sourceUrl}
                        target="_blank"
                        rel="noreferrer"
                    >
                        공식몰에서 구매평 확인하기
                    </a>
                </div>
            </section>

            {/* 상품 문의 */}
            <section
                className="detail-qna"
                id="detail-qna-section"
            >
                <SectionTitle title="Q&A" />

                <div className="detail-board-content">
                    <p>상품에 대해 궁금한 점이 있으신가요?</p>

                    <a
                        href={selectedVariant.sourceUrl}
                        target="_blank"
                        rel="noreferrer"
                    >
                        공식몰에서 상품 문의 확인하기
                    </a>
                </div>
            </section>

        </div>
    );
};