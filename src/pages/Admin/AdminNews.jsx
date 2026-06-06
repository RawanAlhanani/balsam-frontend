import React, { useState, useEffect } from 'react';
import api from '../../api';
import { Link } from 'react-router-dom';

const AdminNews = () => {
    const [news, setNews] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [formData, setFormData] = useState({ titre: '', description: '' });
    const [image, setImage] = useState(null);

    useEffect(() => {
        fetchNews();
    }, []);

    const fetchNews = async () => {
        try {
            const res = await api.get('/admin/news');
            setNews(res.data);
            setLoading(false);
        } catch (err) {
            console.error(err);
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const data = new FormData();
        data.append('titre', formData.titre);
        data.append('description', formData.description);
        if (image) data.append('image_info', image);

        try {
            await api.post('/admin/news', data);
            setShowForm(false);
            setFormData({ titre: '', description: '' });
            setImage(null);
            fetchNews();
        } catch (err) { alert('خطأ في الإضافة'); }
    };

    const handleDelete = async (id) => {
        if (window.confirm('هل أنت متأكد من حذف هذا الخبر؟')) {
            try {
                await api.delete(`/admin/news/${id}`);
                fetchNews();
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
                        <h3 className="content-header-title">إدارة الأخبار</h3>
                    </div>
                    <div className="content-header-right col-md-6 col-12 text-right">
                        <button className="btn btn-primary" onClick={() => setShowForm(!showForm)}>
                            {showForm ? 'إلغاء' : 'إضافة خبر جديد'}
                        </button>
                    </div>
                </div>
                <div className="content-body">
                    {showForm && (
                        <div className="card mb-4 border-primary">
                            <div className="card-body">
                                <form onSubmit={handleSubmit}>
                                    <div className="row">
                                        <div className="form-group col-md-12">
                                            <label>العنوان</label>
                                            <input type="text" className="form-control" value={formData.titre} onChange={(e) => setFormData({...formData, titre: e.target.value})} required />
                                        </div>
                                        <div className="form-group col-md-12">
                                            <label>الوصف</label>
                                            <textarea className="form-control" rows="5" value={formData.description} onChange={(e) => setFormData({...formData, description: e.target.value})} required></textarea>
                                        </div>
                                        <div className="form-group col-md-4">
                                            <label>الصورة</label>
                                            <input type="file" className="form-control-file" onChange={(e) => setImage(e.target.files[0])} />
                                        </div>
                                    </div>
                                    <button type="submit" className="btn btn-success">حفظ الخبر</button>
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
                                            <th>تاريخ الإضافة</th>
                                            <th>العمليات</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {loading ? (
                                            <tr><td colSpan="3" className="text-center">جاري التحميل...</td></tr>
                                        ) : news.map(item => (
                                            <tr key={item.id}>
                                                <td>{item.titre}</td>
                                                <td>{new Date(item.created_at).toLocaleDateString()}</td>
                                                <td>
                                                    <button onClick={() => handleDelete(item.id)} className="btn btn-danger btn-sm">حذف</button>
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

export default AdminNews;
