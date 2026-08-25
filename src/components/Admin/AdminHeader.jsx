import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

const AdminHeader = ({ toggleMenu }) => {
    const navigate = useNavigate();
    const adminRole = localStorage.getItem('admin_role');

    const roleLabels = {
        president: 'رئيس الجمعية',
        vice_president: 'نائب الرئيس',
        secretary: 'الكاتب العام',
        vice_secretary: 'نائب الكاتب العام',
        treasurer: 'أمين المال',
        vice_treasurer: 'نائب أمين المال',
    };

    const handleLogout = (e) => {
        e.preventDefault();
        localStorage.removeItem('admin_token');
        localStorage.removeItem('is_admin');
        localStorage.removeItem('admin_role');
        navigate('/connecte');
    };

    return (
        <nav className="header-navbar navbar-expand-md navbar navbar-with-menu fixed-top navbar-shadow">
            <div className="navbar-wrapper">
                <div className="navbar-header">
                    <ul className="nav navbar-nav flex-row">
                        <li className="nav-item mobile-menu d-md-none mr-auto">
                            <a className="nav-link nav-menu-main menu-toggle hidden-xs" href="#" onClick={toggleMenu}>
                                <i className="ft-menu font-large-1"></i>
                            </a>
                        </li>
                        <li className="nav-item">
                            <Link className="navbar-brand" to="/admin/dashboard">
                                <img className="brand-logo" alt="شعار بلسم" src="/backend/app-assets/images/logo/logo.png" />
                                <h3 className="brand-text">بلسم</h3>
                            </Link>
                        </li>
                        <li className="nav-item d-md-none">
                            <a className="nav-link open-navbar-container" data-toggle="collapse" data-target="#navbar-mobile">
                                <i className="la la-ellipsis-v"></i>
                            </a>
                        </li>
                    </ul>
                </div>
                <div className="navbar-container content">
                    <div className="collapse navbar-collapse" id="navbar-mobile">
                        <ul className="nav navbar-nav mr-auto float-left">
                            <li className="nav-item d-none d-md-block">
                                <a className="nav-link nav-menu-main menu-toggle hidden-xs" href="#" onClick={toggleMenu}>
                                    <i className="ft-menu"></i>
                                </a>
                            </li>
                        </ul>
                        <ul className="nav navbar-nav float-right align-items-center">
                            {adminRole && (
                                <li className="nav-item d-none d-md-block mr-2">
                                    <span className="admin-header-role">
                                        {roleLabels[adminRole] || adminRole}
                                    </span>
                                </li>
                            )}
                            <li className="nav-item">
                                <Link className="nav-link" to="/">
                                    <i className="la la-home mr-1" />
                                    <span>الموقع</span>
                                </Link>
                            </li>
                            <li className="nav-item">
                                <Link className="nav-link dropdown-user-link" to="/admin/my-profile">
                                    <i className="la la-user mr-1" />
                                    <span>الملف الشخصي</span>
                                </Link>
                            </li>
                            <li className="dropdown dropdown-user nav-item">
                                <a className="dropdown-toggle nav-link dropdown-user-link" href="#" onClick={handleLogout}>
                                    <i className="la la-sign-out mr-1" />
                                    <span>تسجيل الخروج</span>
                                </a>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default AdminHeader;
