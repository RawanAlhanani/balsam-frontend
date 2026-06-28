import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../../api';
import BlockEditor from '../../components/Admin/BlockEditor';
import {
    AdminPage, AdminPageHeader, AdminCard, AdminLoading, AdminAlert, AdminBtn
} from '../../components/Admin/ui/AdminUI';

const EditStaticPage = () => {
    const { type, id } = useParams(); // Get both type and id from URL params
    const navigate = useNavigate();
    const [formData, setFormData] = useState({ type: type, titre: '', description: '' }); // Initialize type with URL param
    const [blockContent, setBlockContent] = useState({ sections: [] }); // New state for BlockEditor
    const [image, setImage] = useState(null);
    const [alert, setAlert] = useState({ message: '', type: '' });
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        const fetchPage = async () => {
            try {
                const res = await api.get(`/admin/static-pages/${type}/${id}`); // Use both type and id in the API call
                const page = res.data;
                setFormData({
                    type: type, // Ensure type is set from URL param
                    titre: page.titre,
                    description: page.description || '' // Keep description for non-structured types
                });
                // Load structured_description for 'autism', 'about', and 'projects' types
                if ((type === 'autism' || type === 'about' || type === 'projects') && page.structured_description) {
                    setBlockContent(page.structured_description);
                } else {
                    setBlockContent({ sections: [] }); // Reset for other types or if no structured data
                }
            } catch (err) {
                setAlert({ message: 'خطأ في تحميل الصفحة', type: 'danger' });
            } finally {
                setLoading(false);
            }
        };
        fetchPage();
    }, [type, id]); // Add type to dependency array

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (submitting) return;

        const data = new FormData();
        Object.keys(formData).forEach(k => data.append(k, formData[k]));
        if (image) data.append('image', image);
        data.append('id', id); // Ensure ID is sent for update

        // Use BlockEditor content for 'autism', 'about', and 'projects' types
        if (formData.type === 'autism' || formData.type === 'about' || formData.type === 'projects') {
            data.append('description_json', JSON.stringify(blockContent));
            // For structured types, ensure the regular description field is empty or not sent
            data.delete('description'); 
        }

        setSubmitting(true);
        try {
            // Assuming the same endpoint handles update based on ID and type
            await api.post('/admin/static-pages', data);
            setAlert({ message: 'تم التحديث بنجاح', type: 'success' });
            navigate('/admin/static-pages'); // Redirect to the list page
        } catch (err) {
            setAlert({ message: 'خطأ أثناء التحديث', type: 'danger' });
        } finally {
            setSubmitting(false);
            setTimeout(() => setAlert({ message: '', type: '' }), 3500);
        }
    };

    if (loading) {
        return <AdminLoading />;
    }

    return (
        <AdminPage>
            <AdminPageHeader
                title="تعديل الصفحة الثابتة"
                subtitle={`تعديل محتوى: ${formData.titre}`}
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
                <AdminCard title="نموذج تعديل صفحة" icon="la-edit">
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
                                {submitting ? <><span className="spinner-border spinner-border-sm mr-2" role="status" aria-hidden="true"></span> جارٍ...</> : 'حفظ التغييرات'}
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

export default EditStaticPage;