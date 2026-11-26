import { Link, useNavigate } from 'react-router-dom';
import { Button } from '../../components/Button';
import { SectionTitle } from '../../components/SectionTitle';
import { ProductCard } from '../../components/ProductCard';
import { paths, categoryPath } from '../../router/paths';
import type { Product } from '../../types/product';
import productData from '../../data/products.json';
import '../scss/HomePage.scss';

export const HomePage = () => {
    const navigate = useNavigate();

    // 전체 상품 데이터
    const products = productData as Product[];

    // 메인 카테고리
    const categories = [
        { id: 'clothing', name: 'Clothing' },
        { id: 'home', name: 'Home' },
        { id: 'bag', name: 'Bag' },
        { id: 'walk', name: 'Walk' },
    ];

    // 신상품 4개 가져오기
    const newProducts = products.filter(
        (item) => item.categoryIds.includes('new')
    ).slice(0, 4);

    // 인기 상품 영역 (임시 상품 4개)
    const hotProducts = products.filter(
        (item) => !item.categoryIds.includes('new')
    ).slice(0, 4);

    console.log('신상품 데이터', newProducts);
    console.log('인기 상품 데이터', hotProducts);

    // 메인 페이지 상품 이미지 확인
    console.table(
        [...newProducts, ...hotProducts].map((item) => {
            const variant = item.variants.find(
                (v) => v.id === item.defaultVariantId
            ) || item.variants[0];

            return {
                상품명: item.name,
                색상: variant?.color,
                이미지URL: variant?.images.representative?.sourceUrl,
                로컬경로: variant?.images.representative?.localPath,
            };
        })
    );

    const productsWithImage = products.filter((item) =>
        item.variants.some(
            (v) => v.images.representative?.sourceUrl
        )
    );

    console.log('전체 상품 수:', products.length);
    console.log('이미지가 있는 상품 수:', productsWithImage.length);
    console.log('이미지가 있는 상품:', productsWithImage);

    return (
        <div className="home-page">
            {/* 메인비주얼 */}
            <section className="home-visual">
                <div className="inner">
                    <div className="visual-content">
                        <h1>반려견과 보호자가 함께 지내는 공간</h1>

                        <Button
                            width={340}
                            onClick={() => navigate(paths.fit)}>
                            우리 강아지 맞춤 상품 찾기
                        </Button>
                    </div>
                </div>
            </section>

            <div className="inner home-content">

                {/* 상품 카테고리 */}
                <section className="home-category">
                    <SectionTitle title="상품을 골라보세요" />

                    <div className="category-list">
                        {categories.map((item) => (
                            <Link
                                key={item.id}
                                to={categoryPath(item.id)}
                                className='category-card'>
                                <div className='category-image' />

                                <span className="category-name">
                                    {item.name}
                                </span>
                            </Link>
                        ))}
                    </div>
                </section>

                {/* 신상품 */}
                <section className="home-products home-new">
                    <SectionTitle title="New in" />

                    <div className="product-list">
                        {newProducts.map((item) => (
                            <ProductCard
                                key={item.id}
                                product={item}
                                variant="home"
                            />
                        ))}
                    </div>
                </section>

                {/* 인기 상품 영역 */}
                <section className="home-products home-hot">
                    <SectionTitle title="Hot" />

                    <div className="product-list">
                        {hotProducts.map((item) => (
                            <ProductCard
                                key={item.id}
                                product={item}
                                variant="home" />
                        ))}
                    </div>
                </section>

                {/* 룩북 */}
                <section className="home-lookbook">
                    <div className='lookbook-image' />

                    <div className="lookbook-content">
                        <div className="lookbook-text">
                            <SectionTitle title="강아지와 함께하는 집" />

                            <p>
                                사진 속 제품을 확인하고 내 공간에 어울리는지 살펴보세요
                            </p>
                        </div>

                        <Button
                            variant='outline'
                            width={248}
                            onClick={() => navigate(paths.lookbook)}>
                            룩북 보러가기
                        </Button>
                    </div>
                </section>
            </div>
        </div>
    );
};
