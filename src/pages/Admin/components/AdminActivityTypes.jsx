import React from 'react';
import PropTypes from 'prop-types'; // Import PropTypes
import { AdminCard, AdminFormGroup, AdminBtn } from '../../../components/Admin/ui/AdminUI';

const AdminActivityTypes = ({
    openCategory,
    toggleCategory,
    types,
    newType,
    setNewType,
    editingTypeId,
    editingTypeData,
    setEditingTypeData,
    handleAddType,
    promptDeleteType,
    handleEditType,
    handleCancelEditType,
    handleSaveEditType,
    typesSubmitting,
}) => {
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
                                                <AdminBtn permission="edit_types" variant="primary" size="sm" icon="la-edit" onClick={() => handleEditType(t)}>تعديل</AdminBtn>
                                                <AdminBtn permission="delete_types" variant="danger" size="sm" icon="la-trash" onClick={() => promptDeleteType(t)}>حذف</AdminBtn>
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

AdminActivityTypes.propTypes = {
    openCategory: PropTypes.string,
    toggleCategory: PropTypes.func.isRequired,
    types: PropTypes.arrayOf(PropTypes.shape({
        id: PropTypes.number.isRequired,
        nomActivite: PropTypes.string.isRequired,
    })).isRequired,
    newType: PropTypes.shape({
        nomActivite: PropTypes.string.isRequired,
    }).isRequired,
    setNewType: PropTypes.func.isRequired,
    editingTypeId: PropTypes.number,
    editingTypeData: PropTypes.shape({
        nomActivite: PropTypes.string.isRequired,
    }).isRequired,
    setEditingTypeData: PropTypes.func.isRequired,
    handleAddType: PropTypes.func.isRequired,
    promptDeleteType: PropTypes.func.isRequired,
    handleEditType: PropTypes.func.isRequired,
    handleCancelEditType: PropTypes.func.isRequired,
    handleSaveEditType: PropTypes.func.isRequired,
    typesSubmitting: PropTypes.bool.isRequired,
};

export default AdminActivityTypes;