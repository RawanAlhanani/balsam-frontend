import React, { useState, useEffect } from 'react';
import api from '../../api';
import {
    AdminPage, AdminPageHeader, AdminCard, AdminLoading, AdminEmptyState,
    AdminTableWrap, AdminBtn
} from '../../components/Admin/ui/AdminUI';

const AdminStagiaires = () => {
    const [stagiaires, setStagiaires] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchStagiaires();
    }, []);

    const fetchStagiaires = async () => {
        try {
            const res = await api.get('/admin/stagiaires');
            setStagiaires(res.data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('هل أنت متأكد من حذف طلب التدريب هذا؟')) {
            try {
                await api.delete(`/admin/stagiaires/${id}`);
                fetchStagiaires();
            } catch (err) {
                alert('خطأ في الحذف');
            }
        }
    };

    return (
        <AdminPage>
            <AdminPageHeader
                title="إدارة طلبات التدريب"
                subtitle="مراجعة طلبات التدريب والسير الذاتية"
                badge="التدريب"
            />
            <div className="content-body">
                <AdminCard title="قائمة المتدربين" icon="la-user-plus" flush>
                    {loading ? (
                        <AdminLoading />
                    ) : stagiaires.length === 0 ? (
                        <AdminEmptyState
                            icon="la-user-plus"
                            message="لا توجد طلبات تدريب مسجلة حالياً"
                            hint="ستظهر الطلبات هنا عند تقديمها من الموقع"
                        />
                    ) : (
                        <AdminTableWrap>
                            <table className="table table-hover admin-table">
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
                                    {stagiaires.map(stg => (
                                        <tr key={stg.id}>
                                            <td>{`${stg.prenom_stagiaire} ${stg.nom_stagiaire}`}</td>
                                            <td><strong>{stg.cin}</strong></td>
                                            <td>{stg.email}</td>
                                            <td>{stg.telephone}</td>
                                            <td>{stg.specialite}</td>
                                            <td><span className="admin-tag">{stg.niveau_etude}</span></td>
                                            <td>{stg.etablissement}</td>
                                            <td>{stg.duree_stage}</td>
                                            <td>
                                                {stg.cv_path ? (
                                                    <a
                                                        href={`http://127.0.0.1:8000/storage/${stg.cv_path}`}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="btn btn-sm btn-outline-info admin-action-btn"
                                                    >
                                                        <i className="la la-file-text-o" /> عرض CV
                                                    </a>
                                                ) : (
                                                    <span className="text-muted">غير متوفر</span>
                                                )}
                                            </td>
                                            <td>
                                                <AdminBtn variant="danger" icon="la-trash" onClick={() => handleDelete(stg.id)}>
                                                    حذف
                                                </AdminBtn>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </AdminTableWrap>
                    )}
                </AdminCard>
            </div>
        </AdminPage>
    );
};

export default AdminStagiaires;
