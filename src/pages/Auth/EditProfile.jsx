import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../../api';
import PageBanner from '../../components/PageBanner';
import Loading from '../../components/Loading';

const EditProfile = () => {
    const navigate = useNavigate();
    const { id } = useParams();
    const [regData, setRegData] = useState({ specialites: [], regions: [] });
    const [formData, setFormData] = useState({
        nom_tuteur: '', prenom_tuteur: '', CIN: '', adresse: '', region_id: '',
        email_tuteur: '', telephon: '', whatsapp: '', nom_utilisateur: '', mot_de_pass: '',
        nom_enfant: '', prenom_enfant: '', date_naissance: '', sexeEnfant: '',
        statut: '', parole: '', avs: '', etude: '', type_Tuteur: '', formation: '',
        doctor: []
    });
    const [photo, setPhoto] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    useEffect(() => {
        const loadData = async () => {
            try {
                const [regRes, profileRes] = await Promise.all([
                    api.get('/registration-data'),
                    api.get('/profile')
                ]);
                
                setRegData(regRes.data);
                const { tuteur, enfant, mesDocs } = profileRes.data;
                
                setFormData({
                    ...tuteur,
                    ...enfant,
                    doctor: mesDocs || [],
                    region_id: tuteur.region_id || '',
                });
                setLoading(false);
            } catch (err) {
                console.error(err);
                setError('حدث خطأ في تحميل البيانات.');
                setLoading(false);
            }
        };
        loadData();
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleDoctorChange = (e) => {
        const value = Array.from(e.target.selectedOptions, option => option.value);
        setFormData({ ...formData, doctor: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');
        const data = new FormData();
        Object.keys(formData).forEach(key => {
            if (key === 'doctor') {
                formData[key].forEach(val => data.append('doctor[]', val));
            } else if (formData[key] !== null && key !== 'photo') {
                data.append(key, formData[key]);
            }
        });
        if (photo) data.append('photo', photo);

        try {
            await api.post('/update-profile', data, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            setSuccess('تم تحديث البيانات بنجاح');
            window.scrollTo(0, 0);
        } catch (err) {
            setError('حدث خطأ في التحديث. يرجى التأكد من جميع المعلومات.');
        }
    };

    if (loading) return <Loading message="جاري تحميل البيانات..." />;

    // Only beneficiary registrations have a linked child (see Register.jsx —
    // choosing "volunteer" skips straight past the child/formation/type_Tuteur
    // steps entirely). Without this check, those accounts saw required child
    // fields they never filled in and couldn't submit any profile update.
    const isBeneficiary = formData.account_type === 'beneficiary';

    return (
        <div className="content">
            <PageBanner title="تعديل الملف الشخصي" />

            <section className="eco_services_environment">
                <div className="container">
                    <div className="eco_headings">
                        <h3><b>تعديل حسابي</b></h3>
                        <span><i className="icon-nature-2"></i></span>
                    </div>
                    {error && <div className="alert alert-danger" style={{ textAlign: 'center' }}>{error}</div>}
                    {success && <div className="alert alert-success" style={{ textAlign: 'center' }}>{success}</div>}
                    
                    <form onSubmit={handleSubmit} className="row">
                        <div className={isBeneficiary ? 'col-md-6' : 'col-md-12'}>
                            <h4>معلومات الولي</h4>
                            <div className="form-group">
                                <label>الاسم الشخصي</label>
                                <input className="form-control" name="nom_tuteur" value={formData.nom_tuteur} onChange={handleChange} required />
                            </div>
                            <div className="form-group">
                                <label>الاسم العائلي</label>
                                <input className="form-control" name="prenom_tuteur" value={formData.prenom_tuteur} onChange={handleChange} required />
                            </div>
                            <div className="form-group">
                                <label>رقم البطاقة الوطنية</label>
                                <input className="form-control" name="CIN" value={formData.CIN} onChange={handleChange} required={isBeneficiary} />
                            </div>
                            <div className="form-group">
                                <label>العنوان</label>
                                <input className="form-control" name="adresse" value={formData.adresse} onChange={handleChange} required={isBeneficiary} />
                            </div>
                            <div className="form-group">
                                <label>المنطقة</label>
                                <select className="form-control" name="region_id" value={formData.region_id} onChange={handleChange} required>
                                    <option value="">اختر المنطقة</option>
                                    {regData.regions.map(r => <option key={r.id} value={r.id}>{r.nom_region}</option>)}
                                </select>
                            </div>
                            <div className="form-group">
                                <label>البريد الإلكتروني</label>
                                <input className="form-control" name="email_tuteur" type="email" value={formData.email_tuteur} onChange={handleChange} required />
                            </div>
                            <div className="form-group">
                                <label>رقم الهاتف</label>
                                <input className="form-control" name="telephon" value={formData.telephon} onChange={handleChange} required />
                            </div>
                            <div className="form-group">
                                <label>رقم الواتساب</label>
                                <input className="form-control" name="whatsapp" value={formData.whatsapp} onChange={handleChange} required={isBeneficiary} />
                            </div>
                            <div className="form-group">
                                <label>اسم المستخدم</label>
                                <input className="form-control" name="nom_utilisateur" value={formData.nom_utilisateur} onChange={handleChange} required />
                            </div>
                            <div className="form-group">
                                <label>كلمة المرور (اتركها فارغة للاحتفاظ بكلمة المرور الحالية)</label>
                                <input className="form-control" name="mot_de_pass" type="password" value={formData.mot_de_pass} onChange={handleChange} />
                            </div>
                            {isBeneficiary && (
                                <>
                                    <div className="form-group">
                                        <label>العلاقة بالطفل</label>
                                        <select className="form-control" name="type_Tuteur" value={formData.type_Tuteur} onChange={handleChange} required>
                                            <option value="">العلاقة بالطفل</option>
                                            <option value="1">أب</option>
                                            <option value="2">أم</option>
                                            <option value="3">آخر</option>
                                        </select>
                                    </div>
                                    <div className="form-group">
                                        <label>تكوين في التوحد</label>
                                        <select className="form-control" name="formation" value={formData.formation} onChange={handleChange} required>
                                            <option value="">هل سبق لك أن تلقيت تكوينا في التوحد؟</option>
                                            <option value="1">نعم</option>
                                            <option value="2">لا</option>
                                        </select>
                                    </div>
                                </>
                            )}
                        </div>

                        {isBeneficiary && (
                        <div className="col-md-6">
                            <h4>معلومات الطفل</h4>
                            <div className="form-group">
                                <label>الاسم الشخصي للطفل</label>
                                <input className="form-control" name="nom_enfant" value={formData.nom_enfant} onChange={handleChange} required />
                            </div>
                            <div className="form-group">
                                <label>الاسم العائلي للطفل</label>
                                <input className="form-control" name="prenom_enfant" value={formData.prenom_enfant} onChange={handleChange} required />
                            </div>
                            <div className="form-group">
                                <label>تاريخ الازدياد</label>
                                <input className="form-control" name="date_naissance" type="date" value={formData.date_naissance} onChange={handleChange} required />
                            </div>
                            <div className="form-group">
                                <label>الجنس</label>
                                <select className="form-control" name="sexeEnfant" value={formData.sexeEnfant} onChange={handleChange} required>
                                    <option value="">الجنس</option>
                                    <option value="2">ذكر</option>
                                    <option value="1">أنثى</option>
                                </select>
                            </div>
                            <div className="form-group">
                                <label>صورة الطفل (اتركها فارغة للحفاظ على الصورة الحالية)</label>
                                <input className="form-control-file" type="file" onChange={(e) => setPhoto(e.target.files[0])} />
                            </div>
                            <div className="form-group">
                                <label>حالة الطفل</label>
                                <select className="form-control" name="statut" value={formData.statut} onChange={handleChange} required>
                                    <option value="">حالة الطفل</option>
                                    <option value="1">توحد خفيف</option>
                                    <option value="2">توحد متوسط</option>
                                    <option value="3">توحد شديد</option>
                                </select>
                            </div>
                            <div className="form-group">
                                <label>هل يتكلم؟</label>
                                <select className="form-control" name="parole" value={formData.parole} onChange={handleChange} required>
                                    <option value="">هل يتكلم؟</option>
                                    <option value="1">غير متكلم</option>
                                    <option value="2">يصدر بعض الأصوات</option>
                                    <option value="3">يتكلم بعض الكلمات</option>
                                    <option value="4">يتكلم</option>
                                </select>
                            </div>
                            <div className="form-group">
                                <label>هل لديه مرافق؟</label>
                                <select className="form-control" name="avs" value={formData.avs} onChange={handleChange} required>
                                    <option value="">هل لديه مرافق؟</option>
                                    <option value="1">نعم</option>
                                    <option value="2">لا</option>
                                </select>
                            </div>
                            <div className="form-group">
                                <label>هل يدرس؟</label>
                                <select className="form-control" name="etude" value={formData.etude} onChange={handleChange} required>
                                    <option value="">هل يدرس؟</option>
                                    <option value="1">نعم</option>
                                    <option value="2">لا</option>
                                </select>
                            </div>
                            <div className="form-group">
                                <label>المتخصصون المتابعون:</label>
                                <select className="form-control" name="doctor" multiple value={formData.doctor} onChange={handleDoctorChange} style={{ height: '150px' }}>
                                    {regData.specialites.map(s => <option key={s.id} value={s.id}>{s.specialite}</option>)}
                                </select>
                            </div>
                        </div>
                        )}

                        <div className="col-md-12" style={{ textAlign: 'center', marginTop: '30px' }}>
                            <button type="submit" className="btn-small xsmall-btn" style={{ display: 'table', margin: 'auto' }}>
                                تحديث البيانات
                            </button>
                        </div>
                    </form>
                </div>
            </section>
        </div>
    );
};

export default EditProfile;
