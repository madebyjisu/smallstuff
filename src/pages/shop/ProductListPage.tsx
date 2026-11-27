import { useState } from 'react';
import { Link, NavLink, useParams } from 'react-router-dom';
import { SectionTitle } from '../../components/SectionTitle';
import { Select } from '../../components/Select';
import { ProductCard } from '../../components/ProductCard';
import { paths, categoryPath } from '../../router/paths';
import type { Product } from '../../types/product';
import productData from '../../data/products.json';
import categories from '../../data/categories.json';
import NotFoundPage from '../system/NotFoundPage';
import '../scss/ProductListPage.scss';

export const ProductListPage = () => {

    // 현재 URL의 카테고리 ID 가져오기
    const { categoryId } = useParams();

    // 전체 상품 데이터
    const products = productData as Product[];

    // 상품 정렬 상태
    const [sort, setSort] = useState('default');

    // 현재 선택한 카테고리
    const currentCategory = categories.find(
        (item) => item.id === categoryId
    );

    // 존재하지 않는 카테고리 처리
    if (categoryId && !currentCategory) {
        return <NotFoundPage />;
    }

    // 대분류 카테고리 가져오기
    const mainCategories = categories.filter(
        (item) => item.parentId === null
    );

    // 현재 대분류 ID 확인
    const parentId =
        currentCategory?.parentId || currentCategory?.id;

    // 현재 대분류의 하위 카테고리 가져오기
    const subCategories = categories.filter(
        (item) => item.parentId === parentId
    );

    // 대분류 카테고리 정보
    const parentCategory = categories.find(
        (item) => item.id === parentId
    );

    // 카테고리에 해당하는 상품 필터링
    const filteredProducts = products.filter((item) =>
        categoryId
            ? item.categoryIds.includes(categoryId)
            : true
    );

    // 현재 카테고리에 해당하는 대표 색상 선택
    const productList = filteredProducts.map((item) => {

        const matchingVariants = item.variants.filter(
            (v) => !categoryId ||
                v.categoryIds.includes(categoryId)
        );

        const selectedVariant = matchingVariants.find(
            (v) => v.id === item.defaultVariantId
        ) || matchingVariants[0];

        return {
            product: item,
            selectedVariant,
        };
    });

    // 상품 정렬
    const sortedProducts = [...productList].sort((a, b) => {

        const priceA = a.selectedVariant?.displayPrice;
        const priceB = b.selectedVariant?.displayPrice;

        if (sort === 'price-low' || sort === 'price-high') {

            // 가격 정보가 없는 상품은 뒤로 배치
            if (priceA == null) return priceB == null ? 0 : 1;
            if (priceB == null) return -1;

            return sort === 'price-low'
                ? priceA - priceB
                : priceB - priceA;
        }

        if (sort === 'name') {
            return a.product.name.localeCompare(b.product.name);
        }

        return 0;
    });

    // 정렬 드롭다운 옵션
    const sortOptions = [
        { value: 'default', label: '기본순' },
        { value: 'price-low', label: '낮은 가격순' },
        { value: 'price-high', label: '높은 가격순' },
        { value: 'name', label: '상품명순' },
    ];

    return (
        <div className="product-list-page inner">

            {/* 현재 페이지 경로 */}
            <div className="breadcrumb">
                <Link to={paths.home}>Home</Link>
                <span>/</span>
                <Link to={paths.shop}>Shop</Link>

                {parentCategory && (
                    <>
                        <span>/</span>
                        <Link to={categoryPath(parentCategory.id)}>
                            {parentCategory.name}
                        </Link>
                    </>
                )}

                {currentCategory?.parentId && (
                    <>
                        <span>/</span>
                        <span>{currentCategory.name}</span>
                    </>
                )}
            </div>

            {/* 페이지 제목 및 카테고리 */}
            <section className="list-category">

                <SectionTitle
                    title={currentCategory?.name || 'Shop'}
                    align="center"
                    size="large"
                />

                {/* 대분류 카테고리 */}
                <nav className="main-category">
                    <NavLink
                        to={paths.shop}
                        end
                        className={!categoryId ? 'active' : ''}
                    >
                        All
                    </NavLink>

                    {mainCategories.map((item) => (
                        <Link
                            key={item.id}
                            to={categoryPath(item.id)}
                            className={
                                parentId === item.id ? 'active' : ''
                            }
                        >
                            {item.name}
                        </Link>
                    ))}
                </nav>

                {/* 소분류 카테고리 */}
                {subCategories.length > 0 && parentId && (
                    <nav className="sub-category">

                        <NavLink
                            to={categoryPath(parentId)}
                            end
                        >
                            All
                        </NavLink>

                        {subCategories.map((item) => (
                            <NavLink
                                key={item.id}
                                to={categoryPath(item.id)}
                                end
                            >
                                {item.name}
                            </NavLink>
                        ))}
                    </nav>
                )}
            </section>

            {/* 상품 리스트 */}
            <section className="list-content">

                {/* 상품 개수 및 정렬 */}
                <div className="list-toolbar">

                    <p className="product-count">
                        총 <strong>{sortedProducts.length}</strong>개의 상품
                    </p>

                    <Select
                        options={sortOptions}
                        value={sort}
                        width={170}
                        onChange={(e) => setSort(e.target.value)}
                    />
                </div>

                {/* 상품 카드 반복 출력 */}
                {sortedProducts.length > 0 ? (
                    <div className="product-grid">
                        {sortedProducts.map((item) => (
                            <ProductCard
                                key={item.product.id}
                                product={item.product}
                                variantId={
                                    item.selectedVariant?.id !==
                                    item.product.defaultVariantId
                                        ? item.selectedVariant?.id
                                        : undefined
                                }
                                variant="list"
                            />
                        ))}
                    </div>
                ) : (
                    <div className="empty-products">
                        등록된 상품이 없습니다.
                    </div>
                )}
            </section>
        </div>
    );
};