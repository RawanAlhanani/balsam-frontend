import { useEffect } from 'react';

const useFrontendAssets = () => {
    useEffect(() => {
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
            "/content/view/themes/balsam/assests/sliderpro/css/slider-pro.min.css",
            "/content/view/themes/balsam/assests/style.css",
            "/content/view/themes/balsam/assests/css/lightbox.min.css",
            "/content/view/themes/balsam/assests/css/responsive.css",
            "/content/view/themes/balsam/assests/css/rtl.css"
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
            "/content/view/themes/balsam/assests/sliderpro/js/jquery.sliderPro.min.js",
            "/content/view/themes/balsam/assests/js/lightbox.js",
            "/content/view/themes/balsam/assests/youtube/YouTubePopUp.jquery.js",
            "/content/view/themes/balsam/assests/js/custom.js",
            "/content/view/themes/balsam/assests/js/client_side_validation.js"
        ];

        const styleElements = styles.map(href => {
            const link = document.createElement('link');
            link.rel = 'stylesheet';
            link.href = href;
            link.className = 'frontend-style';
            document.head.appendChild(link);
            return link;
        });

        const scriptElements = scripts.map(src => {
            const script = document.createElement('script');
            script.src = src;
            script.async = false; // Load in order
            script.className = 'frontend-script';
            document.body.appendChild(script);
            return script;
        });

        return () => {
            styleElements.forEach(el => el.remove());
            scriptElements.forEach(el => el.remove());
        };
    }, []);
};

export default useFrontendAssets;
