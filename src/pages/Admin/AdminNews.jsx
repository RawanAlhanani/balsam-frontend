import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate
import api from '../../api';
import {
    AdminPage, AdminPageHeader, AdminCard, AdminLoading, AdminEmptyState,
    AdminFormPanel, AdminFormGroup, AdminFormActions, AdminTableWrap, AdminBtn, AdminAlert, AdminPagination
} from '../../components/Admin/ui/AdminUI';
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

const AdminNews = () => {
    const navigate = useNavigate(); // Initialize useNavigate
    const [news, setNews] = useState([]);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1);
    const [lastPage, setLastPage] = useState(1);
    // Removed showForm, isEditing, editingNewsId, formData, image, currentImage states
    // as editing/adding will be handled on separate pages.
    const [alert, setAlert] = useState({ message: '', type: '' });
    // Removed submitting state
    const [deleting, setDeleting] = useState(false);

    // State for delete confirmation modal
    const [showDeleteConfirmModal, setShowDeleteConfirmModal] = useState(false);
    const [deleteTargetId, setDeleteTargetId] = useState(null);
    const [deleteTargetName, setDeleteTargetName] = useState('');


    useEffect(() => {
        fetchNews();
    }, [page]);

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
            const res = await api.get('/admin/news', { params: { page } });
            setNews(res.data.data);
            setLastPage(res.data.last_page);
        } catch (err) {
            const errorMessage = getPersonalizedErrorMessage(err);
            setAlert({ message: errorMessage, type: 'danger' });
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
            await api.delete(`/admin/news/${deleteTargetId}`);
            await fetchNews();
            setAlert({ message: 'تم حذف الخبر بنجاح', type: 'success' });
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
                title="إدارة الأخبار"
                subtitle="نشر وإدارة الأخبار والمستجدات"
                badge="المحتوى"
                actions={
                    <AdminBtn
                        variant="primary" // Changed variant to primary for consistency
                        icon="la-plus"
                        onClick={() => navigate('/admin/news/add')} // Navigate to add page
                    >
                        إضافة خبر
                    </AdminBtn>
                }
            />
            <div className="content-body">
                {/* Removed AdminFormPanel and its content */}

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
                                        <th>الوصف</th>
                                        <th>الصورة</th>
                                        <th>تاريخ الإضافة</th>
                                        <th>العمليات</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {news.map(item => (
                                        <tr key={item.id}>
                                            <td>{item.titre}</td>
                                            {/* Truncated description */}
                                            <td>{item.description.substring(0, 50)}...</td>
                                            <td>
                                                {item.image_info ? (
                                                    <img src={getStorageUrl(item.image_info)} alt={item.titre} style={{ maxWidth: '50px', maxHeight: '50px', objectFit: 'cover' }} />
                                                ) : (
                                                    'لا توجد'
                                                )}
                                            </td>
                                            <td>{new Date(item.created_at).toLocaleDateString('ar-MA')}</td>
                                            <td>
                                                <div className="admin-action-group">
                                                    <AdminBtn variant="primary" icon="la-edit" onClick={() => navigate(`/admin/news/edit/${item.id}`)}>تعديل</AdminBtn> {/* Navigate to edit page */}
                                                    <AdminBtn variant="danger" icon="la-trash" onClick={() => promptDelete(item.id, item.titre)}>حذف</AdminBtn>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </AdminTableWrap>
                    )}
                    <AdminPagination currentPage={page} lastPage={lastPage} onPageChange={setPage} />
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