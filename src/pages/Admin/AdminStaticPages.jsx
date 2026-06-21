import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../api';
import {
    AdminPage, AdminPageHeader, AdminCard, AdminLoading, AdminAlert, AdminBtn
} from '../../components/Admin/ui/AdminUI';


const AdminStaticPages = () => {
    const navigate = useNavigate();
    const [pages, setPages] = useState({ about: [], autism: [], projects: [] });
    const [selectedType, setSelectedType] = useState('about');
    const [selectedPage, setSelectedPage] = useState(null);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [deleteTarget, setDeleteTarget] = useState(null);
    const [alert, setAlert] = useState({ message: '', type: '' });
    const [loading, setLoading] = useState(false);
    const [deleting, setDeleting] = useState(false);
    const [search, setSearch] = useState('');

    useEffect(() => { fetchPages(); }, []);

    // Lock background scroll and interactions when delete modal is open
    useEffect(() => {
        if (showDeleteModal) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
        return () => { document.body.style.overflow = ''; };
    }, [showDeleteModal]);

    const fetchPages = async () => {
        setLoading(true);
        try {
            const res = await api.get('/admin/static-pages');
            setPages(res.data);
        } finally {
            setLoading(false);
        }
    };

    const handleSelectPage = (type, page) => {
        setSelectedType(type);
        setSelectedPage(page);
        const el = document.getElementById('page-details-table');
        if (el) el.scrollIntoView({ behavior: 'smooth' });
    };

    const promptDelete = (type, page) => {
        setDeleteTarget({ type, id: page.id, titre: page.titre });
        setShowDeleteModal(true);
    };

    const confirmDelete = async () => {
        if (!deleteTarget || deleting) return;
        setDeleting(true);
        try {
            await api.delete(`/admin/static-pages/${deleteTarget.type}/${deleteTarget.id}`);
            setAlert({ message: 'تم الحذف بنجاح', type: 'success' });
            setShowDeleteModal(false);
            setDeleteTarget(null);
            await fetchPages();
            setSelectedPage(null);
        } catch (err) {
            setAlert({ message: 'خطأ أثناء الحذف', type: 'danger' });
            setShowDeleteModal(false);
        } finally {
            setDeleting(false);
            setTimeout(() => setAlert({ message: '', type: '' }), 3500);
        }
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
                        onClick={() => navigate('/admin/static-pages/add')} // Navigate to add page
                    >
                        إضافة محتوى جديد
                    </AdminBtn>
                }
            />
            <div className="content-body">
                    <AdminCard title="صفحات ثابتة" icon="la-file-text">
                            <div className="row mb-3">
                                <div className="col-md-3">
                                    <div className="form-group">
                                        <label className="small">النوع</label>
                                        <select className="form-control" value={selectedType} onChange={e => { setSelectedType(e.target.value); setSelectedPage(null); }} aria-label="نوع الصفحة">
                                            <option value="about">من نحن</option>
                                            <option value="autism">صفحات التوحد</option>
                                            <option value="projects">مشاريعنا</option>
                                        </select>
                                    </div>
                                    <div className="form-group">
                                        <label className="small">بحث</label>
                                        <input className="form-control" placeholder="بحث بعنوان" value={search} onChange={e => setSearch(e.target.value)} style={{maxWidth: '100%'}} />
                                    </div>
                                    <div className="form-group mt-2">
                                        <button className="btn btn-sm btn-success" onClick={() => navigate('/admin/static-pages/add')}>
                                            إضافة محتوى جديد لـ {selectedType === 'about' ? 'من نحن' : selectedType === 'autism' ? 'التوحد' : 'مشاريعنا'}
                                        </button>
                                    </div>
                                </div>
                                <div className="col-md-9">
                            {loading ? (
                                <AdminLoading />
                            ) : (
                                        <ul className="list-group">
                                            {pages[selectedType].filter(p => p.titre.toLowerCase().includes(search.toLowerCase())).map(p => (
                                                <li key={p.id} className="list-group-item d-flex justify-content-between align-items-center">
                                                    <div style={{cursor: 'pointer'}} onClick={() => handleSelectPage(selectedType, p)}>{p.titre}</div>
                                                    <small className="text-muted">{new Date(p.updated_at).toLocaleDateString()}</small>
                                                </li>
                                            ))}
                                            {pages[selectedType].filter(p => p.titre.toLowerCase().includes(search.toLowerCase())).length === 0 && (
                                                <li className="list-group-item text-muted">لا توجد نتائج</li>
                                            )}
                                        </ul>
                                    )}
                                </div>
                            </div>

                            {selectedPage && (
                                <div id="page-details-table">
                                    <h5 className="mb-2">تفاصيل: {selectedPage.titre}</h5>
                                    <table className="table table-bordered">
                                        <tbody>
                                            <tr>
                                                <th style={{width: '200px'}}>حقل</th>
                                                <th>قيمة</th>
                                                <th style={{width: '160px'}}>إجراءات</th>
                                            </tr>
                                            <tr>
                                                <td>العنوان</td>
                                                <td>{selectedPage.titre}</td>
                                                <td>
                                                    <button className="btn btn-sm btn-primary mr-2" onClick={() => navigate(`/admin/static-pages/edit/${selectedType}/${selectedPage.id}`)}>تعديل</button>
                                                    <button className="btn btn-sm btn-danger" onClick={() => promptDelete(selectedType, selectedPage)}>حذف</button>
                                                </td>
                                            </tr>
                                            <tr>
                                                <td>الوصف (نصي)</td>
                                                <td>{selectedPage.description}</td>
                                                <td>
                                                    <button className="btn btn-sm btn-primary" onClick={() => navigate(`/admin/static-pages/edit/${selectedType}/${selectedPage.id}`)}>تعديل</button>
                                                </td>
                                            </tr>
                                            {selectedPage.structured_description && selectedPage.structured_description.sections && selectedPage.structured_description.sections.map((sec, idx) => (
                                                <tr key={idx}>
                                                    <td>قسم: {sec.subtitle || `قسم ${idx+1}`}</td>
                                                    <td style={{whiteSpace: 'pre-wrap'}}>{sec.text}</td>
                                                    <td>
                                                        <button className="btn btn-sm btn-primary" onClick={() => navigate(`/admin/static-pages/edit/${selectedType}/${selectedPage.id}`)}>تعديل</button>
                                                    </td>
                                                </tr>
                                            ))}
                                            <tr>
                                                <td>صورة</td>
                                                <td>
                                                    {selectedPage.page_image || selectedPage.projet_image || selectedPage.about_image ? (
                                                        <img
                                                            src={`http://localhost:8000/storage/MesImages/${selectedPage.page_image || selectedPage.projet_image || selectedPage.about_image}`}
                                                            alt="Page Image"
                                                            style={{ maxWidth: '100px', maxHeight: '100px', objectFit: 'contain' }}
                                                        />
                                                    ) : (
                                                        'لا توجد'
                                                    )}
                                                </td>
                                                <td></td>
                                            </tr>
                                            <tr>
                                                <td>مُحدّث آخر</td>
                                                <td>{new Date(selectedPage.updated_at).toLocaleString()}</td>
                                                <td></td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                            )}
                    </AdminCard>
            </div>
        </AdminPage>

        {showDeleteModal && deleteTarget && (
            <div className="modal show d-block" tabIndex="-1" role="dialog">
                <div className="modal-dialog" role="document">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title">تأكيد الحذف</h5>
                            <button type="button" className="close" onClick={() => setShowDeleteModal(false)}>&times;</button>
                        </div>
                        <div className="modal-body">
                            هل تريد فعلاً حذف "{deleteTarget.titre}"؟
                        </div>
                        <div className="modal-footer">
                            <button type="button" className="btn btn-secondary" onClick={() => setShowDeleteModal(false)}>إلغاء</button>
                            <button type="button" className="btn btn-danger" disabled={deleting} onClick={confirmDelete}>{deleting ? <span className="spinner-border spinner-border-sm"/> : 'حذف'}</button>
                        </div>
                    </div>
                </div>
                <div className="modal-backdrop show" onClick={() => setShowDeleteModal(false)}></div>
            </div>
        )}

        {alert.message && (
            <AdminAlert message={alert.message} type={alert.type} onClose={() => setAlert({ message: '', type: '' })} />
        )}
        </>
    );
};

export default AdminStaticPages;