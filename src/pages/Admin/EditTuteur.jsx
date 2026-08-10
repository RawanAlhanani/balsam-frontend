import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../../api';
import {
    AdminPage, AdminPageHeader, AdminCard, AdminLoading, AdminAlert, AdminBtn, AdminFormGroup
} from '../../components/Admin/ui/AdminUI';
import { getStorageUrl } from '../../utils/formatters';

const getPersonalizedErrorMessage = (error) => {
    if (error.response?.data?.message) return error.response.data.message;
    return 'حدث خطأ ما. الرجاء المحاولة مرة أخرى.';
};

const EditTuteur = () => {
    const { enfantId } = useParams();
    const navigate = useNavigate();
    const [regions, setRegions] = useState([]);
    const [specialites, setSpecialites] = useState([]);
    const [formData, setFormData] = useState({
        nom_tuteur: '', prenom_tuteur: '', CIN: '', adresse: '', region_id: '',
        email_tuteur: '', telephon: '', whatsapp: '', type_Tuteur: '', formation: '',
        nom_enfant: '', prenom_enfant: '', date_naissance: '', sexeEnfant: '',
        statut: '', parole: '', avs: '', etude: '',
    });
    const [doctorIds, setDoctorIds] = useState([]);
    const [currentPhoto, setCurrentPhoto] = useState(null);
    const [photo, setPhoto] = useState(null);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [alert, setAlert] = useState({ message: '', type: '' });
    const [formErrors, setFormErrors] = useState({});

    useEffect(() => {
        const loadData = async () => {
            setLoading(true);
            try {
                const [regRes, editRes] = await Promise.all([
                    api.get('/registration-data'),
                    api.get(`/admin/tuteur-enfant/${enfantId}`),
                ]);
                setRegions(regRes.data.regions || []);
                setSpecialites(regRes.data.specialites || []);

                const { tuteur, enfant, doctor_ids } = editRes.data;
                setFormData({
                    nom_tuteur: tuteur.nom_tuteur || '',
                    prenom_tuteur: tuteur.prenom_tuteur || '',
                    CIN: tuteur.CIN || '',
                    adresse: tuteur.adresse || '',
                    region_id: tuteur.region_id || '',
                    email_tuteur: tuteur.email_tuteur || '',
                    telephon: tuteur.telephon || '',
                    whatsapp: tuteur.whatsapp || '',
                    type_Tuteur: tuteur.type_Tuteur || '',
                    formation: tuteur.formation || '',
                    nom_enfant: enfant.nom_enfant || '',
                    prenom_enfant: enfant.prenom_enfant || '',
                    date_naissance: enfant.date_naissance || '',
                    sexeEnfant: enfant.sexeEnfant || '',
                    statut: enfant.statut || '',
                    parole: enfant.parole || '',
                    avs: enfant.avs || '',
                    etude: enfant.etude || '',
                });
                setDoctorIds((doctor_ids || []).map(String));
                setCurrentPhoto(enfant.photo || null);
            } catch (err) {
                setAlert({ message: getPersonalizedErrorMessage(err), type: 'danger' });
            } finally {
                setLoading(false);
            }
        };
        loadData();
    }, [enfantId]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        if (formErrors[name]) setFormErrors(prev => ({ ...prev, [name]: null }));
    };

    const handleDoctorChange = (e) => {
        setDoctorIds(Array.from(e.target.selectedOptions, option => option.value));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        setFormErrors({});
        setAlert({ message: '', type: '' });

        const data = new FormData();
        Object.keys(formData).forEach(key => data.append(key, formData[key]));
        doctorIds.forEach(id => data.append('doctor[]', id));
        if (photo) data.append('photo', photo);
        data.append('_method', 'PUT');

        try {
            await api.post(`/admin/tuteur-enfant/${enfantId}`, data);
            navigate('/admin/parents', { state: { flashMessage: 'تم تحديث البيانات بنجاح', flashType: 'success' } });
        } catch (err) {
            if (err.response?.status === 422) {
                setFormErrors(err.response.data.errors || {});
                setAlert({ message: 'الرجاء مراجعة الأخطاء في النموذج.', type: 'danger' });
            } else {
                setAlert({ message: getPersonalizedErrorMessage(err), type: 'danger' });
            }
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) return <AdminLoading />;

    return (
        <AdminPage>
            <AdminPageHeader
                title="تعديل بيانات ولي الأمر والطفل"
                subtitle={`${formData.nom_tuteur} ${formData.prenom_tuteur}`}
                badge="المسجلين"
                actions={
                    <AdminBtn variant="secondary" icon="la-arrow-right" onClick={() => navigate('/admin/parents')}>
                        العودة للمسجلين
                    </AdminBtn>
                }
            />
            <div className="content-body">
                <form onSubmit={handleSubmit}>
                    <div className="row">
                        <div className="col-md-6">
                            <AdminCard title="معلومات ولي الأمر" icon="la-user">
                                <AdminFormGroup label="الاسم الشخصي">
                                    <input className="form-control" name="nom_tuteur" value={formData.nom_tuteur} onChange={handleChange} required />
                                    {formErrors.nom_tuteur && <div className="text-danger small mt-1">{formErrors.nom_tuteur[0]}</div>}
                                </AdminFormGroup>
                                <AdminFormGroup label="الاسم العائلي">
                                    <input className="form-control" name="prenom_tuteur" value={formData.prenom_tuteur} onChange={handleChange} required />
                                </AdminFormGroup>
                                <AdminFormGroup label="رقم البطاقة الوطنية">
                                    <input className="form-control" name="CIN" value={formData.CIN} onChange={handleChange} required />
                                    {formErrors.CIN && <div className="text-danger small mt-1">{formErrors.CIN[0]}</div>}
                                </AdminFormGroup>
                                <AdminFormGroup label="العنوان">
                                    <input className="form-control" name="adresse" value={formData.adresse} onChange={handleChange} required />
                                </AdminFormGroup>
                                <AdminFormGroup label="المنطقة">
                                    <select className="form-control" name="region_id" value={formData.region_id} onChange={handleChange}>
                                        <option value="">اختر المنطقة</option>
                                        {regions.map(r => <option key={r.id} value={r.id}>{r.nom_region}</option>)}
                                    </select>
                                </AdminFormGroup>
                                <AdminFormGroup label="البريد الإلكتروني">
                                    <input className="form-control" type="email" name="email_tuteur" value={formData.email_tuteur} onChange={handleChange} />
                                </AdminFormGroup>
                                <AdminFormGroup label="رقم الهاتف">
                                    <input className="form-control" name="telephon" value={formData.telephon} onChange={handleChange} />
                                </AdminFormGroup>
                                <AdminFormGroup label="رقم الواتساب">
                                    <input className="form-control" name="whatsapp" value={formData.whatsapp} onChange={handleChange} />
                                </AdminFormGroup>
                                <AdminFormGroup label="العلاقة بالطفل">
                                    <select className="form-control" name="type_Tuteur" value={formData.type_Tuteur} onChange={handleChange}>
                                        <option value="">العلاقة بالطفل</option>
                                        <option value="1">أب</option>
                                        <option value="2">أم</option>
                                        <option value="3">آخر</option>
                                    </select>
                                </AdminFormGroup>
                                <AdminFormGroup label="تكوين في التوحد">
                                    <select className="form-control" name="formation" value={formData.formation} onChange={handleChange}>
                                        <option value="">هل سبق له تكوين في التوحد؟</option>
                                        <option value="1">نعم</option>
                                        <option value="2">لا</option>
                                    </select>
                                </AdminFormGroup>
                            </AdminCard>
                        </div>

                        <div className="col-md-6">
                            <AdminCard title="معلومات الطفل" icon="la-child">
                                <AdminFormGroup label="الاسم الشخصي للطفل">
                                    <input className="form-control" name="nom_enfant" value={formData.nom_enfant} onChange={handleChange} required />
                                </AdminFormGroup>
                                <AdminFormGroup label="الاسم العائلي للطفل">
                                    <input className="form-control" name="prenom_enfant" value={formData.prenom_enfant} onChange={handleChange} required />
                                </AdminFormGroup>
                                <AdminFormGroup label="تاريخ الازدياد">
                                    <input className="form-control" type="date" name="date_naissance" value={formData.date_naissance} onChange={handleChange} required />
                                </AdminFormGroup>
                                <AdminFormGroup label="الجنس">
                                    <select className="form-control" name="sexeEnfant" value={formData.sexeEnfant} onChange={handleChange} required>
                                        <option value="">الجنس</option>
                                        <option value="2">ذكر</option>
                                        <option value="1">أنثى</option>
                                    </select>
                                </AdminFormGroup>
                                <AdminFormGroup label="صورة الطفل">
                                    {currentPhoto && !photo && (
                                        <div className="mb-2">
                                            <img
                                                src={getStorageUrl(currentPhoto)}
                                                alt="الصورة الحالية"
                                                style={{ maxWidth: '120px', maxHeight: '120px', objectFit: 'contain', display: 'block' }}
                                                className="mb-1 border rounded p-1"
                                            />
                                            <small className="text-muted">الصورة الحالية — اختاري ملفًا جديدًا فقط إن أردتِ استبدالها</small>
                                        </div>
                                    )}
                                    <input type="file" className="form-control-file" onChange={(e) => setPhoto(e.target.files[0])} />
                                </AdminFormGroup>
                                <AdminFormGroup label="حالة الطفل">
                                    <select className="form-control" name="statut" value={formData.statut} onChange={handleChange}>
                                        <option value="">حالة الطفل</option>
                                        <option value="1">توحد خفيف</option>
                                        <option value="2">توحد متوسط</option>
                                        <option value="3">توحد شديد</option>
                                    </select>
                                </AdminFormGroup>
                                <AdminFormGroup label="هل يتكلم؟">
                                    <select className="form-control" name="parole" value={formData.parole} onChange={handleChange}>
                                        <option value="">هل يتكلم؟</option>
                                        <option value="1">غير متكلم</option>
                                        <option value="2">يصدر بعض الأصوات</option>
                                        <option value="3">يتكلم بعض الكلمات</option>
                                        <option value="4">يتكلم</option>
                                    </select>
                                </AdminFormGroup>
                                <AdminFormGroup label="هل لديه مرافق؟">
                                    <select className="form-control" name="avs" value={formData.avs} onChange={handleChange}>
                                        <option value="">هل لديه مرافق؟</option>
                                        <option value="1">نعم</option>
                                        <option value="2">لا</option>
                                    </select>
                                </AdminFormGroup>
                                <AdminFormGroup label="هل يدرس؟">
                                    <select className="form-control" name="etude" value={formData.etude} onChange={handleChange}>
                                        <option value="">هل يدرس؟</option>
                                        <option value="1">نعم</option>
                                        <option value="2">لا</option>
                                    </select>
                                </AdminFormGroup>
                                <AdminFormGroup label="المتخصصون المتابعون">
                                    <select className="form-control" multiple value={doctorIds} onChange={handleDoctorChange} style={{ height: '150px' }}>
                                        {specialites.map(s => <option key={s.id} value={s.id}>{s.specialite}</option>)}
                                    </select>
                                </AdminFormGroup>
                            </AdminCard>
                        </div>
                    </div>

                    <div className="text-left mb-4">
                        <AdminBtn variant="success" type="submit" icon="la-save" disabled={submitting}>
                            {submitting ? <span className="spinner-border spinner-border-sm" /> : 'حفظ التغييرات'}
                        </AdminBtn>
                    </div>
                </form>
            </div>
            {alert.message && (
                <AdminAlert message={alert.message} type={alert.type} onClose={() => setAlert({ message: '', type: '' })} />
            )}
        </AdminPage>
    );
};

export default EditTuteur;
