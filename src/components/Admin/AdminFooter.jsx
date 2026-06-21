import React from 'react';

const AdminFooter = () => {
    const year = new Date().getFullYear();

    return (
        <footer className="footer footer-static footer-light navbar-border navbar-shadow">
            <p className="clearfix text-sm-center mb-0 px-2 py-2">
                <span className="float-md-left d-block d-md-inline-block">
                    &copy; {year} جمعية بلسم — كل الحقوق محفوظة
                </span>
                <span className="float-md-right d-block d-md-inline-block">
                    لوحة تحكم الإدارة
                </span>
            </p>
        </footer>
    );
};

export default AdminFooter;
