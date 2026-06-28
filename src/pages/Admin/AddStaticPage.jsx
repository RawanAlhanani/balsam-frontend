import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../api';
import BlockEditor from '../../components/Admin/BlockEditor';
import {
    AdminPage, AdminPageHeader, AdminCard, AdminLoading, AdminAlert, AdminBtn
} from '../../components/Admin/ui/AdminUI';

const AddStaticPage = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({ type: 'about', titre: '', description: '' });
    const [blockContent, setBlockContent] = useState({ sections: [] });
    const [image, setImage] = useState(null);
    const [alert, setAlert] = useState({ message: '', type: '' });
    const [submitting, setSubmitting] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (submitting) return;

        const data = new FormData();
        Object.keys(formData).forEach(k => data.append(k, formData[k]));
        if (image) data.append('image', image);

        // Use BlockEditor content for 'autism', 'about', and 'projects' types
        if (formData.type === 'autism' || formData.type === 'about' || formData.type === 'projects') {
            data.append('description_json', JSON.stringify(blockContent));
            // Ensure the regular description field is empty or not sent to avoid conflicts
            data.delete('description'); 
        }

        setSubmitting(true);
        try {
            await api.post('/admin/static-pages', data);
            setAlert({ message: 'تم الإضافة بنجاح', type: 'success' });
            navigate('/admin/static-pages'); // Redirect to the list page
        } catch (err) {
            setAlert({ message: 'خطأ أثناء الإضافة', type: 'danger' });
        } finally {
            setSubmitting(false);
            setTimeout(() => setAlert({ message: '', type: '' }), 3500);
        }
    };

    return (
        <AdminPage>
            <AdminPageHeader
                title="أضف صفحة ثابتة جديدة"
                subtitle="إضافة محتوى جديد لصفحات من نحن، التوحد، أو مشاريعنا"
                badge="المحتوى"
                actions={
                    <AdminBtn
                        variant="secondary"
                        icon="la-arrow-right"
                        onClick={() => navigate('/admin/static-pages')}
                    >
                        العودة للصفحات الثابتة
                    </AdminBtn>
                }
            />
            <div className="content-body">
                <AdminCard title="نموذج إضافة صفحة" icon="la-plus">
                    <form onSubmit={handleSubmit}>
                        <div className="form-row">
                            <div className="form-group col-md-4">
                                <label>النوع</label>
                                <select className="form-control" value={formData.type} onChange={e => setFormData({...formData, type: e.target.value})}>
                                    <option value="about">من نحن</option>
                                    <option value="autism">صفحات التوحد</option>
                                    <option value="projects">مشاريعنا</option>
                                </select>
                            </div>
                            <div className="form-group col-md-8">
                                <label>العنوان</label>
                                <input className="form-control" value={formData.titre} onChange={e => setFormData({...formData, titre: e.target.value})} required />
                            </div>
                        </div>
                        <div className="form-group">
                            {/* Use BlockEditor for 'autism', 'about', and 'projects' types */}
                            {formData.type === 'autism' || formData.type === 'about' || formData.type === 'projects' ? (
                                <div>
                                    <label>المحتوى التفصيلي</label>
                                    <BlockEditor 
                                        value={blockContent}
                                        onChange={setBlockContent}
                                        placeholder="أضف عناوين وفقرات وقوائم لإنشاء محتوى منظم"
                                    />
                                </div>
                            ) : (
                                <textarea className="form-control" placeholder="الوصف" value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} required />
                            )}
                        </div>
                        <div className="form-group">
                            <label>صورة</label>
                            <input type="file" className="form-control-file" onChange={e => setImage(e.target.files[0])} />
                        </div>
                        <div className="text-right">
                            <button type="submit" className="btn btn-primary" disabled={submitting}>
                                {submitting ? <><span className="spinner-border spinner-border-sm mr-2" role="status" aria-hidden="true"></span> جارٍ...</> : 'إضافة'}
                            </button>
                        </div>
                    </form>
                </AdminCard>
            </div>
            {alert.message && (
                <AdminAlert message={alert.message} type={alert.type} onClose={() => setAlert({ message: '', type: '' })} />
            )}
        </AdminPage>
    );
};

export default AddStaticPage;