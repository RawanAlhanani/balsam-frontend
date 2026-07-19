import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate
import api from '../../api';
import {
    AdminPage, AdminPageHeader, AdminCard, AdminLoading, AdminEmptyState,
    AdminFormPanel, AdminFormGroup, AdminFormActions, AdminTableWrap, AdminBtn, AdminAlert
} from '../../components/Admin/ui/AdminUI';
import { getStorageUrl } from '../../utils/formatters';
import DeleteConfirmModal from '../../components/Admin/modals/DeleteConfirmModal';

const AdminActivities = () => {
    const navigate = useNavigate(); // Initialize useNavigate
    const [activities, setActivities] = useState([]);
    const [loading, setLoading] = useState(true);
    // Removed showForm, isEditing, editingActivityId, formData, image, currentImage states
    // as editing/adding will be handled on separate pages.
    const [alert, setAlert] = useState({ message: '', type: '' });
    // Removed submitting state
    const [deleting, setDeleting] = useState(false);

    // State for delete confirmation modal
    const [showDeleteConfirmModal, setShowDeleteConfirmModal] = useState(false);
    const [deleteTargetId, setDeleteTargetId] = useState(null);
    const [deleteTargetName, setDeleteTargetName] = useState('');


    useEffect(() => {
        fetchActivities();
        // Removed fetchTypes as it's not needed on this list page anymore
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

    // Removed resetForm, handleOpenAddForm, handleOpenEditForm, handleSubmit functions
    // as they are related to the inline form which is being removed.

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
                        variant="primary" // Changed variant to primary for consistency
                        icon="la-plus"
                        onClick={() => navigate('/admin/activities/add')} // Navigate to add page
                    >
                        إضافة نشاط
                    </AdminBtn>
                }
            />
            <div className="content-body">
                {/* Removed AdminFormPanel and its content */}

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
                                        <th>الصورة</th>
                                        <th>الوصف</th>
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
                                                    <img src={getStorageUrl(act.image_activite)} alt={act.titre} style={{ maxWidth: '50px', maxHeight: '50px', objectFit: 'cover' }} />
                                                ) : (
                                                    'لا توجد'
                                                )}
                                            </td>
                                            <td>{act.description.substring(0, 50)}...</td> {/* Truncated description */}
                                            <td>
                                                <div className="admin-action-group">
                                                    <AdminBtn variant="primary" icon="la-edit" onClick={() => navigate(`/admin/activities/edit/${act.id}`)}>تعديل</AdminBtn> {/* Navigate to edit page */}
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