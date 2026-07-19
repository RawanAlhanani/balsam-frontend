import React, { useState, useEffect } from 'react';
import api from '../../api';
import { getStorageUrl } from '../../utils/formatters';
import {
    AdminPage, AdminPageHeader, AdminCard, AdminFormGroup, AdminBtn, AdminAlert, AdminLoading, AdminEmptyState, AdminPagination
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

const AdminImages = () => {
    const [sliders, setSliders] = useState([]);
    const [gallery, setGallery] = useState([]);
    const [sliderImage, setSliderImage] = useState(null);
    const [galleryImage, setGalleryImage] = useState(null);
    const [loading, setLoading] = useState(true);
    const [submittingSlider, setSubmittingSlider] = useState(false);
    const [submittingGallery, setSubmittingGallery] = useState(false);
    const [deleting, setDeleting] = useState(false);
    const [alert, setAlert] = useState({ message: '', type: '' });
    const [formErrors, setFormErrors] = useState({}); // New state for form errors

    // State for delete confirmation modal
    const [showDeleteConfirmModal, setShowDeleteConfirmModal] = useState(false);
    const [deleteTarget, setDeleteTarget] = useState(null); // { type, id, name }

    const [galleryPage, setGalleryPage] = useState(1);
    const [galleryLastPage, setGalleryLastPage] = useState(1);

    useEffect(() => { fetchImages(); }, [galleryPage]);

    // Lock background scroll and interactions when delete modal is open
    useEffect(() => {
        if (showDeleteConfirmModal) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
        return () => { document.body.style.overflow = ''; };
    }, [showDeleteConfirmModal]);

    const fetchImages = async () => {
        setLoading(true);
        try {
            const [s, g] = await Promise.all([
                api.get('/admin/sliders'),
                api.get('/admin/gallery', { params: { page: galleryPage } })
            ]);
            setSliders(s.data);
            setGallery(g.data.data);
            setGalleryLastPage(g.data.last_page);
        } catch (err) {
            const errorMessage = getPersonalizedErrorMessage(err);
            setAlert({ message: errorMessage, type: 'danger' });
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleUpload = async (type, file) => {
        if (!file) {
            setAlert({ message: 'الرجاء اختيار صورة للرفع.', type: 'danger' });
            setTimeout(() => setAlert({ message: '', type: '' }), 3500);
            return;
        }

        if (type === 'sliders') setSubmittingSlider(true);
        if (type === 'gallery') setSubmittingGallery(true);
        setFormErrors({}); // Clear previous errors
        setAlert({ message: '', type: '' }); // Clear general alert

        const data = new FormData();
        data.append('image', file);

        try {
            await api.post(`/admin/${type}`, data);
            setAlert({ message: 'تم رفع الصورة بنجاح', type: 'success' });
            if (type === 'sliders') setSliderImage(null);
            else setGalleryImage(null);
            fetchImages();
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
            if (type === 'sliders') setSubmittingSlider(false);
            if (type === 'gallery') setSubmittingGallery(false);
            setTimeout(() => setAlert({ message: '', type: '' }), 3500);
        }
    };

    const promptDelete = (type, id, name) => {
        setDeleteTarget({ type, id, name });
        setShowDeleteConfirmModal(true);
    };

    const confirmDelete = async () => {
        if (!deleteTarget || deleting) return;
        setDeleting(true);
        try {
            await api.delete(`/admin/${deleteTarget.type}/${deleteTarget.id}`);
            setAlert({ message: 'تم حذف الصورة بنجاح', type: 'success' });
            setShowDeleteConfirmModal(false);
            setDeleteTarget(null);
            fetchImages();
        } catch (err) {
            const errorMessage = getPersonalizedErrorMessage(err);
            setAlert({ message: errorMessage, type: 'danger' });
            setShowDeleteConfirmModal(false);
            setDeleteTarget(null);
            console.error(err);
        } finally {
            setDeleting(false);
            setTimeout(() => setAlert({ message: '', type: '' }), 3500);
        }
    };

    if (loading) {
        return <AdminLoading />;
    }

    return (
        <>
            <AdminPage>
                <AdminPageHeader
                    title="إدارة الصور والمعرض"
                    subtitle="رفع وإدارة صور السلايدر ومعرض الصور"
                    badge="الوسائط"
                />
                <div className="content-body">
                    <div className="row">
                        <div className="col-md-6">
                            <AdminCard title="الصور الرئيسية (Slider)" icon="la-image">
                                <AdminFormGroup label="رفع صورة جديدة">
                                    <input type="file" className="form-control mb-2" onChange={e => { setSliderImage(e.target.files[0]); setFormErrors(prev => ({ ...prev, image: null })); }} />
                                    {formErrors.image && <div className="text-danger small mt-1">{formErrors.image[0]}</div>}
                                    <AdminBtn variant="info" icon="la-upload" className="w-100 mb-3" onClick={() => handleUpload('sliders', sliderImage)} disabled={submittingSlider}>
                                        {submittingSlider ? <><span className="spinner-border spinner-border-sm mr-2" role="status" aria-hidden="true"></span> جارٍ الرفع...</> : 'رفع للسلايدر'}
                                    </AdminBtn>
                                </AdminFormGroup>
                                {sliders.length === 0 ? (
                                    <AdminEmptyState icon="la-image" message="لا توجد صور في السلايدر" hint="يمكنك رفع صور جديدة أعلاه" />
                                ) : (
                                    <div className="admin-image-grid">
                                        {sliders.map(s => (
                                            <div key={s.id} className="admin-image-item">
                                                <img src={getStorageUrl(s.nomImage)} alt="" />
                                                <AdminBtn variant="danger" size="sm" icon="la-trash" onClick={() => promptDelete('sliders', s.id, `صورة السلايدر ${s.id}`)}>حذف</AdminBtn>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </AdminCard>
                        </div>
                        <div className="col-md-6">
                            <AdminCard title="معرض الصور (Gallery)" icon="la-images">
                                <AdminFormGroup label="رفع صورة جديدة">
                                    <input type="file" className="form-control mb-2" onChange={e => { setGalleryImage(e.target.files[0]); setFormErrors(prev => ({ ...prev, image: null })); }} />
                                    {formErrors.image && <div className="text-danger small mt-1">{formErrors.image[0]}</div>}
                                    <AdminBtn variant="success" icon="la-upload" className="w-100 mb-3" onClick={() => handleUpload('gallery', galleryImage)} disabled={submittingGallery}>
                                        {submittingGallery ? <><span className="spinner-border spinner-border-sm mr-2" role="status" aria-hidden="true"></span> جارٍ الرفع...</> : 'رفع للمعرض'}
                                    </AdminBtn>
                                </AdminFormGroup>
                                {gallery.length === 0 ? (
                                    <AdminEmptyState icon="la-images" message="لا توجد صور في المعرض" hint="يمكنك رفع صور جديدة أعلاه" />
                                ) : (
                                    <div className="admin-image-grid">
                                        {gallery.map(g => (
                                            <div key={g.id} className="admin-image-item">
                                                <img src={getStorageUrl(g.nomImage)} alt="" />
                                                <AdminBtn variant="danger" size="sm" icon="la-trash" onClick={() => promptDelete('gallery', g.id, `صورة المعرض ${g.id}`)}>حذف</AdminBtn>
                                            </div>
                                        ))}
                                    </div>
                                )}
                                <AdminPagination currentPage={galleryPage} lastPage={galleryLastPage} onPageChange={setGalleryPage} />
                            </AdminCard>
                        </div>
                    </div>
                </div>
            </AdminPage>

            <DeleteConfirmModal
                show={showDeleteConfirmModal}
                onClose={() => setShowDeleteConfirmModal(false)}
                onConfirm={confirmDelete}
                itemName={deleteTarget ? deleteTarget.name : ''}
                isDeleting={deleting}
            />

            {alert.message && (
                <AdminAlert message={alert.message} type={alert.type} onClose={() => setAlert({ message: '', type: '' })} />
            )}
        </>
    );
};

export default AdminImages;