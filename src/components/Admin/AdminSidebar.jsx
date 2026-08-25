import React, { useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import { getCurrentUserPermissions } from '../../api';

const AdminSidebar = ({ isExpanded, onNavigate }) => {
    const [openMenus, setOpenMenus] = useState({});
    const [permissions, setPermissions] = useState([]);
    const [permissionsLoaded, setPermissionsLoaded] = useState(false);
    const adminRole = localStorage.getItem('admin_role');

    useEffect(() => {
        const fetchPermissions = async () => {
            try {
                const res = await getCurrentUserPermissions();
                setPermissions(res.data.permissions || []);
            } catch (err) {
                console.error('Failed to fetch permissions:', err);
            } finally {
                setPermissionsLoaded(true);
            }
        };
        fetchPermissions();
    }, []);

    const hasPermission = (permissionName) => {
        // President has all permissions
        if (adminRole === 'president') return true;
        // If permissions not loaded yet, return false to hide items
        if (!permissionsLoaded) return false;
        return permissions.includes(permissionName);
    };

    const toggleMenu = (menu) => {
        setOpenMenus(prev => ({ ...prev, [menu]: !prev[menu] }));
    };

    const menuItems = [
        {
            title: "المسجلين",
            icon: "la-users",
            to: "/admin/parents",
            permission: "view_tuteurs"
        },
        {
            title: "طلبات التدريب", 
            icon: "la-user-plus",  
            to: "/admin/interns",
            permission: "view_stagiaires"
        },
        {
            title: "طلبات التطوع", 
            icon: "la-heart-o",  
            to: "/admin/volunteers",
            permission: "view_volunteers"
        },
        {
            title: "الأنشطة",
            icon: "la-calendar",
            to: "/admin/activities",
            permission: "view_activities"
        },
        {
            title: "الأخبار",
            icon: "la-newspaper-o",
            to: "/admin/news",
            permission: "view_news"
        },
        {
            title: "الشركاء",
            icon: "la-users",
            to: "/admin/partners",
            permission: "view_partners"
        },
        {
            title: "الصور والمعرض",
            icon: "la-image",
            to: "/admin/media",
            permission: "view_gallery"
        },
        {
            title: "الصفحات الثابتة",
            icon: "la-file-text",
            to: "/admin/static-pages",
            permission: "view_static_pages"
        },
        {
            title: "رسائل التواصل",
            icon: "la-envelope",
            to: "/admin/contact-messages",
            permission: "view_contact_messages"
        }
    ];

    // Permission-based items
    const permissionItems = [];
    
    if (hasPermission('view_meetings')) {
        permissionItems.push({
            title: "الاجتماعات",
            icon: "la-comments",
            to: "/admin/meetings"
        });
    }
    
    if (hasPermission('view_activity_reports')) {
        permissionItems.push({
            title: "تقارير الأنشطة",
            icon: "la-clipboard",
            to: "/admin/activity-reports"
        });
    }
    
    if (hasPermission('view_finance')) {
        permissionItems.push({
            title: "المالية",
            icon: "la-money",
            to: "/admin/finance"
        });
    }

    // Settings (The only one keeping a dropdown as it has multiple unique pages)
    const settingsMenu = {
        title: "إعدادات النظام",
        icon: "la-cog",
        subItems: []
    };
    
    if (hasPermission('view_settings')) {
        settingsMenu.subItems.push({ title: "الإعدادات العامة", to: "/admin/settings" });
    }
    
    if (hasPermission('view_users')) {
        settingsMenu.subItems.push({ title: "حسابات الإدارة", to: "/admin/admins" });
    }
    
    if (hasPermission('view_permissions')) {
        settingsMenu.subItems.push({ title: "إدارة الصلاحيات", to: "/admin/permissions" });
    }

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

                    {/* Direct Links - Filter by permissions */}
                    {[...menuItems, ...permissionItems]
                        .filter(item => !item.permission || hasPermission(item.permission))
                        .filter(item => !item.permission || permissionsLoaded)
                        .map((item, idx) => (
                        <li key={idx} className="nav-item">
                            <NavLink to={item.to} onClick={onNavigate} className={({ isActive }) => isActive ? 'active-admin-link' : ''}>
                                <i className={`la ${item.icon}`}></i>
                                <span className="menu-title">{item.title}</span>
                            </NavLink>
                        </li>
                    ))}

                    {/* Settings Dropdown - Only show if has sub items */}
                    {settingsMenu.subItems.length > 0 && (
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