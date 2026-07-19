import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../api';
import {
    AdminPage, AdminPageHeader, AdminCard, AdminLoading, AdminAlert, AdminBtn
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


const AdminStaticPages = () => {
    const navigate = useNavigate();
    const [pages, setPages] = useState({ about: [], autism: [], projects: [] });
    const [selectedType, setSelectedType] = useState('about');
    const [selectedPage, setSelectedPage] = useState(null);
    const [showDeleteConfirmModal, setShowDeleteConfirmModal] = useState(false); // Renamed for consistency
    const [deleteTarget, setDeleteTarget] = useState(null);
    const [alert, setAlert] = useState({ message: '', type: '' });
    const [loading, setLoading] = useState(false);
    const [deleting, setDeleting] = useState(false);
    const [search, setSearch] = useState('');

    useEffect(() => { fetchPages(); }, []);

    // Lock background scroll and interactions when delete modal is open
    useEffect(() => {
        if (showDeleteConfirmModal) { // Changed from showDeleteModal
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
        return () => { document.body.style.overflow = ''; };
    }, [showDeleteConfirmModal]); // Changed from showDeleteModal

    const fetchPages = async () => {
        setLoading(true);
        try {
            const res = await api.get('/admin/static-pages');
            setPages(res.data);
        } catch (err) {
            const errorMessage = getPersonalizedErrorMessage(err);
            setAlert({ message: errorMessage, type: 'danger' });
            setTimeout(() => setAlert({ message: '', type: '' }), 3500);
        } finally {
            setLoading(false);
        }
    };

    const handleSelectPage = (type, page) => {
        setSelectedType(type);
        setSelectedPage(page);
        // Removed scrollIntoView for the details panel, as it's now horizontally aligned
        // and should not cause the main page to scroll.
        // The list itself has independent scrolling.
    };

    const promptDelete = (type, page) => {
        setDeleteTarget({ type, id: page.id, titre: page.titre });
        setShowDeleteConfirmModal(true); // Changed from setShowDeleteModal
    };

    const confirmDelete = async () => {
        if (!deleteTarget || deleting) return;
        setDeleting(true);
        try {
            await api.delete(`/admin/static-pages/${deleteTarget.type}/${deleteTarget.id}`);
            setAlert({ message: 'تم الحذف بنجاح', type: 'success' });
            setShowDeleteConfirmModal(false); // Changed from setShowDeleteModal
            setDeleteTarget(null);
            await fetchPages();
            setSelectedPage(null); // Clear selected page after deletion
        } catch (err) {
            const errorMessage = getPersonalizedErrorMessage(err);
            setAlert({ message: errorMessage, type: 'danger' });
            setShowDeleteConfirmModal(false); // Changed from setShowDeleteModal
        } finally {
            setDeleting(false);
            setTimeout(() => setAlert({ message: '', type: '' }), 3500);
        }
    };

    // Helper function to render structured content for display in table
    const renderStructuredContentPreview = (structured_description) => {
        if (!structured_description || !structured_description.sections || structured_description.sections.length === 0) {
            return <span className="text-muted">لا يوجد محتوى منظم</span>;
        }

        const preview = structured_description.sections.map((section, index) => {
            let content = '';
            switch (section.type) {
                case 'heading':
                    content = `H${section.level}: ${section.content}`;
                    break;
                case 'paragraph':
                    content = section.content;
                    break;
                case 'list':
                    content = `${section.listType === 'bullet' ? '•' : '1.'} ${section.items ? section.items[0] : ''}${section.items && section.items.length > 1 ? '...' : ''}`;
                    break;
                default:
                    content = '';
            }
            return <p key={index} className="mb-0 text-truncate" style={{ maxWidth: '300px' }} dangerouslySetInnerHTML={{ __html: content }} />;
        });

        return (
            <div>
                {preview.slice(0, 3)} {/* Show first 3 sections as preview */}
                {structured_description.sections.length > 3 && <p className="mb-0 text-muted">... المزيد</p>}
            </div>
        );
    };


    return (
        <>
        <AdminPage>
            <AdminPageHeader
                title="إدارة الصفحات الثابتة"
                subtitle="تعديل محتوى من نحن، التوحد، والمشاريع"
                badge="المحتوى"
                actions={
                    <AdminBtn
                        variant="success"
                        icon="la-plus"
                        onClick={() => navigate('/admin/static-pages/add')}
                    >
                        إضافة محتوى جديد
                    </AdminBtn>
                }
            />
            <div className="content-body">
                <AdminCard title="صفحات ثابتة" icon="la-file-text">
                    <div className="row"> {/* Changed to a single row for horizontal layout */}
                        {/* Left Panel: Type Selector & Search */}
                        <div className="col-md-3">
                            <div className="form-group">
                                <label className="small">النوع</label>
                                <select className="form-control" value={selectedType} onChange={e => { setSelectedType(e.target.value); setSelectedPage(null); }} aria-label="نوع الصفحة">
                                    <option value="about">من نحن</option>
                                    <option value="autism">صفحات التوحد</option>
                                    <option value="projects">مشاريعنا</option>
                                </select>
                            </div>
                            <div className="form-group mb-3">
                                <label className="small">بحث</label>
                                <input className="form-control" placeholder="بحث بعنوان" value={search} onChange={e => setSearch(e.target.value)} style={{maxWidth: '100%'}} />
                            </div>
                        </div>

                        {/* Right Section: Page List & Details */}
                        <div className="col-md-9">
                            <div className="row">
                                {/* Middle Panel: Page List */}
                                <div className="col-md-4">
                                    {loading ? (
                                        <AdminLoading />
                                    ) : (
                                        <div className="list-group-container" style={{ maxHeight: '500px', overflowY: 'auto', border: '1px solid #e3e6f0', borderRadius: '0.35rem' }}>
                                            <ul className="list-group list-group-flush">
                                                {pages[selectedType].filter(p => p.titre.toLowerCase().includes(search.toLowerCase())).map(p => (
                                                    <li 
                                                        key={p.id} 
                                                        className={`list-group-item d-flex justify-content-between align-items-center ${selectedPage && selectedPage.id === p.id ? 'active' : ''}`}
                                                        style={{cursor: 'pointer'}} 
                                                        onClick={() => handleSelectPage(selectedType, p)}
                                                    >
                                                        <div>{p.titre}</div>
                                                        <small className="text-muted">{new Date(p.updated_at).toLocaleDateString()}</small>
                                                    </li>
                                                ))}
                                                {pages[selectedType].filter(p => p.titre.toLowerCase().includes(search.toLowerCase())).length === 0 && (
                                                    <li className="list-group-item text-muted">لا توجد نتائج</li>
                                                )}
                                            </ul>
                                        </div>
                                    )}
                                </div>

                                {/* Right Panel: Page Details */}
                                <div className="col-md-8">
                                    {selectedPage ? (
                                        <div id="page-details-panel" className="card shadow-sm h-100">
                                            <div className="card-header d-flex justify-content-between align-items-center">
                                                <h5 className="mb-0">تفاصيل: {selectedPage.titre}</h5>
                                                <div>
                                                    <AdminBtn
                                                        variant="primary"
                                                        icon="la-edit"
                                                        onClick={() => navigate(`/admin/static-pages/edit/${selectedType}/${selectedPage.id}`)}
                                                        className="mr-2"
                                                    >
                                                        تعديل
                                                    </AdminBtn>
                                                    <AdminBtn
                                                        variant="danger"
                                                        icon="la-trash"
                                                        onClick={() => promptDelete(selectedType, selectedPage)}
                                                    >
                                                        حذف
                                                    </AdminBtn>
                                                </div>
                                            </div>
                                            <div className="card-body">
                                                <table className="table table-bordered mb-0">
                                                    <tbody>
                                                        <tr>
                                                            <th style={{width: '150px'}}>العنوان</th>
                                                            <td>{selectedPage.titre}</td>
                                                        </tr>
                                                        <tr>
                                                            <th>المحتوى</th>
                                                            <td>
                                                                {selectedPage.structured_description ? (
                                                                    renderStructuredContentPreview(selectedPage.structured_description)
                                                                ) : (
                                                                    selectedPage.description || 'لا يوجد وصف'
                                                                )}
                                                            </td>
                                                        </tr>
                                                        <tr>
                                                            <th>صورة</th>
                                                            <td>
                                                                {selectedPage.page_image || selectedPage.projet_image || selectedPage.about_image ? (
                                                                    <img
                                                                        src={getStorageUrl(selectedPage.page_image || selectedPage.projet_image || selectedPage.about_image)}
                                                                        alt="Page Image"
                                                                        style={{ maxWidth: '100px', maxHeight: '100px', objectFit: 'contain' }}
                                                                    />
                                                                ) : (
                                                                    'لا توجد'
                                                                )}
                                                            </td>
                                                        </tr>
                                                        <tr>
                                                            <th>مُحدّث آخر</th>
                                                            <td>{new Date(selectedPage.updated_at).toLocaleString()}</td>
                                                        </tr>
                                                    </tbody>
                                                </table>
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="d-flex align-items-center justify-content-center h-100 text-muted border rounded p-4">
                                            <p className="mb-0">الرجاء اختيار صفحة من القائمة لعرض التفاصيل.</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </AdminCard>
            </div>
        </AdminPage>

        <DeleteConfirmModal
            show={showDeleteConfirmModal}
            onClose={() => setShowDeleteConfirmModal(false)}
            onConfirm={confirmDelete}
            itemName={deleteTarget ? deleteTarget.titre : ''}
            isDeleting={deleting}
        />

        {alert.message && (
            <AdminAlert message={alert.message} type={alert.type} onClose={() => setAlert({ message: '', type: '' })} />
        )}
        </>
    );
};

export default AdminStaticPages;