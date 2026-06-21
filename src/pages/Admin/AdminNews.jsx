import React, { useState, useEffect } from 'react';
import api from '../../api';
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


const AdminNews = () => {
    const [news, setNews] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [formData, setFormData] = useState({ titre: '', description: '' });
    const [image, setImage] = useState(null);
    const [alert, setAlert] = useState({ message: '', type: '' });
    const [submitting, setSubmitting] = useState(false);
    const [deleting, setDeleting] = useState(false);

    // State for editing
    const [isEditing, setIsEditing] = useState(false);
    const [editingNewsId, setEditingNewsId] = useState(null);
    const [currentImage, setCurrentImage] = useState(null); // To display existing image

    // State for delete confirmation modal
    const [showDeleteConfirmModal, setShowDeleteConfirmModal] = useState(false);
    const [deleteTargetId, setDeleteTargetId] = useState(null);
    const [deleteTargetName, setDeleteTargetName] = useState('');


    useEffect(() => {
        fetchNews();
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


    const fetchNews = async () => {
        setLoading(true);
        try {
            const res = await api.get('/admin/news');
            setNews(res.data);
        } catch (err) {
            setAlert({ message: 'خطأ في تحميل الأخبار', type: 'danger' });
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const resetForm = () => {
        setFormData({ titre: '', description: '' });
        setImage(null);
        setIsEditing(false);
        setEditingNewsId(null);
        setCurrentImage(null);
    };

    const handleOpenAddForm = () => {
        resetForm();
        setShowForm(true);
    };

    const handleOpenEditForm = (newsItem) => {
        setFormData({
            titre: newsItem.titre,
            description: newsItem.description
        });
        setCurrentImage(newsItem.image_info ? `http://localhost:8000/storage/MesImages/${newsItem.image_info}` : null);
        setIsEditing(true);
        setEditingNewsId(newsItem.id);
        setShowForm(true);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        const data = new FormData();
        data.append('titre', formData.titre);
        data.append('description', formData.description);
        if (image) data.append('image_info', image);

        try {
            if (isEditing) {
                await api.post(`/admin/news/${editingNewsId}`, data); // Use POST for FormData with PUT/PATCH method override
                setAlert({ message: 'تم تحديث الخبر بنجاح', type: 'success' });
            } else {
                await api.post('/admin/news', data);
                setAlert({ message: 'تم إضافة الخبر بنجاح', type: 'success' });
            }
            setShowForm(false);
            resetForm();
            fetchNews();
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
            await api.delete(`/admin/news/${deleteTargetId}`);
            await fetchNews();
            setAlert({ message: 'تم حذف الخبر بنجاح', type: 'success' });
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
                title="إدارة الأخبار"
                subtitle="نشر وإدارة الأخبار والمستجدات"
                badge="المحتوى"
                actions={
                    <AdminBtn
                        variant={showForm ? 'secondary' : 'primary'}
                        icon={showForm ? 'la-times' : 'la-plus'}
                        onClick={showForm ? () => { setShowForm(false); resetForm(); } : handleOpenAddForm}
                    >
                        {showForm ? 'إلغاء' : 'إضافة خبر'}
                    </AdminBtn>
                }
            />
            <div className="content-body">
                <AdminFormPanel
                    title={isEditing ? "تعديل خبر" : "إضافة خبر جديد"}
                    open={showForm}
                    onClose={() => { setShowForm(false); resetForm(); }}
                    onSubmit={handleSubmit}
                >
                    <AdminFormGroup label="العنوان">
                        <input type="text" className="form-control" value={formData.titre} onChange={(e) => setFormData({ ...formData, titre: e.target.value })} required />
                    </AdminFormGroup>
                    <AdminFormGroup label="الوصف">
                        <textarea className="form-control" rows="5" value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} required />
                    </AdminFormGroup>
                    <AdminFormGroup label="الصورة">
                        <input type="file" className="form-control-file" onChange={(e) => setImage(e.target.files[0])} />
                        {currentImage && !image && ( // Show current image if editing and no new image selected
                            <div className="mt-2">
                                <img src={currentImage} alt="Current News" style={{ maxWidth: '100px', maxHeight: '100px', objectFit: 'cover' }} />
                                <small className="d-block text-muted">الصورة الحالية</small>
                            </div>
                        )}
                    </AdminFormGroup>
                    <AdminFormActions>
                        <AdminBtn variant="success" type="submit" icon="la-check" disabled={submitting}>
                            {submitting ? <span className="spinner-border spinner-border-sm"/> : (isEditing ? 'تحديث الخبر' : 'حفظ الخبر')}
                        </AdminBtn>
                        <AdminBtn variant="secondary" icon="la-times" onClick={() => { setShowForm(false); resetForm(); }}>إلغاء</AdminBtn>
                    </AdminFormActions>
                </AdminFormPanel>

                <AdminCard title="قائمة الأخبار" icon="la-newspaper-o" flush>
                    {loading ? (
                        <AdminLoading />
                    ) : news.length === 0 ? (
                        <AdminEmptyState icon="la-newspaper-o" message="لا توجد أخبار مسجلة" hint="أضف خبراً جديداً من الزر أعلاه" />
                    ) : (
                        <AdminTableWrap>
                            <table className="table table-hover admin-table">
                                <thead>
                                    <tr>
                                        <th>العنوان</th>
                                        <th>الوصف</th> {/* New column */}
                                        <th>الصورة</th> {/* New column */}
                                        <th>تاريخ الإضافة</th>
                                        <th>العمليات</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {news.map(item => (
                                        <tr key={item.id}>
                                            <td>{item.titre}</td>
                                            <td>{item.description.substring(0, 50)}...</td> {/* Truncated description */}
                                            <td>
                                                {item.image_info ? (
                                                    <img src={`http://localhost:8000/storage/MesImages/${item.image_info}`} alt={item.titre} style={{ maxWidth: '50px', maxHeight: '50px', objectFit: 'cover' }} />
                                                ) : (
                                                    'لا توجد'
                                                )}
                                            </td>
                                            <td>{new Date(item.created_at).toLocaleDateString('ar-MA')}</td>
                                            <td>
                                                <div className="admin-action-group">
                                                    <AdminBtn variant="primary" icon="la-edit" onClick={() => handleOpenEditForm(item)}>تعديل</AdminBtn>
                                                    <AdminBtn variant="danger" icon="la-trash" onClick={() => promptDelete(item.id, item.titre)}>حذف</AdminBtn>
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

export default AdminNews;