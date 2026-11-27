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
        {
            id: 'clothing',
            name: 'Clothing',
            image: '/images/home/category-clothing.jpg',
        },
        {
            id: 'home',
            name: 'Home',
            image: '/images/home/category-home.png',
        },
        {
            id: 'bag',
            name: 'Bag',
            image: '/images/home/category-bag.jpg',
        },
        {
            id: 'walk',
            name: 'Walk',
            image: '/images/home/category-walk.jpg',
        },
    ];

    // New in 노출 상품 옵션
    const newProducts = [
        'ss-352', // Striped t-shirt Peach pink
        'ss-388', // Dig step boucle White
        'ss-370', // Cloud carry bag 2 Pale blue
        'ss-255', // Rest bed fleece Beige
    ];

    // Hot 노출 상품 옵션
    const hotProducts = [
        'ss-293', // Check Cotton Pajama Shirt Beige
        'ss-126', // Walk jacket Lavender
        'ss-195', // Extended step Vegan leather Brown
        'ss-306', // Rest bed striped Mist blue
    ];

    // 옵션 ID에 해당하는 상품 카드 출력
    const renderProducts = (variantIds: string[]) => {
        return variantIds.map((variantId) => {

            // 해당 색상 옵션이 포함된 통합 상품 찾기
            const product = products.find((item) =>
                item.variants.some((v) => v.id === variantId)
            );

            // 상품이 없는 경우 출력하지 않음
            if (!product) return null;

            return (
                <ProductCard
                    key={variantId}
                    product={product}
                    variantId={variantId}
                    variant="home"
                />
            );
        });
    };

    return (
        <div className="home-page">

            {/* 메인 비주얼 */}
            <section className="home-visual">
                <div className="inner">
                    <div className="visual-content">
                        <h1>
                            반려견과 보호자가 함께 지내는 공간
                        </h1>

                        <Button
                            width={340}
                            onClick={() => navigate(paths.fit)}
                        >
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
                                className="category-card"
                            >
                                <div className="category-image">
                                    <img
                                        src={item.image}
                                        alt={item.name}
                                    />
                                </div>

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
                        {renderProducts(newProducts)}
                    </div>
                </section>

                {/* 인기 상품 */}
                <section className="home-products home-hot">
                    <SectionTitle title="Hot" />

                    <div className="product-list">
                        {renderProducts(hotProducts)}
                    </div>
                </section>

                {/* 룩북 */}
                <section className="home-lookbook">
                    <div className="lookbook-image" />

                    <div className="lookbook-content">
                        <div className="lookbook-text">
                            <SectionTitle title="강아지와 함께하는 집" />

                            <p>
                                사진 속 제품을 확인하고 내 공간에
                                어울리는지 살펴보세요.
                            </p>
                        </div>

                        <Button
                            variant="outline"
                            width={248}
                            onClick={() => navigate(paths.lookbook)}
                        >
                            룩북 보러가기
                        </Button>
                    </div>
                </section>
            </div>
        </div>
    );
};