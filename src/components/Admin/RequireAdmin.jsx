import React from 'react';
import { Navigate } from 'react-router-dom';

/**
 * Gates admin routes/pages on the client so a logged-out or under-privileged
 * visitor is redirected/blocked before the page renders, instead of seeing
 * the admin chrome flash while API calls fail with 401/403 in the background.
 *
 * `roles`, when provided, must match the role strings the backend actually
 * checks in routes/api.php (president, vice_president, secretary,
 * vice_secretary, treasurer, vice_treasurer).
 */
const RequireAdmin = ({ roles, children }) => {
    const isAdmin = localStorage.getItem('is_admin') === 'true';
    const adminToken = localStorage.getItem('admin_token');

    if (!isAdmin || !adminToken) {
        return <Navigate to="/connecte" replace />;
    }

    if (roles && roles.length > 0) {
        const role = localStorage.getItem('admin_role');
        if (!roles.includes(role)) {
            return (
                <div className="alert alert-danger m-2" dir="rtl">
                    ليس لديك الصلاحية للوصول إلى هذه الصفحة.
                </div>
            );
        }
    }

    return children;
};

export default RequireAdmin;
