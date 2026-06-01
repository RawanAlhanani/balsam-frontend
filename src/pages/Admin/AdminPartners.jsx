import React, { useState, useEffect } from 'react';
import api from '../../api';
import { Link } from 'react-router-dom';
import { getStorageUrl } from '../../utils/formatters';

const AdminPartners = () => {
    const [partners, setPartners] = useState([]);
    const [loading, setLoading] = useState(true);

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
                        <h3 className="content-header-title">جميع الشركاء</h3>
                    </div>
                    <div className="content-header-right col-md-6 col-12 text-right">
                        <Link to="/admin/ajoutPartenaire" className="btn btn-info">إضافة شريك جديد</Link>
                    </div>
                </div>
                <div className="content-body">
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
