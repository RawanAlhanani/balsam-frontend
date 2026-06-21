import React, { useState, useEffect } from 'react';
import api from '../../api';
import {
    AdminPage, AdminPageHeader, AdminCard, AdminLoading, AdminEmptyState,
    AdminFormPanel, AdminFormGroup, AdminFormActions, AdminTableWrap, AdminBtn, AdminAlert
} from '../../components/Admin/ui/AdminUI';

// Re-using the DeleteConfirmModal from AdminSettings for consistency
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


const AdminActivities = () => {
    const [activities, setActivities] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [types, setTypes] = useState([]);
    const [formData, setFormData] = useState({ titre: '', type_activite_id: '', date_activite: '', description: '' });
    const [image, setImage] = useState(null);
    const [alert, setAlert] = useState({ message: '', type: '' });
    const [submitting, setSubmitting] = useState(false);
    const [deleting, setDeleting] = useState(false);

    // State for editing
    const [isEditing, setIsEditing] = useState(false);
    const [editingActivityId, setEditingActivityId] = useState(null);
    const [currentImage, setCurrentImage] = useState(null); // To display existing image

    // State for delete confirmation modal
    const [showDeleteConfirmModal, setShowDeleteConfirmModal] = useState(false);
    const [deleteTargetId, setDeleteTargetId] = useState(null);
    const [deleteTargetName, setDeleteTargetName] = useState('');


    useEffect(() => {
        fetchActivities();
        fetchTypes();
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


    const fetchActivities = async () => {
        setLoading(true);
        try {
            const res = await api.get('/admin/activities');
            setActivities(res.data);
        } catch (err) {
            setAlert({ message: 'خطأ في تحميل الأنشطة', type: 'danger' });
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const fetchTypes = async () => {
        try {
            const res = await api.get('/admin/types');
            setTypes(res.data);
        } catch (err) {
            setAlert({ message: 'خطأ في تحميل أنواع الأنشطة', type: 'danger' });
            console.error(err);
        }
    };

    const resetForm = () => {
        setFormData({ titre: '', type_activite_id: '', date_activite: '', description: '' });
        setImage(null);
        setIsEditing(false);
        setEditingActivityId(null);
        setCurrentImage(null);
    };

    const handleOpenAddForm = () => {
        resetForm();
        setShowForm(true);
    };

    const handleOpenEditForm = (activity) => {
        setFormData({
            titre: activity.titre,
            type_activite_id: activity.type_activite_id,
            date_activite: activity.date_activite,
            description: activity.description
        });
        setCurrentImage(activity.image_activite ? `http://localhost:8000/storage/MesImages/${activity.image_activite}` : null);
        setIsEditing(true);
        setEditingActivityId(activity.id);
        setShowForm(true);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        const data = new FormData();
        Object.keys(formData).forEach(key => data.append(key, formData[key]));
        if (image) data.append('image_activite', image);

        try {
            if (isEditing) {
                data.append('_method', 'PUT'); // Add this line for Laravel to interpret as PUT
                await api.post(`/admin/activities/${editingActivityId}`, data); 
                setAlert({ message: 'تم تحديث النشاط بنجاح', type: 'success' });
            } else {
                await api.post('/admin/activities', data);
                setAlert({ message: 'تم إضافة النشاط بنجاح', type: 'success' });
            }
            setShowForm(false);
            resetForm();
            fetchActivities();
        } catch (err) {
            setAlert({ message: `خطأ في ${isEditing ? 'التحديث' : 'الإضافة'}`, type: 'danger' });
            console.error(err);
        } finally {
            setSubmitting(false);
            setTimeout(() => setAlert({ message: '', type: '' }), 3500);
        }
    };

    const promptDelete = (id, title) => {
        setDeleteTargetId(id);
        setDeleteTargetName(title);
        setShowDeleteConfirmModal(true);
    };

    const confirmDelete = async () => {
        if (!deleteTargetId || deleting) return;
        setDeleting(true);
        try {
            await api.delete(`/admin/activities/${deleteTargetId}`);
            await fetchActivities();
            setAlert({ message: 'تم حذف النشاط بنجاح', type: 'success' });
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
                title="إدارة الأنشطة"
                subtitle="إضافة وتعديل الأنشطة المعروضة على الموقع"
                badge="المحتوى"
                actions={
                    <AdminBtn
                        variant={showForm ? 'secondary' : 'primary'}
                        icon={showForm ? 'la-times' : 'la-plus'}
                        onClick={showForm ? () => { setShowForm(false); resetForm(); } : handleOpenAddForm}
                    >
                        {showForm ? 'إلغاء' : 'إضافة نشاط'}
                    </AdminBtn>
                }
            />
            <div className="content-body">
                <AdminFormPanel
                    title={isEditing ? "تعديل نشاط" : "إضافة نشاط جديد"}
                    open={showForm}
                    onClose={() => { setShowForm(false); resetForm(); }}
                    onSubmit={handleSubmit}
                >
                    <div className="row">
                        <AdminFormGroup label="العنوان" className="col-md-4">
                            <input type="text" className="form-control" value={formData.titre} onChange={(e) => setFormData({ ...formData, titre: e.target.value })} required />
                        </AdminFormGroup>
                        <AdminFormGroup label="النوع" className="col-md-4">
                            <select className="form-control" value={formData.type_activite_id} onChange={(e) => setFormData({ ...formData, type_activite_id: e.target.value })} required>
                                <option value="">اختر النوع</option>
                                {types.map(t => <option key={t.id} value={t.id}>{t.nomActivite}</option>)}
                            </select>
                        </AdminFormGroup>
                        <AdminFormGroup label="التاريخ" className="col-md-4">
                            <input type="date" className="form-control" value={formData.date_activite} onChange={(e) => setFormData({ ...formData, date_activite: e.target.value })} required />
                        </AdminFormGroup>
                        <AdminFormGroup label="الوصف" className="col-md-12">
                            <textarea className="form-control" rows="3" value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} required />
                        </AdminFormGroup>
                        <AdminFormGroup label="الصورة" className="col-md-4">
                            <input type="file" className="form-control-file" onChange={(e) => setImage(e.target.files[0])} />
                            {currentImage && !image && ( // Show current image if editing and no new image selected
                                <div className="mt-2">
                                    <img src={currentImage} alt="Current Activity" style={{ maxWidth: '100px', maxHeight: '100px', objectFit: 'cover' }} />
                                    <small className="d-block text-muted">الصورة الحالية</small>
                                </div>
                            )}
                        </AdminFormGroup>
                    </div>
                    <AdminFormActions>
                        <AdminBtn variant="success" type="submit" icon="la-check" disabled={submitting}>
                            {submitting ? <span className="spinner-border spinner-border-sm"/> : (isEditing ? 'تحديث النشاط' : 'حفظ النشاط')}
                        </AdminBtn>
                        <AdminBtn variant="secondary" icon="la-times" onClick={() => { setShowForm(false); resetForm(); }}>إلغاء</AdminBtn>
                    </AdminFormActions>
                </AdminFormPanel>

                <AdminCard title="قائمة الأنشطة" icon="la-calendar" flush>
                    {loading ? (
                        <AdminLoading />
                    ) : activities.length === 0 ? (
                        <AdminEmptyState icon="la-calendar" message="لا توجد أنشطة مسجلة" hint="أضف نشاطاً جديداً من الزر أعلاه" />
                    ) : (
                        <AdminTableWrap>
                            <table className="table table-hover admin-table">
                                <thead>
                                    <tr>
                                        <th>العنوان</th>
                                        <th>النوع</th>
                                        <th>التاريخ</th>
                                        <th>الصورة</th> {/* New column */}
                                        <th>الوصف</th> {/* New column */}
                                        <th>العمليات</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {activities.map(act => (
                                        <tr key={act.id}>
                                            <td>{act.titre}</td>
                                            <td><span className="admin-tag">{act.typeactivite?.nomActivite}</span></td>
                                            <td>{act.date_activite}</td>
                                            <td>
                                                {act.image_activite ? (
                                                    <img src={`http://localhost:8000/storage/MesImages/${act.image_activite}`} alt={act.titre} style={{ maxWidth: '50px', maxHeight: '50px', objectFit: 'cover' }} />
                                                ) : (
                                                    'لا توجد'
                                                )}
                                            </td>
                                            <td>{act.description.substring(0, 50)}...</td> {/* Truncated description */}
                                            <td>
                                                <div className="admin-action-group">
                                                    <AdminBtn variant="primary" icon="la-edit" onClick={() => handleOpenEditForm(act)}>تعديل</AdminBtn>
                                                    <AdminBtn variant="danger" icon="la-trash" onClick={() => promptDelete(act.id, act.titre)}>حذف</AdminBtn>
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

export default AdminActivities;