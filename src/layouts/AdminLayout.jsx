import React, { useEffect } from 'react';
import AdminHeader from '../components/Admin/AdminHeader';
import AdminSidebar from '../components/Admin/AdminSidebar';
import AdminFooter from '../components/Admin/AdminFooter';

const AdminLayout = ({ children }) => {
    useEffect(() => {
        // Add admin specific classes to body
        document.body.className = "vertical-layout vertical-menu 2-columns menu-expanded fixed-navbar";
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

        const linkElements = adminStyles.map(href => {
            const link = document.createElement('link');
            link.rel = 'stylesheet';
            link.type = 'text/css';
            link.href = href;
            link.className = 'admin-style';
            document.head.appendChild(link);
            return link;
        });

        return () => {
            // Clean up admin styles when leaving admin section
            document.body.className = "";
            document.body.removeAttribute("data-open");
            document.body.removeAttribute("data-menu");
            document.body.removeAttribute("data-col");
            linkElements.forEach(link => {
                if (link.parentNode) {
                    link.parentNode.removeChild(link);
                }
            });
        };
    }, []);

    return (
        <div className="admin-wrapper">
            <AdminHeader />
            <AdminSidebar />
            {children}
            <AdminFooter />
        </div>
    );
};

export default AdminLayout;
