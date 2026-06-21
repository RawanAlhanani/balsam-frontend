import React, { useState, useEffect } from 'react';
import api from '../../api';
import {
    AdminPage, AdminPageHeader, AdminCard, AdminFormGroup, AdminBtn, AdminAlert, AdminLoading
} from '../../components/Admin/ui/AdminUI';

// Simple Delete Confirmation Modal Component
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


const AdminSettings = () => {
    const [types, setTypes] = useState([]);
    const [regions, setRegions] = useState([]);
    const [doctors, setDoctors] = useState([]);
    const [financeCats, setFinanceCats] = useState([]);
    
    // State for adding new items
    const [newType, setNewType] = useState('');
    const [newRegion, setNewRegion] = useState('');
    const [newDoctor, setNewDoctor] = useState('');
    const [newCat, setNewCat] = useState({ name: '', type: 'income' });

    const [alert, setAlert] = useState({ message: '', type: '' });
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false); // For add/edit operations
    const [deleting, setDeleting] = useState(false); // For delete operations

    // State for delete confirmation modal
    const [showDeleteConfirmModal, setShowDeleteConfirmModal] = useState(false);
    const [deleteTargetCat, setDeleteTargetCat] = useState(null); // For finance categories
    const [deleteTargetType, setDeleteTargetType] = useState(null); // For activity types
    const [deleteTargetRegion, setDeleteTargetRegion] = useState(null); // For regions
    const [deleteTargetDoctor, setDeleteTargetDoctor] = useState(null); // For doctors

    // State for editing finance categories
    const [editingCatId, setEditingCatId] = useState(null);
    const [editingCatData, setEditingCatData] = useState({ name: '', type: 'income' });

    // State for editing activity types
    const [editingTypeId, setEditingTypeId] = useState(null);
    const [editingTypeData, setEditingTypeData] = useState('');

    // State for editing regions
    const [editingRegionId, setEditingRegionId] = useState(null);
    const [editingRegionData, setEditingRegionData] = useState('');

    // State for editing doctors
    const [editingDoctorId, setEditingDoctorId] = useState(null);
    const [editingDoctorData, setEditingDoctorData] = useState('');

    // State for controlling open/closed categories
    const [openCategory, setOpenCategory] = useState(null); // 'types', 'regions', 'doctors', 'finance'

    const toggleCategory = (categoryName) => {
        setOpenCategory(prev => (prev === categoryName ? null : categoryName));
    };


    useEffect(() => {
        fetchInitialData();
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


    const fetchInitialData = async () => {
        setLoading(true);
        try {
            const [typesRes, regionsRes, doctorsRes, financeCatsRes] = await Promise.all([
                api.get('/admin/types'),
                api.get('/admin/regions'),
                api.get('/admin/doctors'),
                api.get('/admin/finance-categories')
            ]);
            setTypes(typesRes.data);
            setRegions(regionsRes.data);
            setDoctors(doctorsRes.data);
            setFinanceCats(financeCatsRes.data);
        } catch (err) {
            setAlert({ message: 'خطأ في تحميل البيانات الأولية', type: 'danger' });
        } finally {
            setLoading(false);
        }
    };

    // --- Finance Categories Handlers ---
    const fetchFinanceCats = async () => {
        try {
            const res = await api.get('/admin/finance-categories');
            setFinanceCats(res.data);
        } catch (err) {
            setAlert({ message: 'خطأ في تحميل فئات المالية', type: 'danger' });
        }
    };

    const handleAddCat = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        try {
            await api.post('/admin/finance-categories', newCat);
            setNewCat({ name: '', type: 'income' });
            await fetchFinanceCats();
            setAlert({ message: 'تم إضافة الفئة بنجاح', type: 'success' });
        } catch (err) {
            setAlert({ message: 'خطأ أثناء إضافة الفئة', type: 'danger' });
        } finally {
            setSubmitting(false);
            setTimeout(() => setAlert({ message: '', type: '' }), 3500);
        }
    };

    const promptDeleteCat = (category) => {
        setDeleteTargetCat(category);
        setDeleteTargetType(null); // Clear other delete targets
        setDeleteTargetRegion(null);
        setDeleteTargetDoctor(null);
        setShowDeleteConfirmModal(true);
    };

    const confirmDeleteCat = async () => {
        if (!deleteTargetCat || deleting) return;
        setDeleting(true);
        try {
            await api.delete(`/admin/finance-categories/${deleteTargetCat.id}`);
            await fetchFinanceCats();
            setAlert({ message: 'تم حذف الفئة بنجاح', type: 'success' });
            setShowDeleteConfirmModal(false);
            setDeleteTargetCat(null);
        } catch (err) {
            setAlert({ message: 'خطأ أثناء حذف الفئة', type: 'danger' });
        } finally {
            setDeleting(false);
            setTimeout(() => setAlert({ message: '', type: '' }), 3500);
        }
    };

    const handleEditCat = (category) => {
        setEditingCatId(category.id);
        setEditingCatData({ name: category.name, type: category.type });
    };

    const handleCancelEditCat = () => {
        setEditingCatId(null);
        setEditingCatData({ name: '', type: 'income' });
    };

    const handleSaveEditCat = async (id) => {
        setSubmitting(true);
        try {
            await api.put(`/admin/finance-categories/${id}`, editingCatData);
            await fetchFinanceCats();
            setAlert({ message: 'تم تحديث الفئة بنجاح', type: 'success' });
            handleCancelEditCat();
        } catch (err) {
            setAlert({ message: 'خطأ أثناء تحديث الفئة', type: 'danger' });
        } finally {
            setSubmitting(false);
            setTimeout(() => setAlert({ message: '', type: '' }), 3500);
        }
    };

    // --- Activity Types Handlers ---
    const fetchTypes = async () => {
        try {
            const res = await api.get('/admin/types');
            setTypes(res.data);
        } catch (err) {
            setAlert({ message: 'خطأ في تحميل أنواع الأنشطة', type: 'danger' });
        }
    };

    const handleAddType = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        try {
            await api.post('/admin/types', { nomActivite: newType });
            setNewType('');
            await fetchTypes();
            setAlert({ message: 'تم إضافة نوع النشاط بنجاح', type: 'success' });
        } catch (err) {
            setAlert({ message: 'خطأ أثناء إضافة نوع النشاط', type: 'danger' });
        } finally {
            setSubmitting(false);
            setTimeout(() => setAlert({ message: '', type: '' }), 3500);
        }
    };

    const promptDeleteType = (typeItem) => {
        setDeleteTargetType(typeItem);
        setDeleteTargetCat(null); // Clear other delete targets
        setDeleteTargetRegion(null);
        setDeleteTargetDoctor(null);
        setShowDeleteConfirmModal(true);
    };

    const confirmDeleteType = async () => {
        if (!deleteTargetType || deleting) return;
        setDeleting(true);
        try {
            await api.delete(`/admin/types/${deleteTargetType.id}`);
            await fetchTypes();
            setAlert({ message: 'تم حذف نوع النشاط بنجاح', type: 'success' });
            setShowDeleteConfirmModal(false);
            setDeleteTargetType(null);
        } catch (err) {
            setAlert({ message: 'خطأ أثناء حذف نوع النشاط', type: 'danger' });
        } finally {
            setDeleting(false);
            setTimeout(() => setAlert({ message: '', type: '' }), 3500);
        }
    };

    const handleEditType = (typeItem) => {
        setEditingTypeId(typeItem.id);
        setEditingTypeData(typeItem.nomActivite);
    };

    const handleCancelEditType = () => {
        setEditingTypeId(null);
        setEditingTypeData('');
    };

    const handleSaveEditType = async (id) => {
        setSubmitting(true);
        try {
            await api.put(`/admin/types/${id}`, { nomActivite: editingTypeData });
            await fetchTypes();
            setAlert({ message: 'تم تحديث نوع النشاط بنجاح', type: 'success' });
            handleCancelEditType();
        } catch (err) {
            setAlert({ message: 'خطأ أثناء تحديث نوع النشاط', type: 'danger' });
        } finally {
            setSubmitting(false);
            setTimeout(() => setAlert({ message: '', type: '' }), 3500);
        }
    };

    // --- Regions Handlers ---
    const fetchRegions = async () => {
        try {
            const res = await api.get('/admin/regions');
            setRegions(res.data);
        } catch (err) {
            setAlert({ message: 'خطأ في تحميل المناطق', type: 'danger' });
        }
    };

    const handleAddRegion = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        try {
            await api.post('/admin/regions', { nom_region: newRegion });
            setNewRegion('');
            await fetchRegions();
            setAlert({ message: 'تم إضافة المنطقة بنجاح', type: 'success' });
        } catch (err) {
            setAlert({ message: 'خطأ أثناء إضافة المنطقة', type: 'danger' });
        } finally {
            setSubmitting(false);
            setTimeout(() => setAlert({ message: '', type: '' }), 3500);
        }
    };

    const promptDeleteRegion = (regionItem) => {
        setDeleteTargetRegion(regionItem);
        setDeleteTargetCat(null); // Clear other delete targets
        setDeleteTargetType(null);
        setDeleteTargetDoctor(null);
        setShowDeleteConfirmModal(true);
    };

    const confirmDeleteRegion = async () => {
        if (!deleteTargetRegion || deleting) return;
        setDeleting(true);
        try {
            await api.delete(`/admin/regions/${deleteTargetRegion.id}`);
            await fetchRegions();
            setAlert({ message: 'تم حذف المنطقة بنجاح', type: 'success' });
            setShowDeleteConfirmModal(false);
            setDeleteTargetRegion(null);
        } catch (err) {
            setAlert({ message: 'خطأ أثناء حذف المنطقة', type: 'danger' });
        } finally {
            setDeleting(false);
            setTimeout(() => setAlert({ message: '', type: '' }), 3500);
        }
    };

    const handleEditRegion = (regionItem) => {
        setEditingRegionId(regionItem.id);
        setEditingRegionData(regionItem.nom_region);
    };

    const handleCancelEditRegion = () => {
        setEditingRegionId(null);
        setEditingRegionData('');
    };

    const handleSaveEditRegion = async (id) => {
        setSubmitting(true);
        try {
            await api.put(`/admin/regions/${id}`, { nom_region: editingRegionData });
            await fetchRegions();
            setAlert({ message: 'تم تحديث المنطقة بنجاح', type: 'success' });
            handleCancelEditRegion();
        } catch (err) {
            setAlert({ message: 'خطأ أثناء تحديث المنطقة', type: 'danger' });
        } finally {
            setSubmitting(false);
            setTimeout(() => setAlert({ message: '', type: '' }), 3500);
        }
    };

    // --- Doctors Handlers ---
    const fetchDoctors = async () => {
        try {
            const res = await api.get('/admin/doctors');
            setDoctors(res.data);
        } catch (err) {
            setAlert({ message: 'خطأ في تحميل التخصصات', type: 'danger' });
        }
    };

    const handleAddDoctor = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        try {
            await api.post('/admin/doctors', { specialite: newDoctor });
            setNewDoctor('');
            await fetchDoctors();
            setAlert({ message: 'تم إضافة التخصص بنجاح', type: 'success' });
        } catch (err) {
            setAlert({ message: 'خطأ أثناء إضافة التخصص', type: 'danger' });
        } finally {
            setSubmitting(false);
            setTimeout(() => setAlert({ message: '', type: '' }), 3500);
        }
    };

    const promptDeleteDoctor = (doctorItem) => {
        setDeleteTargetDoctor(doctorItem);
        setDeleteTargetCat(null); // Clear other delete targets
        setDeleteTargetType(null);
        setDeleteTargetRegion(null);
        setShowDeleteConfirmModal(true);
    };

    const confirmDeleteDoctor = async () => {
        if (!deleteTargetDoctor || deleting) return;
        setDeleting(true);
        try {
            await api.delete(`/admin/doctors/${deleteTargetDoctor.id}`);
            await fetchDoctors();
            setAlert({ message: 'تم حذف التخصص بنجاح', type: 'success' });
            setShowDeleteConfirmModal(false);
            setDeleteTargetDoctor(null);
        } catch (err) {
            setAlert({ message: 'خطأ أثناء حذف التخصص', type: 'danger' });
        } finally {
            setDeleting(false);
            setTimeout(() => setAlert({ message: '', type: '' }), 3500);
        }
    };

    const handleEditDoctor = (doctorItem) => {
        setEditingDoctorId(doctorItem.id);
        setEditingDoctorData(doctorItem.specialite);
    };

    const handleCancelEditDoctor = () => {
        setEditingDoctorId(null);
        setEditingDoctorData('');
    };

    const handleSaveEditDoctor = async (id) => {
        setSubmitting(true);
        try {
            await api.put(`/admin/doctors/${id}`, { specialite: editingDoctorData });
            await fetchDoctors();
            setAlert({ message: 'تم تحديث التخصص بنجاح', type: 'success' });
            handleCancelEditDoctor();
        } catch (err) {
            setAlert({ message: 'خطأ أثناء تحديث التخصص', type: 'danger' });
        } finally {
            setSubmitting(false);
            setTimeout(() => setAlert({ message: '', type: '' }), 3500);
        }
    };


    return (
        <>
        <AdminPage>
            <AdminPageHeader
                title="إعدادات النظام"
                subtitle="إدارة البيانات المرجعية وفئات المالية"
                badge="الإعدادات"
            />
            <div className="content-body">
                <div className="row">
                    {/* Activity Types Card */}
                    <div className="col-md-4">
                        <AdminCard
                            title={
                                <div className="d-flex justify-content-between align-items-center" onClick={() => toggleCategory('types')} style={{ cursor: 'pointer' }}>
                                    <span>أنواع الأنشطة</span>
                                    <i className={`la ${openCategory === 'types' ? 'la-angle-up' : 'la-angle-down'}`}></i>
                                </div>
                            }
                            icon="la-tags"
                        >
                            {openCategory === 'types' && (
                                <>
                                    <form onSubmit={handleAddType} className="mb-3">
                                        <AdminFormGroup label="اسم نوع النشاط">
                                            <input className="form-control" placeholder="نوع نشاط جديد" value={newType} onChange={e => setNewType(e.target.value)} required />
                                        </AdminFormGroup>
                                        <AdminBtn variant="success" type="submit" icon="la-plus" disabled={submitting}>
                                            {submitting ? <span className="spinner-border spinner-border-sm"/> : 'إضافة نوع'}
                                        </AdminBtn>
                                    </form>
                                    <ul className="list-group">
                                        {types.map(t => (
                                            <li key={t.id} className="list-group-item d-flex justify-content-between align-items-center">
                                                {editingTypeId === t.id ? (
                                                    <div className="d-flex align-items-center flex-grow-1">
                                                        <input
                                                            className="form-control form-control-sm mr-2"
                                                            value={editingTypeData}
                                                            onChange={e => setEditingTypeData(e.target.value)}
                                                            required
                                                        />
                                                        <AdminBtn variant="primary" size="sm" icon="la-save" onClick={() => handleSaveEditType(t.id)} disabled={submitting}>
                                                            {submitting ? <span className="spinner-border spinner-border-sm"/> : 'حفظ'}
                                                        </AdminBtn>
                                                        <AdminBtn variant="secondary" size="sm" icon="la-times" onClick={handleCancelEditType} className="ml-1">إلغاء</AdminBtn>
                                                    </div>
                                                ) : (
                                                    <>
                                                        <span>{t.nomActivite}</span>
                                                        <div className="admin-action-group">
                                                            <AdminBtn variant="primary" size="sm" icon="la-edit" onClick={() => handleEditType(t)}>تعديل</AdminBtn>
                                                            <AdminBtn variant="danger" size="sm" icon="la-trash" onClick={() => promptDeleteType(t)}>حذف</AdminBtn>
                                                        </div>
                                                    </>
                                                )}
                                            </li>
                                        ))}
                                        {types.length === 0 && <li className="list-group-item text-muted">لا توجد أنواع</li>}
                                    </ul>
                                </>
                            )}
                        </AdminCard>
                    </div>

                    {/* Regions Card */}
                    <div className="col-md-4">
                        <AdminCard
                            title={
                                <div className="d-flex justify-content-between align-items-center" onClick={() => toggleCategory('regions')} style={{ cursor: 'pointer' }}>
                                    <span>المناطق</span>
                                    <i className={`la ${openCategory === 'regions' ? 'la-angle-up' : 'la-angle-down'}`}></i>
                                </div>
                            }
                            icon="la-map-marker"
                        >
                            {openCategory === 'regions' && (
                                <>
                                    <form onSubmit={handleAddRegion} className="mb-3">
                                        <AdminFormGroup label="اسم المنطقة">
                                            <input className="form-control" placeholder="منطقة جديدة" value={newRegion} onChange={e => setNewRegion(e.target.value)} required />
                                        </AdminFormGroup>
                                        <AdminBtn variant="success" type="submit" icon="la-plus" disabled={submitting}>
                                            {submitting ? <span className="spinner-border spinner-border-sm"/> : 'إضافة منطقة'}
                                        </AdminBtn>
                                    </form>
                                    <ul className="list-group">
                                        {regions.map(r => (
                                            <li key={r.id} className="list-group-item d-flex justify-content-between align-items-center">
                                                {editingRegionId === r.id ? (
                                                    <div className="d-flex align-items-center flex-grow-1">
                                                        <input
                                                            className="form-control form-control-sm mr-2"
                                                            value={editingRegionData}
                                                            onChange={e => setEditingRegionData(e.target.value)}
                                                            required
                                                        />
                                                        <AdminBtn variant="primary" size="sm" icon="la-save" onClick={() => handleSaveEditRegion(r.id)} disabled={submitting}>
                                                            {submitting ? <span className="spinner-border spinner-border-sm"/> : 'حفظ'}
                                                        </AdminBtn>
                                                        <AdminBtn variant="secondary" size="sm" icon="la-times" onClick={handleCancelEditRegion} className="ml-1">إلغاء</AdminBtn>
                                                    </div>
                                                ) : (
                                                    <>
                                                        <span>{r.nom_region}</span>
                                                        <div className="admin-action-group">
                                                            <AdminBtn variant="primary" size="sm" icon="la-edit" onClick={() => handleEditRegion(r)}>تعديل</AdminBtn>
                                                            <AdminBtn variant="danger" size="sm" icon="la-trash" onClick={() => promptDeleteRegion(r)}>حذف</AdminBtn>
                                                        </div>
                                                    </>
                                                )}
                                            </li>
                                        ))}
                                        {regions.length === 0 && <li className="list-group-item text-muted">لا توجد مناطق</li>}
                                    </ul>
                                </>
                            )}
                        </AdminCard>
                    </div>

                    {/* Doctors Card */}
                    <div className="col-md-4">
                        <AdminCard
                            title={
                                <div className="d-flex justify-content-between align-items-center" onClick={() => toggleCategory('doctors')} style={{ cursor: 'pointer' }}>
                                    <span>التخصصات</span>
                                    <i className={`la ${openCategory === 'doctors' ? 'la-angle-up' : 'la-angle-down'}`}></i>
                                </div>
                            }
                            icon="la-stethoscope"
                        >
                            {openCategory === 'doctors' && (
                                <>
                                    <form onSubmit={handleAddDoctor} className="mb-3">
                                        <AdminFormGroup label="اسم التخصص">
                                            <input className="form-control" placeholder="تخصص جديد" value={newDoctor} onChange={e => setNewDoctor(e.target.value)} required />
                                        </AdminFormGroup>
                                        <AdminBtn variant="success" type="submit" icon="la-plus" disabled={submitting}>
                                            {submitting ? <span className="spinner-border spinner-border-sm"/> : 'إضافة تخصص'}
                                        </AdminBtn>
                                    </form>
                                    <ul className="list-group">
                                        {doctors.map(d => (
                                            <li key={d.id} className="list-group-item d-flex justify-content-between align-items-center">
                                                {editingDoctorId === d.id ? (
                                                    <div className="d-flex align-items-center flex-grow-1">
                                                        <input
                                                            className="form-control form-control-sm mr-2"
                                                            value={editingDoctorData}
                                                            onChange={e => setEditingDoctorData(e.target.value)}
                                                            required
                                                        />
                                                        <AdminBtn variant="primary" size="sm" icon="la-save" onClick={() => handleSaveEditDoctor(d.id)} disabled={submitting}>
                                                            {submitting ? <span className="spinner-border spinner-border-sm"/> : 'حفظ'}
                                                        </AdminBtn>
                                                        <AdminBtn variant="secondary" size="sm" icon="la-times" onClick={handleCancelEditDoctor} className="ml-1">إلغاء</AdminBtn>
                                                    </div>
                                                ) : (
                                                    <>
                                                        <span>{d.specialite}</span>
                                                        <div className="admin-action-group">
                                                            <AdminBtn variant="primary" size="sm" icon="la-edit" onClick={() => handleEditDoctor(d)}>تعديل</AdminBtn>
                                                            <AdminBtn variant="danger" size="sm" icon="la-trash" onClick={() => promptDeleteDoctor(d)}>حذف</AdminBtn>
                                                        </div>
                                                    </>
                                                )}
                                            </li>
                                        ))}
                                        {doctors.length === 0 && <li className="list-group-item text-muted">لا توجد تخصصات</li>}
                                    </ul>
                                </>
                            )}
                        </AdminCard>
                    </div>
                </div>

                {/* Finance Categories Card */}
                <div className="row mt-3">
                    <div className="col-md-12">
                        <AdminCard
                            title={
                                <div className="d-flex justify-content-between align-items-center" onClick={() => toggleCategory('finance')} style={{ cursor: 'pointer' }}>
                                    <span>فئات المالية</span>
                                    <i className={`la ${openCategory === 'finance' ? 'la-angle-up' : 'la-angle-down'}`}></i>
                                </div>
                            }
                            icon="la-money"
                        >
                            {openCategory === 'finance' && (
                                <>
                                    <form onSubmit={handleAddCat} className="admin-filter-bar mb-4">
                                        <AdminFormGroup label="اسم الفئة" className="flex-grow-1">
                                            <input className="form-control" placeholder="اسم الفئة الجديد" value={newCat.name} onChange={e => setNewCat({ ...newCat, name: e.target.value })} required />
                                        </AdminFormGroup>
                                        <AdminFormGroup label="النوع">
                                            <select className="form-control" value={newCat.type} onChange={e => setNewCat({ ...newCat, type: e.target.value })}>
                                                <option value="income">مدخول (+)</option>
                                                <option value="expense">مصروف (-)</option>
                                            </select>
                                        </AdminFormGroup>
                                        <AdminBtn variant="success" type="submit" icon="la-plus" disabled={submitting}>
                                            {submitting ? <span className="spinner-border spinner-border-sm"/> : 'إضافة'}
                                        </AdminBtn>
                                    </form>

                                    <div className="row">
                                        <div className="col-md-6">
                                            <h5 className="admin-section-title">فئات المداخيل</h5>
                                            <ul className="list-group">
                                                {financeCats.filter(c => c.type === 'income').map(c => (
                                                    <li key={c.id} className="list-group-item d-flex justify-content-between align-items-center">
                                                        {editingCatId === c.id ? (
                                                            <div className="d-flex align-items-center flex-grow-1">
                                                                <input
                                                                    className="form-control form-control-sm mr-2"
                                                                    value={editingCatData.name}
                                                                    onChange={e => setEditingCatData({ ...editingCatData, name: e.target.value })}
                                                                    required
                                                                />
                                                                <select
                                                                    className="form-control form-control-sm mr-2"
                                                                    value={editingCatData.type}
                                                                    onChange={e => setEditingCatData({ ...editingCatData, type: e.target.value })}
                                                                >
                                                                    <option value="income">مدخول (+)</option>
                                                                    <option value="expense">مصروف (-)</option>
                                                                </select>
                                                                <AdminBtn variant="primary" size="sm" icon="la-save" onClick={() => handleSaveEditCat(c.id)} disabled={submitting}>
                                                                    {submitting ? <span className="spinner-border spinner-border-sm"/> : 'حفظ'}
                                                                </AdminBtn>
                                                                <AdminBtn variant="secondary" size="sm" icon="la-times" onClick={handleCancelEditCat} className="ml-1">إلغاء</AdminBtn>
                                                            </div>
                                                        ) : (
                                                            <>
                                                                <span>{c.name}</span>
                                                                <div className="admin-action-group">
                                                                    <AdminBtn variant="primary" size="sm" icon="la-edit" onClick={() => handleEditCat(c)}>تعديل</AdminBtn>
                                                                    <AdminBtn variant="danger" size="sm" icon="la-trash" onClick={() => promptDeleteCat(c)}>حذف</AdminBtn>
                                                                </div>
                                                            </>
                                                        )}
                                                    </li>
                                                ))}
                                                {financeCats.filter(c => c.type === 'income').length === 0 && (
                                                    <li className="list-group-item text-muted">لا توجد فئات</li>
                                                )}
                                            </ul>
                                        </div>
                                        <div className="col-md-6">
                                            <h5 className="admin-section-title">فئات المصاريف</h5>
                                            <ul className="list-group">
                                                {financeCats.filter(c => c.type === 'expense').map(c => (
                                                    <li key={c.id} className="list-group-item d-flex justify-content-between align-items-center">
                                                        {editingCatId === c.id ? (
                                                            <div className="d-flex align-items-center flex-grow-1">
                                                                <input
                                                                    className="form-control form-control-sm mr-2"
                                                                    value={editingCatData.name}
                                                                    onChange={e => setEditingCatData({ ...editingCatData, name: e.target.value })}
                                                                    required
                                                                />
                                                                <select
                                                                    className="form-control form-control-sm mr-2"
                                                                    value={editingCatData.type}
                                                                    onChange={e => setEditingCatData({ ...editingCatData, type: e.target.value })}
                                                                >
                                                                    <option value="income">مدخول (+)</option>
                                                                    <option value="expense">مصروف (-)</option>
                                                                </select>
                                                                <AdminBtn variant="primary" size="sm" icon="la-save" onClick={() => handleSaveEditCat(c.id)} disabled={submitting}>
                                                                    {submitting ? <span className="spinner-border spinner-border-sm"/> : 'حفظ'}
                                                                </AdminBtn>
                                                                <AdminBtn variant="secondary" size="sm" icon="la-times" onClick={handleCancelEditCat} className="ml-1">إلغاء</AdminBtn>
                                                            </div>
                                                        ) : (
                                                            <>
                                                                <span>{c.name}</span>
                                                                <div className="admin-action-group">
                                                                    <AdminBtn variant="primary" size="sm" icon="la-edit" onClick={() => handleEditCat(c)}>تعديل</AdminBtn>
                                                                    <AdminBtn variant="danger" size="sm" icon="la-trash" onClick={() => promptDeleteCat(c)}>حذف</AdminBtn>
                                                                </div>
                                                            </>
                                                        )}
                                                    </li>
                                                ))}
                                                {financeCats.filter(c => c.type === 'expense').length === 0 && (
                                                    <li className="list-group-item text-muted">لا توجد فئات</li>
                                                )}
                                            </ul>
                                        </div>
                                    </div>
                                </>
                            )}
                        </AdminCard>
                    </div>
                </div>
            </div>
        </AdminPage>

        <DeleteConfirmModal
            show={showDeleteConfirmModal}
            onClose={() => setShowDeleteConfirmModal(false)}
            onConfirm={
                deleteTargetCat ? confirmDeleteCat :
                deleteTargetType ? confirmDeleteType :
                deleteTargetRegion ? confirmDeleteRegion :
                deleteTargetDoctor ? confirmDeleteDoctor :
                () => setShowDeleteConfirmModal(false) // Fallback
            }
            itemName={deleteTargetCat?.name || deleteTargetType?.nomActivite || deleteTargetRegion?.nom_region || deleteTargetDoctor?.specialite || ''}
            isDeleting={deleting}
        />

        {alert.message && (
            <AdminAlert message={alert.message} type={alert.type} onClose={() => setAlert({ message: '', type: '' })} />
        )}
        </>
    );
};

export default AdminSettings;