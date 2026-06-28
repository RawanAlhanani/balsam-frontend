import React from 'react';
import PropTypes from 'prop-types'; // Import PropTypes
import { AdminCard, AdminFormGroup, AdminBtn } from '../../../components/Admin/ui/AdminUI';

const AdminFinanceCategories = ({
    openCategory,
    toggleCategory,
    financeCats,
    newCat,
    setNewCat,
    editingCatId,
    editingCatData,
    setEditingCatData,
    handleAddCat,
    promptDeleteCat,
    handleEditCat,
    handleCancelEditCat,
    handleSaveEditCat,
    financeCatsSubmitting,
}) => {
    return (
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
                                <AdminBtn variant="success" type="submit" icon="la-plus" disabled={financeCatsSubmitting}>
                                    {financeCatsSubmitting ? <span className="spinner-border spinner-border-sm"/> : 'إضافة'}
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
                                                        <AdminBtn variant="primary" size="sm" icon="la-save" onClick={() => handleSaveEditCat(c.id)} disabled={financeCatsSubmitting}>
                                                            {financeCatsSubmitting ? <span className="spinner-border spinner-border-sm"/> : 'حفظ'}
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
                                                        <AdminBtn variant="primary" size="sm" icon="la-save" onClick={() => handleSaveEditCat(c.id)} disabled={financeCatsSubmitting}>
                                                            {financeCatsSubmitting ? <span className="spinner-border spinner-border-sm"/> : 'حفظ'}
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
    );
};

AdminFinanceCategories.propTypes = {
    openCategory: PropTypes.string,
    toggleCategory: PropTypes.func.isRequired,
    financeCats: PropTypes.arrayOf(PropTypes.shape({
        id: PropTypes.number.isRequired,
        name: PropTypes.string.isRequired,
        type: PropTypes.oneOf(['income', 'expense']).isRequired,
    })).isRequired,
    newCat: PropTypes.shape({
        name: PropTypes.string.isRequired,
        type: PropTypes.oneOf(['income', 'expense']).isRequired,
    }).isRequired,
    setNewCat: PropTypes.func.isRequired,
    editingCatId: PropTypes.number,
    editingCatData: PropTypes.shape({
        name: PropTypes.string.isRequired,
        type: PropTypes.oneOf(['income', 'expense']).isRequired,
    }).isRequired,
    setEditingCatData: PropTypes.func.isRequired,
    handleAddCat: PropTypes.func.isRequired,
    promptDeleteCat: PropTypes.func.isRequired,
    handleEditCat: PropTypes.func.isRequired,
    handleCancelEditCat: PropTypes.func.isRequired,
    handleSaveEditCat: PropTypes.func.isRequired,
    financeCatsSubmitting: PropTypes.bool.isRequired,
};

export default AdminFinanceCategories;