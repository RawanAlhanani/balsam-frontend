import React, { useState, useEffect } from 'react';
import api from '../../api';

const AdminStaticPages = () => {
    const [pages, setPages] = useState({ about: [], autism: [], projects: [] });
    const [formData, setFormData] = useState({ type: 'about', titre: '', description: '' });
    const [image, setImage] = useState(null);

    useEffect(() => { fetchPages(); }, []);

    const fetchPages = async () => {
        const res = await api.get('/admin/static-pages');
        setPages(res.data);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const data = new FormData();
        Object.keys(formData).forEach(k => data.append(k, formData[k]));
        if (image) data.append('image', image);
        await api.post('/admin/static-pages', data);
        fetchPages();
    };

    return (
        <div className="app-content content">
            <div className="content-wrapper">
                <div className="content-header row"><h3 className="content-header-title">إدارة الصفحات الثابتة</h3></div>
                <div className="content-body">
                    <div className="card mb-4">
                        <div className="card-body">
                            <form onSubmit={handleSubmit}>
                                <div className="row">
                                    <div className="col-md-2">
                                        <select className="form-control" onChange={e => setFormData({...formData, type: e.target.value})}>
                                            <option value="about">من نحن</option>
                                            <option value="autism">صفحات التوحد</option>
                                            <option value="projects">مشاريعنا</option>
                                        </select>
                                    </div>
                                    <div className="col-md-3"><input className="form-control" placeholder="العنوان" onChange={e => setFormData({...formData, titre: e.target.value})} required /></div>
                                    <div className="col-md-4"><input className="form-control" placeholder="الوصف" onChange={e => setFormData({...formData, description: e.target.value})} required /></div>
                                    <div className="col-md-2"><input type="file" onChange={e => setImage(e.target.files[0])} /></div>
                                    <div className="col-md-1"><button className="btn btn-primary w-100">إضافة</button></div>
                                </div>
                            </form>
                        </div>
                    </div>
                    {['about', 'autism', 'projects'].map(type => (
                        <div key={type} className="card mb-3">
                            <div className="card-header"><h4>{type === 'about' ? 'من نحن' : type === 'autism' ? 'صفحات التوحد' : 'مشاريعنا'}</h4></div>
                            <div className="card-body">
                                <ul className="list-group">
                                    {pages[type].map(p => <li key={p.id} className="list-group-item">{p.titre}</li>)}
                                </ul>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default AdminStaticPages;
