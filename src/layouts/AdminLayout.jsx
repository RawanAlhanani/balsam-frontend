import React, { useEffect, useState } from 'react';
import AdminHeader from '../components/Admin/AdminHeader';
import AdminSidebar from '../components/Admin/AdminSidebar';
import AdminFooter from '../components/Admin/AdminFooter';
import './admin.css';

const AdminLayout = ({ children }) => {
    const [isMenuExpanded, setIsMenuExpanded] = useState(true);

    const toggleMenu = (e) => {
        if (e) e.preventDefault();
        setIsMenuExpanded(!isMenuExpanded);
    };

    useEffect(() => {
        // Set body classes and attributes for admin theme
        const baseClasses = ["vertical-layout", "vertical-menu", "2-columns", "fixed-navbar"];
        const menuClass = isMenuExpanded ? "menu-expanded" : "menu-collapsed";
        document.body.classList.add(...baseClasses, menuClass);
        
        document.body.setAttribute("data-open", "click");
        document.body.setAttribute("data-menu", "vertical-menu");
        document.body.setAttribute("data-col", "2-columns");
        document.documentElement.style.height = '100%'; // Ensure full height for admin layout
        document.body.style.height = '100%';
        document.body.style.overflow = 'auto';

        // Admin CSS files
        const adminCssFiles = [
            "/backend/app-assets/fonts/line-awesome/css/line-awesome.min.css",
            "/backend/app-assets/fonts/simple-line-icons/style.css",
            "/backend/app-assets/css-rtl/vendors.css",
            "/backend/app-assets/vendors/css/forms/icheck/icheck.css", // Specific form vendor CSS
            "/backend/app-assets/vendors/css/forms/icheck/custom.css", // Specific form vendor CSS
            "/backend/app-assets/css-rtl/app.css",
            "/backend/app-assets/css-rtl/custom-rtl.css",
            "/backend/app-assets/css-rtl/core/menu/menu-types/vertical-menu.css",
            "/backend/app-assets/css-rtl/core/colors/palette-gradient.css",
            "/backend/assets/css/style-rtl.css"
        ];

        // Admin JS files (order matters)
        const adminJsFiles = [
            "/backend/app-assets/js/core/libraries/jquery.min.js", // Admin's own jQuery
            "https://cdnjs.cloudflare.com/ajax/libs/tether/1.4.7/js/tether.min.js", // Tether for Bootstrap 4
            "/backend/app-assets/js/core/libraries/bootstrap.min.js", // Admin's own Bootstrap
            "/backend/app-assets/vendors/js/vendors.min.js", // Main vendor bundle
            "/backend/app-assets/vendors/js/ui/unison.min.js", // ADDED: Unison.js for breakpoint detection
            "/backend/app-assets/vendors/js/ui/perfect-scrollbar.jquery.min.js", // Example of a specific vendor script
            "/backend/app-assets/vendors/js/menu/jquery.mmenu.all.min.js", // Example of a specific vendor script
            "/backend/app-assets/vendors/js/forms/icheck/icheck.min.js", // Example of a specific vendor script
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
            // Remove body classes and attributes
            document.body.classList.remove(...baseClasses, "menu-expanded", "menu-collapsed");
            document.body.removeAttribute("data-open");
            document.body.removeAttribute("data-menu");
            document.body.removeAttribute("data-col");
            document.documentElement.style.height = '';
            document.body.style.height = '';
            document.body.style.overflow = '';

            // Remove injected elements
            injectedElements.forEach(el => {
                if (el.parentNode) {
                    el.parentNode.removeChild(el);
                }
            });
        };
    }, [isMenuExpanded]); // Re-run effect if menu expansion changes

    return (
        <div className="admin-wrapper admin-theme">
            <AdminHeader toggleMenu={toggleMenu} />
            <AdminSidebar isExpanded={isMenuExpanded} />
            <div className="app-content content"> {/* This div is part of the admin theme structure */}
                <div className="content-wrapper">
                    <div className="content-body">
                        {children}
                    </div>
                </div>
            </div>
            <AdminFooter />
        </div>
    );
};

export default AdminLayout;