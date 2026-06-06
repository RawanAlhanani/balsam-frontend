import React, { useState, useEffect } from 'react';
import api from '../../api';
import { Link } from 'react-router-dom';
import { getStorageUrl } from '../../utils/formatters';

const AdminPartners = () => {
    const [partners, setPartners] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [nomPartenaire, setNomPartenaire] = useState('');
    const [image, setImage] = useState(null);

    useEffect(() => {
        fetchPartners();
    }, []);

    const fetchPartners = async () => {
        try {
            const res = await api.get('/admin/partners');
            setPartners(res.data);
            setLoading(false);
        } catch (err) {
            console.error(err);
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const data = new FormData();
        data.append('nomPartenaire', nomPartenaire);
        if (image) data.append('imagePartenaire', image);

        try {
            await api.post('/admin/partners', data);
            setShowForm(false);
            setNomPartenaire('');
            setImage(null);
            fetchPartners();
        } catch (err) { alert('خطأ في الإضافة'); }
    };

    const handleDelete = async (id) => {
        if (window.confirm('هل أنت متأكد من حذف هذا الشريك؟')) {
            try {
                await api.delete(`/admin/partners/${id}`);
                fetchPartners();
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
                        <h3 className="content-header-title">إدارة الشركاء</h3>
                    </div>
                    <div className="content-header-right col-md-6 col-12 text-right">
                        <button className="btn btn-primary" onClick={() => setShowForm(!showForm)}>
                            {showForm ? 'إلغاء' : 'إضافة شريك جديد'}
                        </button>
                    </div>
                </div>
                <div className="content-body">
                    {showForm && (
                        <div className="card mb-4 border-primary">
                            <div className="card-body">
                                <form onSubmit={handleSubmit}>
                                    <div className="row">
                                        <div className="form-group col-md-6">
                                            <label>اسم الشريك</label>
                                            <input type="text" className="form-control" value={nomPartenaire} onChange={(e) => setNomPartenaire(e.target.value)} required />
                                        </div>
                                        <div className="form-group col-md-4">
                                            <label>الشعار</label>
                                            <input type="file" className="form-control-file" onChange={(e) => setImage(e.target.files[0])} required />
                                        </div>
                                    </div>
                                    <button type="submit" className="btn btn-success">حفظ الشريك</button>
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
                                            <th>الاسم</th>
                                            <th>الشعار</th>
                                            <th>العمليات</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {loading ? (
                                            <tr><td colSpan="3" className="text-center">جاري التحميل...</td></tr>
                                        ) : partners.map(p => (
                                            <tr key={p.id}>
                                                <td>{p.nomPartenaire}</td>
                                                <td>
                                                    <img src={getStorageUrl(p.imagePartenaire)} alt={p.nomPartenaire} style={{ width: '50px' }} />
                                                </td>
                                                <td>
                                                    <button onClick={() => handleDelete(p.id)} className="btn btn-danger btn-sm">حذف</button>
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

export default AdminPartners;
