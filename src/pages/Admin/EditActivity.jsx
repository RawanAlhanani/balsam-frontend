import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../../api';
import {
    AdminPage, AdminPageHeader, AdminFormPanel, AdminFormGroup, AdminFormActions, AdminBtn, AdminAlert, AdminLoading
} from '../../components/Admin/ui/AdminUI';

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
            setCurrentImage(activity.image_activite ? `http://localhost:8000/storage/MesImages/${activity.image_activite}` : null);
        } catch (err) {
            setAlert({ message: 'خطأ في تحميل النشاط', type: 'danger' });
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
        data.append('_method', 'PUT'); // Important for Laravel to handle PUT with FormData

        try {
            await api.post(`/admin/activities/${id}`, data);
            setAlert({ message: 'تم تحديث النشاط بنجاح', type: 'success' });
            navigate('/admin/activities'); // Redirect to list page
        } catch (err) {
            setAlert({ message: 'خطأ في التحديث', type: 'danger' });
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
                            {currentImage && !image && ( // Show current image if editing and no new image selected
                                <div className="mt-2">
                                    <img src={currentImage} alt="Current Activity" style={{ maxWidth: '100px', maxHeight: '100px', objectFit: 'cover' }} />
                                    <small className="d-block text-muted">الصورة الحالية</small>
                                </div>
                            )}
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