import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

const AdminHeader = () => {
    const navigate = useNavigate();

    const handleLogout = (e) => {
        e.preventDefault();
        localStorage.removeItem('admin_token');
        localStorage.removeItem('is_admin');
        navigate('/connecte');
    };

    return (
        <nav className="header-navbar navbar-expand-md navbar navbar-with-menu navbar-without-dd-arrow fixed-top navbar-semi-light bg-info navbar-shadow">
            <div className="navbar-wrapper">
                <div className="navbar-header">
                    <ul className="nav navbar-nav flex-row">
                        <li className="nav-item mobile-menu d-md-none mr-auto">
                            <a className="nav-link nav-menu-main menu-toggle hidden-xs" href="#">
                                <i className="ft-menu font-large-1"></i>
                            </a>
                        </li>
                        <li className="nav-item">
                            <Link className="navbar-brand" to="/">
                                <img className="brand-logo" alt="modern admin logo" src="/backend/app-assets/images/logo/logo.png" />
                                <h3 className="brand-text">الإدارة الحديثة</h3>
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
                                <a className="nav-link nav-menu-main menu-toggle hidden-xs" href="#">
                                    <i className="ft-menu"></i>
                                </a>
                            </li>
                        </ul>
                        <ul className="nav navbar-nav float-right">
                            <li className="dropdown dropdown-user nav-item">
                                <a className="dropdown-toggle nav-link dropdown-user-link" href="#" onClick={handleLogout}>
                                    <span className="mr-1">تسجيل الخروج</span>
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
