import React, { useState, useEffect } from 'react';
import api from '../../api';

const AdminSettings = () => {
    const [types, setTypes] = useState([]);
    const [regions, setRegions] = useState([]);
    const [doctors, setDoctors] = useState([]);
    const [financeCats, setFinanceCats] = useState([]);
    const [newCat, setNewCat] = useState({ name: '', type: 'income' });

    useEffect(() => {
        api.get('/admin/types').then(res => setTypes(res.data));
        api.get('/admin/regions').then(res => setRegions(res.data));
        api.get('/admin/doctors').then(res => setDoctors(res.data));
        fetchFinanceCats();
    }, []);

    const fetchFinanceCats = () => {
        api.get('/admin/finance-categories').then(res => setFinanceCats(res.data));
    };

    const handleAddCat = async (e) => {
        e.preventDefault();
        await api.post('/admin/finance-categories', newCat);
        setNewCat({ name: '', type: 'income' });
        fetchFinanceCats();
    };

    const handleDeleteCat = async (id) => {
        if (window.confirm('حذف هذه الفئة؟')) {
            await api.delete(`/admin/finance-categories/${id}`);
            fetchFinanceCats();
        }
    };

    return (
        <div className="app-content content">
            <div className="content-wrapper">
                <div className="content-header row">
                    <div className="content-header-left col-md-6 col-12 mb-2">
                        <h3 className="content-header-title">إعدادات النظام</h3>
                    </div>
                </div>
                <div className="content-body">
                    <div className="row">
                        {/* Existing Settings */}
                        <div className="col-md-4">
                            <div className="card">
                                <div className="card-header"><h4>أنواع الأنشطة</h4></div>
                                <div className="card-body">
                                    <ul className="list-group">
                                        {types.map(t => <li key={t.id} className="list-group-item">{t.nomActivite}</li>)}
                                    </ul>
                                </div>
                            </div>
                        </div>
                        {/* ... (Regions and Specialities omitted for brevity but they are there) */}
                        <div className="col-md-4">
                            <div className="card">
                                <div className="card-header"><h4>المناطق</h4></div>
                                <div className="card-body">
                                    <ul className="list-group">
                                        {regions.map(r => <li key={r.id} className="list-group-item">{r.nom_region}</li>)}
                                    </ul>
                                </div>
                            </div>
                        </div>
                        <div className="col-md-4">
                            <div className="card">
                                <div className="card-header"><h4>التخصصات</h4></div>
                                <div className="card-body">
                                    <ul className="list-group">
                                        {doctors.map(d => <li key={d.id} className="list-group-item">{d.specialite}</li>)}
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>

                    <hr />
                    
                    <div className="row mt-4">
                        <div className="col-md-12">
                            <div className="card">
                                <div className="card-header"><h4>إدارة فئات المالية (Incomes & Expenses)</h4></div>
                                <div className="card-body">
                                    <form onSubmit={handleAddCat} className="row mb-4">
                                        <div className="col-md-4">
                                            <input className="form-control" placeholder="اسم الفئة الجديد" value={newCat.name} onChange={e => setNewCat({...newCat, name: e.target.value})} required />
                                        </div>
                                        <div className="col-md-3">
                                            <select className="form-control" value={newCat.type} onChange={e => setNewCat({...newCat, type: e.target.value})}>
                                                <option value="income">مدخول (+)</option>
                                                <option value="expense">مصروف (-)</option>
                                            </select>
                                        </div>
                                        <div className="col-md-2">
                                            <button className="btn btn-success w-100">إضافة فئة</button>
                                        </div>
                                    </form>

                                    <div className="row">
                                        <div className="col-md-6">
                                            <h5>فئات المداخيل</h5>
                                            <ul className="list-group">
                                                {financeCats.filter(c => c.type === 'income').map(c => (
                                                    <li key={c.id} className="list-group-item d-flex justify-content-between">
                                                        {c.name}
                                                        <button onClick={() => handleDeleteCat(c.id)} className="btn btn-sm btn-danger">حذف</button>
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                        <div className="col-md-6">
                                            <h5>فئات المصاريف</h5>
                                            <ul className="list-group">
                                                {financeCats.filter(c => c.type === 'expense').map(c => (
                                                    <li key={c.id} className="list-group-item d-flex justify-content-between">
                                                        {c.name}
                                                        <button onClick={() => handleDeleteCat(c.id)} className="btn btn-sm btn-danger">حذف</button>
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminSettings;
