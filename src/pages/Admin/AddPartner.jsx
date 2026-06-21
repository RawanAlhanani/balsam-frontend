import React, { useState } from 'react';
import api from '../../api';
import { useNavigate } from 'react-router-dom';
import {
    AdminPage, AdminPageHeader, AdminCard, AdminFormGroup, AdminFormActions, AdminBtn
} from '../../components/Admin/ui/AdminUI';

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
            navigate('/admin/partners');
        } catch (err) {
            alert('خطأ في الإضافة');
        }
    };

    return (
        <AdminPage>
            <AdminPageHeader title="إضافة شريك جديد" subtitle="إضافة شريك وشعاره" badge="المحتوى" />
            <div className="content-body">
                <AdminCard title="بيانات الشريك" icon="la-handshake-o">
                    <form onSubmit={handleSubmit}>
                        <AdminFormGroup label="اسم الشريك">
                            <input type="text" className="form-control" value={nomPartenaire} onChange={(e) => setNomPartenaire(e.target.value)} required />
                        </AdminFormGroup>
                        <AdminFormGroup label="الشعار">
                            <input type="file" className="form-control-file" onChange={(e) => setImage(e.target.files[0])} required />
                        </AdminFormGroup>
                        <AdminFormActions>
                            <AdminBtn variant="primary" type="submit" icon="la-check">حفظ</AdminBtn>
                            <AdminBtn variant="secondary" icon="la-arrow-right" onClick={() => navigate('/admin/partners')}>رجوع</AdminBtn>
                        </AdminFormActions>
                    </form>
                </AdminCard>
            </div>
        </AdminPage>
    );
};

export default AddPartner;
