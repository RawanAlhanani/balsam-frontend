import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import Header from '../components/Header/Header';
import Footer from '../components/Footer/Footer';
import useFrontendAssets from '../hooks/useFrontendAssets';

const MainLayout = ({ children }) => {
    const { pathname } = useLocation();
    useFrontendAssets(); // Dynamic loading of frontend CSS/JS

    useEffect(() => {
        // Scroll to top on route change
        window.scrollTo(0, 0);

        // Re-initialize theme elements if necessary
        if (window.jQuery) {
            window.jQuery(window).trigger('resize');
        }
    }, [pathname]);

    return (
        <div className="eco_wrapper">
            <Header />
            {children}
            <Footer />
        </div>
    );
};

export default MainLayout;
