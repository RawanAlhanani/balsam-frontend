import React, { useState } from 'react';
import api from '../../api';
import { useNavigate } from 'react-router-dom';

const AddPartner = () => {
    const navigate = useNavigate();
    const [nomPartenaire, setNomPartenaire] = useState('');
    const [image, setImage] = useState(null);

    const handleSubmit = async (e) => {
        e.preventDefault();
        const data = new FormData();
        data.append('nomPartenaire', nomPartenaire);
        if (image) data.append('imagePartenaire', image);

        try {
            await api.post('/admin/partners', data);
            navigate('/admin/partenaires');
        } catch (err) {
            alert('خطأ في الإضافة');
        }
    };

    return (
        <div className="app-content content">
            <div className="content-wrapper">
                <div className="content-header row">
                    <div className="content-header-left col-md-6 col-12 mb-2">
                        <h3 className="content-header-title">إضافة شريك جديد</h3>
                    </div>
                </div>
                <div className="content-body">
                    <div className="card">
                        <div className="card-body">
                            <form onSubmit={handleSubmit}>
                                <div className="form-group">
                                    <label>اسم الشريك</label>
                                    <input type="text" className="form-control" onChange={(e) => setNomPartenaire(e.target.value)} required />
                                </div>
                                <div className="form-group">
                                    <label>الشعار</label>
                                    <input type="file" className="form-control-file" onChange={(e) => setImage(e.target.files[0])} required />
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

export default AddPartner;
