import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const AdminSidebar = ({ isExpanded }) => {
    const [openMenus, setOpenMenus] = useState({});
    const adminRole = localStorage.getItem('admin_role');

    const toggleMenu = (menu) => {
        setOpenMenus(prev => ({ ...prev, [menu]: !prev[menu] }));
    };

    const menuItems = [
        {
            title: "المسجلين",
            icon: "la-users",
            to: "/admin/tuteurs"
        },
        {
            title: "الأنشطة",
            icon: "la-calendar",
            to: "/admin/activites"
        },
        {
            title: "الأخبار",
            icon: "la-newspaper-o",
            to: "/admin/infos"
        },
        {
            title: "الشركاء",
            icon: "la-handshake-o",
            to: "/admin/partenaires"
        },
        {
            title: "الصور والمعرض",
            icon: "la-image",
            to: "/admin/images"
        },
        {
            title: "الصفحات الثابتة",
            icon: "la-file-text",
            to: "/admin/pages"
        }
    ];

    // Role-based simple items
    const roleItems = [];
    if (adminRole === 'president' || adminRole === 'secretary') {
        roleItems.push({
            title: "الاجتماعات",
            icon: "la-comments",
            to: "/admin/meetings"
        });
    }

    if (adminRole === 'president' || adminRole === 'treasurer') {
        roleItems.push({
            title: "المالية",
            icon: "la-money",
            to: "/admin/finance"
        });
    }

    // Settings (The only one keeping a dropdown as it has multiple unique pages)
    const settingsMenu = {
        title: "إعدادات النظام",
        icon: "la-cog",
        subItems: [
            { title: "الإعدادات العامة", to: "/admin/settings" },
            { title: "حسابات الإدارة", to: "/admin/admins" }
        ]
    };

    const handleLogout = (e) => {
        e.preventDefault();
        localStorage.removeItem('admin_token');
        localStorage.removeItem('is_admin');
        localStorage.removeItem('admin_role');
        window.location.href = '/connecte';
    };

    return (
        <div className={`main-menu menu-fixed menu-light menu-accordion menu-shadow ${!isExpanded ? 'menu-hide' : ''}`} data-scroll-to-active="true">
            <div className="main-menu-content">
                <ul className="navigation navigation-main" id="main-menu-navigation">
                    <li className="nav-item">
                        <Link to="/admin/dashboard"><i className="la la-dashboard"></i><span className="menu-title">لوحة التحكم</span></Link>
                    </li>
                    
                    {/* Direct Links */}
                    {[...menuItems, ...roleItems].map((item, idx) => (
                        <li key={idx} className="nav-item">
                            <Link to={item.to}>
                                <i className={`la ${item.icon}`}></i>
                                <span className="menu-title">{item.title}</span>
                            </Link>
                        </li>
                    ))}

                    {/* Settings Dropdown */}
                    {adminRole === 'president' && (
                        <li className={`nav-item ${openMenus[settingsMenu.title] ? 'open' : ''}`}>
                            <a href="#" onClick={(e) => { e.preventDefault(); toggleMenu(settingsMenu.title); }}>
                                <i className={`la ${settingsMenu.icon}`}></i>
                                <span className="menu-title">{settingsMenu.title}</span>
                            </a>
                            <ul className="menu-content" style={{ display: openMenus[settingsMenu.title] ? 'block' : 'none' }}>
                                {settingsMenu.subItems.map((sub, sIdx) => (
                                    <li key={sIdx}>
                                        <Link className="menu-item" to={sub.to}>{sub.title}</Link>
                                    </li>
                                ))}
                            </ul>
                        </li>
                    )}

                    <li className="nav-item">
                        <a href="#" onClick={handleLogout} className="text-danger">
                            <i className="la la-power-off"></i><span className="menu-title">تسجيل الخروج</span>
                        </a>
                    </li>
                </ul>
            </div>
        </div>
    );
};

export default AdminSidebar;