import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../api';
import PageBanner from '../../components/PageBanner';

const Register = () => {
    const navigate = useNavigate();
    // 0: الاختيار، 1-4: الأسرة، 5: المتطوع، 6: المتدرب منفصل
    const [step, setStep] = useState(0); 
    const [accountType, setAccountType] = useState('');
    const [regData, setRegData] = useState({ specialites: [], regions: [] });
    
    const [formData, setFormData] = useState({
        // حقول مشتركة وحقول الأسرة ومتطوع
        nom_tuteur: '', prenom_tuteur: '', CIN: '', adresse: '', region_id: '',
        email_tuteur: '', telephon: '', whatsapp: '', nom_utilisateur: '', mot_de_pass: '',
        nom_enfant: '', prenom_enfant: '', date_naissance: '', sexeEnfant: '',
        statut: '', parole: '', avs: '', etude: '', type_Tuteur: '', formation: '',
        doctor: [], professional_field: '', interests: [],

        // حقول المتدرب (Stagiaire) الخاصة والجديدة تماماً
        nom_stagiaire: '', prenom_stagiaire: '',
        etablissement: '', specialite_stage: '', niveau_etude: '', duree_stage: ''
    });
    
    const [photo, setPhoto] = useState(null); 
    const [error, setError] = useState('');

    useEffect(() => {
        api.get('/registration-data').then(res => setRegData(res.data));
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleInterestChange = (e) => {
        const { value, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            interests: checked ? [...prev.interests, value] : prev.interests.filter(i => i !== value)
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const data = new FormData();

        // ─── الحالة الأولى: إذا كان الحساب طلب تدريب (Stagiaire) مستقل ───
        if (accountType === 'stagiaire') {
            data.append('nom_stagiaire', formData.nom_stagiaire);
            data.append('prenom_stagiaire', formData.prenom_stagiaire);
            data.append('cin', formData.CIN);
            data.append('email', formData.email_tuteur);
            data.append('telephone', formData.telephon);
            data.append('region_id', formData.region_id);
            data.append('etablissement', formData.etablissement);
            data.append('specialite', formData.specialite_stage);
            data.append('niveau_etude', formData.niveau_etude);
            data.append('duree_stage', formData.duree_stage);
            data.append('nom_utilisateur', formData.nom_utilisateur);
            data.append('mot_de_pass', formData.mot_de_pass);
            if (photo) data.append('photo', photo); // السيرة الذاتية

            try {
                // إرسال إلى مسار المتدربين الجديد بالباكيند
                await api.post('/register-stagiaire', data, {
                    headers: { 'Content-Type': 'multipart/form-data' }
                });
                navigate('/se_connecter');
            } catch (err) {
                setError('خطأ في تسجيل طلب التدريب. يرجى التحقق من الحقول.');
            }
            return; // إيقاف تنفيذ الكود هنا
        }

        // ─── الحالة الثانية: التسجيل القديم المعتاد (أسرة أو متطوع) ───
        data.append('account_type', accountType);
        Object.keys(formData).forEach(key => {
            if (key === 'doctor' || key === 'interests') {
                formData[key].forEach(val => data.append(`${key}[]`, val));
            } else if (!['nom_stagiaire', 'prenom_stagiaire', 'etablissement', 'specialite_stage', 'niveau_etude', 'duree_stage'].includes(key)) {
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
            setError('خطأ في التسجيل. يرجى التأكد من جميع المعلومات.');
        }
    };

    const renderTypeSelection = () => (
        <div className="your-submit-message">
            <h4 className="eco_sm_titles">اختر نوع الحساب المراد إنشاؤه</h4>
            <div className="row text-center mt-4">
                <div className="col-md-4 mb-3">
                    <button className="btn btn-outline-info w-100 p-4" onClick={() => { setAccountType('beneficiary'); setStep(1); }}>
                        <i className="fa fa-users fa-2x mb-2"></i><br/>
                        حساب أسرة مستفيدة
                    </button>
                </div>
                <div className="col-md-4 mb-3">
                    <button className="btn btn-outline-success w-100 p-4" onClick={() => { setAccountType('volunteer'); setStep(5); }}>
                        <i className="fa fa-heart fa-2x mb-2"></i><br/>
                        حساب مهتم/متطوع/داعم
                    </button>
                </div>
                <div className="col-md-4 mb-3">
                    {/* 👈 تم تعديل الزر هنا ليقوم بالتوجه المباشر لصفحة التقديم على التدريب الخاصة بك */}
                    <button className="btn btn-outline-warning w-100 p-4" onClick={() => navigate('/centre/devenir-stagiaire')}>
                        <i className="fa fa-graduation-cap fa-2x mb-2"></i><br/>
                        طلب تدريب (Stagiaire)
                    </button>
                </div>
            </div>
        </div>
    );

    /* ─── خطوات الأسرة المستفيدة (1-4) ─── */
    const renderBeneficiaryStep1 = () => (
        <div className="your-submit-message">
            <h4 className="eco_sm_titles">الخطوة 1: معلومات شخصية عن الطفل</h4>
            <div className="row">
                <div className="form-group col-md-6">
                    <input className="form-control" name="nom_enfant" placeholder="الاسم العائلي للطفل" value={formData.nom_enfant} onChange={handleChange} required />
                </div>
                <div className="form-group col-md-6">
                    <input className="form-control" name="prenom_enfant" placeholder="الاسم الشخصي للطفل" value={formData.prenom_enfant} onChange={handleChange} required />
                </div>
                <div className="form-group col-md-6">
                    <p className="droite">تاريخ الازدياد :</p>
                    <input className="form-control" name="date_naissance" type="date" value={formData.date_naissance} onChange={handleChange} required />
                </div>
                <div className="form-group col-md-6">
                    <p className="droite">حمل صورة للطفل :</p>
                    <input className="form-control-file" type="file" onChange={(e) => setPhoto(e.target.files[0])} />
                </div>
                <div className="form-group col-md-12">
                    <p className="droite">الجنس :</p>
                    <label className="mr-3"><input type="radio" name="sexeEnfant" value="1" checked={formData.sexeEnfant === '1'} onChange={handleChange} /> أنثى</label>
                    <label><input type="radio" name="sexeEnfant" value="2" checked={formData.sexeEnfant === '2'} onChange={handleChange} /> ذكر</label>
                </div>
            </div>
            <div className="text-left mt-3">
                <button className="btn-small xsmall-btn mr-2" onClick={() => setStep(0)}>السابق</button>
                <button className="btn-small xsmall-btn" onClick={() => setStep(2)}>التالي</button>
            </div>
        </div>
    );

    const renderBeneficiaryStep2 = () => (
        <div className="your-submit-message">
            <h4 className="eco_sm_titles">الخطوة 2: وضعية الطفل</h4>
            <div className="row">
                <div className="form-group col-md-6">
                    <select className="form-control" name="statut" value={formData.statut} onChange={handleChange} required>
                        <option value="">- اختر حالة الطفل -</option>
                        <option value="1">توحد خفيف</option>
                        <option value="2">توحد متوسط</option>
                        <option value="3">توحد شديد</option>
                    </select>
                </div>
                <div className="form-group col-md-6">
                    <select className="form-control" name="parole" value={formData.parole} onChange={handleChange} required>
                        <option value="">- اختر كلام الطفل -</option>
                        <option value="1">غير متكلم</option>
                        <option value="2">يصدر بعض الأصوات</option>
                        <option value="3">يتكلم بعض الكلمات</option>
                        <option value="4">يتكلم</option>
                    </select>
                </div>
                <div className="form-group col-md-12">
                    <p className="droite">التخصصات الطبية المتابعة :</p>
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
                <button className="btn-small xsmall-btn" onClick={() => setStep(3)}>التالي</button>
            </div>
        </div>
    );

    const renderBeneficiaryStep3 = () => (
        <div className="your-submit-message">
            <h4 className="eco_sm_titles">الخطوة 3: معلومات ولي الأمر</h4>
            <div className="row">
                <div className="form-group col-md-6">
                    <input className="form-control" name="nom_tuteur" placeholder="الاسم العائلي" value={formData.nom_tuteur} onChange={handleChange} required />
                </div>
                <div className="form-group col-md-6">
                    <input className="form-control" name="prenom_tuteur" placeholder="الاسم الشخصي" value={formData.prenom_tuteur} onChange={handleChange} required />
                </div>
                <div className="form-group col-md-6">
                    <input className="form-control" name="CIN" placeholder="رقم البطاقة الوطنية" value={formData.CIN} onChange={handleChange} required />
                </div>
                <div className="form-group col-md-6">
                    <input className="form-control" name="email_tuteur" placeholder="البريد الإلكتروني" type="email" value={formData.email_tuteur} onChange={handleChange} required />
                </div>
                <div className="form-group col-md-6">
                    <select className="form-control" name="region_id" value={formData.region_id} onChange={handleChange} required>
                        <option value="">- اختر المنطقة -</option>
                        {regData.regions.map(r => <option key={r.id} value={r.id}>{r.nom_region}</option>)}
                    </select>
                </div>
                <div className="form-group col-md-6">
                    <input className="form-control" name="telephon" placeholder="رقم الهاتف" value={formData.telephon} onChange={handleChange} required />
                </div>
            </div>
            <div className="text-left mt-3">
                <button className="btn-small xsmall-btn mr-2" onClick={() => setStep(2)}>السابق</button>
                <button className="btn-small xsmall-btn" onClick={() => setStep(4)}>التالي</button>
            </div>
        </div>
    );

    const renderBeneficiaryStep4 = () => (
        <div className="your-submit-message">
            <h4 className="eco_sm_titles">الخطوة 4: إنشاء الحساب</h4>
            <div className="row">
                <div className="form-group col-md-6">
                    <input className="form-control" name="nom_utilisateur" placeholder="اسم المستخدم" value={formData.nom_utilisateur} onChange={handleChange} required />
                </div>
                <div className="form-group col-md-6">
                    <input className="form-control" name="mot_de_pass" placeholder="كلمة السر" type="password" value={formData.mot_de_pass} onChange={handleChange} required />
                </div>
            </div>
            <div className="text-left mt-3">
                <button className="btn-small xsmall-btn mr-2" onClick={() => setStep(3)}>السابق</button>
                <button className="btn-small xsmall-btn" onClick={handleSubmit}>تأكيد التسجيل</button>
            </div>
        </div>
    );

    /* ─── استمارة المتطوع (الخطوة 5) ─── */
    const renderVolunteerForm = () => (
        <div className="your-submit-message">
            <h4 className="eco_sm_titles">حساب مهتم / متطوع / داعم</h4>
            <div className="row">
                <div className="form-group col-md-6">
                    <input className="form-control" name="nom_tuteur" placeholder="الاسم العائلي" value={formData.nom_tuteur} onChange={handleChange} required />
                </div>
                <div className="form-group col-md-6">
                    <input className="form-control" name="prenom_tuteur" placeholder="الاسم الشخصي" value={formData.prenom_tuteur} onChange={handleChange} required />
                </div>
                <div className="form-group col-md-6">
                    <input className="form-control" name="email_tuteur" placeholder="البريد الإلكتروني" type="email" value={formData.email_tuteur} onChange={handleChange} required />
                </div>
                <div className="form-group col-md-6">
                    <select className="form-control" name="region_id" value={formData.region_id} onChange={handleChange} required>
                        <option value="">- اختر المدينة -</option>
                        {regData.regions.map(r => <option key={r.id} value={r.id}>{r.nom_region}</option>)}
                    </select>
                </div>
                <div className="form-group col-md-6">
                    <select className="form-control" name="professional_field" value={formData.professional_field} onChange={handleChange} required>
                        <option value="">- المجال المهني -</option>
                        <option value="طالب">طالب</option>
                        <option value="أخصائي">أخصائي</option>
                        <option value="متطوع">متطوع</option>
                        <option value="باحث">باحث</option>
                        <option value="مهتم">مهتم</option>
                    </select>
                </div>
                <div className="form-group col-md-12">
                    <p className="droite">مجالات الاهتمام :</p>
                    <div className="row">
                        {['التوعية', 'التربية', 'التكوين', 'التطوع', 'الدعم الرقمي', 'التبرع'].map(i => (
                            <div key={i} className="col-md-4">
                                <label><input type="checkbox" value={i} onChange={handleInterestChange} /> {i}</label>
                            </div>
                        ))}
                    </div>
                </div>
                <div className="form-group col-md-6">
                    <input className="form-control" name="nom_utilisateur" placeholder="اسم المستخدم" value={formData.nom_utilisateur} onChange={handleChange} required />
                </div>
                <div className="form-group col-md-6">
                    <input className="form-control" name="mot_de_pass" placeholder="كلمة السر" type="password" value={formData.mot_de_pass} onChange={handleChange} required />
                </div>
            </div>
            <div className="text-left mt-3">
                <button className="btn-small xsmall-btn mr-2" onClick={() => setStep(0)}>السابق</button>
                <button className="btn-small xsmall-btn" onClick={handleSubmit}>تأكيد التسجيل</button>
            </div>
        </div>
    );

    return (
        <div className="content">
            <PageBanner />

            <section>
                <div className="container">
                    <div className="eco_contact_form">
                        <div className="row">
                            <div className="col-md-10 offset-md-2 no-padding col-sm-12 responsive-991-width">
                                {error && <div className="alert alert-danger">{error}</div>}
                                
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
        </div>
    );
};

export default Register;