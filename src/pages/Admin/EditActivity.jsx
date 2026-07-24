import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../../api';
import {
    AdminPage, AdminPageHeader, AdminFormPanel, AdminFormGroup, AdminFormActions, AdminBtn, AdminAlert, AdminLoading
} from '../../components/Admin/ui/AdminUI';
import { getStorageUrl } from '../../utils/formatters';

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

const EditActivity = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [formData, setFormData] = useState({ titre: '', type_activite_id: '', date_activite: '', description: '' });
    const [image, setImage] = useState(null);
    const [types, setTypes] = useState([]);
    const [submitting, setSubmitting] = useState(false);
    const [loadingActivity, setLoadingActivity] = useState(true);
    const [loadingTypes, setLoadingTypes] = useState(true);
    const [alert, setAlert] = useState({ message: '', type: '' });
    const [currentImage, setCurrentImage] = useState(null);
    const [formErrors, setFormErrors] = useState({}); // New state for form errors

    useEffect(() => {
        fetchActivity();
        fetchTypes();
    }, [id]);

    const fetchActivity = async () => {
        setLoadingActivity(true);
        try {
            const res = await api.get(`/admin/activities/${id}`); // Assuming an API endpoint to get a single activity
            const activity = res.data;
            setFormData({
                titre: activity.titre,
                type_activite_id: activity.type_activite_id,
                date_activite: activity.date_activite,
                description: activity.description
            });
            setCurrentImage(activity.image_activite ? getStorageUrl(activity.image_activite) : null);
        } catch (err) {
            const errorMessage = getPersonalizedErrorMessage(err);
            setAlert({ message: errorMessage, type: 'danger' });
            console.error(err);
        } finally {
            setLoadingActivity(false);
        }
    };

    const fetchTypes = async () => {
        setLoadingTypes(true);
        try {
            const res = await api.get('/admin/types');
            setTypes(res.data);
        } catch (err) {
            const errorMessage = getPersonalizedErrorMessage(err);
            setAlert({ message: errorMessage, type: 'danger' });
            console.error(err);
        } finally {
            setLoadingTypes(false);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
        // Clear error for this field when user starts typing
        if (formErrors[name]) {
            setFormErrors(prev => ({ ...prev, [name]: null }));
        }
    };

    const handleImageChange = (e) => {
        setImage(e.target.files[0]);
        // Clear image error if present
        if (formErrors.image_activite) {
            setFormErrors(prev => ({ ...prev, image_activite: null }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        setFormErrors({}); // Clear previous errors
        setAlert({ message: '', type: '' }); // Clear general alert

        const data = new FormData();
        Object.keys(formData).forEach(key => data.append(key, formData[key]));
        if (image) data.append('image_activite', image);
        data.append('_method', 'PUT'); // Important for Laravel to handle PUT with FormData

        try {
            await api.post(`/admin/activities/${id}`, data);
            setAlert({ message: 'تم تحديث النشاط بنجاح', type: 'success' });
            navigate('/admin/activities'); // Redirect to list page
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

    if (loadingActivity || loadingTypes) {
        return <AdminLoading />;
    }

    return (
        <AdminPage>
            <AdminPageHeader
                title="تعديل نشاط"
                subtitle={`تعديل تفاصيل النشاط: ${formData.titre}`}
                badge="الأنشطة"
                actions={
                    <AdminBtn
                        variant="secondary"
                        icon="la-arrow-right"
                        onClick={() => navigate('/admin/activities')}
                    >
                        العودة للأنشطة
                    </AdminBtn>
                }
            />
            <div className="content-body">
                <AdminFormPanel
                    title="نموذج تعديل نشاط"
                    open={true} // Always open on this page
                    onClose={() => navigate('/admin/activities')} // Navigate back on close
                    onSubmit={handleSubmit}
                >
                    <div className="row">
                        <AdminFormGroup label="العنوان" className="col-md-4">
                            <input type="text" className="form-control" name="titre" value={formData.titre} onChange={handleInputChange} required />
                            {formErrors.titre && <div className="text-danger small mt-1">{formErrors.titre[0]}</div>}
                        </AdminFormGroup>
                        <AdminFormGroup label="النوع" className="col-md-4">
                            <select className="form-control" name="type_activite_id" value={formData.type_activite_id} onChange={handleInputChange} required>
                                <option value="">اختر النوع</option>
                                {types.map(t => <option key={t.id} value={t.id}>{t.nomActivite}</option>)}
                            </select>
                            {formErrors.type_activite_id && <div className="text-danger small mt-1">{formErrors.type_activite_id[0]}</div>}
                        </AdminFormGroup>
                        <AdminFormGroup label="التاريخ" className="col-md-4">
                            <input type="date" className="form-control" name="date_activite" value={formData.date_activite} onChange={handleInputChange} required />
                            {formErrors.date_activite && <div className="text-danger small mt-1">{formErrors.date_activite[0]}</div>}
                        </AdminFormGroup>
                        <AdminFormGroup label="الوصف" className="col-md-12">
                            <textarea className="form-control" rows="3" name="description" value={formData.description} onChange={handleInputChange} required />
                            {formErrors.description && <div className="text-danger small mt-1">{formErrors.description[0]}</div>}
                        </AdminFormGroup>
                        <AdminFormGroup label="الصورة" className="col-md-4">
                            <input type="file" className="form-control-file" name="image_activite" onChange={handleImageChange} />
                            {currentImage && !image && ( // Show current image if editing and no new image selected
                                <div className="mt-2">
                                    <img src={currentImage} alt="صورة النشاط الحالية" style={{ maxWidth: '100px', maxHeight: '100px', objectFit: 'cover' }} />
                                    <small className="d-block text-muted">الصورة الحالية</small>
                                </div>
                            )}
                            {formErrors.image_activite && <div className="text-danger small mt-1">{formErrors.image_activite[0]}</div>}
                        </AdminFormGroup>
                    </div>
                    <AdminFormActions>
                        <AdminBtn variant="success" type="submit" icon="la-check" disabled={submitting}>
                            {submitting ? <span className="spinner-border spinner-border-sm"/> : 'تحديث النشاط'}
                        </AdminBtn>
                        <AdminBtn variant="secondary" icon="la-times" onClick={() => navigate('/admin/activities')}>إلغاء</AdminBtn>
                    </AdminFormActions>
                </AdminFormPanel>
            </div>
            {alert.message && (
                <AdminAlert message={alert.message} type={alert.type} onClose={() => setAlert({ message: '', type: '' })} />
            )}
        </AdminPage>
    );
};

export default EditActivity;