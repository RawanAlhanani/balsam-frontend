import React, { useState, useEffect } from 'react';
import api from '../../api';
import { getStorageUrl } from '../../utils/formatters';
import {
    AdminPage, AdminPageHeader, AdminCard, AdminLoading, AdminEmptyState,
    AdminFormPanel, AdminFormGroup, AdminFormActions, AdminTableWrap, AdminBtn, AdminAlert
} from '../../components/Admin/ui/AdminUI';

// Re-using the DeleteConfirmModal for consistency
const DeleteConfirmModal = ({ show, onClose, onConfirm, itemName, isDeleting }) => {
    if (!show) return null;
    return (
        <div className="modal show d-block" tabIndex="-1" role="dialog">
            <div className="modal-dialog" role="document" style={{ zIndex: 1060 }}>
                <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title">تأكيد الحذف</h5>
                        <button type="button" className="close" onClick={onClose}>&times;</button>
                    </div>
                    <div className="modal-body">
                        هل أنت متأكد أنك تريد حذف "{itemName}"؟
                    </div>
                    <div className="modal-footer">
                        <button type="button" className="btn btn-secondary" onClick={onClose}>إلغاء</button>
                        <button type="button" className="btn btn-danger" disabled={isDeleting} onClick={onConfirm}>
                            {isDeleting ? <span className="spinner-border spinner-border-sm"/> : 'حذف'}
                        </button>
                    </div>
                </div>
            </div>
            <div className="modal-backdrop show" onClick={onClose} style={{ zIndex: 1050 }}></div>
        </div>
    );
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
            setAlert({ message: 'خطأ في تحميل الشركاء', type: 'danger' });
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
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        const data = new FormData();
        data.append('nomPartenaire', nomPartenaire);
        if (image) data.append('imagePartenaire', image);

        try {
            if (isEditing) {
                await api.post(`/admin/partners/${editingPartnerId}`, data); // Use POST for FormData with PUT/PATCH method override
                setAlert({ message: 'تم تحديث الشريك بنجاح', type: 'success' });
            } else {
                await api.post('/admin/partners', data);
                setAlert({ message: 'تم إضافة الشريك بنجاح', type: 'success' });
            }
            setShowForm(false);
            resetForm();
            fetchPartners();
        } catch (err) {
            setAlert({ message: `خطأ في ${isEditing ? 'التحديث' : 'الإضافة'}`, type: 'danger' });
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
            setAlert({ message: 'خطأ في الحذف', type: 'danger' });
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
                            <input type="text" className="form-control" value={nomPartenaire} onChange={(e) => setNomPartenaire(e.target.value)} required />
                        </AdminFormGroup>
                        <AdminFormGroup label="الشعار" className="col-md-6">
                            <input type="file" className="form-control-file" onChange={(e) => setImage(e.target.files[0])} />
                            {currentImage && !image && ( // Show current image if editing and no new image selected
                                <div className="mt-2">
                                    <img src={currentImage} alt="Current Partner" style={{ maxWidth: '100px', maxHeight: '100px', objectFit: 'contain' }} />
                                    <small className="d-block text-muted">الشعار الحالي</small>
                                </div>
                            )}
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
                                                    <AdminBtn variant="primary" icon="la-edit" onClick={() => handleOpenEditForm(p)}>تعديل</AdminBtn>
                                                    <AdminBtn variant="danger" icon="la-trash" onClick={() => promptDelete(p.id, p.nomPartenaire)}>حذف</AdminBtn>
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