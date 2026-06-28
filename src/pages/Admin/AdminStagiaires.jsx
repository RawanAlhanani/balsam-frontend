import React, { useState, useEffect } from 'react';
import api from '../../api';
import {
    AdminPage, AdminPageHeader, AdminCard, AdminLoading, AdminEmptyState,
    AdminTableWrap, AdminBtn, AdminAlert
} from '../../components/Admin/ui/AdminUI';

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

// DeleteConfirmModal component (copied for consistency)
const DeleteConfirmModal = ({ show, onClose, onConfirm, itemName, isDeleting }) => {
    if (!show) return null;

    return (
        <>
            {/* Backdrop */}
            <div
                className="modal-backdrop fade show"
                onClick={onClose}
                style={{
                    zIndex: 1040
                }}
            ></div>

            {/* Modal */}
            <div
                className="modal fade show d-block"
                tabIndex="-1"
                role="dialog"
                style={{
                    position: "fixed",
                    top: 0,
                    left: 0,
                    width: "100%",
                    height: "100%",
                    zIndex: 1055,
                    overflowY: "auto"
                }}
            >
                <div
                    className="modal-dialog modal-dialog-centered"
                    role="document"
                >
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title">تأكيد الحذف</h5>

                            <button
                                type="button"
                                className="close"
                                onClick={onClose}
                            >
                                &times;
                            </button>
                        </div>

                        <div className="modal-body">
                            هل أنت متأكد أنك تريد حذف "{itemName}"؟
                        </div>

                        <div className="modal-footer">
                            <button
                                type="button"
                                className="btn btn-secondary"
                                onClick={onClose}
                            >
                                إلغاء
                            </button>

                            <button
                                type="button"
                                className="btn btn-danger"
                                onClick={onConfirm}
                                disabled={isDeleting}
                            >
                                {isDeleting ? (
                                    <span className="spinner-border spinner-border-sm"></span>
                                ) : (
                                    "حذف"
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

const AdminStagiaires = () => {
    const [stagiaires, setStagiaires] = useState([]);
    const [loading, setLoading] = useState(true);
    const [alert, setAlert] = useState({ message: '', type: '' });
    const [deleting, setDeleting] = useState(false);

    // State for delete confirmation modal
    const [showDeleteConfirmModal, setShowDeleteConfirmModal] = useState(false);
    const [deleteTargetId, setDeleteTargetId] = useState(null);
    const [deleteTargetName, setDeleteTargetName] = useState('');

    useEffect(() => {
        fetchStagiaires();
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

    const fetchStagiaires = async () => {
        setLoading(true);
        try {
            const res = await api.get('/admin/stagiaires');
            setStagiaires(res.data);
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
            await api.delete(`/admin/stagiaires/${deleteTargetId}`);
            setAlert({ message: 'تم حذف طلب التدريب بنجاح', type: 'success' });
            setShowDeleteConfirmModal(false);
            setDeleteTargetId(null);
            setDeleteTargetName('');
            fetchStagiaires();
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

    return (
        <>
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
                                                    <AdminBtn variant="danger" icon="la-trash" onClick={() => promptDelete(stg.id, `${stg.prenom_stagiaire} ${stg.nom_stagiaire}`)}>
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

export default AdminStagiaires;