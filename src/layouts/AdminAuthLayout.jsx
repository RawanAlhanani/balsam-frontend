import React, { useEffect } from 'react';

const AdminAuthLayout = ({ children }) => {
    useEffect(() => {
        // Set body classes and attributes for admin theme
        document.body.className = "vertical-layout vertical-menu 1-column menu-expanded blank-page blank-page";
        document.body.setAttribute("data-open", "click");
        document.body.setAttribute("data-menu", "vertical-menu");
        document.body.setAttribute("data-col", "1-column");
        document.documentElement.style.height = '100%';
        document.body.style.height = '100%';
        document.body.style.overflow = 'auto';

        // Admin CSS files
        const adminCssFiles = [
            "/backend/app-assets/fonts/line-awesome/css/line-awesome.min.css",
            "/backend/app-assets/fonts/simple-line-icons/style.css",
            "/backend/app-assets/css-rtl/vendors.css",
            "/backend/app-assets/vendors/css/forms/icheck/icheck.css",
            "/backend/app-assets/vendors/css/forms/icheck/custom.css",
            "/backend/app-assets/css-rtl/app.css",
            "/backend/app-assets/css-rtl/custom-rtl.css",
            "/backend/app-assets/css-rtl/core/menu/menu-types/vertical-menu.css",
            "/backend/app-assets/css-rtl/core/colors/palette-gradient.css",
            "/backend/app-assets/css-rtl/pages/login-register.css",
            "/backend/assets/css/style-rtl.css"
        ];

        // Admin JS files (order matters)
        const adminJsFiles = [
            "/backend/app-assets/js/core/libraries/jquery.min.js", // Admin's own jQuery
            "https://cdnjs.cloudflare.com/ajax/libs/tether/1.4.7/js/tether.min.js", // Tether for Bootstrap 4
            "/backend/app-assets/js/core/libraries/bootstrap.min.js", // Admin's own Bootstrap
            "/backend/app-assets/vendors/js/ui/unison.min.js", // ADDED: Unison.js for breakpoint detection
            "/backend/app-assets/js/core/app-menu.js",
            "/backend/app-assets/js/core/app.js"
        ];

        const injectedElements = [];

        // Inject CSS files
        adminCssFiles.forEach(href => {
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
            for (const src of adminJsFiles) {
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
            document.body.className = "";
            document.body.removeAttribute("data-open");
            document.body.removeAttribute("data-menu");
            document.body.removeAttribute("data-col");
            document.documentElement.style.height = '';
            document.body.style.height = '';
            document.body.style.overflow = '';

            injectedElements.forEach(el => {
                if (el.parentNode) {
                    el.parentNode.removeChild(el);
                }
            });
        };
    }, []); // Empty dependency array means this runs once on mount and cleans up on unmount

    return <>{children}</>;
};

export default AdminAuthLayout;