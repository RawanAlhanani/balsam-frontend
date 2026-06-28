import { useState, useEffect, useCallback } from 'react';
import api from '../api'; // Assuming your API instance is exported from here

const useAdminCrud = (endpoint, itemNameKey, initialNewItemState, transformNewItem = (item) => item, transformEditItem = (item) => item) => {
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false); // For add/edit operations
    const [deleting, setDeleting] = useState(false); // For delete operations

    const [newItem, setNewItem] = useState(initialNewItemState);
    const [editingItemId, setEditingItemId] = useState(null);
    const [editingItemData, setEditingItemData] = useState(initialNewItemState);

    const [alert, setAlert] = useState({ message: '', type: '' });

    // Delete confirmation modal state
    const [showDeleteConfirmModal, setShowDeleteConfirmModal] = useState(false);
    const [deleteTargetItem, setDeleteTargetItem] = useState(null);

    const clearAlert = useCallback(() => {
        setAlert({ message: '', type: '' });
    }, []);

    const fetchItems = useCallback(async () => {
        setLoading(true);
        try {
            const res = await api.get(endpoint);
            setItems(res.data);
        } catch (err) {
            console.error(`Error fetching items from ${endpoint}:`, err);
            setAlert({ message: `خطأ في تحميل ${itemNameKey}s`, type: 'danger' });
        } finally {
            setLoading(false);
        }
    }, [endpoint, itemNameKey]);

    useEffect(() => {
        fetchItems();
    }, [fetchItems]);

    const handleAddItem = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        try {
            const dataToSend = transformNewItem(newItem);
            await api.post(endpoint, dataToSend);
            setNewItem(initialNewItemState);
            await fetchItems();
            setAlert({ message: `تم إضافة ${itemNameKey} بنجاح`, type: 'success' });
        } catch (err) {
            console.error(`Error adding item to ${endpoint}:`, err);
            setAlert({ message: `خطأ أثناء إضافة ${itemNameKey}`, type: 'danger' });
        } finally {
            setSubmitting(false);
            setTimeout(clearAlert, 3500);
        }
    };

    const promptDeleteItem = (item) => {
        setDeleteTargetItem(item);
        setShowDeleteConfirmModal(true);
    };

    const confirmDeleteItem = async () => {
        if (!deleteTargetItem || deleting) return;
        setDeleting(true);
        try {
            await api.delete(`${endpoint}/${deleteTargetItem.id}`);
            await fetchItems();
            setAlert({ message: `تم حذف ${itemNameKey} بنجاح`, type: 'success' });
            setShowDeleteConfirmModal(false);
            setDeleteTargetItem(null);
        } catch (err) {
            console.error(`Error deleting item from ${endpoint}:`, err);
            setAlert({ message: `خطأ أثناء حذف ${itemNameKey}`, type: 'danger' });
        } finally {
            setDeleting(false);
            setTimeout(clearAlert, 3500);
        }
    };

    const handleEditItem = (item) => {
        setEditingItemId(item.id);
        setEditingItemData(item); // Store the full item for editing
    };

    const handleCancelEdit = () => {
        setEditingItemId(null);
        setEditingItemData(initialNewItemState);
    };

    const handleSaveEditItem = async (id) => {
        setSubmitting(true);
        try {
            const dataToSend = transformEditItem(editingItemData);
            await api.put(`${endpoint}/${id}`, dataToSend);
            await fetchItems();
            setAlert({ message: `تم تحديث ${itemNameKey} بنجاح`, type: 'success' });
            handleCancelEdit();
        } catch (err) {
            console.error(`Error updating item at ${endpoint}/${id}:`, err);
            setAlert({ message: `خطأ أثناء تحديث ${itemNameKey}`, type: 'danger' });
        } finally {
            setSubmitting(false);
            setTimeout(clearAlert, 3500);
        }
    };

    return {
        items,
        loading,
        submitting,
        deleting,
        newItem,
        setNewItem,
        editingItemId,
        editingItemData,
        setEditingItemData,
        alert,
        setAlert, // Allow external components to set alerts if needed
        showDeleteConfirmModal,
        deleteTargetItem,
        setShowDeleteConfirmModal,
        fetchItems,
        handleAddItem,
        promptDeleteItem,
        confirmDeleteItem,
        handleEditItem,
        handleCancelEdit,
        handleSaveEditItem,
        clearAlert,
    };
};

export default useAdminCrud;