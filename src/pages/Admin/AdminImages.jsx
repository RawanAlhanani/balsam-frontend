import React, { useState, useEffect } from 'react';
import api from '../../api';
import { getStorageUrl } from '../../utils/formatters';

const AdminImages = () => {
    const [sliders, setSliders] = useState([]);
    const [gallery, setGallery] = useState([]);
    const [image, setImage] = useState(null);

    useEffect(() => { fetchImages(); }, []);

    const fetchImages = async () => {
        const s = await api.get('/admin/sliders');
        const g = await api.get('/admin/gallery');
        setSliders(s.data);
        setGallery(g.data);
    };

    const handleUpload = async (type) => {
        if (!image) return;
        const data = new FormData();
        data.append('image', image);
        await api.post(`/admin/${type}`, data);
        setImage(null);
        fetchImages();
    };

    const handleDelete = async (type, id) => {
        await api.delete(`/admin/${type}/${id}`);
        fetchImages();
    };

    return (
        <div className="app-content content">
            <div className="content-wrapper">
                <div className="content-header row">
                    <div className="content-header-left col-md-12 mb-2">
                        <h3 className="content-header-title">إدارة الصور والمعرض</h3>
                    </div>
                </div>
                <div className="content-body">
                    <div className="row">
                        <div className="col-md-6">
                            <div className="card">
                                <div className="card-header"><h4>الصور الرئيسية (Slider)</h4></div>
                                <div className="card-body">
                                    <input type="file" onChange={e => setImage(e.target.files[0])} className="form-control mb-2" />
                                    <button className="btn btn-info w-100 mb-3" onClick={() => handleUpload('sliders')}>رفع صورة للسلايدر</button>
                                    <div className="row">
                                        {sliders.map(s => (
                                            <div key={s.id} className="col-4 mb-2">
                                                <img src={getStorageUrl(s.nomImage)} className="img-fluid rounded" alt="" />
                                                <button onClick={() => handleDelete('sliders', s.id)} className="btn btn-danger btn-sm w-100 mt-1">حذف</button>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="col-md-6">
                            <div className="card">
                                <div className="card-header"><h4>معرض الصور (Gallery)</h4></div>
                                <div className="card-body">
                                    <input type="file" onChange={e => setImage(e.target.files[0])} className="form-control mb-2" />
                                    <button className="btn btn-success w-100 mb-3" onClick={() => handleUpload('gallery')}>رفع صورة للمعرض</button>
                                    <div className="row">
                                        {gallery.map(g => (
                                            <div key={g.id} className="col-4 mb-2">
                                                <img src={getStorageUrl(g.nomImage)} className="img-fluid rounded" alt="" />
                                                <button onClick={() => handleDelete('gallery', g.id)} className="btn btn-danger btn-sm w-100 mt-1">حذف</button>
                                            </div>
                                        ))}
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

export default AdminImages;
