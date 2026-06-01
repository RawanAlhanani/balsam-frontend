import React, { useState } from 'react';
import api from '../../api';
import { useNavigate } from 'react-router-dom';

const AddNews = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        titre: '',
        description: ''
    });
    const [image, setImage] = useState(null);

    const handleSubmit = async (e) => {
        e.preventDefault();
        const data = new FormData();
        data.append('titre', formData.titre);
        data.append('description', formData.description);
        if (image) data.append('image_info', image);

        try {
            await api.post('/admin/news', data);
            navigate('/admin/infos');
        } catch (err) {
            alert('خطأ في الإضافة');
        }
    };

    return (
        <div className="app-content content">
            <div className="content-wrapper">
                <div className="content-header row">
                    <div className="content-header-left col-md-6 col-12 mb-2">
                        <h3 className="content-header-title">إضافة خبر جديد</h3>
                    </div>
                </div>
                <div className="content-body">
                    <div className="card">
                        <div className="card-body">
                            <form onSubmit={handleSubmit}>
                                <div className="form-group">
                                    <label>العنوان</label>
                                    <input type="text" className="form-control" onChange={(e) => setFormData({...formData, titre: e.target.value})} required />
                                </div>
                                <div className="form-group">
                                    <label>الوصف</label>
                                    <textarea className="form-control" rows="5" onChange={(e) => setFormData({...formData, description: e.target.value})} required></textarea>
                                </div>
                                <div className="form-group">
                                    <label>الصورة</label>
                                    <input type="file" className="form-control-file" onChange={(e) => setImage(e.target.files[0])} />
                                </div>
                                <button type="submit" className="btn btn-primary">حفظ</button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AddNews;
