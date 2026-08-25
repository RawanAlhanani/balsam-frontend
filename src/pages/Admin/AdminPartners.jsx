import React, { useState, useEffect } from 'react';
import api from '../../api';
import { getStorageUrl } from '../../utils/formatters';
import {
    AdminPage, AdminPageHeader, AdminCard, AdminLoading, AdminEmptyState,
    AdminFormPanel, AdminFormGroup, AdminFormActions, AdminTableWrap, AdminBtn, AdminAlert
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

const AdminPartners = () => {
    const [partners, setPartners] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [nomPartenaire, setNomPartenaire] = useState('');
    const [image, setImage] = useState(null);
    const [alert, setAlert] = useState({ message: '', type: '' });
    const [submitting, setSubmitting] = useState(false);
    const [deleting, setDeleting] = useState(false);
    const [formErrors, setFormErrors] = useState({}); // New state for form errors

    // State for editing
    const [isEditing, setIsEditing] = useState(false);
    const [editingPartnerId, setEditingPartnerId] = useState(null);
    const [currentImage, setCurrentImage] = useState(null); // To display existing image

    // State for delete confirmation modal
    const [showDeleteConfirmModal, setShowDeleteConfirmModal] = useState(false);
    const [deleteTargetId, setDeleteTargetId] = useState(null);
    const [deleteTargetName, setDeleteTargetName] = useState('');


    useEffect(() => {
        fetchPartners();
    }, []);

    // Lock background scroll when modal is open
    useEffect(() => {
        if (showDeleteConfirmModal) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
        return () => { document.body.style.overflow = ''; };
    }, [showDeleteConfirmModal]);


    const fetchPartners = async () => {
        setLoading(true);
        try {
            const res = await api.get('/admin/partners');
            setPartners(res.data);
        } catch (err) {
            const errorMessage = getPersonalizedErrorMessage(err);
            setAlert({ message: errorMessage, type: 'danger' });
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const resetForm = () => {
        setNomPartenaire('');
        setImage(null);
        setIsEditing(false);
        setEditingPartnerId(null);
        setCurrentImage(null);
        setFormErrors({}); // Clear form errors on reset
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        if (name === 'nomPartenaire') {
            setNomPartenaire(value);
        }
        // Clear error for this field when user starts typing
        if (formErrors[name]) {
            setFormErrors(prev => ({ ...prev, [name]: null }));
        }
    };

    const handleImageChange = (e) => {
        setImage(e.target.files[0]);
        // Clear image error if present
        if (formErrors.imagePartenaire) {
            setFormErrors(prev => ({ ...prev, imagePartenaire: null }));
        }
    };

    const handleOpenAddForm = () => {
        resetForm();
        setShowForm(true);
    };

    const handleOpenEditForm = (partner) => {
        setNomPartenaire(partner.nomPartenaire);
        setCurrentImage(partner.imagePartenaire ? getStorageUrl(partner.imagePartenaire) : null);
        setIsEditing(true);
        setEditingPartnerId(partner.id);
        setShowForm(true);
        setFormErrors({}); // Clear form errors when opening edit form
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        setFormErrors({}); // Clear previous errors
        setAlert({ message: '', type: '' }); // Clear general alert

        const data = new FormData();
        data.append('nomPartenaire', nomPartenaire);
        if (image) data.append('imagePartenaire', image);

        try {
            if (isEditing) {
                data.append('_method', 'PUT'); // Important for Laravel to handle PUT with FormData
                await api.post(`/admin/partners/${editingPartnerId}`, data);
                setAlert({ message: 'تم تحديث الشريك بنجاح', type: 'success' });
            } else {
                await api.post('/admin/partners', data);
                setAlert({ message: 'تم إضافة الشريك بنجاح', type: 'success' });
            }
            setShowForm(false);
            resetForm();
            fetchPartners();
        } catch (err) {
            if (err.response && err.response.status === 422) {
                // Validation errors from Laravel
                setFormErrors(err.response.data.errors);
                setAlert({ message: 'الرجاء مراجعة الأخطاء في النموذج.', type: 'danger' });
            } else {
                // Other API errors
                const errorMessage = getPersonalizedErrorMessage(err);
                setAlert({ message: errorMessage, type: 'danger' });
            }
            console.error(err);
        } finally {
            setSubmitting(false);
            setTimeout(() => setAlert({ message: '', type: '' }), 3500);
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
            await api.delete(`/admin/partners/${deleteTargetId}`);
            await fetchPartners();
            setAlert({ message: 'تم حذف الشريك بنجاح', type: 'success' });
            setShowDeleteConfirmModal(false);
            setDeleteTargetId(null);
            setDeleteTargetName('');
        } catch (err) {
            const errorMessage = getPersonalizedErrorMessage(err);
            setAlert({ message: errorMessage, type: 'danger' });
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
                title="إدارة الشركاء"
                subtitle="إدارة شعارات وأسماء الشركاء"
                badge="المحتوى"
                actions={
                    <AdminBtn
                        variant={showForm ? 'secondary' : 'primary'}
                        icon={showForm ? 'la-times' : 'la-plus'}
                        onClick={showForm ? () => { setShowForm(false); resetForm(); } : handleOpenAddForm}
                    >
                        {showForm ? 'إلغاء' : 'إضافة شريك'}
                    </AdminBtn>
                }
            />
            <div className="content-body">
                <AdminFormPanel
                    title={isEditing ? "تعديل شريك" : "إضافة شريك جديد"}
                    open={showForm}
                    onClose={() => { setShowForm(false); resetForm(); }}
                    onSubmit={handleSubmit}
                >
                    <div className="row">
                        <AdminFormGroup label="اسم الشريك" className="col-md-6">
                            <input type="text" className="form-control" name="nomPartenaire" value={nomPartenaire} onChange={handleInputChange} required />
                            {formErrors.nomPartenaire && <div className="text-danger small mt-1">{formErrors.nomPartenaire[0]}</div>}
                        </AdminFormGroup>
                        <AdminFormGroup label="الشعار" className="col-md-6">
                            <input type="file" className="form-control-file" name="imagePartenaire" onChange={handleImageChange} />
                            {currentImage && !image && ( // Show current image if editing and no new image selected
                                <div className="mt-2">
                                    <img src={currentImage} alt="الشعار الحالي" style={{ maxWidth: '100px', maxHeight: '100px', objectFit: 'contain' }} />
                                    <small className="d-block text-muted">الشعار الحالي</small>
                                </div>
                            )}
                            {formErrors.imagePartenaire && <div className="text-danger small mt-1">{formErrors.imagePartenaire[0]}</div>}
                        </AdminFormGroup>
                    </div>
                    <AdminFormActions>
                        <AdminBtn variant="success" type="submit" icon="la-check" disabled={submitting}>
                            {submitting ? <span className="spinner-border spinner-border-sm"/> : (isEditing ? 'تحديث الشريك' : 'حفظ الشريك')}
                        </AdminBtn>
                        <AdminBtn variant="secondary" icon="la-times" onClick={() => { setShowForm(false); resetForm(); }}>إلغاء</AdminBtn>
                    </AdminFormActions>
                </AdminFormPanel>

                <AdminCard title="قائمة الشركاء" icon="la-handshake-o" flush>
                    {loading ? (
                        <AdminLoading />
                    ) : partners.length === 0 ? (
                        <AdminEmptyState icon="la-handshake-o" message="لا يوجد شركاء مسجلين" hint="أضف شريكاً جديداً من الزر أعلاه" />
                    ) : (
                        <AdminTableWrap>
                            <table className="table table-hover admin-table">
                                <thead>
                                    <tr>
                                        <th>الاسم</th>
                                        <th>الشعار</th>
                                        <th>العمليات</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {partners.map(p => (
                                        <tr key={p.id}>
                                            <td>{p.nomPartenaire}</td>
                                            <td>
                                                <img src={getStorageUrl(p.imagePartenaire)} alt={p.nomPartenaire} className="admin-partner-logo" />
                                            </td>
                                            <td>
                                                <div className="admin-action-group">
                                                    <AdminBtn permission="edit_partners" variant="primary" icon="la-edit" onClick={() => handleOpenEditForm(p)}>تعديل</AdminBtn>
                                                    <AdminBtn permission="delete_partners" variant="danger" icon="la-trash" onClick={() => promptDelete(p.id, p.nomPartenaire)}>حذف</AdminBtn>
                                                </div>
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

export default AdminPartners;