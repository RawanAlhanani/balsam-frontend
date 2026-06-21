import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../api';
import {
    AdminPage, AdminPageHeader, AdminCard, AdminLoading, AdminEmptyState, AdminBtn
} from '../../components/Admin/ui/AdminUI';
import { useNavigate } from 'react-router-dom';
import { getStorageUrl } from '../../utils/formatters';

const AdminTuteurs = () => {
    const [tuteurs, setTuteurs] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const isAdmin = localStorage.getItem('is_admin');
        if (!isAdmin) {
            navigate('/connecte');
            return;
        }
        fetchTuteurs();
    }, [navigate]);

    const fetchTuteurs = () => {
        api.get('/admin/tuteurs')
            .then(res => {
                setTuteurs(res.data);
                setLoading(false);
            })
            .catch(err => {
                console.error(err);
                setLoading(false);
            });
    };

    const handleDelete = async (id) => {
        if (window.confirm('هل أنت متأكد من حذف هذا المسجل وجميع بياناته؟')) {
            try {
                await api.delete(`/admin/tuteurs/${id}`);
                fetchTuteurs();
            } catch (err) {
                alert('خطأ في الحذف');
            }
        }
    };

    const rows = tuteurs.flatMap(tuteur =>
        (tuteur.enfants || []).map(enfant => ({ tuteur, enfant }))
    );

    return (
        <AdminPage>
            <AdminPageHeader
                title="أولياء الأمور والأبناء"
                subtitle="عرض بيانات المسجلين وأطفالهم"
                badge="المسجلين"
            />
            <div className="content-body">
                <AdminCard title="قائمة المسجلين" icon="la-users" flush>
                    {loading ? (
                        <AdminLoading />
                    ) : rows.length === 0 ? (
                        <AdminEmptyState icon="la-users" message="لا يوجد مسجلين حالياً" />
                    ) : (
                        <div className="table-responsive admin-table-wrap admin-table-scroll">
                            <table className="table table-hover admin-table">
                                <thead>
                                    <tr>
                                        <th>الاسم العائلي</th>
                                        <th>الاسم الشخصي</th>
                                        <th>الهاتف</th>
                                        <th>الواتساب</th>
                                        <th>تكوين</th>
                                        <th>رقم البطاقة</th>
                                        <th>العنوان</th>
                                        <th>المنطقة</th>
                                        <th>اسم الطفل</th>
                                        <th>تاريخ الازدياد</th>
                                        <th>جنس الطفل</th>
                                        <th>حالة التوحد</th>
                                        <th>كلام الطفل</th>
                                        <th>مرافق</th>
                                        <th>متمدرس</th>
                                        <th>الصورة</th>
                                        <th>العمليات</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {rows.map(({ tuteur, enfant }) => (
                                        <tr key={enfant.id}>
                                            <td>{tuteur.nom_tuteur}</td>
                                            <td>{tuteur.prenom_tuteur}</td>
                                            <td>{tuteur.telephon}</td>
                                            <td>{tuteur.whatsapp}</td>
                                            <td>{tuteur.formation == 1 ? 'نعم' : 'لا'}</td>
                                            <td>{tuteur.CIN}</td>
                                            <td>{tuteur.adresse}</td>
                                            <td>{tuteur.region?.nom_region}</td>
                                            <td>{enfant.prenom_enfant} {enfant.nom_enfant}</td>
                                            <td>{enfant.date_naissance}</td>
                                            <td>{enfant.sexeEnfant == 2 ? 'ذكر' : 'أنثى'}</td>
                                            <td>
                                                {enfant.statut == 1 ? 'خفيف' : enfant.statut == 2 ? 'متوسط' : 'شديد'}
                                            </td>
                                            <td>
                                                {enfant.parole == 1 ? 'غير متكلم' : enfant.parole == 2 ? 'أصوات' : enfant.parole == 3 ? 'كلمات' : 'يتكلم'}
                                            </td>
                                            <td>{enfant.avs == 1 ? 'نعم' : 'لا'}</td>
                                            <td>{enfant.etude == 1 ? 'نعم' : 'لا'}</td>
                                            <td>
                                                <img className="admin-child-photo" src={getStorageUrl(enfant.photo || 'Profile.png')} alt="" />
                                            </td>
                                            <td>
                                                <div className="admin-action-group">
                                                    <Link to={`/admin/editTuteur/${enfant.id}`} className="btn btn-sm btn-warning admin-action-btn">
                                                        <i className="la la-edit" /> تعديل
                                                    </Link>
                                                    <AdminBtn variant="danger" icon="la-trash" onClick={() => handleDelete(tuteur.id)}>حذف</AdminBtn>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </AdminCard>
            </div>
        </AdminPage>
    );
};

export default AdminTuteurs;
