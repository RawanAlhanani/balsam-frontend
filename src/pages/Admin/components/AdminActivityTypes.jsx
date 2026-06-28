import React from 'react';
import { AdminCard, AdminFormGroup, AdminBtn } from '../../../components/Admin/ui/AdminUI';
import useAdminCrud from '../../../hooks/useAdminCrud';

const AdminActivityTypes = ({ openCategory, toggleCategory }) => {
    const {
        items: types,
        submitting: typesSubmitting,
        newItem: newType,
        setNewItem: setNewType,
        editingItemId: editingTypeId,
        editingItemData: editingTypeData,
        setEditingItemData: setEditingTypeData,
        handleAddItem: handleAddType,
        promptDeleteItem: promptDeleteType,
        handleEditItem: handleEditType,
        handleCancelEdit: handleCancelEditType,
        handleSaveEditItem: handleSaveEditType,
    } = useAdminCrud('/admin/types', 'نوع النشاط', { nomActivite: '' },
        (item) => ({ nomActivite: item.nomActivite }), // transformNewItem
        (item) => ({ nomActivite: item.nomActivite })  // transformEditItem
    );

    return (
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
                                <input className="form-control" placeholder="نوع نشاط جديد" value={newType.nomActivite} onChange={e => setNewType({ nomActivite: e.target.value })} required />
                            </AdminFormGroup>
                            <AdminBtn variant="success" type="submit" icon="la-plus" disabled={typesSubmitting}>
                                {typesSubmitting ? <span className="spinner-border spinner-border-sm"/> : 'إضافة نوع'}
                            </AdminBtn>
                        </form>
                        <ul className="list-group">
                            {types.map(t => (
                                <li key={t.id} className="list-group-item d-flex justify-content-between align-items-center">
                                    {editingTypeId === t.id ? (
                                        <div className="d-flex align-items-center flex-grow-1">
                                            <input
                                                className="form-control form-control-sm mr-2"
                                                value={editingTypeData.nomActivite}
                                                onChange={e => setEditingTypeData({ nomActivite: e.target.value })}
                                                required
                                            />
                                            <AdminBtn variant="primary" size="sm" icon="la-save" onClick={() => handleSaveEditType(t.id)} disabled={typesSubmitting}>
                                                {typesSubmitting ? <span className="spinner-border spinner-border-sm"/> : 'حفظ'}
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
    );
};

export default AdminActivityTypes;