import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../../api';
import {
    AdminPage, AdminPageHeader, AdminFormPanel, AdminFormGroup, AdminFormActions, AdminBtn, AdminAlert, AdminLoading
} from '../../components/Admin/ui/AdminUI';

const EditNews = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [formData, setFormData] = useState({ titre: '', description: '' });
    const [image, setImage] = useState(null);
    const [submitting, setSubmitting] = useState(false);
    const [loadingNews, setLoadingNews] = useState(true);
    const [alert, setAlert] = useState({ message: '', type: '' });
    const [currentImage, setCurrentImage] = useState(null);

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
            setAlert({ message: 'خطأ في تحميل الخبر', type: 'danger' });
            console.error(err);
        } finally {
            setLoadingNews(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);
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
            setAlert({ message: 'خطأ في التحديث', type: 'danger' });
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
                        <input type="text" className="form-control" value={formData.titre} onChange={(e) => setFormData({ ...formData, titre: e.target.value })} required />
                    </AdminFormGroup>
                    <AdminFormGroup label="الوصف">
                        <textarea className="form-control" rows="5" value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} required />
                    </AdminFormGroup>
                    <AdminFormGroup label="الصورة">
                        <input type="file" className="form-control-file" onChange={(e) => setImage(e.target.files[0])} />
                        {currentImage && !image && ( // Show current image if editing and no new image selected
                            <div className="mt-2">
                                <img src={currentImage} alt="Current News" style={{ maxWidth: '100px', maxHeight: '100px', objectFit: 'cover' }} />
                                <small className="d-block text-muted">الصورة الحالية</small>
                            </div>
                        )}
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