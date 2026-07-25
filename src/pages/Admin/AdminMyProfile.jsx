import React, { useState, useEffect } from 'react';
import api from '../../api';
import {
    AdminPage, AdminPageHeader, AdminFormPanel, AdminFormGroup, AdminFormActions, AdminBtn, AdminAlert, AdminLoading
} from '../../components/Admin/ui/AdminUI';

const roleLabels = {
    president: 'رئيس الجمعية',
    vice_president: 'نائب الرئيس',
    secretary: 'الكاتب العام',
    vice_secretary: 'نائب الكاتب العام',
    treasurer: 'أمين المال',
    vice_treasurer: 'نائب أمين المال',
};

const AdminMyProfile = () => {
    const [formData, setFormData] = useState({ name: '', email: '', password: '' });
    const [role, setRole] = useState('');
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [alert, setAlert] = useState({ message: '', type: '' });
    const [formErrors, setFormErrors] = useState({});

    useEffect(() => {
        api.get('/profile')
            .then(res => {
                setFormData({ name: res.data.admin.name, email: res.data.admin.email, password: '' });
                setRole(res.data.role);
                setLoading(false);
            })
            .catch(err => {
                console.error(err);
                setAlert({ message: err.response?.data?.message || 'حدث خطأ أثناء تحميل الملف الشخصي.', type: 'danger' });
                setLoading(false);
            });
    }, []);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        if (formErrors[name]) {
            setFormErrors(prev => ({ ...prev, [name]: null }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        setFormErrors({});
        setAlert({ message: '', type: '' });

        try {
            const res = await api.put('/admin/my-profile', formData);
            setAlert({ message: res.data.message || 'تم تحديث الملف الشخصي بنجاح', type: 'success' });
            setFormData(prev => ({ ...prev, password: '' }));
        } catch (err) {
            if (err.response?.status === 422 && err.response.data.errors) {
                setFormErrors(err.response.data.errors);
                setAlert({ message: 'الرجاء مراجعة الأخطاء في النموذج.', type: 'danger' });
            } else {
                setAlert({ message: err.response?.data?.message || 'حدث خطأ أثناء تحديث الملف الشخصي.', type: 'danger' });
            }
            console.error(err);
        } finally {
            setSubmitting(false);
            setTimeout(() => setAlert({ message: '', type: '' }), 3500);
        }
    };

    if (loading) return <AdminLoading />;

    return (
        <AdminPage>
            <AdminPageHeader
                title="الملف الشخصي"
                subtitle={role ? `الصفة: ${roleLabels[role] || role}` : undefined}
                badge="حسابي"
            />
            <div className="content-body">
                <AdminFormPanel title="تعديل بياناتي" open={true} onSubmit={handleSubmit}>
                    <div className="row">
                        <AdminFormGroup label="الاسم" className="col-md-6">
                            <input className="form-control" name="name" value={formData.name} onChange={handleInputChange} required />
                            {formErrors.name && <div className="text-danger small mt-1">{formErrors.name[0]}</div>}
                        </AdminFormGroup>
                        <AdminFormGroup label="البريد الإلكتروني" className="col-md-6">
                            <input className="form-control" type="email" name="email" value={formData.email} onChange={handleInputChange} required />
                            {formErrors.email && <div className="text-danger small mt-1">{formErrors.email[0]}</div>}
                        </AdminFormGroup>
                        <AdminFormGroup label="كلمة السر الجديدة" className="col-md-6">
                            <input className="form-control" type="password" name="password" value={formData.password} onChange={handleInputChange} placeholder="اتركها فارغة للإبقاء على كلمة السر الحالية" />
                            {formErrors.password && <div className="text-danger small mt-1">{formErrors.password[0]}</div>}
                        </AdminFormGroup>
                    </div>
                    <AdminFormActions>
                        <AdminBtn variant="success" type="submit" icon="la-check" disabled={submitting}>
                            {submitting ? <><span className="spinner-border spinner-border-sm mr-2" role="status" aria-hidden="true"></span> جارٍ...</> : 'حفظ التعديلات'}
                        </AdminBtn>
                    </AdminFormActions>
                </AdminFormPanel>
            </div>
            {alert.message && (
                <AdminAlert message={alert.message} type={alert.type} onClose={() => setAlert({ message: '', type: '' })} />
            )}
        </AdminPage>
    );
};

export default AdminMyProfile;
