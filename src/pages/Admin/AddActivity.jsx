import React, { useState, useEffect } from 'react';
import api from '../../api';
import { useNavigate } from 'react-router-dom';
import {
    AdminPage, AdminPageHeader, AdminCard, AdminFormGroup, AdminFormActions, AdminBtn
} from '../../components/Admin/ui/AdminUI';

const AddActivity = () => {
    const navigate = useNavigate();
    const [types, setTypes] = useState([]);
    const [formData, setFormData] = useState({
        titre: '',
        type_activite_id: '',
        date_activite: '',
        description: ''
    });
    const [image, setImage] = useState(null);

    useEffect(() => {
        api.get('/admin/types').then(res => setTypes(res.data));
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        const data = new FormData();
        Object.keys(formData).forEach(key => data.append(key, formData[key]));
        if (image) data.append('image_activite', image);

        try {
            await api.post('/admin/activities', data);
            navigate('/admin/activities');
        } catch (err) {
            alert('خطأ في الإضافة');
        }
    };

    return (
        <AdminPage>
            <AdminPageHeader title="إضافة نشاط جديد" subtitle="إنشاء نشاط جديد للموقع" badge="المحتوى" />
            <div className="content-body">
                <AdminCard title="بيانات النشاط" icon="la-calendar">
                    <form onSubmit={handleSubmit}>
                        <AdminFormGroup label="العنوان">
                            <input type="text" className="form-control" value={formData.titre} onChange={(e) => setFormData({ ...formData, titre: e.target.value })} required />
                        </AdminFormGroup>
                        <AdminFormGroup label="النوع">
                            <select className="form-control" value={formData.type_activite_id} onChange={(e) => setFormData({ ...formData, type_activite_id: e.target.value })} required>
                                <option value="">اختر النوع</option>
                                {types.map(t => <option key={t.id} value={t.id}>{t.nomActivite}</option>)}
                            </select>
                        </AdminFormGroup>
                        <AdminFormGroup label="التاريخ">
                            <input type="date" className="form-control" value={formData.date_activite} onChange={(e) => setFormData({ ...formData, date_activite: e.target.value })} required />
                        </AdminFormGroup>
                        <AdminFormGroup label="الوصف">
                            <textarea className="form-control" rows="5" value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} required />
                        </AdminFormGroup>
                        <AdminFormGroup label="الصورة">
                            <input type="file" className="form-control-file" onChange={(e) => setImage(e.target.files[0])} />
                        </AdminFormGroup>
                        <AdminFormActions>
                            <AdminBtn variant="primary" type="submit" icon="la-check">حفظ</AdminBtn>
                            <AdminBtn variant="secondary" icon="la-arrow-right" onClick={() => navigate('/admin/activities')}>رجوع</AdminBtn>
                        </AdminFormActions>
                    </form>
                </AdminCard>
            </div>
        </AdminPage>
    );
};

export default AddActivity;
