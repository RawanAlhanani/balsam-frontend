import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../api';
import {
    AdminPage, AdminPageHeader, AdminFormPanel, AdminFormGroup, AdminFormActions, AdminBtn, AdminAlert
} from '../../components/Admin/ui/AdminUI';

const AddNews = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({ titre: '', description: '' });
    const [image, setImage] = useState(null);
    const [submitting, setSubmitting] = useState(false);
    const [alert, setAlert] = useState({ message: '', type: '' });

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        const data = new FormData();
        data.append('titre', formData.titre);
        data.append('description', formData.description);
        if (image) data.append('image_info', image);

        try {
            await api.post('/admin/news', data);
            setAlert({ message: 'تم إضافة الخبر بنجاح', type: 'success' });
            navigate('/admin/news'); // Redirect to list page
        } catch (err) {
            setAlert({ message: 'خطأ في الإضافة', type: 'danger' });
            console.error(err);
        } finally {
            setSubmitting(false);
            setTimeout(() => setAlert({ message: '', type: '' }), 3500);
        }
    };

    return (
        <AdminPage>
            <AdminPageHeader
                title="إضافة خبر جديد"
                subtitle="أضف تفاصيل الخبر الجديد"
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
                    title="نموذج إضافة خبر"
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
                    </AdminFormGroup>
                    <AdminFormActions>
                        <AdminBtn variant="success" type="submit" icon="la-check" disabled={submitting}>
                            {submitting ? <span className="spinner-border spinner-border-sm"/> : 'حفظ الخبر'}
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

export default AddNews;