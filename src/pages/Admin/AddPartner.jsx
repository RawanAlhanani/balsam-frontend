import React, { useState } from 'react';
import api from '../../api';
import { useNavigate } from 'react-router-dom';
import {
    AdminPage, AdminPageHeader, AdminCard, AdminFormGroup, AdminFormActions, AdminBtn, AdminAlert
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

const AddPartner = () => {
    const navigate = useNavigate();
    const [nomPartenaire, setNomPartenaire] = useState('');
    const [image, setImage] = useState(null);
    const [submitting, setSubmitting] = useState(false);
    const [alert, setAlert] = useState({ message: '', type: '' });
    const [formErrors, setFormErrors] = useState({}); // New state for form errors

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        if (name === 'nomPartenaire') {
            setNomPartenaire(value);
        }
        // Clear error for this field when user starts typing
        if (formErrors[name]) {
            setFormErrors(prev => ({ ...prev, [name]: null }));
        }
    };

    const handleImageChange = (e) => {
        setImage(e.target.files[0]);
        // Clear image error if present
        if (formErrors.imagePartenaire) {
            setFormErrors(prev => ({ ...prev, imagePartenaire: null }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        setFormErrors({}); // Clear previous errors
        setAlert({ message: '', type: '' }); // Clear general alert

        const data = new FormData();
        data.append('nomPartenaire', nomPartenaire);
        if (image) data.append('imagePartenaire', image);

        try {
            await api.post('/admin/partners', data);
            setAlert({ message: 'تم إضافة الشريك بنجاح', type: 'success' });
            navigate('/admin/partners');
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

    return (
        <AdminPage>
            <AdminPageHeader title="إضافة شريك جديد" subtitle="إضافة شريك وشعاره" badge="المحتوى" />
            <div className="content-body">
                <AdminCard title="بيانات الشريك" icon="la-handshake-o">
                    <form onSubmit={handleSubmit}>
                        <AdminFormGroup label="اسم الشريك">
                            <input type="text" className="form-control" name="nomPartenaire" value={nomPartenaire} onChange={handleInputChange} required />
                            {formErrors.nomPartenaire && <div className="text-danger small mt-1">{formErrors.nomPartenaire[0]}</div>}
                        </AdminFormGroup>
                        <AdminFormGroup label="الشعار">
                            <input type="file" className="form-control-file" name="imagePartenaire" onChange={handleImageChange} required />
                            {formErrors.imagePartenaire && <div className="text-danger small mt-1">{formErrors.imagePartenaire[0]}</div>}
                        </AdminFormGroup>
                        <AdminFormActions>
                            <AdminBtn variant="primary" type="submit" icon="la-check" disabled={submitting}>
                                {submitting ? <><span className="spinner-border spinner-border-sm mr-2" role="status" aria-hidden="true"></span> جارٍ...</> : 'حفظ'}
                            </AdminBtn>
                            <AdminBtn variant="secondary" icon="la-arrow-right" onClick={() => navigate('/admin/partners')}>رجوع</AdminBtn>
                        </AdminFormActions>
                    </form>
                </AdminCard>
            </div>
            {alert.message && (
                <AdminAlert message={alert.message} type={alert.type} onClose={() => setAlert({ message: '', type: '' })} />
            )}
        </AdminPage>
    );
};

export default AddPartner;