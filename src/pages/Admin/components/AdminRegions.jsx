import React from 'react';
import PropTypes from 'prop-types'; // Import PropTypes
import { AdminCard, AdminFormGroup, AdminBtn } from '../../../components/Admin/ui/AdminUI';

const AdminRegions = ({
    openCategory,
    toggleCategory,
    regions,
    newRegion,
    setNewRegion,
    editingRegionId,
    editingRegionData,
    setEditingRegionData,
    handleAddRegion,
    promptDeleteRegion,
    handleEditRegion,
    handleCancelEditRegion,
    handleSaveEditRegion,
    regionsSubmitting,
}) => {
    return (
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
                                <input className="form-control" placeholder="منطقة جديدة" value={newRegion.nom_region} onChange={e => setNewRegion({ nom_region: e.target.value })} required />
                            </AdminFormGroup>
                            <AdminBtn variant="success" type="submit" icon="la-plus" disabled={regionsSubmitting}>
                                {regionsSubmitting ? <span className="spinner-border spinner-border-sm"/> : 'إضافة منطقة'}
                            </AdminBtn>
                        </form>
                        <ul className="list-group">
                            {regions.map(r => (
                                <li key={r.id} className="list-group-item d-flex justify-content-between align-items-center">
                                    {editingRegionId === r.id ? (
                                        <div className="d-flex align-items-center flex-grow-1">
                                            <input
                                                className="form-control form-control-sm mr-2"
                                                value={editingRegionData.nom_region}
                                                onChange={e => setEditingRegionData({ nom_region: e.target.value })}
                                                required
                                            />
                                            <AdminBtn variant="primary" size="sm" icon="la-save" onClick={() => handleSaveEditRegion(r.id)} disabled={regionsSubmitting}>
                                                {regionsSubmitting ? <span className="spinner-border spinner-border-sm"/> : 'حفظ'}
                                            </AdminBtn>
                                            <AdminBtn variant="secondary" size="sm" icon="la-times" onClick={handleCancelEditRegion} className="ml-1">إلغاء</AdminBtn>
                                        </div>
                                    ) : (
                                        <>
                                            <span>{r.nom_region}</span>
                                            <div className="admin-action-group">
                                                <AdminBtn permission="edit_regions" variant="primary" size="sm" icon="la-edit" onClick={() => handleEditRegion(r)}>تعديل</AdminBtn>
                                                <AdminBtn permission="delete_regions" variant="danger" size="sm" icon="la-trash" onClick={() => promptDeleteRegion(r)}>حذف</AdminBtn>
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
    );
};

AdminRegions.propTypes = {
    openCategory: PropTypes.string,
    toggleCategory: PropTypes.func.isRequired,
    regions: PropTypes.arrayOf(PropTypes.shape({
        id: PropTypes.number.isRequired,
        nom_region: PropTypes.string.isRequired,
    })).isRequired,
    newRegion: PropTypes.shape({
        nom_region: PropTypes.string.isRequired,
    }).isRequired,
    setNewRegion: PropTypes.func.isRequired,
    editingRegionId: PropTypes.number,
    editingRegionData: PropTypes.shape({
        nom_region: PropTypes.string.isRequired,
    }).isRequired,
    setEditingRegionData: PropTypes.func.isRequired,
    handleAddRegion: PropTypes.func.isRequired,
    promptDeleteRegion: PropTypes.func.isRequired,
    handleEditRegion: PropTypes.func.isRequired,
    handleCancelEditRegion: PropTypes.func.isRequired,
    handleSaveEditRegion: PropTypes.func.isRequired,
    regionsSubmitting: PropTypes.bool.isRequired,
};

export default AdminRegions;