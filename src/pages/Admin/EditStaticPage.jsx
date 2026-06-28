import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../../api';
import BlockEditor from '../../components/Admin/BlockEditor';
import {
    AdminPage, AdminPageHeader, AdminCard, AdminLoading, AdminAlert, AdminBtn
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

const EditStaticPage = () => {
    const { type, id } = useParams(); // Get both type and id from URL params
    const navigate = useNavigate();
    const [formData, setFormData] = useState({ type: type, titre: '', description: '' }); // Initialize type with URL param
    const [blockContent, setBlockContent] = useState({ sections: [] }); // New state for BlockEditor
    const [image, setImage] = useState(null);
    const [alert, setAlert] = useState({ message: '', type: '' });
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [formErrors, setFormErrors] = useState({}); // New state for form errors

    useEffect(() => {
        const fetchPage = async () => {
            setLoading(true);
            try {
                const res = await api.get(`/admin/static-pages/${type}/${id}`); // Use both type and id in the API call
                const page = res.data;
                setFormData({
                    type: type, // Ensure type is set from URL param
                    titre: page.titre,
                    description: page.description || '' // Keep description for non-structured types
                });
                // Load structured_description for 'autism', 'about', and 'projects' types
                if ((type === 'autism' || type === 'about' || type === 'projects') && page.structured_description) {
                    setBlockContent(page.structured_description);
                } else {
                    setBlockContent({ sections: [] }); // Reset for other types or if no structured data
                }
            } catch (err) {
                const errorMessage = getPersonalizedErrorMessage(err);
                setAlert({ message: errorMessage, type: 'danger' });
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchPage();
    }, [type, id]); // Add type to dependency array

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
        if (formErrors[name]) {
            setFormErrors(prev => ({ ...prev, [name]: null }));
        }
    };

    const handleBlockContentChange = (newContent) => {
        setBlockContent(newContent);
        // Clear error for description_json when BlockEditor content changes
        if (formErrors.description_json) {
            setFormErrors(prev => ({ ...prev, description_json: null }));
        }
    };

    const handleImageChange = (e) => {
        setImage(e.target.files[0]);
        // Clear image error if present
        if (formErrors.image) {
            setFormErrors(prev => ({ ...prev, image: null }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        setFormErrors({}); // Clear previous errors
        setAlert({ message: '', type: '' }); // Clear general alert

        const data = new FormData();
        Object.keys(formData).forEach(k => data.append(k, formData[k]));
        if (image) data.append('image', image);
        // data.append('id', id); // ID is now part of the URL, no need to append to FormData

        // Use BlockEditor content for 'autism', 'about', and 'projects' types
        if (formData.type === 'autism' || formData.type === 'about' || formData.type === 'projects') {
            data.append('description_json', JSON.stringify(blockContent));
            // For structured types, ensure the regular description field is empty or not sent
            data.delete('description'); 
        }
        data.append('_method', 'PUT'); // Important for Laravel to handle PUT with FormData

        try {
            // Changed API endpoint to include type and id for a RESTful update
            await api.post(`/admin/static-pages/${type}/${id}`, data);
            setAlert({ message: 'تم التحديث بنجاح', type: 'success' });
            navigate('/admin/static-pages'); // Redirect to the list page
        } catch (err) {
            if (err.response && err.response.status === 422) {
                setFormErrors(err.response.data.errors);
                setAlert({ message: 'الرجاء مراجعة الأخطاء في النموذج.', type: 'danger' });
            } else {
                const errorMessage = getPersonalizedErrorMessage(err);
                setAlert({ message: errorMessage, type: 'danger' });
            }
            console.error(err);
        } finally {
            setSubmitting(false);
            setTimeout(() => setAlert({ message: '', type: '' }), 3500);
        }
    };

    if (loading) {
        return <AdminLoading />;
    }

    return (
        <AdminPage>
            <AdminPageHeader
                title="تعديل الصفحة الثابتة"
                subtitle={`تعديل محتوى: ${formData.titre}`}
                badge="المحتوى"
                actions={
                    <AdminBtn
                        variant="secondary"
                        icon="la-arrow-right"
                        onClick={() => navigate('/admin/static-pages')}
                    >
                        العودة للصفحات الثابتة
                    </AdminBtn>
                }
            />
            <div className="content-body">
                <AdminCard title="نموذج تعديل صفحة" icon="la-edit">
                    <form onSubmit={handleSubmit}>
                        <div className="form-row">
                            <div className="form-group col-md-4">
                                <label>النوع</label>
                                <select className="form-control" name="type" value={formData.type} onChange={handleInputChange}>
                                    <option value="about">من نحن</option>
                                    <option value="autism">صفحات التوحد</option>
                                    <option value="projects">مشاريعنا</option>
                                </select>
                                {formErrors.type && <div className="text-danger small mt-1">{formErrors.type[0]}</div>}
                            </div>
                            <div className="form-group col-md-8">
                                <label>العنوان</label>
                                <input className="form-control" name="titre" value={formData.titre} onChange={handleInputChange} required />
                                {formErrors.titre && <div className="text-danger small mt-1">{formErrors.titre[0]}</div>}
                            </div>
                        </div>
                        <div className="form-group">
                            {formData.type === 'autism' || formData.type === 'about' || formData.type === 'projects' ? (
                                <div>
                                    <label>المحتوى التفصيلي</label>
                                    <BlockEditor 
                                        value={blockContent}
                                        onChange={handleBlockContentChange}
                                        placeholder="أضف عناوين وفقرات وقوائم لإنشاء محتوى منظم"
                                    />
                                    {formErrors.description_json && <div className="text-danger small mt-1">{formErrors.description_json[0]}</div>}
                                </div>
                            ) : (
                                <div>
                                    <label>الوصف</label>
                                    <textarea className="form-control" name="description" placeholder="الوصف" value={formData.description} onChange={handleInputChange} required />
                                    {formErrors.description && <div className="text-danger small mt-1">{formErrors.description[0]}</div>}
                                </div>
                            )}
                        </div>
                        <div className="form-group">
                            <label>صورة</label>
                            <input type="file" className="form-control-file" name="image" onChange={handleImageChange} />
                            {formErrors.image && <div className="text-danger small mt-1">{formErrors.image[0]}</div>}
                        </div>
                        <div className="text-right">
                            <button type="submit" className="btn btn-primary" disabled={submitting}>
                                {submitting ? <><span className="spinner-border spinner-border-sm mr-2" role="status" aria-hidden="true"></span> جارٍ...</> : 'حفظ التغييرات'}
                            </button>
                        </div>
                    </form>
                </AdminCard>
            </div>
            {alert.message && (
                <AdminAlert message={alert.message} type={alert.type} onClose={() => setAlert({ message: '', type: '' })} />
            )}
        </AdminPage>
    );
};

export default EditStaticPage;