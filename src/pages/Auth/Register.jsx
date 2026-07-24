import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../api';
import PageBanner from '../../components/PageBanner';
import Loading from '../../components/Loading';

const Register = () => {
    const navigate = useNavigate();
    const [step, setStep] = useState(0); 
    const [accountType, setAccountType] = useState('');
    const [regData, setRegData] = useState({ specialites: [], regions: [], formations: [] }); 
    
    const [formData, setFormData] = useState({
        nom_enfant: '', prenom_enfant: '', date_naissance: '', sexeEnfant: '',
        statut: '', parole: '', doctor: [],
        etude: '', avs: '', // ستصبح قيمتها رقمية (1 أو 0)
        formation: '', 
        nom_tuteur: '', prenom_tuteur: '', CIN: '', email_tuteur: '', region_id: '', telephon: '',
        adresse: '', whatsapp: '', type_Tuteur: '', 
        nom_utilisateur: '', mot_de_pass: '',
        professional_field: '', interests: []
    });
    
    const [photo, setPhoto] = useState(null); 
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        const loadData = async () => {
            try {
                const res = await api.get('/registration-data');
                setRegData(res.data);
                setLoading(false);
            } catch (err) {
                console.error('Error loading registration data:', err);
                setError('حدث خطأ في تحميل البيانات');
                setLoading(false);
            }
        };
        loadData();
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
        setError(''); 
    };

    const validateStep = () => {
        setError('');
        
        if (step === 1) {
            if (!formData.nom_enfant.trim() || !formData.prenom_enfant.trim() || !formData.date_naissance || !formData.sexeEnfant) {
                setError('يرجى ملء جميع الحقول المطلوبة للطفل قبل الانتقال.');
                return false;
            }
        }
        if (step === 2) {
            if (!formData.statut || !formData.parole || !formData.etude || formData.avs === '' || !formData.formation) {
                setError('يرجى تحديد حالة الطفل، مستوى الكلام، الدراسة، الـ AVS والتكوين.');
                return false;
            }
        }
        if (step === 3) {
            if (!formData.nom_tuteur.trim() || !formData.prenom_tuteur.trim() || !formData.CIN.trim() || 
                !formData.email_tuteur.trim() || !formData.region_id || !formData.telephon.trim() ||
                !formData.adresse.trim() || !formData.whatsapp.trim() || !formData.type_Tuteur) {
                setError('يرجى ملء جميع معلومات ولي الأمر والعنوان واختيار صلة القرابة.');
                return false;
            }
        }
        if (step === 4) {
            if (!formData.nom_utilisateur.trim() || !formData.mot_de_pass.trim()) {
                setError('اسم المستخدم وكلمة السر حقول إجبارية.');
                return false;
            }
        }
        if (step === 5) {
            if (!formData.nom_tuteur.trim() || !formData.prenom_tuteur.trim() || !formData.email_tuteur.trim() || !formData.region_id || !formData.professional_field || !formData.nom_utilisateur.trim() || !formData.mot_de_pass.trim()) {
                setError('يرجى ملء جميع البيانات الإجبارية لإنشاء حساب المتطوع.');
                return false;
            }
        }
        return true;
    };

    const nextStep = () => {
        if (validateStep()) {
            setStep(prev => prev + 1);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!validateStep()) return;

        setSubmitting(true);
        const data = new FormData();
        data.append('account_type', accountType);
        
        Object.keys(formData).forEach(key => {
            if (key === 'doctor' || key === 'interests') {
                formData[key].forEach(val => data.append(`${key}[]`, val));
            } else {
                data.append(key, formData[key]);
            }
        });

        if (photo) data.append('photo', photo);

        try {
            await api.post('/register', data, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            navigate('/se_connecter');
        } catch (err) {
            console.error("Backend Validation Error Details:", err.response?.data);
            if (err.response && err.response.data && err.response.data.errors) {
                const errorMessages = Object.entries(err.response.data.errors)
                    .map(([field, msgs]) => `${field}: ${msgs.join(', ')}`)
                    .join(' | ');
                setError(errorMessages);
            } else if (err.response && err.response.data && err.response.data.message) {
                setError(err.response.data.message);
            } else {
                setError('خطأ في التسجيل. يرجى التحقق من المدخلات.');
            }
        } finally {
            setSubmitting(false);
        }
    };

    const renderTypeSelection = () => (
        <div className="your-submit-message">
            <h4 className="eco_sm_titles">اختر نوع الحساب المراد إنشاؤه</h4>
            <div className="row text-center mt-4">
                <div className="col-md-4 mb-3">
                    <button type="button" className="account-type-card account-type-card--info" onClick={() => { setAccountType('beneficiary'); setStep(1); }}>
                        <span className="account-type-card__icon"><i className="fa fa-users"></i></span>
                        <span className="account-type-card__label">حساب أسرة مستفيدة</span>
                    </button>
                </div>
                <div className="col-md-4 mb-3">
                    <button type="button" className="account-type-card account-type-card--success" onClick={() => { setAccountType('volunteer'); setStep(5); }}>
                        <span className="account-type-card__icon"><i className="fa fa-heart"></i></span>
                        <span className="account-type-card__label">حساب مهتم/متطوع/داعم</span>
                    </button>
                </div>
                <div className="col-md-4 mb-3">
                    <button type="button" className="account-type-card account-type-card--warning" onClick={() => navigate('/centre/devenir-stagiaire')}>
                        <span className="account-type-card__icon"><i className="fa fa-graduation-cap"></i></span>
                        <span className="account-type-card__label">طلب تدريب (Stagiaire)</span>
                    </button>
                </div>
            </div>
        </div>
    );

    const renderBeneficiaryStep1 = () => (
        <div className="your-submit-message">
            <h4 className="eco_sm_titles">الخطوة 1: معلومات شخصية عن الطفل</h4>
            <div className="row">
                <div className="form-group col-md-6">
                    <label className="label-right">الاسم العائلي للطفل <span className="text-danger-star">*</span></label>
                    <input className="form-control" name="nom_enfant" placeholder="أدخل الاسم العائلي" value={formData.nom_enfant} onChange={handleChange} required />
                </div>
                <div className="form-group col-md-6">
                    <label className="label-right">الاسم الشخصي للطفل <span className="text-danger-star">*</span></label>
                    <input className="form-control" name="prenom_enfant" placeholder="أدخل الاسم الشخصي" value={formData.prenom_enfant} onChange={handleChange} required />
                </div>
                <div className="form-group col-md-6">
                    <label className="label-right">تاريخ الازدياد <span className="text-danger-star">*</span></label>
                    <input className="form-control" name="date_naissance" type="date" value={formData.date_naissance} onChange={handleChange} required />
                </div>
                <div className="form-group col-md-6">
                    <label className="label-right">حمل صورة للطفل (اختياري)</label>
                    <input className="form-control-file" type="file" onChange={(e) => setPhoto(e.target.files[0])} />
                </div>
                <div className="form-group col-md-12">
                    <label className="label-right d-block">الجنس <span className="text-danger-star">*</span></label>
                    <label className="mr-3"><input type="radio" name="sexeEnfant" value="1" checked={formData.sexeEnfant === '1'} onChange={handleChange} /> أنثى</label>
                    <label className="mr-3"><input type="radio" name="sexeEnfant" value="2" checked={formData.sexeEnfant === '2'} onChange={handleChange} /> ذكر</label>
                </div>
            </div>
            <div className="text-left mt-3">
                <button className="btn-small xsmall-btn mr-2" onClick={() => setStep(0)}>السابق</button>
                <button className="btn-small xsmall-btn" onClick={nextStep}>التالي</button>
            </div>
        </div>
    );

    const renderBeneficiaryStep2 = () => (
        <div className="your-submit-message">
            <h4 className="eco_sm_titles">الخطوة 2: وضعية الطفل الدراسية والصحية</h4>
            <div className="row">
                <div className="form-group col-md-6">
                    <label className="label-right">حالة الطفل <span className="text-danger-star">*</span></label>
                    <select className="form-control" name="statut" value={formData.statut} onChange={handleChange} required>
                        <option value="">- اختر حالة الطفل -</option>
                        <option value="1">توحد خفيف</option>
                        <option value="2">توحد متوسط</option>
                        <option value="3">توحد شديد</option>
                    </select>
                </div>
                <div className="form-group col-md-6">
                    <label className="label-right">كلام الطفل <span className="text-danger-star">*</span></label>
                    <select className="form-control" name="parole" value={formData.parole} onChange={handleChange} required>
                        <option value="">- اختر مستوى الكلام -</option>
                        <option value="1">غير متكلم</option>
                        <option value="2">يصدر بعض الأصوات</option>
                        <option value="3">يتكلم بعض الكلمات</option>
                        <option value="4">يتكلم</option>
                    </select>
                </div>

                <div className="form-group col-md-4">
                    <label className="label-right">هل يدرس الطفل حاليا؟ <span className="text-danger-star">*</span></label>
                    <select className="form-control" name="etude" value={formData.etude} onChange={handleChange} required>
                        <option value="">- اختر الجواب -</option>
                        <option value="1">نعم</option>
                        <option value="2">لا</option>
                    </select>
                </div>
                
                <div className="form-group col-md-4">
                    <label className="label-right">هل يحتاج مرافقة (AVS)؟ <span className="text-danger-star">*</span></label>
                    <select className="form-control" name="avs" value={formData.avs} onChange={handleChange} required>
                        <option value="">- اختر الجواب -</option>
                        <option value="1">نعم</option>
                        <option value="2">لا</option>
                    </select>
                </div>
                
                <div className="form-group col-md-4">
                    <label className="label-right">التكوين المستفيد منه <span className="text-danger-star">*</span></label>
                    <select className="form-control" name="formation" value={formData.formation} onChange={handleChange} required>
                        <option value="">- اختر نوع التكوين -</option>
                        {regData.formations && regData.formations.length > 0 ? (
                            regData.formations.map(f => <option key={f.id} value={f.id}>{f.nom_formation || f.title}</option>)
                        ) : (
                            <>
                                <option value="1">تكوين أساسي</option>
                                <option value="2">تكوين متوسط</option>
                                <option value="3">تكوين متقدم</option>
                                <option value="4">لا يوجد تكوين حالياً</option>
                            </>
                        )}
                    </select>
                </div>

                <div className="form-group col-md-12">
                    <label className="label-right">التخصصات الطبية المتابعة (اختياري)</label>
                    <div className="row">
                        {regData.specialites.map(s => (
                            <div key={s.id} className="col-md-3">
                                <label>
                                    <input type="checkbox" value={s.id} checked={formData.doctor.includes(s.id.toString())} onChange={(e) => {
                                        const val = e.target.value;
                                        const checked = e.target.checked;
                                        setFormData(prev => ({
                                            ...prev,
                                            doctor: checked ? [...prev.doctor, val] : prev.doctor.filter(d => d !== val)
                                        }));
                                    }} /> {s.specialite}
                                </label>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
            <div className="text-left mt-3">
                <button className="btn-small xsmall-btn mr-2" onClick={() => setStep(1)}>السابق</button>
                <button className="btn-small xsmall-btn" onClick={nextStep}>التالي</button>
            </div>
        </div>
    );

    const renderBeneficiaryStep3 = () => (
        <div className="your-submit-message">
            <h4 className="eco_sm_titles">الخطوة 3: معلومات ولي الأمر والعنوان</h4>
            <div className="row">
                <div className="form-group col-md-6">
                    <label className="label-right">الاسم العائلي <span className="text-danger-star">*</span></label>
                    <input className="form-control" name="nom_tuteur" placeholder="أدخل الاسم العائلي" value={formData.nom_tuteur} onChange={handleChange} required />
                </div>
                <div className="form-group col-md-6">
                    <label className="label-right">الاسم الشخصي <span className="text-danger-star">*</span></label>
                    <input className="form-control" name="prenom_tuteur" placeholder="أدخل الاسم الشخصي" value={formData.prenom_tuteur} onChange={handleChange} required />
                </div>
                <div className="form-group col-md-6">
                    <label className="label-right">رقم البطاقة الوطنية <span className="text-danger-star">*</span></label>
                    <input className="form-control" name="CIN" placeholder="مثال: AB123456" value={formData.CIN} onChange={handleChange} required />
                </div>
                
                <div className="form-group col-md-6">
                    <label className="label-right">صلة القرابة بالطفل <span className="text-danger-star">*</span></label>
                    <select className="form-control" name="type_Tuteur" value={formData.type_Tuteur} onChange={handleChange} required>
                        <option value="">- اختر صلة القرابة -</option>
                        <option value="1">الأب</option>
                        <option value="2">الأم</option>
                        <option value="3">الحاضن الشرعي / الوالي</option>
                    </select>
                </div>
                
                <div className="form-group col-md-6">
                    <label className="label-right">البريد الإلكتروني <span className="text-danger-star">*</span></label>
                    <input className="form-control" name="email_tuteur" placeholder="example@email.com" type="email" value={formData.email_tuteur} onChange={handleChange} required />
                </div>
                <div className="form-group col-md-6">
                    <label className="label-right">رقم الهاتف <span className="text-danger-star">*</span></label>
                    <input className="form-control" name="telephon" placeholder="أدخل رقم الهاتف" value={formData.telephon} onChange={handleChange} required />
                </div>

                <div className="form-group col-md-6">
                    <label className="label-right">رقم الواتساب <span className="text-danger-star">*</span></label>
                    <input className="form-control" name="whatsapp" placeholder="أدخل رقم الواتساب" value={formData.whatsapp} onChange={handleChange} required />
                </div>
                <div className="form-group col-md-6">
                    <label className="label-right">المنطقة / المدينة <span className="text-danger-star">*</span></label>
                    <select className="form-control" name="region_id" value={formData.region_id} onChange={handleChange} required>
                        <option value="">- اختر المنطقة -</option>
                        {regData.regions.map(r => <option key={r.id} value={r.id}>{r.nom_region}</option>)}
                    </select>
                </div>
                <div className="form-group col-md-12">
                    <label className="label-right">العنوان السكني الكامل <span className="text-danger-star">*</span></label>
                    <input className="form-control" name="adresse" placeholder="أدخل العنوان السكني الحالي بالتفصيل" value={formData.adresse} onChange={handleChange} required />
                </div>
            </div>
            <div className="text-left mt-3">
                <button className="btn-small xsmall-btn mr-2" onClick={() => setStep(2)}>السابق</button>
                <button className="btn-small xsmall-btn" onClick={nextStep}>التالي</button>
            </div>
        </div>
    );

    const renderBeneficiaryStep4 = () => (
        <div className="your-submit-message">
            <h4 className="eco_sm_titles">الخطوة 4: إنشاء الحساب</h4>
            <div className="row">
                <div className="form-group col-md-6">
                    <label className="label-right">اسم المستخدم <span className="text-danger-star">*</span></label>
                    <input className="form-control" name="nom_utilisateur" placeholder="اسم لتسجيل الدخول" value={formData.nom_utilisateur} onChange={handleChange} required />
                </div>
                <div className="form-group col-md-6">
                    <label className="label-right">كلمة السر <span className="text-danger-star">*</span></label>
                    <input className="form-control" name="mot_de_pass" placeholder="كلمة المرور الخاصة بك" type="password" value={formData.mot_de_pass} onChange={handleChange} required />
                </div>
            </div>
            <div className="text-left mt-3">
                <button className="btn-small xsmall-btn mr-2" onClick={() => setStep(3)}>السابق</button>
                <button className="btn-small xsmall-btn" onClick={handleSubmit} disabled={submitting}>
                    {submitting ? 'جاري التسجيل...' : 'تأكيد التسجيل'}
                </button>
            </div>
        </div>
    );

    const renderVolunteerForm = () => (
        <div className="your-submit-message">
            <h4 className="eco_sm_titles">حساب مهتم / متطوع / داعم</h4>
            <div className="row">
                <div className="form-group col-md-6">
                    <label className="label-right">الاسم العائلي <span className="text-danger-star">*</span></label>
                    <input className="form-control" name="nom_tuteur" placeholder="الاسم العائلي" value={formData.nom_tuteur} onChange={handleChange} required />
                </div>
                <div className="form-group col-md-6">
                    <label className="label-right">الاسم الشخصي <span className="text-danger-star">*</span></label>
                    <input className="form-control" name="prenom_tuteur" placeholder="الاسم الشخصي" value={formData.prenom_tuteur} onChange={handleChange} required />
                </div>
                <div className="form-group col-md-6">
                    <label className="label-right">البريد الإلكتروني <span className="text-danger-star">*</span></label>
                    <input className="form-control" name="email_tuteur" placeholder="البريد الإلكتروني" type="email" value={formData.email_tuteur} onChange={handleChange} required />
                </div>
                <div className="form-group col-md-6">
                    <label className="label-right">المدينة <span className="text-danger-star">*</span></label>
                    <select className="form-control" name="region_id" value={formData.region_id} onChange={handleChange} required>
                        <option value="">- اختر المدينة -</option>
                        {regData.regions.map(r => <option key={r.id} value={r.id}>{r.nom_region}</option>)}
                    </select>
                </div>
                <div className="form-group col-md-6">
                    <label className="label-right">المجال المهني <span className="text-danger-star">*</span></label>
                    <select className="form-control" name="professional_field" value={formData.professional_field} onChange={handleChange} required>
                        <option value="">- المجال المهني -</option>
                        <option value="طالب">طالب</option>
                        <option value="أخصائي">أخصائي</option>
                        <option value="متطوع">متطوع</option>
                        <option value="باحث">باحث</option>
                        <option value="مهتم">مهتم</option>
                    </select>
                </div>
                <div className="form-group col-md-6">
                    <label className="label-right">اسم المستخدم <span className="text-danger-star">*</span></label>
                    <input className="form-control" name="nom_utilisateur" placeholder="اسم المستخدم" value={formData.nom_utilisateur} onChange={handleChange} required />
                </div>
                <div className="form-group col-md-6">
                    <label className="label-right">كلمة السر <span className="text-danger-star">*</span></label>
                    <input className="form-control" name="mot_de_pass" placeholder="كلمة السر" type="password" value={formData.mot_de_pass} onChange={handleChange} required />
                </div>
            </div>
            <div className="text-left mt-3">
                <button className="btn-small xsmall-btn mr-2" onClick={() => setStep(0)}>السابق</button>
                <button className="btn-small xsmall-btn" onClick={handleSubmit} disabled={submitting}>
                    {submitting ? 'جاري التسجيل...' : 'تأكيد التسجيل'}
                </button>
            </div>
        </div>
    );

    if (loading) return <Loading message="جاري تحميل البيانات..." />;

    return (
        <div className="content">
            <PageBanner title="إنشاء حساب" />

            <section>
                <div className="container">
                    <div className="eco_contact_form">
                        <div className="row">
                            <div className="col-md-10 offset-md-2 no-padding col-sm-12 responsive-991-width">
                                {error && (
                                    <div className="alert alert-danger text-right" style={{ direction: 'rtl' }}>
                                        <i className="fa fa-exclamation-triangle mr-2"></i> {error}
                                    </div>
                                )}
                                
                                {step === 0 && renderTypeSelection()}
                                {step === 1 && renderBeneficiaryStep1()}
                                {step === 2 && renderBeneficiaryStep2()}
                                {step === 3 && renderBeneficiaryStep3()}
                                {step === 4 && renderBeneficiaryStep4()}
                                {step === 5 && renderVolunteerForm()}
                                
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <style>{`
                .label-right {
                    display: block;
                    text-align: right;
                    direction: rtl;
                    font-weight: 600;
                    margin-bottom: 5px;
                }
                .text-danger-star {
                    color: #ef4444 !important;
                    font-weight: bold;
                    margin-right: 3px;
                }
            `}</style>
        </div>
    );
};

export default Register;