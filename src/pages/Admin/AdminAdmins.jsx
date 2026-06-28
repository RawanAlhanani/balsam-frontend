import React, { useState, useEffect } from 'react';
import api from '../../api';
import {
    AdminPage, AdminPageHeader, AdminCard, AdminFormPanel, AdminFormGroup,
    AdminFormActions, AdminTableWrap, AdminBtn, AdminAlert, AdminLoading, AdminEmptyState
} from '../../components/Admin/ui/AdminUI';

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

    useEffect(() => { fetchAdmins(); }, []);

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
            await api.post('/admin/accounts', formData);
            setAlert({ message: 'تم إضافة المسؤول بنجاح', type: 'success' });
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

    const handleDelete = async (id) => {
        if (!window.confirm('هل أنت متأكد أنك تريد حذف هذا الحساب؟')) {
            return;
        }
        try {
            await api.delete(`/admin/accounts/${id}`);
            setAlert({ message: 'تم حذف الحساب بنجاح', type: 'success' });
            fetchAdmins();
        } catch (err) {
            const errorMessage = getPersonalizedErrorMessage(err);
            setAlert({ message: errorMessage, type: 'danger' });
            console.error(err);
        } finally {
            setTimeout(() => setAlert({ message: '', type: '' }), 3500);
        }
    };

    const roleLabels = {
        president: 'رئيس',
        vice_president: 'نائب رئيس',
        secretary: 'كاتب عام',
        treasurer: 'أمين مال',
    };

    return (
        <>
            <AdminPage>
                <AdminPageHeader
                    title="إدارة حسابات الإدارة"
                    subtitle="إضافة وحذف حسابات المسؤولين"
                    badge="الإعدادات"
                    actions={
                        <AdminBtn variant={showForm ? 'secondary' : 'primary'} icon={showForm ? 'la-times' : 'la-plus'} onClick={() => { setShowForm(!showForm); resetForm(); }}>
                            {showForm ? 'إلغاء' : 'إضافة مسؤول'}
                        </AdminBtn>
                    }
                />
                <div className="content-body">
                    <AdminFormPanel title="إضافة مسؤول جديد" open={showForm} onClose={() => { setShowForm(false); resetForm(); }} onSubmit={handleSubmit}>
                        <div className="row">
                            <AdminFormGroup label="الاسم" className="col-md-3">
                                <input className="form-control" name="name" value={formData.name} onChange={handleInputChange} required />
                                {formErrors.name && <div className="text-danger small mt-1">{formErrors.name[0]}</div>}
                            </AdminFormGroup>
                            <AdminFormGroup label="البريد" className="col-md-3">
                                <input className="form-control" type="email" name="email" value={formData.email} onChange={handleInputChange} required />
                                {formErrors.email && <div className="text-danger small mt-1">{formErrors.email[0]}</div>}
                            </AdminFormGroup>
                            <AdminFormGroup label="كلمة السر" className="col-md-3">
                                <input className="form-control" type="password" name="password" value={formData.password} onChange={handleInputChange} required />
                                {formErrors.password && <div className="text-danger small mt-1">{formErrors.password[0]}</div>}
                            </AdminFormGroup>
                            <AdminFormGroup label="الصفة" className="col-md-3">
                                <select className="form-control" name="role" value={formData.role} onChange={handleInputChange}>
                                    <option value="president">رئيس</option>
                                    <option value="vice_president">نائب رئيس</option>
                                    <option value="secretary">كاتب عام</option>
                                    <option value="treasurer">أمين مال</option>
                                </select>
                                {formErrors.role && <div className="text-danger small mt-1">{formErrors.role[0]}</div>}
                            </AdminFormGroup>
                        </div>
                        <AdminFormActions>
                            <AdminBtn variant="success" type="submit" icon="la-check" disabled={submitting}>
                                {submitting ? <><span className="spinner-border spinner-border-sm mr-2" role="status" aria-hidden="true"></span> جارٍ...</> : 'حفظ'}
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
                                                    <AdminBtn variant="danger" icon="la-trash" onClick={() => handleDelete(a.id)}>حذف</AdminBtn>
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

            {alert.message && (
                <AdminAlert message={alert.message} type={alert.type} onClose={() => setAlert({ message: '', type: '' })} />
            )}
        </>
    );
};

export default AdminAdmins;