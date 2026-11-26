import { Outlet } from 'react-router-dom';
import ScrollToTop from '../router/ScrollToTop';
import { Header } from '../components/Header';
import { Footer } from '../components/Footer';

export default function RootLayout() {
    return (
        <>
            <ScrollToTop />

            <Header />

            <main>
                <Outlet />
            </main>

            <Footer />
        </>
    );
}