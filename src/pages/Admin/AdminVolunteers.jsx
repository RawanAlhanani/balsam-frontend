import React, { useState, useEffect } from 'react';
import api from '../../api';

const AdminVolunteers = () => {
    const [volunteers, setVolunteers] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchVolunteers();
    }, []);

const fetchVolunteers = async () => {
        try {
            const res = await api.get('/admin/volunteers');
            setVolunteers(res.data.data); 
            setLoading(false);
        } catch (err) {
            console.error(err);
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('هل أنت متأكد من حذف طلب التطوع هذا؟')) {
            try {
                await api.delete(`/admin/volunteers/${id}`);
                // استدعاء دالة الجلب مجدداً لتحديث الجدول فوراً كما فعلت مع المتدربين
                fetchVolunteers();
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
                        <h3 className="content-header-title">إدارة طلبات التطوع (Volunteers)</h3>
                    </div>
                </div>
                
                <div className="content-body">
                    <div className="card">
                        <div className="card-content">
                            <div className="table-responsive">
                                <table className="table table-hover" style={{ direction: 'rtl', textAlign: 'right' }}>
                                    <thead>
                                        <tr>
                                            <th>الاسم الكامل</th>
                                            <th>البريد الإلكتروني</th>
                                            <th>المجال المهني</th>
                                            <th>مجالات الاهتمام</th>
                                            <th>اسم المستخدم</th>
                                            <th>العمليات</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {loading ? (
                                            <tr>
                                                <td colSpan="6" className="text-center">جاري التحميل...</td>
                                            </tr>
                                        ) : volunteers.length === 0 ? (
                                            <tr>
                                                <td colSpan="6" className="text-center text-muted">لا توجد طلبات تطوع مسجلة حالياً.</td>
                                            </tr>
                                        ) : (
                                            volunteers.map(vol => (
                                                <tr key={vol.id}>
                                                    <td>{`${vol.prenom_tuteur} ${vol.nom_tuteur}`}</td>
                                                    <td>{vol.email_tuteur}</td>
                                                    <td>{vol.professional_field}</td>
                                                    <td>
                                                        {vol.interests ? (
                                                            (Array.isArray(vol.interests) ? vol.interests : JSON.parse(vol.interests)).map((interest, idx) => (
                                                                <span key={idx} className="badge badge-success" style={{ marginLeft: '5px' }}>
                                                                    {interest}
                                                                </span>
                                                            ))
                                                        ) : (
                                                            <span className="text-muted">غير محدد</span>
                                                        )}
                                                    </td>
                                                    <td style={{ fontWeight: 'bold' }}>{vol.nom_utilisateur}</td>
                                                    <td>
                                                        <button onClick={() => handleDelete(vol.id)} className="btn btn-danger btn-sm">حذف</button>
                                                    </td>
                                                </tr>
                                            ))
                                        )}
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

export default AdminVolunteers;