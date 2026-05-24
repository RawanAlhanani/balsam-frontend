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

        // Handle preloader
        const preloader = document.getElementById('preloader');
        const status = document.getElementById('status');
        if (preloader && status) {
            status.style.display = 'block';
            preloader.style.display = 'block';
            
            setTimeout(() => {
                status.style.display = 'none';
                preloader.style.display = 'none';
            }, 500);
        }

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
            <div id="preloader">
                <div id="status"></div>
            </div>
        </div>
    );
};

export default MainLayout;
