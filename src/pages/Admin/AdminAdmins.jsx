import React, { useState, useEffect } from 'react';
import api from '../../api';

const AdminAdmins = () => {
    const [admins, setAdmins] = useState([]);
    const [showForm, setShowForm] = useState(false);
    const [formData, setFormData] = useState({ name: '', email: '', password: '', role: 'secretary' });

    useEffect(() => { fetchAdmins(); }, []);

    const fetchAdmins = async () => {
        const res = await api.get('/admin/accounts');
        setAdmins(res.data);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await api.post('/admin/accounts', formData);
            setShowForm(false);
            fetchAdmins();
        } catch (err) { alert('خطأ في الإضافة'); }
    };

    const handleDelete = async (id) => {
        if (window.confirm('حذف هذا الحساب؟')) {
            await api.delete(`/admin/accounts/${id}`);
            fetchAdmins();
        }
    };

    return (
        <div className="app-content content">
            <div className="content-wrapper">
                <div className="content-header row">
                    <div className="content-header-left col-md-6 col-12 mb-2">
                        <h3 className="content-header-title">إدارة حسابات الإدارة</h3>
                    </div>
                    <div className="col-md-6 text-right">
                        <button className="btn btn-primary" onClick={() => setShowForm(!showForm)}>
                            {showForm ? 'إلغاء' : 'إضافة مسؤول جديد'}
                        </button>
                    </div>
                </div>
                <div className="content-body">
                    {showForm && (
                        <div className="card mb-4">
                            <div className="card-body">
                                <form onSubmit={handleSubmit}>
                                    <div className="row">
                                        <div className="col-md-3"><input className="form-control" placeholder="الاسم" onChange={e => setFormData({...formData, name: e.target.value})} required /></div>
                                        <div className="col-md-3"><input className="form-control" placeholder="البريد" type="email" onChange={e => setFormData({...formData, email: e.target.value})} required /></div>
                                        <div className="col-md-3"><input className="form-control" placeholder="كلمة السر" type="password" onChange={e => setFormData({...formData, password: e.target.value})} required /></div>
                                        <div className="col-md-2">
                                            <select className="form-control" onChange={e => setFormData({...formData, role: e.target.value})}>
                                                <option value="president">رئيس</option>
                                                <option value="vice_president">نائب رئيس</option>
                                                <option value="secretary">كاتب عام</option>
                                                <option value="treasurer">أمين مال</option>
                                            </select>
                                        </div>
                                        <div className="col-md-1"><button className="btn btn-success w-100">حفظ</button></div>
                                    </div>
                                </form>
                            </div>
                        </div>
                    )}
                    <div className="card">
                        <table className="table">
                            <thead><tr><th>الاسم</th><th>البريد</th><th>الصفة</th><th>العمليات</th></tr></thead>
                            <tbody>
                                {admins.map(a => (
                                    <tr key={a.id}>
                                        <td>{a.name}</td>
                                        <td>{a.email}</td>
                                        <td>{a.role}</td>
                                        <td><button onClick={() => handleDelete(a.id)} className="btn btn-danger btn-sm">حذف</button></td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminAdmins;
