import React, { useState, useEffect } from 'react';
import api from '../../api';
import { Link } from 'react-router-dom';

const AdminActivities = () => {
    const [activities, setActivities] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchActivities();
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
                        <h3 className="content-header-title">جميع الأنشطة</h3>
                    </div>
                    <div className="content-header-right col-md-6 col-12 text-right">
                        <Link to="/admin/ajoutActivite" className="btn btn-info">إضافة نشاط جديد</Link>
                    </div>
                </div>
                <div className="content-body">
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
