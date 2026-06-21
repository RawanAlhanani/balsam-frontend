import React, { useState } from 'react';
import api from '../../api';
import { useNavigate } from 'react-router-dom';
import {
    AdminPage, AdminPageHeader, AdminCard, AdminFormGroup, AdminFormActions, AdminBtn
} from '../../components/Admin/ui/AdminUI';

const AddNews = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({ titre: '', description: '' });
    const [image, setImage] = useState(null);

    const handleSubmit = async (e) => {
        e.preventDefault();
        const data = new FormData();
        data.append('titre', formData.titre);
        data.append('description', formData.description);
        if (image) data.append('image_info', image);

        try {
            await api.post('/admin/news', data);
            navigate('/admin/news');
        } catch (err) {
            alert('خطأ في الإضافة');
        }
    };

    return (
        <AdminPage>
            <AdminPageHeader title="إضافة خبر جديد" subtitle="نشر خبر على الموقع" badge="المحتوى" />
            <div className="content-body">
                <AdminCard title="بيانات الخبر" icon="la-newspaper-o">
                    <form onSubmit={handleSubmit}>
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
                            <AdminBtn variant="primary" type="submit" icon="la-check">حفظ</AdminBtn>
                            <AdminBtn variant="secondary" icon="la-arrow-right" onClick={() => navigate('/admin/news')}>رجوع</AdminBtn>
                        </AdminFormActions>
                    </form>
                </AdminCard>
            </div>
        </AdminPage>
    );
};

export default AddNews;
