import React, { useState, useEffect } from 'react';
import api from '../../api';
import {
    AdminPage, AdminPageHeader, AdminCard, AdminFormPanel, AdminFormGroup,
    AdminFormActions, AdminTableWrap, AdminBtn, AdminAlert, AdminLoading, AdminEmptyState
} from '../../components/Admin/ui/AdminUI';
import DeleteConfirmModal from '../../components/Admin/modals/DeleteConfirmModal';

// Helper function to personalize error messages
const getPersonalizedErrorMessage = (error) => {
    let rawMessage = '';
    if (error.response && error.response.data && error.response.data.message) {
        rawMessage = error.response.data.message.toLowerCase();
    } else if (error.message) {
        rawMessage = error.message.toLowerCase();
    }

    // Specific backend/SQL error patterns
    if (rawMessage.includes('sqlstate') || rawMessage.includes('database error') || rawMessage.includes('syntax error')) {
        return 'حدث خطأ في قاعدة البيانات. الرجاء إبلاغ الدعم الفني.'; // Database error. Please contact support.
    }
    if (rawMessage.includes('internal server error') || rawMessage.includes('undefined')) {
        return 'حدث خطأ غير متوقع من الخادم. الرجاء المحاولة مرة أخرى لاحقًا.'; // An unexpected server error occurred. Please try again later.
    }
    if (rawMessage.includes('network error') || rawMessage.includes('failed to fetch')) {
        return 'فشل الاتصال بالخادم. الرجاء التحقق من اتصالك بالإنترنت والمحاولة مرة أخرى.'; // Failed to connect to the server. Please check your internet connection and try again.
    }

    // If the backend provided a message that doesn't match technical patterns, use it.
    // Assuming the backend message is already in Arabic or user-friendly if it's not a technical error.
    if (error.response && error.response.data && error.response.data.message) {
        return error.response.data.message;
    }

    // Fallback for any other unhandled errors
    return 'حدث خطأ ما. الرجاء المحاولة مرة أخرى.'; // Something went wrong. Please try again.
};

