import React, { useEffect, useState } from 'react';
import AdminHeader from '../components/Admin/AdminHeader';
import AdminSidebar from '../components/Admin/AdminSidebar';
import AdminFooter from '../components/Admin/AdminFooter';

const AdminLayout = ({ children }) => {
    const [isMenuExpanded, setIsMenuExpanded] = useState(true);

    const toggleMenu = (e) => {
        if (e) e.preventDefault();
        setIsMenuExpanded(!isMenuExpanded);
    };

    useEffect(() => {
        // Add admin specific classes to body
        const baseClasses = "vertical-layout vertical-menu 2-columns fixed-navbar";
        const menuClass = isMenuExpanded ? "menu-expanded" : "menu-collapsed";
        document.body.className = `${baseClasses} ${menuClass}`;
        
        document.body.setAttribute("data-open", "click");
        document.body.setAttribute("data-menu", "vertical-menu");
        document.body.setAttribute("data-col", "2-columns");

        // Dynamically load Admin CSS
        const adminStyles = [
            "/backend/app-assets/fonts/line-awesome/css/line-awesome.min.css",
            "/backend/app-assets/fonts/simple-line-icons/style.css",
            "/backend/app-assets/css-rtl/vendors.css",
            "/backend/app-assets/css-rtl/app.css",
            "/backend/app-assets/css-rtl/custom-rtl.css",
            "/backend/app-assets/css-rtl/core/menu/menu-types/vertical-menu.css",
            "/backend/app-assets/css-rtl/core/colors/palette-gradient.css",
            "/backend/assets/css/style-rtl.css"
        ];

        const adminScripts = [
            "/backend/app-assets/vendors/js/vendors.min.js",
            "/backend/app-assets/js/core/app-menu.js",
            "/backend/app-assets/js/core/app.js"
        ];

        const linkElements = adminStyles.map(href => {
            const link = document.createElement('link');
            link.rel = 'stylesheet';
            link.type = 'text/css';
            link.href = href;
            link.className = 'admin-style';
            document.head.appendChild(link);
            return link;
        });

        const scriptElements = adminScripts.map(src => {
            const script = document.createElement('script');
            script.src = src;
            script.className = 'admin-script';
            script.async = false;
            document.body.appendChild(script);
            return script;
        });

        return () => {
            // Clean up admin styles and scripts when leaving admin section
            document.body.className = "";
            document.body.removeAttribute("data-open");
            document.body.removeAttribute("data-menu");
            document.body.removeAttribute("data-col");
            linkElements.forEach(link => {
                if (link.parentNode) link.parentNode.removeChild(link);
            });
            scriptElements.forEach(script => {
                if (script.parentNode) script.parentNode.removeChild(script);
            });
        };
    }, [isMenuExpanded]);

    return (
        <div className="admin-wrapper">
            <AdminHeader toggleMenu={toggleMenu} />
            <AdminSidebar isExpanded={isMenuExpanded} />
            {children}
            <AdminFooter />
        </div>
    );
};

export default AdminLayout;
