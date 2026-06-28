import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../api';
import {
    AdminPage, AdminPageHeader, AdminFormPanel, AdminFormGroup, AdminFormActions, AdminBtn, AdminAlert, AdminLoading
} from '../../components/Admin/ui/AdminUI';

const AddActivity = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({ titre: '', type_activite_id: '', date_activite: '', description: '' });
    const [image, setImage] = useState(null);
    const [types, setTypes] = useState([]);
    const [submitting, setSubmitting] = useState(false);
    const [loadingTypes, setLoadingTypes] = useState(true);
    const [alert, setAlert] = useState({ message: '', type: '' });

    useEffect(() => {
        fetchTypes();
    }, []);

    const fetchTypes = async () => {
        setLoadingTypes(true);
        try {
            const res = await api.get('/admin/types');
            setTypes(res.data);
        } catch (err) {
            setAlert({ message: 'خطأ في تحميل أنواع الأنشطة', type: 'danger' });
            console.error(err);
        } finally {
            setLoadingTypes(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        const data = new FormData();
        Object.keys(formData).forEach(key => data.append(key, formData[key]));
        if (image) data.append('image_activite', image);

        try {
            await api.post('/admin/activities', data);
            setAlert({ message: 'تم إضافة النشاط بنجاح', type: 'success' });
            navigate('/admin/activities'); // Redirect to list page
        } catch (err) {
            setAlert({ message: 'خطأ في الإضافة', type: 'danger' });
            console.error(err);
        } finally {
            setSubmitting(false);
            setTimeout(() => setAlert({ message: '', type: '' }), 3500);
        }
    };

    if (loadingTypes) {
        return <AdminLoading />;
    }

    return (
        <AdminPage>
            <AdminPageHeader
                title="إضافة نشاط جديد"
                subtitle="أضف تفاصيل النشاط الجديد"
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
                    title="نموذج إضافة نشاط"
                    open={true} // Always open on this page
                    onClose={() => navigate('/admin/activities')} // Navigate back on close
                    onSubmit={handleSubmit}
                >
                    <div className="row">
                        <AdminFormGroup label="العنوان" className="col-md-4">
                            <input type="text" className="form-control" value={formData.titre} onChange={(e) => setFormData({ ...formData, titre: e.target.value })} required />
                        </AdminFormGroup>
                        <AdminFormGroup label="النوع" className="col-md-4">
                            <select className="form-control" value={formData.type_activite_id} onChange={(e) => setFormData({ ...formData, type_activite_id: e.target.value })} required>
                                <option value="">اختر النوع</option>
                                {types.map(t => <option key={t.id} value={t.id}>{t.nomActivite}</option>)}
                            </select>
                        </AdminFormGroup>
                        <AdminFormGroup label="التاريخ" className="col-md-4">
                            <input type="date" className="form-control" value={formData.date_activite} onChange={(e) => setFormData({ ...formData, date_activite: e.target.value })} required />
                        </AdminFormGroup>
                        <AdminFormGroup label="الوصف" className="col-md-12">
                            <textarea className="form-control" rows="3" value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} required />
                        </AdminFormGroup>
                        <AdminFormGroup label="الصورة" className="col-md-4">
                            <input type="file" className="form-control-file" onChange={(e) => setImage(e.target.files[0])} />
                        </AdminFormGroup>
                    </div>
                    <AdminFormActions>
                        <AdminBtn variant="success" type="submit" icon="la-check" disabled={submitting}>
                            {submitting ? <span className="spinner-border spinner-border-sm"/> : 'حفظ النشاط'}
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

export default AddActivity;