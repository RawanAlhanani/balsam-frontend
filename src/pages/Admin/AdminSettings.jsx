import React, { useState, useEffect } from 'react';
import api from '../../api';
import {
    AdminPage, AdminPageHeader, AdminCard, AdminFormGroup, AdminBtn, AdminAlert, AdminLoading
} from '../../components/Admin/ui/AdminUI';
import DeleteConfirmModal from '../../components/Admin/modals/DeleteConfirmModal';
import useAdminCrud from '../../hooks/useAdminCrud'; // Import the new custom hook
import AdminActivityTypes from './components/AdminActivityTypes'; // Import the new component
import AdminRegions from './components/AdminRegions'; // Import the new component
import AdminDoctors from './components/AdminDoctors'; // Import the new component
import AdminFinanceCategories from './components/AdminFinanceCategories'; // Import the new component

const AdminSettings = () => {
    // Using the custom hook for each category
    const {
        items: types,
        loading: typesLoading,
        submitting: typesSubmitting,
        deleting: typesDeleting,
        newItem: newType,
        setNewItem: setNewType,
        editingItemId: editingTypeId,
        editingItemData: editingTypeData,
        setEditingItemData: setEditingTypeData,
        alert: typesAlert,
        setAlert: setTypesAlert,
        showDeleteConfirmModal: showDeleteConfirmModalType,
        deleteTargetItem: deleteTargetType,
        setShowDeleteConfirmModal: setShowDeleteConfirmModalType,
        handleAddItem: handleAddType,
        promptDeleteItem: promptDeleteType,
        confirmDeleteItem: confirmDeleteType,
        handleEditItem: handleEditType,
        handleCancelEdit: handleCancelEditType,
        handleSaveEditItem: handleSaveEditType,
        clearAlert: clearTypesAlert,
    } = useAdminCrud('/admin/types', 'نوع النشاط', { nomActivite: '' },
        (item) => ({ nomActivite: item.nomActivite }), // transformNewItem
        (item) => ({ nomActivite: item.nomActivite })  // transformEditItem
    );

    const {
        items: regions,
        loading: regionsLoading,
        submitting: regionsSubmitting,
        deleting: regionsDeleting,
        newItem: newRegion,
        setNewItem: setNewRegion,
        editingItemId: editingRegionId,
        editingItemData: editingRegionData,
        setEditingItemData: setEditingRegionData,
        alert: regionsAlert,
        setAlert: setRegionsAlert,
        showDeleteConfirmModal: showDeleteConfirmModalRegion,
        deleteTargetItem: deleteTargetRegion,
        setShowDeleteConfirmModal: setShowDeleteConfirmModalRegion,
        handleAddItem: handleAddRegion,
        promptDeleteItem: promptDeleteRegion,
        confirmDeleteItem: confirmDeleteRegion,
        handleEditItem: handleEditRegion,
        handleCancelEdit: handleCancelEditRegion,
        handleSaveEditItem: handleSaveEditRegion,
        clearAlert: clearRegionsAlert,
    } = useAdminCrud('/admin/regions', 'المنطقة', { nom_region: '' },
        (item) => ({ nom_region: item.nom_region }),
        (item) => ({ nom_region: item.nom_region })
    );

    const {
        items: doctors,
        loading: doctorsLoading,
        submitting: doctorsSubmitting,
        deleting: doctorsDeleting,
        newItem: newDoctor,
        setNewItem: setNewDoctor,
        editingItemId: editingDoctorId,
        editingItemData: editingDoctorData,
        setEditingItemData: setEditingDoctorData,
        alert: doctorsAlert,
        setAlert: setDoctorsAlert,
        showDeleteConfirmModal: showDeleteConfirmModalDoctor,
        deleteTargetItem: deleteTargetDoctor,
        setShowDeleteConfirmModal: setShowDeleteConfirmModalDoctor,
        handleAddItem: handleAddDoctor,
        promptDeleteItem: promptDeleteDoctor,
        confirmDeleteItem: confirmDeleteDoctor,
        handleEditItem: handleEditDoctor,
        handleCancelEdit: handleCancelEditDoctor,
        handleSaveEditItem: handleSaveEditDoctor,
        clearAlert: clearDoctorsAlert,
    } = useAdminCrud('/admin/doctors', 'التخصص', { specialite: '' },
        (item) => ({ specialite: item.specialite }),
        (item) => ({ specialite: item.specialite })
    );

    const {
        items: financeCats,
        loading: financeCatsLoading,
        submitting: financeCatsSubmitting,
        deleting: financeCatsDeleting,
        newItem: newCat,
        setNewItem: setNewCat,
        editingItemId: editingCatId,
        editingItemData: editingCatData,
        setEditingItemData: setEditingCatData,
        alert: financeCatsAlert,
        setAlert: setFinanceCatsAlert,
        showDeleteConfirmModal: showDeleteConfirmModalCat,
        deleteTargetItem: deleteTargetCat,
        setShowDeleteConfirmModal: setShowDeleteConfirmModalCat,
        handleAddItem: handleAddCat,
        promptDeleteItem: promptDeleteCat,
        confirmDeleteItem: confirmDeleteCat,
        handleEditItem: handleEditCat,
        handleCancelEdit: handleCancelEditCat,
        handleSaveEditItem: handleSaveEditCat,
        clearAlert: clearFinanceCatsAlert,
    } = useAdminCrud('/admin/finance-categories', 'الفئة المالية', { name: '', type: 'income' },
        (item) => ({ name: item.name, type: item.type }),
        (item) => ({ name: item.name, type: item.type })
    );

    // Combine alerts from all hooks
    const [globalAlert, setGlobalAlert] = useState({ message: '', type: '' });

    useEffect(() => {
        if (typesAlert.message) setGlobalAlert(typesAlert);
        else if (regionsAlert.message) setGlobalAlert(regionsAlert);
        else if (doctorsAlert.message) setGlobalAlert(doctorsAlert);
        else if (financeCatsAlert.message) setGlobalAlert(financeCatsAlert);
        else setGlobalAlert({ message: '', type: '' });
    }, [typesAlert, regionsAlert, doctorsAlert, financeCatsAlert]);

    useEffect(() => {
        if (globalAlert.message) {
            const timer = setTimeout(() => setGlobalAlert({ message: '', type: '' }), 3500);
            return () => clearTimeout(timer);
        }
    }, [globalAlert]);


    // State for controlling open/closed categories
    const [openCategory, setOpenCategory] = useState(null); // 'types', 'regions', 'doctors', 'finance'

    const toggleCategory = (categoryName) => {
        setOpenCategory(prev => (prev === categoryName ? null : categoryName));
    };

    // Lock background scroll when modal is open
    useEffect(() => {
        const anyModalOpen = showDeleteConfirmModalType || showDeleteConfirmModalRegion || showDeleteConfirmModalDoctor || showDeleteConfirmModalCat;
        if (anyModalOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
        return () => { document.body.style.overflow = ''; };
    }, [showDeleteConfirmModalType, showDeleteConfirmModalRegion, showDeleteConfirmModalDoctor, showDeleteConfirmModalCat]);


    // Determine which delete modal to show and which item/confirm function to use
    const getActiveDeleteModalProps = () => {
        if (showDeleteConfirmModalType) {
            return {
                show: true,
                onClose: () => setShowDeleteConfirmModalType(false),
                onConfirm: confirmDeleteType,
                itemName: deleteTargetType?.nomActivite,
                isDeleting: typesDeleting
            };
        }
        if (showDeleteConfirmModalRegion) {
            return {
                show: true,
                onClose: () => setShowDeleteConfirmModalRegion(false),
                onConfirm: confirmDeleteRegion,
                itemName: deleteTargetRegion?.nom_region,
                isDeleting: regionsDeleting
            };
        }
        if (showDeleteConfirmModalDoctor) {
            return {
                show: true,
                onClose: () => setShowDeleteConfirmModalDoctor(false),
                onConfirm: confirmDeleteDoctor,
                itemName: deleteTargetDoctor?.specialite,
                isDeleting: doctorsDeleting
            };
        }
        if (showDeleteConfirmModalCat) {
            return {
                show: true,
                onClose: () => setShowDeleteConfirmModalCat(false),
                onConfirm: confirmDeleteCat,
                itemName: deleteTargetCat?.name,
                isDeleting: financeCatsDeleting
            };
        }
        return { show: false };
    };

    const activeDeleteModalProps = getActiveDeleteModalProps();

    // Overall loading state for initial data fetch
    if (typesLoading || regionsLoading || doctorsLoading || financeCatsLoading) {
        return <AdminLoading />;
    }

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
                    <AdminActivityTypes
                        openCategory={openCategory}
                        toggleCategory={toggleCategory}
                        types={types}
                        newType={newType}
                        setNewType={setNewType}
                        editingTypeId={editingTypeId}
                        editingTypeData={editingTypeData}
                        setEditingTypeData={setEditingTypeData}
                        handleAddType={handleAddType}
                        promptDeleteType={promptDeleteType}
                        handleEditType={handleEditType}
                        handleCancelEditType={handleCancelEditType}
                        handleSaveEditType={handleSaveEditType}
                        typesSubmitting={typesSubmitting}
                    />

                    <AdminRegions
                        openCategory={openCategory}
                        toggleCategory={toggleCategory}
                        regions={regions}
                        newRegion={newRegion}
                        setNewRegion={setNewRegion}
                        editingRegionId={editingRegionId}
                        editingRegionData={editingRegionData}
                        setEditingRegionData={setEditingRegionData}
                        handleAddRegion={handleAddRegion}
                        promptDeleteRegion={promptDeleteRegion}
                        handleEditRegion={handleEditRegion}
                        handleCancelEditRegion={handleCancelEditRegion}
                        handleSaveEditRegion={handleSaveEditRegion}
                        regionsSubmitting={regionsSubmitting}
                    />

                    <AdminDoctors
                        openCategory={openCategory}
                        toggleCategory={toggleCategory}
                        doctors={doctors}
                        newDoctor={newDoctor}
                        setNewDoctor={setNewDoctor}
                        editingDoctorId={editingDoctorId}
                        editingDoctorData={editingDoctorData}
                        setEditingDoctorData={setEditingDoctorData}
                        handleAddDoctor={handleAddDoctor}
                        promptDeleteDoctor={promptDeleteDoctor}
                        handleEditDoctor={handleEditDoctor}
                        handleCancelEditDoctor={handleCancelEditDoctor}
                        handleSaveEditDoctor={handleSaveEditDoctor}
                        doctorsSubmitting={doctorsSubmitting}
                    />
                </div>

                <AdminFinanceCategories
                    openCategory={openCategory}
                    toggleCategory={toggleCategory}
                    financeCats={financeCats}
                    newCat={newCat}
                    setNewCat={setNewCat}
                    editingCatId={editingCatId}
                    editingCatData={editingCatData}
                    setEditingCatData={setEditingCatData}
                    handleAddCat={handleAddCat}
                    promptDeleteCat={promptDeleteCat}
                    handleEditCat={handleEditCat}
                    handleCancelEditCat={handleCancelEditCat}
                    handleSaveEditCat={handleSaveEditCat}
                    financeCatsSubmitting={financeCatsSubmitting}
                />
            </div>
        </AdminPage>

        <DeleteConfirmModal {...activeDeleteModalProps} />

        {globalAlert.message && (
            <AdminAlert message={globalAlert.message} type={globalAlert.type} onClose={() => setGlobalAlert({ message: '', type: '' })} />
        )}
        </>
    );
};

export default AdminSettings;