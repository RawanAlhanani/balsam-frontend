import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';

const AdminSidebar = ({ isExpanded, onNavigate }) => {
    const [openMenus, setOpenMenus] = useState({});
    const adminRole = localStorage.getItem('admin_role');

    const toggleMenu = (menu) => {
        setOpenMenus(prev => ({ ...prev, [menu]: !prev[menu] }));
    };

    const menuItems = [
        {
            title: "المسجلين",
            icon: "la-users",
            to: "/admin/parents"
        },
        {
            title: "طلبات التدريب", 
            icon: "la-user-plus",  
            to: "/admin/interns"
        },
        {
            title: "طلبات التطوع", 
            icon: "la-heart-o",  
            to: "/admin/volunteers"
        },
        {
            title: "الأنشطة",
            icon: "la-calendar",
            to: "/admin/activities"
        },
        {
            title: "الأخبار",
            icon: "la-newspaper-o",
            to: "/admin/news"
        },
        {
            title: "الشركاء",
            icon: "la-users", // Changed from la-handshake-o for testing
            to: "/admin/partners"
        },
        {
            title: "الصور والمعرض",
            icon: "la-image",
            to: "/admin/media"
        },
        {
            title: "الصفحات الثابتة",
            icon: "la-file-text",
            to: "/admin/static-pages"
        },
        {
            title: "رسائل التواصل",
            icon: "la-envelope",
            to: "/admin/contact-messages"
        }
    ];

    // Role-based simple items
    const roleItems = [];
    if (adminRole === 'president' || adminRole === 'secretary' || adminRole === 'vice_secretary') {
        roleItems.push({
            title: "الاجتماعات",
            icon: "la-comments",
            to: "/admin/meetings"
        });
        roleItems.push({
            title: "تقارير الأنشطة",
            icon: "la-clipboard",
            to: "/admin/activity-reports"
        });
    }

    if (adminRole === 'president' || adminRole === 'treasurer' || adminRole === 'vice_treasurer') {
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
            <div className="main-menu-content" style={{ overflowY: 'auto', maxHeight: 'calc(100vh - 60px)' }}> {/* Added scrolling styles */}
                <ul className="navigation navigation-main" id="main-menu-navigation">
                    <li className="nav-item">
                        <NavLink to="/admin/dashboard" onClick={onNavigate} className={({ isActive }) => isActive ? 'active-admin-link' : ''}>
                            <i className="la la-dashboard"></i><span className="menu-title">لوحة التحكم</span>
                        </NavLink>
                    </li>

                    {/* Direct Links */}
                    {[...menuItems, ...roleItems].map((item, idx) => (
                        <li key={idx} className="nav-item">
                            <NavLink to={item.to} onClick={onNavigate} className={({ isActive }) => isActive ? 'active-admin-link' : ''}>
                                <i className={`la ${item.icon}`}></i>
                                <span className="menu-title">{item.title}</span>
                            </NavLink>
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
                                        <NavLink className={({ isActive }) => isActive ? 'menu-item active-admin-link' : 'menu-item'} to={sub.to} onClick={onNavigate}>{sub.title}</NavLink>
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