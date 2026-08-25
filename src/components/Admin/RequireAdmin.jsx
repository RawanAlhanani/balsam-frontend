import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { getAdminPermissions } from '../../utils/adminPermissions';

/**
 * Gates admin routes/pages on the client so a logged-out or under-privileged
 * visitor is redirected/blocked before the page renders, instead of seeing
 * the admin chrome flash while API calls fail with 401/403 in the background.
 *
 * `roles`, when provided, must match the role strings the backend actually
 * checks in routes/api.php (president, vice_president, secretary,
 * vice_secretary, treasurer, vice_treasurer).
 */
const RequireAdmin = ({ roles, permissions, children }) => {
    const [loadedPermissions, setLoadedPermissions] = useState(null);
    const isAdmin = localStorage.getItem('is_admin') === 'true';
    const adminToken = localStorage.getItem('admin_token');

    useEffect(() => {
        if (!isAdmin || !adminToken) {
            setLoadedPermissions([]);
            return;
        }

        if (!permissions || permissions.length === 0) {
            setLoadedPermissions([]);
            return;
        }

        if (localStorage.getItem('admin_role') === 'president') {
            setLoadedPermissions(permissions);
            return;
        }

        getAdminPermissions()
            .then(setLoadedPermissions)
            .catch(() => setLoadedPermissions([]));
    }, [adminToken, isAdmin, permissions]);

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

    if (permissions && permissions.length > 0) {
        if (loadedPermissions === null) {
            return <div className="p-3 text-center" dir="rtl">جارٍ التحقق من الصلاحيات...</div>;
        }

        const hasPermission = permissions.some(permission => loadedPermissions.includes(permission));
        if (!hasPermission) {
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
