import React, { useState, useEffect } from 'react';
import api from '../../api';
import { getStorageUrl } from '../../utils/formatters';
import {
    AdminPage, AdminPageHeader, AdminCard, AdminFormGroup, AdminBtn
} from '../../components/Admin/ui/AdminUI';

const AdminImages = () => {
    const [sliders, setSliders] = useState([]);
    const [gallery, setGallery] = useState([]);
    const [sliderImage, setSliderImage] = useState(null);
    const [galleryImage, setGalleryImage] = useState(null);

    useEffect(() => { fetchImages(); }, []);

    const fetchImages = async () => {
        const s = await api.get('/admin/sliders');
        const g = await api.get('/admin/gallery');
        setSliders(s.data);
        setGallery(g.data);
    };

    const handleUpload = async (type, file) => {
        if (!file) return;
        const data = new FormData();
        data.append('image', file);
        await api.post(`/admin/${type}`, data);
        if (type === 'sliders') setSliderImage(null);
        else setGalleryImage(null);
        fetchImages();
    };

    const handleDelete = async (type, id) => {
        if (window.confirm('حذف هذه الصورة؟')) {
            await api.delete(`/admin/${type}/${id}`);
            fetchImages();
        }
    };

    return (
        <AdminPage>
            <AdminPageHeader
                title="إدارة الصور والمعرض"
                subtitle="رفع وإدارة صور السلايدر ومعرض الصور"
                badge="الوسائط"
            />
            <div className="content-body">
                <div className="row">
                    <div className="col-md-6">
                        <AdminCard title="الصور الرئيسية (Slider)" icon="la-image">
                            <AdminFormGroup label="رفع صورة جديدة">
                                <input type="file" className="form-control mb-2" onChange={e => setSliderImage(e.target.files[0])} />
                                <AdminBtn variant="info" icon="la-upload" className="w-100 mb-3" onClick={() => handleUpload('sliders', sliderImage)}>
                                    رفع للسلايدر
                                </AdminBtn>
                            </AdminFormGroup>
                            {sliders.length === 0 ? (
                                <p className="text-muted text-center py-3">لا توجد صور في السلايدر</p>
                            ) : (
                                <div className="admin-image-grid">
                                    {sliders.map(s => (
                                        <div key={s.id} className="admin-image-item">
                                            <img src={getStorageUrl(s.nomImage)} alt="" />
                                            <AdminBtn variant="danger" size="sm" icon="la-trash" onClick={() => handleDelete('sliders', s.id)}>حذف</AdminBtn>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </AdminCard>
                    </div>
                    <div className="col-md-6">
                        <AdminCard title="معرض الصور (Gallery)" icon="la-images">
                            <AdminFormGroup label="رفع صورة جديدة">
                                <input type="file" className="form-control mb-2" onChange={e => setGalleryImage(e.target.files[0])} />
                                <AdminBtn variant="success" icon="la-upload" className="w-100 mb-3" onClick={() => handleUpload('gallery', galleryImage)}>
                                    رفع للمعرض
                                </AdminBtn>
                            </AdminFormGroup>
                            {gallery.length === 0 ? (
                                <p className="text-muted text-center py-3">لا توجد صور في المعرض</p>
                            ) : (
                                <div className="admin-image-grid">
                                    {gallery.map(g => (
                                        <div key={g.id} className="admin-image-item">
                                            <img src={getStorageUrl(g.nomImage)} alt="" />
                                            <AdminBtn variant="danger" size="sm" icon="la-trash" onClick={() => handleDelete('gallery', g.id)}>حذف</AdminBtn>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </AdminCard>
                    </div>
                </div>
            </div>
        </AdminPage>
    );
};

export default AdminImages;
