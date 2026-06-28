import React from 'react';
import { AdminCard, AdminFormGroup, AdminBtn } from '../../../components/Admin/ui/AdminUI';

const AdminDoctors = ({
    openCategory,
    toggleCategory,
    doctors,
    newDoctor,
    setNewDoctor,
    editingDoctorId,
    editingDoctorData,
    setEditingDoctorData,
    handleAddDoctor,
    promptDeleteDoctor,
    handleEditDoctor,
    handleCancelEditDoctor,
    handleSaveEditDoctor,
    doctorsSubmitting,
}) => {
    return (
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
                                <input className="form-control" placeholder="تخصص جديد" value={newDoctor.specialite} onChange={e => setNewDoctor({ specialite: e.target.value })} required />
                            </AdminFormGroup>
                            <AdminBtn variant="success" type="submit" icon="la-plus" disabled={doctorsSubmitting}>
                                {doctorsSubmitting ? <span className="spinner-border spinner-border-sm"/> : 'إضافة تخصص'}
                            </AdminBtn>
                        </form>
                        <ul className="list-group">
                            {doctors.map(d => (
                                <li key={d.id} className="list-group-item d-flex justify-content-between align-items-center">
                                    {editingDoctorId === d.id ? (
                                        <div className="d-flex align-items-center flex-grow-1">
                                            <input
                                                className="form-control form-control-sm mr-2"
                                                value={editingDoctorData.specialite}
                                                onChange={e => setEditingDoctorData({ specialite: e.target.value })}
                                                required
                                            />
                                            <AdminBtn variant="primary" size="sm" icon="la-save" onClick={() => handleSaveEditDoctor(d.id)} disabled={doctorsSubmitting}>
                                                {doctorsSubmitting ? <span className="spinner-border spinner-border-sm"/> : 'حفظ'}
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
    );
};

export default AdminDoctors;