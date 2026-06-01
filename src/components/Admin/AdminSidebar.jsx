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
            title: "المسجلين في الموقع",
            icon: "la-home",
            subItems: [
                { title: "أولياء الأمور وأبناؤهم", to: "/admin/tuteurs" }
            ]
        },
        {
            title: "الأنشطة",
            icon: "la-calendar",
            subItems: [
                { title: "جميع الأنشطة", to: "/admin/activites" },
                { title: "إضافة نشاط", to: "/admin/ajoutActivite" }
            ]
        },
        {
            title: "الأخبار",
            icon: "la-newspaper-o",
            subItems: [
                { title: "جميع الأخبار", to: "/admin/infos" },
                { title: "إضافة خبر", to: "/admin/ajoutInfo" }
            ]
        },
        {
            title: "الشركاء",
            icon: "la-handshake-o",
            subItems: [
                { title: "جميع الشركاء", to: "/admin/partenaires" },
                { title: "إضافة شريك", to: "/admin/ajoutPartenaire" }
            ]
        },
        {
            title: "الصور والمعرض",
            icon: "la-image",
            subItems: [
                { title: "إدارة الصور", to: "/admin/images" }
            ]
        },
        {
            title: "الصفحات الثابتة",
            icon: "la-file-text",
            subItems: [
                { title: "إدارة الصفحات", to: "/admin/pages" }
            ]
        }
    ];

    // Only President can see system settings and admin accounts
    if (adminRole === 'president') {
        menuItems.push({
            title: "إعدادات النظام",
            icon: "la-cog",
            subItems: [
                { title: "الإعدادات العامة", to: "/admin/settings" },
                { title: "حسابات الإدارة", to: "/admin/admins" }
            ]
        });
    }

    const handleLogout = (e) => {
        e.preventDefault();
        localStorage.removeItem('admin_token');
        localStorage.removeItem('is_admin');
        window.location.href = '/connecte';
    };

    return (
        <div className={`main-menu menu-fixed menu-light menu-accordion menu-shadow ${!isExpanded ? 'menu-hide' : ''}`} data-scroll-to-active="true">
            <div className="main-menu-content">
                <ul className="navigation navigation-main" id="main-menu-navigation">
                    <li className="nav-item">
                        <Link to="/admin/dashboard"><i className="la la-dashboard"></i><span className="menu-title">لوحة التحكم</span></Link>
                    </li>
                    {menuItems.map((item, idx) => (
                        <li key={idx} className={`nav-item ${openMenus[item.title] ? 'open' : ''}`}>
                            <a href="#" onClick={(e) => { e.preventDefault(); toggleMenu(item.title); }}>
                                <i className={`la ${item.icon}`}></i>
                                <span className="menu-title">{item.title}</span>
                            </a>
                            <ul className="menu-content" style={{ display: openMenus[item.title] ? 'block' : 'none' }}>
                                {item.subItems.map((sub, sIdx) => (
                                    <li key={sIdx}>
                                        <Link className="menu-item" to={sub.to}>{sub.title}</Link>
                                    </li>
                                ))}
                            </ul>
                        </li>
                    ))}
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
