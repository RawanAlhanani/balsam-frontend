import React, { useState, useEffect } from 'react';
import api from '../../api';

const AdminStaticPages = () => {
    const [pages, setPages] = useState({ about: [], autism: [], projects: [] });
    const [formData, setFormData] = useState({ type: 'about', titre: '', description: '' });
    const [sections, setSections] = useState([{ subtitle: '', text: '' }]);
    const [editingId, setEditingId] = useState(null);
    const [image, setImage] = useState(null);
    const [selectedType, setSelectedType] = useState('about');
    const [selectedPage, setSelectedPage] = useState(null);
    const [showFormModal, setShowFormModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [deleteTarget, setDeleteTarget] = useState(null);
    const [alert, setAlert] = useState({ message: '', type: '' });
    const [loading, setLoading] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [deleting, setDeleting] = useState(false);
    const [search, setSearch] = useState('');

    useEffect(() => { fetchPages(); }, []);

    // Lock background scroll and interactions when any modal is open
    useEffect(() => {
        const anyOpen = showFormModal || showDeleteModal;
        if (anyOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
        return () => { document.body.style.overflow = ''; };
    }, [showFormModal, showDeleteModal]);

    const fetchPages = async () => {
        setLoading(true);
        try {
            const res = await api.get('/admin/static-pages');
            setPages(res.data);
        } finally {
            setLoading(false);
        }
    };

    const loadForEdit = (type, page) => {
        setFormData({ type, titre: page.titre, description: page.description || '' });
        setEditingId(page.id);
        if (type === 'autism') {
            const s = (page.structured_description && page.structured_description.sections) ? page.structured_description.sections : [{ subtitle: '', text: page.description || '' }];
            setSections(s.map(sec => ({ subtitle: sec.subtitle || '', text: sec.text || '' })));
        } else {
            setSections([{ subtitle: '', text: '' }]);
        }
        setShowFormModal(true);
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
            setAlert({ message: 'حدث خطأ أثناء الحذف', type: 'danger' });
            setShowDeleteModal(false);
        } finally {
            setDeleting(false);
            setTimeout(() => setAlert({ message: '', type: '' }), 3500);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (submitting) return;
        const data = new FormData();
        Object.keys(formData).forEach(k => data.append(k, formData[k]));
        if (image) data.append('image', image);
        // If creating an autism page, send structured sections JSON
        if (formData.type === 'autism') {
            data.append('description_json', JSON.stringify({ main: formData.titre, sections }));
        }
        if (editingId) data.append('id', editingId);
        setSubmitting(true);
        try {
            await api.post('/admin/static-pages', data);
            await fetchPages();
            setAlert({ message: editingId ? 'تم التحديث' : 'تم الإضافة', type: 'success' });
            setShowFormModal(false);
        } catch (err) {
            setAlert({ message: 'خطأ أثناء الحفظ', type: 'danger' });
        } finally {
            setSubmitting(false);
            setTimeout(() => setAlert({ message: '', type: '' }), 3500);
        }
        // reset form
        setFormData({ type: 'about', titre: '', description: '' });
        setSections([{ subtitle: '', text: '' }]);
        setImage(null);
        setEditingId(null);
    };

    return (
        <>
        <div className="app-content content">
            <div className="content-wrapper">
                <div className="content-header row"><h3 className="content-header-title">إدارة الصفحات الثابتة</h3></div>
                <div className="content-body">
                    {/* Add/Edit uses modal now */}
                    <div className="card mb-3">
                        <div className="card-header d-flex justify-content-between align-items-center">
                            <h4>صفحات ثابتة</h4>
                            <div>
                                <button className="btn btn-sm btn-success mr-2" onClick={() => { setEditingId(null); setFormData({ type: selectedType, titre: '', description: '' }); setSections([{ subtitle: '', text: '' }]); setShowFormModal(true); }}>أضف صفحة</button>
                            </div>
                        </div>
                        <div className="card-body">
                            <div className="row mb-3">
                                <div className="col-md-3">
                                    <div className="form-group">
                                        <label className="small">النوع</label>
                                        <select className="form-control" value={selectedType} onChange={e => { setSelectedType(e.target.value); setFormData({...formData, type: e.target.value}); }} aria-label="نوع الصفحة">
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
                                        <button className="btn btn-sm btn-success" onClick={() => { setEditingId(null); setFormData({ type: selectedType, titre: '', description: '' }); setSections([{ subtitle: '', text: '' }]); setShowFormModal(true); }}>أضف صفحة</button>
                                    </div>
                                </div>
                                <div className="col-md-9">
                                    {loading ? (
                                        <div className="text-center py-4"><div className="spinner-border text-primary" role="status"><span className="sr-only">Loading...</span></div></div>
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
                                                    <button className="btn btn-sm btn-primary mr-2" onClick={() => loadForEdit(selectedType, selectedPage)}>تعديل</button>
                                                    <button className="btn btn-sm btn-danger" onClick={() => promptDelete(selectedType, selectedPage)}>حذف</button>
                                                </td>
                                            </tr>
                                            <tr>
                                                <td>الوصف (نصي)</td>
                                                <td>{selectedPage.description}</td>
                                                <td>
                                                    <button className="btn btn-sm btn-primary" onClick={() => loadForEdit(selectedType, selectedPage)}>تعديل</button>
                                                </td>
                                            </tr>
                                            {selectedPage.structured_description && selectedPage.structured_description.sections && selectedPage.structured_description.sections.map((sec, idx) => (
                                                <tr key={idx}>
                                                    <td>قسم: {sec.subtitle || `قسم ${idx+1}`}</td>
                                                    <td style={{whiteSpace: 'pre-wrap'}}>{sec.text}</td>
                                                    <td>
                                                        <button className="btn btn-sm btn-primary" onClick={() => loadForEdit(selectedType, selectedPage)}>تعديل</button>
                                                    </td>
                                                </tr>
                                            ))}
                                            <tr>
                                                <td>صورة</td>
                                                <td>{selectedPage.page_image || selectedPage.projet_image || selectedPage.about_image || 'لا توجد'}</td>
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
                        </div>
                    </div>
                </div>
            </div>
        </div>
        {showFormModal && (
            <div className="modal show d-block" tabIndex="-1" role="dialog">
                <div className="modal-dialog modal-lg" role="document">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title">{editingId ? 'تعديل الصفحة' : 'أضف صفحة'}</h5>
                            <button type="button" className="close" onClick={() => setShowFormModal(false)}>&times;</button>
                        </div>
                        <div className="modal-body">
                            <form onSubmit={handleSubmit}>
                                <div className="form-row">
                                    <div className="form-group col-md-4">
                                        <label>النوع</label>
                                        <select className="form-control" value={formData.type} onChange={e => setFormData({...formData, type: e.target.value})}>
                                            <option value="about">من نحن</option>
                                            <option value="autism">صفحات التوحد</option>
                                            <option value="projects">مشاريعنا</option>
                                        </select>
                                    </div>
                                    <div className="form-group col-md-8">
                                        <label>العنوان</label>
                                        <input className="form-control" value={formData.titre} onChange={e => setFormData({...formData, titre: e.target.value})} required />
                                    </div>
                                </div>
                                <div className="form-group">
                                    {formData.type === 'autism' ? (
                                        <div>
                                            <small>أضف التفرعات التفصيلية (subtitle + text)</small>
                                            {sections.map((s, idx) => (
                                                <div key={idx} className="d-flex mb-2">
                                                    <input className="form-control mr-2" placeholder="عنوان فرعي" value={s.subtitle} onChange={e => { const copy = [...sections]; copy[idx].subtitle = e.target.value; setSections(copy); }} />
                                                    <input className="form-control" placeholder="النص" value={s.text} onChange={e => { const copy = [...sections]; copy[idx].text = e.target.value; setSections(copy); }} />
                                                    <button type="button" className="btn btn-sm btn-danger ml-2" onClick={() => { const copy = sections.filter((_, i) => i !== idx); setSections(copy.length?copy:[{ subtitle: '', text: '' }]); }}>حذف</button>
                                                </div>
                                            ))}
                                            <button type="button" className="btn btn-sm btn-secondary" onClick={() => setSections([...sections, { subtitle: '', text: '' }])}>أضف تفرع</button>
                                        </div>
                                    ) : (
                                        <textarea className="form-control" placeholder="الوصف" value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} required />
                                    )}
                                </div>
                                <div className="form-group">
                                    <label>صورة</label>
                                    <input type="file" className="form-control-file" onChange={e => setImage(e.target.files[0])} />
                                </div>
                                <div className="text-right">
                                    <button type="button" className="btn btn-secondary mr-2" onClick={() => setShowFormModal(false)}>إلغاء</button>
                                    <button type="submit" className="btn btn-primary" disabled={submitting}>
                                        {submitting ? <><span className="spinner-border spinner-border-sm mr-2" role="status" aria-hidden="true"></span> جارٍ...</> : (editingId ? 'حفظ' : 'إضافة')}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
                <div className="modal-backdrop show" onClick={() => setShowFormModal(false)}></div>
            </div>
        )}

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
            <div style={{position: 'fixed', top: 20, right: 20, zIndex: 1050}}>
                <div className={`alert alert-${alert.type}`} role="alert">{alert.message}</div>
            </div>
        )}
        {/* rely on modal-backdrop and body overflow lock; removed custom overlay to avoid blocking modal inputs */}
        </>
    );
};

export default AdminStaticPages;
