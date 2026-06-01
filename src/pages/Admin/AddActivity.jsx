import React, { useState, useEffect } from 'react';
import api from '../../api';
import { useNavigate } from 'react-router-dom';

const AddActivity = () => {
    const navigate = useNavigate();
    const [types, setTypes] = useState([]);
    const [formData, setFormData] = useState({
        titre: '',
        type_activite_id: '',
        date_activite: '',
        description: ''
    });
    const [image, setImage] = useState(null);

    useEffect(() => {
        api.get('/admin/types').then(res => setTypes(res.data));
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        const data = new FormData();
        Object.keys(formData).forEach(key => data.append(key, formData[key]));
        if (image) data.append('image_activite', image);

        try {
            await api.post('/admin/activities', data);
            navigate('/admin/activites');
        } catch (err) {
            alert('خطأ في الإضافة');
        }
    };

    return (
        <div className="app-content content">
            <div className="content-wrapper">
                <div className="content-header row">
                    <div className="content-header-left col-md-6 col-12 mb-2">
                        <h3 className="content-header-title">إضافة نشاط جديد</h3>
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
                                    <label>النوع</label>
                                    <select className="form-control" onChange={(e) => setFormData({...formData, type_activite_id: e.target.value})} required>
                                        <option value="">اختر النوع</option>
                                        {types.map(t => <option key={t.id} value={t.id}>{t.nomActivite}</option>)}
                                    </select>
                                </div>
                                <div className="form-group">
                                    <label>التاريخ</label>
                                    <input type="date" className="form-control" onChange={(e) => setFormData({...formData, date_activite: e.target.value})} required />
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

export default AddActivity;
