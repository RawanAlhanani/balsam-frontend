import React, { useState, useEffect } from 'react';
import api from '../../api';
import {
    AdminPage, AdminPageHeader, AdminCard, AdminLoading, AdminEmptyState,
    AdminTableWrap, AdminBtn, AdminAlert
} from '../../components/Admin/ui/AdminUI';
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

const AdminVolunteers = () => {
    const [volunteers, setVolunteers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [alert, setAlert] = useState({ message: '', type: '' });
    const [deleting, setDeleting] = useState(false);

    // State for delete confirmation modal
    const [showDeleteConfirmModal, setShowDeleteConfirmModal] = useState(false);
    const [deleteTargetId, setDeleteTargetId] = useState(null);
    const [deleteTargetName, setDeleteTargetName] = useState('');

    useEffect(() => {
        fetchVolunteers();
    }, []);

    // Lock background scroll and interactions when delete modal is open
    useEffect(() => {
        if (showDeleteConfirmModal) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
        return () => { document.body.style.overflow = ''; };
    }, [showDeleteConfirmModal]);

    const fetchVolunteers = async () => {
        setLoading(true);
        try {
            const res = await api.get('/admin/volunteers');
            setVolunteers(res.data.data);
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
            await api.delete(`/admin/volunteers/${deleteTargetId}`);
            setAlert({ message: 'تم حذف طلب التطوع بنجاح', type: 'success' });
            setShowDeleteConfirmModal(false);
            setDeleteTargetId(null);
            setDeleteTargetName('');
            fetchVolunteers();
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

    const parseInterests = (interests) => {
        if (!interests) return [];
        try {
            const parsed = JSON.parse(interests);
            return Array.isArray(parsed) ? parsed : [];
        } catch (e) {
            console.error("Failed to parse interests:", e);
            return [];
        }
    };

    return (
        <>
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
                                                    <AdminBtn permission="delete_volunteers" variant="danger" icon="la-trash" onClick={() => promptDelete(vol.id, `${vol.prenom_tuteur} ${vol.nom_tuteur}`)}>
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

export default AdminVolunteers;