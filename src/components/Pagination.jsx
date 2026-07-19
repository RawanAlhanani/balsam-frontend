import React from 'react';
import PropTypes from 'prop-types';

/**
 * Minimal prev/next + page indicator for the public site's paginated
 * list endpoints (news, photos). Mirrors Laravel's paginate() shape:
 * { current_page, last_page }.
 */
const Pagination = ({ currentPage, lastPage, onPageChange }) => {
    if (lastPage <= 1) return null;

    return (
        <nav
            aria-label="ترقيم الصفحات"
            style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                gap: '12px',
                marginTop: '30px',
                clear: 'both', // some list pages (e.g. News) use float-based cards above with no clearfix
                width: '100%',
            }}
        >
            <button
                type="button"
                className="btn btn-outline-primary"
                onClick={() => onPageChange(currentPage - 1)}
                disabled={currentPage <= 1}
            >
                السابق
            </button>
            <span>صفحة {currentPage} من {lastPage}</span>
            <button
                type="button"
                className="btn btn-outline-primary"
                onClick={() => onPageChange(currentPage + 1)}
                disabled={currentPage >= lastPage}
            >
                التالي
            </button>
        </nav>
    );
};

Pagination.propTypes = {
    currentPage: PropTypes.number.isRequired,
    lastPage: PropTypes.number.isRequired,
    onPageChange: PropTypes.func.isRequired,
};

export default Pagination;
