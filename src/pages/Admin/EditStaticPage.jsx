import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../../api';
import {
    AdminPage, AdminPageHeader, AdminCard, AdminLoading, AdminAlert, AdminBtn
} from '../../components/Admin/ui/AdminUI';

const EditStaticPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [formData, setFormData] = useState({ type: 'about', titre: '', description: '' });
    const [sections, setSections] = useState([{ subtitle: '', text: '' }]);
    const [image, setImage] = useState(null);
    const [alert, setAlert] = useState({ message: '', type: '' });
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        const fetchPage = async () => {
            try {
                const res = await api.get(`/admin/static-pages/single/${id}`);
                const page = res.data;
                setFormData({
                    type: page.type,
                    titre: page.titre,
                    description: page.description || ''
                });
                if (page.type === 'autism' && page.structured_description && page.structured_description.sections) {
                    setSections(page.structured_description.sections.map(sec => ({ subtitle: sec.subtitle || '', text: sec.text || '' })));
                } else {
                    setSections([{ subtitle: '', text: '' }]);
                }
            } catch (err) {
                setAlert({ message: 'خطأ في تحميل الصفحة', type: 'danger' });
            } finally {
                setLoading(false);
            }
        };
        fetchPage();
    }, [id]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (submitting) return;

        const data = new FormData();
        Object.keys(formData).forEach(k => data.append(k, formData[k]));
        if (image) data.append('image', image);
        data.append('id', id); // Ensure ID is sent for update

        if (formData.type === 'autism') {
            data.append('description_json', JSON.stringify({ main: formData.titre, sections }));
        }

        setSubmitting(true);
        try {
            await api.post('/admin/static-pages', data); // Assuming the same endpoint handles update based on ID
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
                            {formData.type === 'autism' ? (
                                <div>
                                    <small>أضف التفرعات التفصيلية (subtitle + text)</small>
                                    {sections.map((s, idx) => (
                                        <div key={idx} className="d-flex mb-2">
                                            <input className="form-control mr-2" placeholder="عنوان فرعي" value={s.subtitle} onChange={e => { const copy = [...sections]; copy[idx].subtitle = e.target.value; setSections(copy); }} />
                                            <input className="form-control" placeholder="النص" value={s.text} onChange={e => { const copy = [...sections]; copy[idx].text = e.target.value; setSections(copy); }} />
                                            <button type="button" className="btn btn-sm btn-danger ml-2" onClick={() => { const copy = sections.filter((_, i) => i !== idx); setSections(copy.length?copy:[{ subtitle: '', text: '' }]); }}>حذف</button>
                                        </div>
                                    ))}
                                    <button type="button" className="btn btn-sm btn-secondary" onClick={() => setSections([...sections, { subtitle: '', text: '' }])}>أضف تفرع</button>
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