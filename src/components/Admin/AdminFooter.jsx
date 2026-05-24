import React from 'react';

const AdminFooter = () => {
    return (
        <footer className="footer footer-static footer-light navbar-border navbar-shadow">
            <p className="clearfix blue-grey lighten-2 text-sm-center mb-0 px-2">
                <span className="float-md-left d-block d-md-inline-block">
                    حقوق النشر &copy; 2021 <a className="text-bold-800 grey darken-2" href="#" target="_blank">zakaria</a>, كل الحقوق محفوظة.
                </span>
                <span className="float-md-right d-block d-md-inline-blockd-none d-lg-block">
                    مصنوع يدويًا & مصنوع من <i className="ft-heart pink"></i>
                </span>
            </p>
        </footer>
    );
};

export default AdminFooter;
