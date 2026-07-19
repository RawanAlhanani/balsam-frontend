import React from 'react';
import './Loading.css';

/**
 * Shared loading state for the public site. `overlay` (default true) covers
 * the viewport for route-level/initial loads; pass `overlay={false}` to
 * render inline within a page section instead (e.g. while refetching a
 * paginated list, so the header/footer don't flash out).
 */
const Loading = ({ message = 'جاري التحميل...', size = 'medium', overlay = true }) => {
    return (
        <div
            className={`balsam-loading balsam-loading--${size} ${overlay ? 'balsam-loading--overlay' : 'balsam-loading--inline'}`}
            role="status"
            aria-live="polite"
        >
            <div className="balsam-loading__logo">
                <img src="/content/upload/logo-650x380.png" alt="جمعية بلسم لذوي التوحد" />
            </div>
            <div className="balsam-loading__dots" aria-hidden="true">
                <span className="balsam-loading__dot balsam-loading__dot--1"></span>
                <span className="balsam-loading__dot balsam-loading__dot--2"></span>
                <span className="balsam-loading__dot balsam-loading__dot--3"></span>
                <span className="balsam-loading__dot balsam-loading__dot--4"></span>
            </div>
            {message && <p className="balsam-loading__message">{message}</p>}
        </div>
    );
};

export default Loading;
