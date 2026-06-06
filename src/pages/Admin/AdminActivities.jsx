import React, { useState, useEffect } from 'react';
import api from '../../api';
import { Link } from 'react-router-dom';

const AdminActivities = () => {
    const [activities, setActivities] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [types, setTypes] = useState([]);
    const [formData, setFormData] = useState({ titre: '', type_activite_id: '', date_activite: '', description: '' });
    const [image, setImage] = useState(null);

    useEffect(() => {
        fetchActivities();
        api.get('/admin/types').then(res => setTypes(res.data));
    }, []);

    const fetchActivities = async () => {
        try {
            const res = await api.get('/admin/activities');
            setActivities(res.data);
            setLoading(false);
        } catch (err) {
            console.error(err);
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const data = new FormData();
        Object.keys(formData).forEach(key => data.append(key, formData[key]));
        if (image) data.append('image_activite', image);

        try {
            await api.post('/admin/activities', data);
            setShowForm(false);
            setFormData({ titre: '', type_activite_id: '', date_activite: '', description: '' });
            setImage(null);
            fetchActivities();
        } catch (err) { alert('خطأ في الإضافة'); }
    };

    const handleDelete = async (id) => {
        if (window.confirm('هل أنت متأكد من حذف هذا النشاط؟')) {
            try {
                await api.delete(`/admin/activities/${id}`);
                fetchActivities();
            } catch (err) {
                alert('خطأ في الحذف');
            }
        }
    };

    return (
        <div className="app-content content">
            <div className="content-wrapper">
                <div className="content-header row">
                    <div className="content-header-left col-md-6 col-12 mb-2">
                        <h3 className="content-header-title">إدارة الأنشطة</h3>
                    </div>
                    <div className="content-header-right col-md-6 col-12 text-right">
                        <button className="btn btn-primary" onClick={() => setShowForm(!showForm)}>
                            {showForm ? 'إلغاء' : 'إضافة نشاط جديد'}
                        </button>
                    </div>
                </div>
                <div className="content-body">
                    {showForm && (
                        <div className="card mb-4 border-primary">
                            <div className="card-body">
                                <form onSubmit={handleSubmit}>
                                    <div className="row">
                                        <div className="form-group col-md-4">
                                            <label>العنوان</label>
                                            <input type="text" className="form-control" value={formData.titre} onChange={(e) => setFormData({...formData, titre: e.target.value})} required />
                                        </div>
                                        <div className="form-group col-md-4">
                                            <label>النوع</label>
                                            <select className="form-control" value={formData.type_activite_id} onChange={(e) => setFormData({...formData, type_activite_id: e.target.value})} required>
                                                <option value="">اختر النوع</option>
                                                {types.map(t => <option key={t.id} value={t.id}>{t.nomActivite}</option>)}
                                            </select>
                                        </div>
                                        <div className="form-group col-md-4">
                                            <label>التاريخ</label>
                                            <input type="date" className="form-control" value={formData.date_activite} onChange={(e) => setFormData({...formData, date_activite: e.target.value})} required />
                                        </div>
                                        <div className="form-group col-md-12">
                                            <label>الوصف</label>
                                            <textarea className="form-control" rows="3" value={formData.description} onChange={(e) => setFormData({...formData, description: e.target.value})} required></textarea>
                                        </div>
                                        <div className="form-group col-md-4">
                                            <label>الصورة</label>
                                            <input type="file" className="form-control-file" onChange={(e) => setImage(e.target.files[0])} />
                                        </div>
                                    </div>
                                    <button type="submit" className="btn btn-success">حفظ النشاط</button>
                                </form>
                            </div>
                        </div>
                    )}
                    <div className="card">
                        <div className="card-content">
                            <div className="table-responsive">
                                <table className="table table-hover">
                                    <thead>
                                        <tr>
                                            <th>العنوان</th>
                                            <th>النوع</th>
                                            <th>التاريخ</th>
                                            <th>العمليات</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {loading ? (
                                            <tr><td colSpan="4" className="text-center">جاري التحميل...</td></tr>
                                        ) : activities.map(act => (
                                            <tr key={act.id}>
                                                <td>{act.titre}</td>
                                                <td>{act.typeactivite?.nomActivite}</td>
                                                <td>{act.date_activite}</td>
                                                <td>
                                                    <button onClick={() => handleDelete(act.id)} className="btn btn-danger btn-sm">حذف</button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminActivities;
