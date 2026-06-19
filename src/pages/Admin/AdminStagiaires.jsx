import React, { useState, useEffect } from 'react';
import api from '../../api';

const AdminStagiaires = () => {
    const [stagiaires, setStagiaires] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchStagiaires();
    }, []);

    const fetchStagiaires = async () => {
        try {
            // تأكد من أن الرابط يطابق الـ Route المخصص للمتدربين في الـ Backend
            const res = await api.get('/admin/stagiaires');
            setStagiaires(res.data);
            setLoading(false);
        } catch (err) {
            console.error(err);
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('هل أنت متأكد من حذف هذا طلب التدريب هذا؟')) {
            try {
                await api.delete(`/admin/stagiaires/${id}`);
                fetchStagiaires();
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
                        <h3 className="content-header-title">إدارة طلبات التدريب (Stagiaires)</h3>
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
                                            <th>CIN</th>
                                            <th>البريد الإلكتروني</th>
                                            <th>الهاتف</th>
                                            <th>التخصص</th>
                                            <th>المستوى</th>
                                            <th>المؤسسة</th>
                                            <th>مدة التدريب</th>
                                            <th>السيرة الذاتية</th>
                                            <th>العمليات</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {loading ? (
                                            <tr>
                                                <td colSpan="10" className="text-center">جاري التحميل...</td>
                                            </tr>
                                        ) : stagiaires.length === 0 ? (
                                            <tr>
                                                <td colSpan="10" className="text-center text-muted">لا توجد طلبات تدريب مسجلة حالياً.</td>
                                            </tr>
                                        ) : (
                                            stagiaires.map(stg => (
                                                <tr key={stg.id}>
                                                    <td>{`${stg.prenom_stagiaire} ${stg.nom_stagiaire}`}</td>
                                                    <td style={{ fontWeight: 'bold' }}>{stg.cin}</td>
                                                    <td>{stg.email}</td>
                                                    <td>{stg.telephone}</td>
                                                    <td>{stg.specialite}</td>
                                                    <td><span className="badge badge-success">{stg.niveau_etude}</span></td>
                                                    <td>{stg.etablissement}</td>
                                                    <td style={{ fontSize: '12px' }}>{stg.duree_stage}</td>
                                                    <td>
                                                        {stg.cv_path ? (
                                                            <a 
                                                                href={`http://127.0.0.1:8000/storage/${stg.cv_path}`} 
                                                                target="_blank" 
                                                                rel="noopener noreferrer" 
                                                                className="btn btn-info btn-sm"
                                                            >
                                                                عرض الـ CV
                                                            </a>
                                                        ) : (
                                                            <span className="text-muted">غير متوفر</span>
                                                        )}
                                                    </td>
                                                    <td>
                                                        <button onClick={() => handleDelete(stg.id)} className="btn btn-danger btn-sm">حذف</button>
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

export default AdminStagiaires;