import React, { useState, useEffect } from 'react';
import api from '../../api';
import {
    AdminPage, AdminPageHeader, AdminCard, AdminLoading, AdminEmptyState,
    AdminTableWrap, AdminBtn, AdminAlert, AdminPagination
} from '../../components/Admin/ui/AdminUI';
import DeleteConfirmModal from '../../components/Admin/modals/DeleteConfirmModal';

const AdminContactMessages = () => {
    const [messages, setMessages] = useState([]);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1);
    const [lastPage, setLastPage] = useState(1);
    const [alert, setAlert] = useState({ message: '', type: '' });
    const [deleting, setDeleting] = useState(false);

    // State for delete confirmation modal
    const [showDeleteConfirmModal, setShowDeleteConfirmModal] = useState(false);
    const [deleteTargetId, setDeleteTargetId] = useState(null);
    const [deleteTargetName, setDeleteTargetName] = useState('');

    useEffect(() => {
        fetchMessages();
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

    const fetchMessages = async () => {
        setLoading(true);
        try {
            const res = await api.get('/admin/contact-messages', { params: { page } });
            setMessages(res.data.data);
            setLastPage(res.data.last_page);
        } catch (err) {
            setAlert({ message: err.response?.data?.message || 'خطأ في تحميل رسائل التواصل', type: 'danger' });
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const promptDelete = (id, subject) => {
        setDeleteTargetId(id);
        setDeleteTargetName(subject);
        setShowDeleteConfirmModal(true);
    };

    const confirmDelete = async () => {
        if (!deleteTargetId || deleting) return;
        setDeleting(true);
        try {
            await api.delete(`/admin/contact-messages/${deleteTargetId}`);
            await fetchMessages();
            setAlert({ message: 'تم حذف الرسالة بنجاح', type: 'success' });
            setShowDeleteConfirmModal(false);
            setDeleteTargetId(null);
            setDeleteTargetName('');
        } catch (err) {
            setAlert({ message: err.response?.data?.message || 'خطأ أثناء حذف الرسالة', type: 'danger' });
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
                    title="رسائل التواصل"
                    subtitle="عرض الرسائل المرسلة عبر نموذج تواصل معنا"
                    badge="التواصل"
                />
                <div className="content-body">
                    <AdminCard title="قائمة الرسائل" icon="la-envelope" flush>
                        {loading ? (
                            <AdminLoading />
                        ) : messages.length === 0 ? (
                            <AdminEmptyState icon="la-envelope" message="لا توجد رسائل تواصل حالياً" hint="ستظهر الرسائل هنا عند إرسالها من الموقع" />
                        ) : (
                            <AdminTableWrap>
                                <table className="table table-hover admin-table">
                                    <thead>
                                        <tr>
                                            <th>الاسم</th>
                                            <th>البريد الإلكتروني</th>
                                            <th>الموضوع</th>
                                            <th>الرسالة</th>
                                            <th>التاريخ</th>
                                            <th>العمليات</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {messages.map(msg => (
                                            <tr key={msg.id}>
                                                <td>{msg.name}</td>
                                                <td>{msg.email}</td>
                                                <td>{msg.subject}</td>
                                                <td>{msg.message.length > 60 ? `${msg.message.substring(0, 60)}...` : msg.message}</td>
                                                <td>{new Date(msg.created_at).toLocaleDateString('ar-MA')}</td>
                                                <td>
                                                    <AdminBtn permission="delete_contact_messages" variant="danger" icon="la-trash" onClick={() => promptDelete(msg.id, msg.subject)}>حذف</AdminBtn>
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

export default AdminContactMessages;
