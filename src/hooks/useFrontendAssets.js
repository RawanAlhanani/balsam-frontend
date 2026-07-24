import { useEffect } from 'react';

const useFrontendAssets = () => {
    const styles = [
        "/content/view/themes/balsam/assests/css/bootstrap.min.css",
        "/content/view/themes/balsam/assests/css/font-awesome.css",
        "/content/view/themes/balsam/assests/css/chosen.min.css",
        "/content/view/themes/balsam/assests/css/slick-slider.css",
        "/content/view/themes/balsam/assests/css/jquery.bxslider.css",
        "/content/view/themes/balsam/assests/css/prettyPhoto.css",
        "/content/view/themes/balsam/assests/js/responsive-menu/component.css",
        "/content/view/themes/balsam/assests/css/svg-icons.css",
        "/content/view/themes/balsam/assests/css/typography.css",
        "/content/view/themes/balsam/assests/css/jquery.auto-complete.css",
        "/content/view/themes/balsam/assests/css/shortcodes.css",
        "/content/view/themes/balsam/assests/css/colors.css",
        "/content/view/themes/balsam/assests/style.css",
        "/content/view/themes/balsam/assests/css/lightbox.min.css",
        "/content/view/themes/balsam/assests/css/responsive.css",
        "/content/view/themes/balsam/assests/css/rtl.css",
        "/styles/modern-theme.css"
    ];

    const scripts = [
        "/content/view/themes/balsam/assests/js/jquery.js",
        "/content/view/themes/balsam/assests/js/bootstrap-lab.js",
        "/content/view/themes/balsam/assests/js/bootstrap.js",
        "/content/view/themes/balsam/assests/js/responsive-menu/modernizr.custom.js",
        "/content/view/themes/balsam/assests/js/responsive-menu/jquery.dlmenu.js",
        "/content/view/themes/balsam/assests/js/jquery-filterable.js",
        "/content/view/themes/balsam/assests/js/masonry-gallery.js",
        "/content/view/themes/balsam/assests/js/chosen.jquery.min.js",
        "/content/view/themes/balsam/assests/js/jquery.auto-complete.js",
        "/content/view/themes/balsam/assests/js/jquery.prettyPhoto.js",
        "/content/view/themes/balsam/assests/js/countup.js",
        "/content/view/themes/balsam/assests/js/jquery.countdown.js",
        "/content/view/themes/balsam/assests/js/slick-slider.js",
        "/content/view/themes/balsam/assests/js/jquery.bxslider.js",
        "/content/view/themes/balsam/assests/js/owl.carousel.js",
        "/content/view/themes/balsam/assests/js/lightbox.js",
        "/content/view/themes/balsam/assests/youtube/YouTubePopUp.jquery.js",
        "/content/view/themes/balsam/assests/js/custom.js",
        "/content/view/themes/balsam/assests/js/client_side_validation.js"
    ];

    useEffect(() => {
        const injectedElements = [];

        // Inject CSS files
        styles.forEach(href => {
            const link = document.createElement('link');
            link.rel = 'stylesheet';
            link.type = 'text/css';
            link.href = href;
            document.head.appendChild(link);
            injectedElements.push(link);
        });

        // Inject JS files
        const injectScript = (src) => {
            return new Promise((resolve, reject) => {
                const script = document.createElement('script');
                script.src = src;
                script.async = false; // Ensure scripts load in order
                script.onload = resolve;
                script.onerror = reject;
                document.body.appendChild(script);
                injectedElements.push(script);
            });
        };

        const loadScripts = async () => {
            for (const src of scripts) {
                try {
                    await injectScript(src);
                } catch (error) {
                    console.error(`Failed to load script: ${src}`, error);
                }
            }
        };

        loadScripts();

        // Cleanup function
        return () => {
            injectedElements.forEach(el => {
                if (el.parentNode) {
                    el.parentNode.removeChild(el);
                }
            });
        };
    }, []); // Empty dependency array means this runs once on mount and cleans up on unmount
};

export default useFrontendAssets;