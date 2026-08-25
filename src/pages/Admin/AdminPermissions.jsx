import React, { useState, useEffect } from 'react';
import api, { 
    getUsersWithPermissions, 
    getUserPermissions, 
    assignUserPermissions,
    getPermissionsByModule 
} from '../../api';
import {
    AdminPage, AdminPageHeader, AdminCard, AdminFormPanel, AdminFormGroup,
    AdminFormActions, AdminTableWrap, AdminBtn, AdminAlert, AdminLoading, AdminEmptyState
} from '../../components/Admin/ui/AdminUI';
import DeleteConfirmModal from '../../components/Admin/modals/DeleteConfirmModal';

const AdminPermissions = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [alert, setAlert] = useState({ message: '', type: '' });
    const [showEditModal, setShowEditModal] = useState(false);
    const [editingUser, setEditingUser] = useState(null);
    const [allPermissions, setAllPermissions] = useState({});
    const [selectedPermissions, setSelectedPermissions] = useState([]);
    const [submitting, setSubmitting] = useState(false);

    const roleLabels = {
        president: 'الرئيس',
        vice_president: 'نائب الرئيس',
        secretary: 'الكاتب العام',
        vice_secretary: 'نائب الكاتب العام',
        treasurer: 'أمين المال',
        vice_treasurer: 'نائب أمين المال',
    };

    const moduleLabels = {
        activities: 'الأنشطة',
        news: 'الأخبار',
        partners: 'الشركاء',
        projects: 'المشاريع',
        finance: 'المالية',
        activity_reports: 'تقارير الأنشطة',
        meetings: 'الاجتماعات',
        tuteurs: 'المسجلين',
        doctors: 'التخصصات',
        regions: 'المناطق',
        types: 'أنواع الأنشطة',
        sliders: 'الشرائح',
        gallery: 'المعرض',
        static_pages: 'الصفحات الثابتة',
        settings: 'الإعدادات',
        site_settings: 'إعدادات الموقع',
        users: 'حسابات الإدارة',
        permissions: 'الصلاحيات',
        stats: 'الإحصائيات',
        contact_messages: 'رسائل التواصل',
        volunteers: 'المتطوعون',
        stagiaires: 'المتدربين',
    };

    const permissionLabels = {
        view_tuteurs: 'عرض المسجلين',
        edit_tuteurs: 'تعديل بيانات المسجلين',
        delete_tuteurs: 'حذف المسجلين',
        view_users: 'عرض حسابات الإدارة',
        create_users: 'إنشاء حساب إداري',
        edit_users: 'تعديل حسابات الإدارة',
        delete_users: 'حذف حسابات الإدارة',
        view_doctors: 'عرض التخصصات',
        create_doctors: 'إضافة تخصص',
        edit_doctors: 'تعديل التخصصات',
        delete_doctors: 'حذف التخصصات',
        view_stagiaires: 'عرض المتدربين',
        delete_stagiaires: 'حذف المتدربين',
    };

    const permissionDescriptions = {
        view_tuteurs: 'عرض المسجلين من النظام.',
        edit_tuteurs: 'تعديل بيانات المسجلين في النظام.',
        delete_tuteurs: 'حذف المسجلين من النظام.',
        view_users: 'عرض حسابات الإدارة.',
        create_users: 'إنشاء حساب إداري جديد.',
        edit_users: 'تعديل حسابات الإدارة.',
        delete_users: 'حذف حسابات الإدارة.',
        view_doctors: 'عرض التخصصات من إعدادات النظام.',
        create_doctors: 'إضافة تخصص جديد من إعدادات النظام.',
        edit_doctors: 'تعديل التخصصات من إعدادات النظام.',
        delete_doctors: 'حذف التخصصات من إعدادات النظام.',
        view_stagiaires: 'عرض قائمة المتدربين.',
        delete_stagiaires: 'حذف طلبات المتدربين.',
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        setLoading(true);
        try {
            const res = await getUsersWithPermissions();
            setUsers(res.data);
        } catch (err) {
            setAlert({ message: 'فشل في تحميل المستخدمين', type: 'danger' });
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleOpenEditModal = async (user) => {
        if (user.role === 'president') {
            setAlert({ message: 'لا يمكن تعديل صلاحيات الرئيس', type: 'warning' });
            return;
        }

        setEditingUser(user);

        const effectivePermissions = Array.isArray(user.permissions) ? user.permissions : [];
        const directPermissions = Array.isArray(user.direct_permissions) ? user.direct_permissions : [];
        const revokedPermissions = Array.isArray(user.revoked_permissions) ? user.revoked_permissions : [];
        
        // Include role permissions that are NOT revoked
        const revokedIds = revokedPermissions.map(p => p.id);
        const rolePermissionIds = effectivePermissions
            .filter(p => !directPermissions.some(dp => dp.id === p.id))
            .map(p => p.id)
            .filter(id => !revokedIds.includes(id));
        
        const directPermissionIds = directPermissions.map(p => p.id);
        setSelectedPermissions([...rolePermissionIds, ...directPermissionIds]);
        
        setShowEditModal(true);

        // Load permissions grouped by module
        try {
            const res = await getPermissionsByModule();
            setAllPermissions(res.data);
        } catch (err) {
            console.error('Failed to load permissions:', err);
        }
    };

    const handlePermissionToggle = (permissionId) => {
        setSelectedPermissions(prev => {
            if (prev.includes(permissionId)) {
                return prev.filter(id => id !== permissionId);
            } else {
                return [...prev, permissionId];
            }
        });
    };

    const handleSavePermissions = async () => {
        setSubmitting(true);
        try {
            await assignUserPermissions(editingUser.id, selectedPermissions);
            setAlert({ message: 'تم تحديث الصلاحيات بنجاح', type: 'success' });
            setShowEditModal(false);
            fetchUsers();
        } catch (err) {
            setAlert({ message: 'فشل في تحديث الصلاحيات', type: 'danger' });
            console.error(err);
        } finally {
            setSubmitting(false);
            setTimeout(() => setAlert({ message: '', type: '' }), 3500);
        }
    };

    const getRolePermissionIds = (user) => {
        // Get permissions that come from the user's role (excluding revoked ones)
        const effectivePermissions = Array.isArray(user.permissions) ? user.permissions : [];
        const directPermissions = Array.isArray(user.direct_permissions) ? user.direct_permissions : [];
        const revokedPermissions = Array.isArray(user.revoked_permissions) ? user.revoked_permissions : [];
        const revokedIds = revokedPermissions.map(p => p.id);
        const rolePerms = effectivePermissions.filter(p => {
            // Check if this permission is in direct_permissions (user-specific)
            const isDirect = directPermissions.some(dp => dp.id === p.id);
            // Check if this permission is revoked
            const isRevoked = revokedIds.includes(p.id);
            return !isDirect && !isRevoked;
        });
        return rolePerms.map(p => p.id);
    };

    return (
        <>
            <AdminPage>
                <AdminPageHeader
                    title="إدارة الصلاحيات"
                    subtitle="تعديل صلاحيات المستخدمين"
                    badge="الإعدادات"
                />
                <div className="content-body">
                    <AdminCard title="المستخدمون وصلاحياتهم" icon="la-shield" flush>
                        {loading ? (
                            <AdminLoading />
                        ) : users.length === 0 ? (
                            <AdminEmptyState icon="la-shield" message="لا يوجد مستخدمين" />
                        ) : (
                            <AdminTableWrap>
                                <table className="table table-hover admin-table">
                                    <thead>
                                        <tr>
                                            <th>الاسم</th>
                                            <th>البريد الإلكتروني</th>
                                            <th>الدور</th>
                                            <th>عدد الصلاحيات</th>
                                            <th>العمليات</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {users.map(user => (
                                            <tr key={user.id}>
                                                <td>{user.name}</td>
                                                <td>{user.email}</td>
                                                <td>
                                                    <span className="admin-tag">
                                                        {roleLabels[user.role] || user.role}
                                                    </span>
                                                </td>
                                                <td>
                                                    <span className="badge badge-info">
                                                        {user.permissions?.length || 0} صلاحية
                                                    </span>
                                                    {user.direct_permissions?.length > 0 && (
                                                        <span className="badge badge-success ml-1">
                                                            +{user.direct_permissions.length} مخصصة
                                                        </span>
                                                    )}
                                                </td>
                                                <td>
                                                    <div className="admin-action-group">
                                                        {user.role !== 'president' ? (
                                                            <AdminBtn 
                                                                variant="primary" 
                                                                icon="la-edit" 
                                                                onClick={() => handleOpenEditModal(user)}
                                                            >
                                                                تعديل الصلاحيات
                                                            </AdminBtn>
                                                        ) : (
                                                            <span className="text-muted">لديه جميع الصلاحيات</span>
                                                        )}
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </AdminTableWrap>
                        )}
                    </AdminCard>
                </div>
            </AdminPage>

            {/* Edit Permissions Modal */}
            {showEditModal && editingUser && (
                <div className="modal fade show d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
                    <div className="modal-dialog modal-xl">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title">تعديل صلاحيات: {editingUser.name}</h5>
                                <button type="button" className="close" onClick={() => setShowEditModal(false)}>
                                    <span>×</span>
                                </button>
                            </div>
                            <div className="modal-body" style={{ maxHeight: '70vh', overflowY: 'auto' }}>
                                <div className="alert alert-info">
                                    <strong>الدور الحالي:</strong> {roleLabels[editingUser.role] || editingUser.role}
                                    <br />
                                    <small>الصلاحيات المحددة باللون الأزرق هي صلاحيات الدور الافتراضية.</small>
                                </div>

                                {Object.entries(allPermissions).map(([module, permissions]) => (
                                    <div key={module} className="card mb-3">
                                        <div className="card-header">
                                            <h6 className="mb-0">{moduleLabels[module] || module}</h6>
                                        </div>
                                        <div className="card-body">
                                            <div className="row">
                                                {permissions.map(permission => {
                                                    const rolePermIds = getRolePermissionIds(editingUser);
                                                    const isRolePermission = rolePermIds.includes(permission.id);
                                                    const isSelected = selectedPermissions.includes(permission.id);
                                                    
                                                    return (
                                                        <div key={permission.id} className="col-md-4 col-sm-6 mb-2">
                                                            <div className={`custom-control custom-checkbox ${isRolePermission ? 'custom-checkbox-primary' : ''}`}>
                                                                <input
                                                                    type="checkbox"
                                                                    className="custom-control-input"
                                                                    id={`perm_${permission.id}`}
                                                                    checked={isSelected}
                                                                    onChange={() => handlePermissionToggle(permission.id)}
                                                                />
                                                                <label 
                                                                    className={`custom-control-label ${isRolePermission ? 'text-primary' : ''}`}
                                                                    htmlFor={`perm_${permission.id}`}
                                                                >
                                                                    <span>
                                                                        {permissionLabels[permission.name] || permission.display_name}
                                                                        <small className="d-block text-muted mt-1">
                                                                            {permissionDescriptions[permission.name] || permission.description}
                                                                        </small>
                                                                    </span>
                                                                    {isRolePermission && (
                                                                        <span className="badge badge-primary ml-1">الدور</span>
                                                                    )}
                                                                </label>
                                                            </div>
                                                        </div>
                                                    );
                                                })}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                            <div className="modal-footer">
                                <AdminBtn 
                                    variant="success" 
                                    onClick={handleSavePermissions} 
                                    disabled={submitting}
                                    icon="la-check"
                                >
                                    {submitting ? 'جارٍ الحفظ...' : 'حفظ التغييرات'}
                                </AdminBtn>
                                <AdminBtn variant="secondary" onClick={() => setShowEditModal(false)} icon="la-times">
                                    إلغاء
                                </AdminBtn>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {alert.message && (
                <AdminAlert message={alert.message} type={alert.type} onClose={() => setAlert({ message: '', type: '' })} />
            )}
        </>
    );
};

export default AdminPermissions;
