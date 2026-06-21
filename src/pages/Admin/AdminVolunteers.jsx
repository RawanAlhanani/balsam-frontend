import React, { useState, useEffect } from 'react';
import api from '../../api';
import {
    AdminPage, AdminPageHeader, AdminCard, AdminLoading, AdminEmptyState,
    AdminTableWrap, AdminBtn
} from '../../components/Admin/ui/AdminUI';

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
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('هل أنت متأكد من حذف طلب التطوع هذا؟')) {
            try {
                await api.delete(`/admin/volunteers/${id}`);
                fetchVolunteers();
            } catch (err) {
                alert('خطأ في الحذف');
            }
        }
    };

    const parseInterests = (interests) => {
        if (!interests) return [];
        return Array.isArray(interests) ? interests : JSON.parse(interests);
    };

    return (
        <AdminPage>
            <AdminPageHeader
                title="إدارة طلبات التطوع"
                subtitle="عرض ومراجعة طلبات التطوع المقدمة من الموقع"
                badge="التطوع"
            />
            <div className="content-body">
                <AdminCard title="قائمة الطلبات" icon="la-heart-o" flush>
                    {loading ? (
                        <AdminLoading />
                    ) : volunteers.length === 0 ? (
                        <AdminEmptyState
                            icon="la-heart-o"
                            message="لا توجد طلبات تطوع مسجلة حالياً"
                            hint="ستظهر الطلبات هنا عند تقديمها من الموقع"
                        />
                    ) : (
                        <AdminTableWrap>
                            <table className="table table-hover admin-table">
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
                                    {volunteers.map(vol => (
                                        <tr key={vol.id}>
                                            <td>{`${vol.prenom_tuteur} ${vol.nom_tuteur}`}</td>
                                            <td>{vol.email_tuteur}</td>
                                            <td>{vol.professional_field}</td>
                                            <td>
                                                {vol.interests ? (
                                                    parseInterests(vol.interests).map((interest, idx) => (
                                                        <span key={idx} className="admin-tag">{interest}</span>
                                                    ))
                                                ) : (
                                                    <span className="text-muted">غير محدد</span>
                                                )}
                                            </td>
                                            <td><strong>{vol.nom_utilisateur}</strong></td>
                                            <td>
                                                <AdminBtn variant="danger" icon="la-trash" onClick={() => handleDelete(vol.id)}>
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

export default AdminVolunteers;