const AdminAdmins = () => {
    const [admins, setAdmins] = useState([]);
    const [showForm, setShowForm] = useState(false);
    const [formData, setFormData] = useState({ name: '', email: '', password: '', role: 'secretary' });
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [alert, setAlert] = useState({ message: '', type: '' });
    const [formErrors, setFormErrors] = useState({}); // New state for form errors
    const [deleting, setDeleting] = useState(false);

    // State for editing an existing admin (password stays optional here —
    // blank means "keep current password")
    const [isEditing, setIsEditing] = useState(false);
    const [editingId, setEditingId] = useState(null);

    // State for delete confirmation modal
    const [showDeleteConfirmModal, setShowDeleteConfirmModal] = useState(false);
    const [deleteTargetId, setDeleteTargetId] = useState(null);
    const [deleteTargetName, setDeleteTargetName] = useState('');

    useEffect(() => { fetchAdmins(); }, []);

    // Lock background scroll and interactions when delete modal is open
    useEffect(() => {
        if (showDeleteConfirmModal) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
        return () => { document.body.style.overflow = ''; };
    }, [showDeleteConfirmModal]);

    const fetchAdmins = async () => {
        setLoading(true);
        try {
            const res = await api.get('/admin/accounts');
            setAdmins(res.data);
        } catch (err) {
            const errorMessage = getPersonalizedErrorMessage(err);
            setAlert({ message: errorMessage, type: 'danger' });
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const resetForm = () => {
        setFormData({ name: '', email: '', password: '', role: 'secretary' });
        setFormErrors({}); // Clear form errors on reset
        setIsEditing(false);
        setEditingId(null);
    };

    const handleOpenEditForm = (admin) => {
        setFormData({ name: admin.name, email: admin.email, password: '', role: admin.role });
        setIsEditing(true);
        setEditingId(admin.id);
        setFormErrors({});
        setShowForm(true);
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
        // Clear error for this field when user starts typing
        if (formErrors[name]) {
            setFormErrors(prev => ({ ...prev, [name]: null }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        setFormErrors({}); // Clear previous errors
        setAlert({ message: '', type: '' }); // Clear general alert

        try {
            if (isEditing) {
                await api.put(`/admin/accounts/${editingId}`, formData);
                setAlert({ message: 'تم تحديث حساب المسؤول بنجاح', type: 'success' });
            } else {
                await api.post('/admin/accounts', formData);
                setAlert({ message: 'تم إضافة المسؤول بنجاح', type: 'success' });
            }
            setShowForm(false);
            resetForm();
            fetchAdmins();
        } catch (err) {
            if (err.response && err.response.status === 422) {
                // Validation errors from Laravel
                setFormErrors(err.response.data.errors);
                setAlert({ message: 'الرجاء مراجعة الأخطاء في النموذج.', type: 'danger' });
            } else {
                // Other API errors
                const errorMessage = getPersonalizedErrorMessage(err);
                setAlert({ message: errorMessage, type: 'danger' });
            }
            console.error(err);
        } finally {
            setSubmitting(false);
            setTimeout(() => setAlert({ message: '', type: '' }), 3500);
        }
    };

    const promptDelete = (id, name) => {
        setDeleteTargetId(id);
        setDeleteTargetName(name);
        setShowDeleteConfirmModal(true);
    };

    const confirmDelete = async () => {
        if (!deleteTargetId || deleting) return;
        setDeleting(true);
        try {
            await api.delete(`/admin/accounts/${deleteTargetId}`);
            setAlert({ message: 'تم حذف الحساب بنجاح', type: 'success' });
            setShowDeleteConfirmModal(false);
            setDeleteTargetId(null);
            setDeleteTargetName('');
            fetchAdmins();
        } catch (err) {
            const errorMessage = getPersonalizedErrorMessage(err);
            setAlert({ message: errorMessage, type: 'danger' });
            setShowDeleteConfirmModal(false);
            setDeleteTargetId(null);
            setDeleteTargetName('');
            console.error(err);
        } finally {
            setDeleting(false);
            setTimeout(() => setAlert({ message: '', type: '' }), 3500);
        }
    };

    const roleLabels = {
        president: 'رئيس',
        vice_president: 'نائب رئيس',
        secretary: 'كاتب عام',
        vice_secretary: 'نائب الكاتب العام',
        treasurer: 'أمين مال',
        vice_treasurer: 'نائب أمين المال',
    };

    return (
        <>
            <AdminPage>
                <AdminPageHeader
                    title="إدارة حسابات الإدارة"
                    subtitle="إضافة وحذف حسابات المسؤولين"
                    badge="الإعدادات"
                    actions={
                        <AdminBtn variant={showForm ? 'secondary' : 'primary'} icon={showForm ? 'la-times' : 'la-plus'} onClick={() => { if (showForm) { setShowForm(false); resetForm(); } else { resetForm(); setShowForm(true); } }}>
                            {showForm ? 'إلغاء' : 'إضافة مسؤول'}
                        </AdminBtn>
                    }
                />
                <div className="content-body">
                    <AdminFormPanel title={isEditing ? 'تعديل حساب المسؤول' : 'إضافة مسؤول جديد'} open={showForm} onClose={() => { setShowForm(false); resetForm(); }} onSubmit={handleSubmit}>
                        <div className="row">
                            <AdminFormGroup label="الاسم" className="col-md-3">
                                <input className="form-control" name="name" value={formData.name} onChange={handleInputChange} required />
                                {formErrors.name && <div className="text-danger small mt-1">{formErrors.name[0]}</div>}
                            </AdminFormGroup>
                            <AdminFormGroup label="البريد" className="col-md-3">
                                <input className="form-control" type="email" name="email" value={formData.email} onChange={handleInputChange} required />
                                {formErrors.email && <div className="text-danger small mt-1">{formErrors.email[0]}</div>}
                            </AdminFormGroup>
                            <AdminFormGroup label={isEditing ? 'كلمة السر' : 'كلمة السر'} className="col-md-3">
                                <input className="form-control" type="password" name="password" value={formData.password} onChange={handleInputChange} placeholder={isEditing ? 'اتركها فارغة للإبقاء على كلمة السر الحالية' : ''} required={!isEditing} />
                                {formErrors.password && <div className="text-danger small mt-1">{formErrors.password[0]}</div>}
                            </AdminFormGroup>
                            <AdminFormGroup label="الصفة" className="col-md-3">
                                <select className="form-control" name="role" value={formData.role} onChange={handleInputChange}>
                                    <option value="president">رئيس</option>
                                    <option value="vice_president">نائب رئيس</option>
                                    <option value="secretary">كاتب عام</option>
                                    <option value="vice_secretary">نائب الكاتب العام</option>
                                    <option value="treasurer">أمين مال</option>
                                    <option value="vice_treasurer">نائب أمين المال</option>
                                </select>
                                {formErrors.role && <div className="text-danger small mt-1">{formErrors.role[0]}</div>}
                            </AdminFormGroup>
                        </div>
                        <AdminFormActions>
                            <AdminBtn variant="success" type="submit" icon="la-check" disabled={submitting}>
                                {submitting ? <><span className="spinner-border spinner-border-sm mr-2" role="status" aria-hidden="true"></span> جارٍ...</> : (isEditing ? 'حفظ التعديلات' : 'حفظ')}
                            </AdminBtn>
                            <AdminBtn variant="secondary" icon="la-times" onClick={() => { setShowForm(false); resetForm(); }}>إلغاء</AdminBtn>
                        </AdminFormActions>
                    </AdminFormPanel>

                    <AdminCard title="قائمة الحسابات" icon="la-user-secret" flush>
                        {loading ? (
                            <AdminLoading />
                        ) : admins.length === 0 ? (
                            <AdminEmptyState icon="la-user-secret" message="لا توجد حسابات مسؤولين مسجلة" hint="أضف حساب مسؤول جديد من الزر أعلاه" />
                        ) : (
                            <AdminTableWrap>
                                <table className="table table-hover admin-table">
                                    <thead>
                                        <tr>
                                            <th>الاسم</th>
                                            <th>البريد</th>
                                            <th>الصفة</th>
                                            <th>العمليات</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {admins.map(a => (
                                            <tr key={a.id}>
                                                <td>{a.name}</td>
                                                <td>{a.email}</td>
                                                <td><span className="admin-tag">{roleLabels[a.role] || a.role}</span></td>
                                                <td>
                                                    <div className="admin-action-group">
                                                        <AdminBtn permission="edit_users" variant="primary" icon="la-edit" onClick={() => handleOpenEditForm(a)}>تعديل</AdminBtn>
                                                        <AdminBtn permission="delete_users" variant="danger" icon="la-trash" onClick={() => promptDelete(a.id, a.name)}>حذف</AdminBtn>
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

            <DeleteConfirmModal
                show={showDeleteConfirmModal}
                onClose={() => setShowDeleteConfirmModal(false)}
                onConfirm={confirmDelete}
                itemName={deleteTargetName}
                isDeleting={deleting}
            />

            {alert.message && (
                <AdminAlert message={alert.message} type={alert.type} onClose={() => setAlert({ message: '', type: '' })} />
            )}
        </>
    );
};

export default AdminAdmins;