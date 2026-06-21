import React, { useState, useEffect } from 'react';
import api from '../../api';
import {
    AdminPage, AdminPageHeader, AdminCard, AdminFormPanel, AdminFormGroup,
    AdminFormActions, AdminTableWrap, AdminBtn
} from '../../components/Admin/ui/AdminUI';

const AdminAdmins = () => {
    const [admins, setAdmins] = useState([]);
    const [showForm, setShowForm] = useState(false);
    const [formData, setFormData] = useState({ name: '', email: '', password: '', role: 'secretary' });

    useEffect(() => { fetchAdmins(); }, []);

    const fetchAdmins = async () => {
        const res = await api.get('/admin/accounts');
        setAdmins(res.data);
    };

    const resetForm = () => setFormData({ name: '', email: '', password: '', role: 'secretary' });

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await api.post('/admin/accounts', formData);
            setShowForm(false);
            resetForm();
            fetchAdmins();
        } catch (err) {
            alert('خطأ في الإضافة');
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('حذف هذا الحساب؟')) {
            await api.delete(`/admin/accounts/${id}`);
            fetchAdmins();
        }
    };

    const roleLabels = {
        president: 'رئيس',
        vice_president: 'نائب رئيس',
        secretary: 'كاتب عام',
        treasurer: 'أمين مال',
    };

    return (
        <AdminPage>
            <AdminPageHeader
                title="إدارة حسابات الإدارة"
                subtitle="إضافة وحذف حسابات المسؤولين"
                badge="الإعدادات"
                actions={
                    <AdminBtn variant={showForm ? 'secondary' : 'primary'} icon={showForm ? 'la-times' : 'la-plus'} onClick={() => setShowForm(!showForm)}>
                        {showForm ? 'إلغاء' : 'إضافة مسؤول'}
                    </AdminBtn>
                }
            />
            <div className="content-body">
                <AdminFormPanel title="إضافة مسؤول جديد" open={showForm} onClose={() => { setShowForm(false); resetForm(); }} onSubmit={handleSubmit}>
                    <div className="row">
                        <AdminFormGroup label="الاسم" className="col-md-3">
                            <input className="form-control" value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} required />
                        </AdminFormGroup>
                        <AdminFormGroup label="البريد" className="col-md-3">
                            <input className="form-control" type="email" value={formData.email} onChange={e => setFormData({ ...formData, email: e.target.value })} required />
                        </AdminFormGroup>
                        <AdminFormGroup label="كلمة السر" className="col-md-3">
                            <input className="form-control" type="password" value={formData.password} onChange={e => setFormData({ ...formData, password: e.target.value })} required />
                        </AdminFormGroup>
                        <AdminFormGroup label="الصفة" className="col-md-3">
                            <select className="form-control" value={formData.role} onChange={e => setFormData({ ...formData, role: e.target.value })}>
                                <option value="president">رئيس</option>
                                <option value="vice_president">نائب رئيس</option>
                                <option value="secretary">كاتب عام</option>
                                <option value="treasurer">أمين مال</option>
                            </select>
                        </AdminFormGroup>
                    </div>
                    <AdminFormActions>
                        <AdminBtn variant="success" type="submit" icon="la-check">حفظ</AdminBtn>
                        <AdminBtn variant="secondary" icon="la-times" onClick={() => { setShowForm(false); resetForm(); }}>إلغاء</AdminBtn>
                    </AdminFormActions>
                </AdminFormPanel>

                <AdminCard title="قائمة الحسابات" icon="la-user-secret" flush>
                    <AdminTableWrap>
                        <table className="table table-hover admin-table">
                            <thead>
                                <tr>
                                    <th>الاسم</th>
                                    <th>البريد</th>
                                    <th>الصفة</th>
                                    <th>العمليات</th>
                                </tr>
                            </thead>
                            <tbody>
                                {admins.map(a => (
                                    <tr key={a.id}>
                                        <td>{a.name}</td>
                                        <td>{a.email}</td>
                                        <td><span className="admin-tag">{roleLabels[a.role] || a.role}</span></td>
                                        <td>
                                            <AdminBtn variant="danger" icon="la-trash" onClick={() => handleDelete(a.id)}>حذف</AdminBtn>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </AdminTableWrap>
                </AdminCard>
            </div>
        </AdminPage>
    );
};

export default AdminAdmins;
