import { Link } from 'react-router-dom';
import type { Product } from '../types/product';
import { productPath } from '../router/paths';
import './scss/ProductCard.scss';

interface ProductCardProps {
    product: Product;
    variant?: 'home' | 'list';
    variantId?: string;
    recommendedSize?: string;
}

export const ProductCard = ({
    product,
    variant = 'list',
    variantId,
    recommendedSize,
}: ProductCardProps) => {

    // 지정한 색상 또는 기본 색상 가져오기
    const selectedVariant = product.variants.find(
        (item) => item.id === (variantId || product.defaultVariantId)
    ) || product.variants[0];

    if (!selectedVariant) return null;

    const price = selectedVariant.displayPrice;
    const regularPrice = selectedVariant.regularPrice;
    const discountPercent = selectedVariant.discountPercent;

    // 실제 할인 여부 확인
    const isDiscount =
        regularPrice !== null &&
        price !== null &&
        regularPrice > price;

    // 상품 대표 이미지
    const image = selectedVariant.images.representative;
    const imageUrl = image?.localPath || image?.sourceUrl;

    // 메인에서는 색상별 상품명 표시
    const productName = variant === 'home' && variantId
        ? selectedVariant.sourceName
        : product.name;

    // 지정한 색상 또는 전체 상품 품절 여부
    const isSoldOut = variantId
        ? selectedVariant.soldOut === true ||
        selectedVariant.saleStatus === 'sold-out'
        : product.variants.every(
            (item) =>
                item.soldOut === true ||
                item.saleStatus === 'sold-out'
        );

    // 상품 상세 페이지에 선택한 색상 전달
    const detailPath = variantId
        ? `${productPath(product.id)}?variant=${selectedVariant.id}`
        : productPath(product.id);

    return (
        <Link
            to={detailPath}
            className={`product-card product-card--${variant}`}
        >
            {/* 상품 이미지 */}
            <div className="product-image">
                {imageUrl ? (
                    <img
                        src={imageUrl}
                        alt={productName}
                        loading="lazy"
                    />
                ) : (
                    <span className="image-placeholder">
                        상품 이미지
                    </span>
                )}

                {isSoldOut && (
                    <span className="sold-out">
                        SOLD OUT
                    </span>
                )}
            </div>

            {/* 상품 정보 */}
            <div className="product-info">
                <h3 className="product-name">
                    {productName}
                </h3>

                {/* 할인 전 가격 */}
                {isDiscount && regularPrice !== null && (
                    <span className="original-price">
                        {regularPrice.toLocaleString()}원
                    </span>
                )}

                {/* 할인율 및 판매가 */}
                <div className="product-price">
                    {isDiscount && discountPercent !== null && (
                        <span className="discount">
                            {discountPercent}%
                        </span>
                    )}

                    <span className="price">
                        {price !== null
                            ? `${price.toLocaleString()}원`
                            : '가격 확인 필요'}
                    </span>
                </div>

                {/* 추천 사이즈 */}
                {recommendedSize && (
                    <p className="recommended-size">
                        추천 사이즈 {recommendedSize}
                    </p>
                )}
            </div>
        </Link>
    );
};