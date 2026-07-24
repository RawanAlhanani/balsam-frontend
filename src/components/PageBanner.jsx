import React from 'react';
import { Link } from 'react-router-dom';

/**
 * Slim gradient breadcrumb strip shown at the top of every inner page.
 * Deliberately not a full hero with a repeated title — nearly every page
 * already renders its own eco_headings title block right below this, so a
 * second big title here would just duplicate it.
 */
const PageBanner = ({ title }) => {
    return (
        <div className="eco_banner eco_inner_page_banner eco_inner_page_banner--slim">
            <div className="container">
                <nav className="modern-breadcrumb" aria-label="breadcrumb">
                    <Link to="/">الرئيسية</Link>
                    {title && (
                        <>
                            <span className="modern-breadcrumb__sep">/</span>
                            <span className="modern-breadcrumb__current">{title}</span>
                        </>
                    )}
                </nav>
            </div>
        </div>
    );
};

export default PageBanner;
