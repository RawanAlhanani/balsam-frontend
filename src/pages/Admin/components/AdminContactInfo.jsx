import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { AdminCard, AdminFormGroup, AdminBtn, AdminAlert } from '../../../components/Admin/ui/AdminUI';
import { getSiteSettings, updateSiteSettings } from '../../../api';

const AdminContactInfo = ({ openCategory, toggleCategory }) => {
    const [form, setForm] = useState({ phone: '', email: '', facebook_url: '', instagram_url: '' });
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [alert, setAlert] = useState({ message: '', type: '' });

    useEffect(() => {
        getSiteSettings()
            .then(res => setForm({
                phone: res.data.phone || '',
                email: res.data.email || '',
                facebook_url: res.data.facebook_url || '',
                instagram_url: res.data.instagram_url || '',
            }))
            .catch(() => setAlert({ message: 'تعذّر تحميل معلومات التواصل.', type: 'danger' }))
            .finally(() => setLoading(false));
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        try {
            const res = await updateSiteSettings(form);
            setAlert({ message: res.data.message || 'تم الحفظ بنجاح.', type: 'success' });
        } catch (err) {
            if (err.response?.status === 422 && err.response.data.errors) {
                setAlert({ message: Object.values(err.response.data.errors)[0][0], type: 'danger' });
            } else {
                setAlert({ message: err.response?.data?.message || 'حدث خطأ أثناء الحفظ.', type: 'danger' });
            }
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="col-md-4">
            <AdminCard
                title={
                    <div className="d-flex justify-content-between align-items-center" onClick={() => toggleCategory('contact')} style={{ cursor: 'pointer' }}>
                        <span>معلومات التواصل</span>
                        <i className={`la ${openCategory === 'contact' ? 'la-angle-up' : 'la-angle-down'}`}></i>
                    </div>
                }
                icon="la-phone"
            >
                {openCategory === 'contact' && (loading ? (
                    <p className="text-muted mb-0">جارٍ التحميل...</p>
                ) : (
                    <form onSubmit={handleSubmit}>
                        {alert.message && (
                            <AdminAlert message={alert.message} type={alert.type} onClose={() => setAlert({ message: '', type: '' })} />
                        )}
                        <AdminFormGroup label="رقم الهاتف">
                            <input className="form-control" dir="ltr" placeholder="+212 6XX-XXXXXX" name="phone" value={form.phone} onChange={handleChange} />
                        </AdminFormGroup>
                        <AdminFormGroup label="البريد الإلكتروني">
                            <input type="email" className="form-control" dir="ltr" placeholder="contact@balsam.ma" name="email" value={form.email} onChange={handleChange} />
                        </AdminFormGroup>
                        <AdminFormGroup label="رابط فيسبوك">
                            <input type="url" className="form-control" dir="ltr" placeholder="https://facebook.com/..." name="facebook_url" value={form.facebook_url} onChange={handleChange} />
                        </AdminFormGroup>
                        <AdminFormGroup label="رابط انستغرام">
                            <input type="url" className="form-control" dir="ltr" placeholder="https://instagram.com/..." name="instagram_url" value={form.instagram_url} onChange={handleChange} />
                        </AdminFormGroup>
                        <AdminBtn variant="success" type="submit" icon="la-save" disabled={submitting}>
                            {submitting ? <span className="spinner-border spinner-border-sm"/> : 'حفظ'}
                        </AdminBtn>
                    </form>
                ))}
            </AdminCard>
        </div>
    );
};

AdminContactInfo.propTypes = {
    openCategory: PropTypes.string,
    toggleCategory: PropTypes.func.isRequired,
};

export default AdminContactInfo;
