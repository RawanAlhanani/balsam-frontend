import api from '../api';

let permissionsPromise;

export const getAdminPermissions = () => {
    if (!permissionsPromise) {
        permissionsPromise = api.get('/admin/me/permissions')
            .then(response => response.data.permissions || [])
            .catch(error => {
                permissionsPromise = null;
                throw error;
            });
    }
    return permissionsPromise;
};
