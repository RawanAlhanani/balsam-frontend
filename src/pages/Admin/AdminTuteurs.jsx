import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../api';
import {
    AdminPage, AdminPageHeader, AdminCard, AdminLoading, AdminEmptyState, AdminBtn, AdminAlert
} from '../../components/Admin/ui/AdminUI';
import { useNavigate } from 'react-router-dom';
import { getStorageUrl } from '../../utils/formatters';
import DeleteConfirmModal from '../../components/Admin/modals/DeleteConfirmModal';

// Helper function to personalize error messages
const getPersonalizedErrorMessage = (error) => {
    let rawMessage = '';
    if (error.response && error.response.data && error.response.data.message) {
        rawMessage = error.response.data.message.toLowerCase();
    } else if (error.message) {
        rawMessage = error.message.toLowerCase();
    }

    // Specific backend/SQL error patterns
    if (rawMessage.includes('sqlstate') || rawMessage.includes('database error') || rawMessage.includes('syntax error')) {
        return 'حدث خطأ في قاعدة البيانات. الرجاء إبلاغ الدعم الفني.'; // Database error. Please contact support.
    }
    if (rawMessage.includes('internal server error') || rawMessage.includes('undefined')) {
        return 'حدث خطأ غير متوقع من الخادم. الرجاء المحاولة مرة أخرى لاحقًا.'; // An unexpected server error occurred. Please try again later.
    }
    if (rawMessage.includes('network error') || rawMessage.includes('failed to fetch')) {
        return 'فشل الاتصال بالخادم. الرجاء التحقق من اتصالك بالإنترنت والمحاولة مرة أخرى.'; // Failed to connect to the server. Please check your internet connection and try again.
    }

    // If the backend provided a message that doesn't match technical patterns, use it.
    // Assuming the backend message is already in Arabic or user-friendly if it's not a technical error.
    if (error.response && error.response.data && error.response.data.message) {
        return error.response.data.message;
    }

    // Fallback for any other unhandled errors
    return 'حدث خطأ ما. الرجاء المحاولة مرة أخرى.'; // Something went wrong. Please try again.
};

const AdminTuteurs = () => {
    const [tuteurs, setTuteurs] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();
    const [alert, setAlert] = useState({ message: '', type: '' });
    const [deleting, setDeleting] = useState(false);

    // State for delete confirmation modal
    const [showDeleteConfirmModal, setShowDeleteConfirmModal] = useState(false);
    const [deleteTargetId, setDeleteTargetId] = useState(null);
    const [deleteTargetName, setDeleteTargetName] = useState('');

    useEffect(() => {
        const isAdmin = localStorage.getItem('is_admin');
        if (!isAdmin) {
            navigate('/connecte');
            return;
        }
        fetchTuteurs();
    }, [navigate]);

    // Lock background scroll and interactions when delete modal is open
    useEffect(() => {
        if (showDeleteConfirmModal) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
        return () => { document.body.style.overflow = ''; };
    }, [showDeleteConfirmModal]);

    const fetchTuteurs = async () => {
        setLoading(true);
        try {
            const res = await api.get('/admin/tuteurs');
            setTuteurs(res.data);
        } catch (err) {
            const errorMessage = getPersonalizedErrorMessage(err);
            setAlert({ message: errorMessage, type: 'danger' });
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const promptDelete = (id, name) => {
        setDeleteTargetId(id);
        setDeleteTargetName(name);
        setShowDeleteConfirmModal(true);
    };

    const confirmDelete = async () => {
        if (!deleteTargetId || deleting) return;
        setDeleting(true);
        try {
            await api.delete(`/admin/tuteurs/${deleteTargetId}`);
            setAlert({ message: 'تم حذف المسجل بنجاح', type: 'success' });
            setShowDeleteConfirmModal(false);
            setDeleteTargetId(null);
            setDeleteTargetName('');
            fetchTuteurs();
        } catch (err) {
            const errorMessage = getPersonalizedErrorMessage(err);
            setAlert({ message: errorMessage, type: 'danger' });
            setShowDeleteConfirmModal(false);
            setDeleteTargetId(null);
            setDeleteTargetName('');
            console.error(err);
        } finally {
            setDeleting(false);
            setTimeout(() => setAlert({ message: '', type: '' }), 3500);
        }
    };

    const rows = tuteurs.flatMap(tuteur =>
        (tuteur.enfants || []).map(enfant => ({ tuteur, enfant }))
    );

    return (
        <>
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
                                                        <AdminBtn variant="danger" icon="la-trash" onClick={() => promptDelete(tuteur.id, `${tuteur.nom_tuteur} ${tuteur.prenom_tuteur}`)}>حذف</AdminBtn>
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

            <DeleteConfirmModal
                show={showDeleteConfirmModal}
                onClose={() => setShowDeleteConfirmModal(false)}
                onConfirm={confirmDelete}
                itemName={deleteTargetName}
                isDeleting={deleting}
            />

            {alert.message && (
                <AdminAlert message={alert.message} type={alert.type} onClose={() => setAlert({ message: '', type: '' })} />
            )}
        </>
    );
};

export default AdminTuteurs;