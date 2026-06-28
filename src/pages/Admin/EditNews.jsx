import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../../api';
import {
    AdminPage, AdminPageHeader, AdminFormPanel, AdminFormGroup, AdminFormActions, AdminBtn, AdminAlert, AdminLoading
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

const EditNews = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [formData, setFormData] = useState({ titre: '', description: '' });
    const [image, setImage] = useState(null);
    const [submitting, setSubmitting] = useState(false);
    const [loadingNews, setLoadingNews] = useState(true);
    const [alert, setAlert] = useState({ message: '', type: '' });
    const [currentImage, setCurrentImage] = useState(null);
    const [formErrors, setFormErrors] = useState({}); // New state for form errors

    useEffect(() => {
        fetchNews();
    }, [id]);

    const fetchNews = async () => {
        setLoadingNews(true);
        try {
            const res = await api.get(`/admin/news/${id}`); // Assuming an API endpoint to get a single news item
            const newsItem = res.data;
            setFormData({
                titre: newsItem.titre,
                description: newsItem.description
            });
            setCurrentImage(newsItem.image_info ? `http://localhost:8000/storage/MesImages/${newsItem.image_info}` : null);
        } catch (err) {
            const errorMessage = getPersonalizedErrorMessage(err);
            setAlert({ message: errorMessage, type: 'danger' });
            console.error(err);
        } finally {
            setLoadingNews(false);
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
        if (formErrors.image_info) {
            setFormErrors(prev => ({ ...prev, image_info: null }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        setFormErrors({}); // Clear previous errors
        setAlert({ message: '', type: '' }); // Clear general alert

        const data = new FormData();
        data.append('titre', formData.titre);
        data.append('description', formData.description);
        if (image) data.append('image_info', image);
        data.append('_method', 'PUT'); // Important for Laravel to handle PUT with FormData

        try {
            await api.post(`/admin/news/${id}`, data);
            setAlert({ message: 'تم تحديث الخبر بنجاح', type: 'success' });
            navigate('/admin/news'); // Redirect to list page
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

    if (loadingNews) {
        return <AdminLoading />;
    }

    return (
        <AdminPage>
            <AdminPageHeader
                title="تعديل خبر"
                subtitle={`تعديل تفاصيل الخبر: ${formData.titre}`}
                badge="الأخبار"
                actions={
                    <AdminBtn
                        variant="secondary"
                        icon="la-arrow-right"
                        onClick={() => navigate('/admin/news')}
                    >
                        العودة للأخبار
                    </AdminBtn>
                }
            />
            <div className="content-body">
                <AdminFormPanel
                    title="نموذج تعديل خبر"
                    open={true} // Always open on this page
                    onClose={() => navigate('/admin/news')} // Navigate back on close
                    onSubmit={handleSubmit}
                >
                    <AdminFormGroup label="العنوان">
                        <input type="text" className="form-control" name="titre" value={formData.titre} onChange={handleInputChange} required />
                        {formErrors.titre && <div className="text-danger small mt-1">{formErrors.titre[0]}</div>}
                    </AdminFormGroup>
                    <AdminFormGroup label="الوصف">
                        <textarea className="form-control" rows="5" name="description" value={formData.description} onChange={handleInputChange} required />
                        {formErrors.description && <div className="text-danger small mt-1">{formErrors.description[0]}</div>}
                    </AdminFormGroup>
                    <AdminFormGroup label="الصورة">
                        <input type="file" className="form-control-file" name="image_info" onChange={handleImageChange} />
                        {currentImage && !image && ( // Show current image if editing and no new image selected
                            <div className="mt-2">
                                <img src={currentImage} alt="Current News" style={{ maxWidth: '100px', maxHeight: '100px', objectFit: 'cover' }} />
                                <small className="d-block text-muted">الصورة الحالية</small>
                            </div>
                        )}
                        {formErrors.image_info && <div className="text-danger small mt-1">{formErrors.image_info[0]}</div>}
                    </AdminFormGroup>
                    <AdminFormActions>
                        <AdminBtn variant="success" type="submit" icon="la-check" disabled={submitting}>
                            {submitting ? <span className="spinner-border spinner-border-sm"/> : 'تحديث الخبر'}
                        </AdminBtn>
                        <AdminBtn variant="secondary" icon="la-times" onClick={() => navigate('/admin/news')}>إلغاء</AdminBtn>
                    </AdminFormActions>
                </AdminFormPanel>
            </div>
            {alert.message && (
                <AdminAlert message={alert.message} type={alert.type} onClose={() => setAlert({ message: '', type: '' })} />
            )}
        </AdminPage>
    );
};

export default EditNews;