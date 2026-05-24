import React from 'react';

const PageBanner = ({ title }) => {
    return (
        <div className="eco_banner eco_inner_page_banner">
            <div className="container">
                <div className="eco_headings">
                    {title && <h3 style={{ color: '#fff' }}><b>{title}</b></h3>}
                </div>
            </div>
        </div>
    );
};

export default PageBanner;
