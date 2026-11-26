import type { Product } from '../types/product';
import { Link } from 'react-router-dom';
import { productPath } from '../router/paths';
import './scss/ProductCard.scss';

interface ProductCardProps {
    product: Product;
    variant?: 'home' | 'list';
    recommendedSize?: string;
}

export const ProductCard = ({
    product,
    variant = 'list',
    recommendedSize,
}: ProductCardProps) => {

    // 상품의 기본 대표 색상 찾기
    const defaultVariant = product.variants.find(
        (item) => item.id === product.defaultVariantId
    ) || product.variants[0];

    // 상품 옵션이 없는 경우 출력하지 않음
    if (!defaultVariant) return null;

    const price = defaultVariant.displayPrice;
    const regularPrice = defaultVariant.regularPrice;
    const discountPercent = defaultVariant.discountPercent;

    // 실제 할인 여부 확인
    const isDiscount =
        regularPrice !== null &&
        price !== null &&
        regularPrice > price;

    // 사용이 허용된 대표 이미지 가져오기
    const image = defaultVariant.images.representative;

    const imageUrl = image?.localPath || image?.sourceUrl;

    // 모든 색상 옵션이 품절인지 확인
    const isSoldout = product.variants.every(
        (item) =>
            item.soldOut === true ||
            item.saleStatus === 'sold-out'
    );

    return (
        <Link
            to={productPath(product.id)}
            className={`product-card product-card--${variant}`}
        >
            {/* 상품이미지 */}
            <div className="product-image">
                {imageUrl ? (
                    <img
                        src={imageUrl}
                        alt={product.name}
                        loading="lazy" />
                ) : (
                    <span className='image-placeholder'>
                        상품이미지
                    </span>
                )}

                {isSoldout && (
                    <span className='sold-out'>
                        SOLD OUT
                    </span>
                )}
            </div>

            {/* 상품정보 */}
            <div className="product-info">
                <h3 className="product-name">
                    {product.name}
                </h3>

                {/* 할인 전 가격 */}
                {isDiscount && regularPrice !== null && (
                    <span className='original-price'>
                        {regularPrice.toLocaleString()}원
                    </span>
                )}

                {/* 할인율 및 판매가 */}
                <div className="product-price">
                    {isDiscount &&
                        discountPercent !== null && (
                            <span className='discount'>
                                {discountPercent}%
                            </span>
                        )}

                    <span className='price'>
                        {price !== null
                            ? `${price.toLocaleString()}원`
                            : '가격 확인 필요'}
                    </span>
                </div>

                {/* 추천 사이즈가 있는 경우 */}
                {recommendedSize && (
                    <p className='recommended-size'>
                        추천 사이즈 {recommendedSize}
                    </p>
                )}
            </div>
        </Link>
    );
};
