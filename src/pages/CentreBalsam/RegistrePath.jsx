import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../api';
import PageBanner from "../../components/PageBanner.jsx";

export default function RegisterPath() {
    const navigate = useNavigate();
    const [step, setStep] = useState(1); // يبدأ مباشرة من الخطوة 1 لحساب الأسرة
    const [regData, setRegData] = useState({ specialites: [], regions: [] });
    const [formData, setFormData] = useState({
        nom_tuteur: '', prenom_tuteur: '', CIN: '', adresse: '', region_id: '',
        email_tuteur: '', telephon: '', whatsapp: '', nom_utilisateur: '', mot_de_pass: '',
        nom_enfant: '', prenom_enfant: '', date_naissance: '', sexeEnfant: '',
        statut: '', parole: '', avs: '', etude: '', type_Tuteur: '', formation: '',
        doctor: []
    });
    const [photo, setPhoto] = useState(null);
    const [error, setError] = useState('');

    useEffect(() => {
        api.get('/registration-data')
           .then(res => setRegData(res.data))
           .catch(err => console.log("خطأ في جلب بيانات التخصصات والمناطق:", err));
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const data = new FormData();
        data.append('account_type', 'beneficiary'); // الحساب دائماً أسرة مستفيدة
        Object.keys(formData).forEach(key => {
            if (key === 'doctor') {
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
            setError('خطأ في التسجيل. يرجى التأكد من جميع المعلومات الصحيحة.');
        }
    };

    /* ── واجهات خطوات الاستمارة المحسنة والمباشرة ── */
    const renderBeneficiaryStep1 = () => (
        <div className="form-card-step animate-fade">
            <h4 className="step-inner-title">👶 الخطوة ١: معلومات شخصية عن الطفل</h4>
            <div className="inputs-grid">
                <div className="form-group">
                    <label>الاسم العائلي للطفل *</label>
                    <input className="form-control" name="nom_enfant" placeholder="مثال: العلمي" value={formData.nom_enfant} onChange={handleChange} required />
                </div>
                <div className="form-group">
                    <label>الاسم الشخصي للطفل *</label>
                    <input className="form-control" name="prenom_enfant" placeholder="مثال: يوسف" value={formData.prenom_enfant} onChange={handleChange} required />
                </div>
                <div className="form-group">
                    <label>تاريخ الازدياد *</label>
                    <input className="form-control" name="date_naissance" type="date" value={formData.date_naissance} onChange={handleChange} required />
                </div>
                <div className="form-group">
                    <label>تحميل صورة الطفل</label>
                    <input className="form-control-file" type="file" onChange={(e) => setPhoto(e.target.files[0])} />
                </div>
                <div className="form-group full-width">
                    <label style={{ display: 'block', marginBottom: '10px' }}>الجنس *</label>
                    <div className="radio-group">
                        <label className="radio-label"><input type="radio" name="sexeEnfant" value="1" checked={formData.sexeEnfant === '1'} onChange={handleChange} /> أنثى</label>
                        <label className="radio-label"><input type="radio" name="sexeEnfant" value="2" checked={formData.sexeEnfant === '2'} onChange={handleChange} /> ذكر</label>
                    </div>
                </div>
            </div>
            <div className="step-buttons-action">
                <div /> {/* مساحة فارغة للحفاظ على التوازن */}
                <button type="button" className="btn-next" onClick={() => setStep(2)}>التالي (وضعية الطفل) ⬅</button>
            </div>
        </div>
    );

    const renderBeneficiaryStep2 = () => (
        <div className="form-card-step animate-fade">
            <h4 className="step-inner-title">📊 الخطوة ٢: وضعية الطفل الصحية والتطورية</h4>
            <div className="inputs-grid">
                <div className="form-group">
                    <label>درجة حالة الطفل الحالية *</label>
                    <select className="form-control" name="statut" value={formData.statut} onChange={handleChange} required>
                        <option value="">- اختر حالة الطفل -</option>
                        <option value="1">توحد خفيف</option>
                        <option value="2">توحد متوسط</option>
                        <option value="3">توحد شديد</option>
                    </select>
                </div>
                <div className="form-group">
                    <label>مستوى النطق والكلام *</label>
                    <select className="form-control" name="parole" value={formData.parole} onChange={handleChange} required>
                        <option value="">- اختر كلام الطفل -</option>
                        <option value="1">غير متكلم</option>
                        <option value="2">يصدر بعض الأصوات</option>
                        <option value="3">يتكلم بعض الكلمات</option>
                        <option value="4">يتكلم</option>
                    </select>
                </div>
                <div className="form-group full-width">
                    <label style={{ marginBottom: '12px', display: 'block' }}>التخصصات الطبية المتابعة حالياً:</label>
                    <div className="checkbox-grid">
                        {regData.specialites && regData.specialites.map(s => (
                            <label key={s.id} className="checkbox-label">
                                <input type="checkbox" value={s.id} checked={formData.doctor.includes(s.id.toString())} onChange={(e) => {
                                    const val = e.target.value;
                                    const checked = e.target.checked;
                                    setFormData(prev => ({
                                        ...prev,
                                        doctor: checked ? [...prev.doctor, val] : prev.doctor.filter(d => d !== val)
                                    }));
                                }} /> {s.specialite}
                            </label>
                        ))}
                    </div>
                </div>
            </div>
            <div className="step-buttons-action">
                <button type="button" className="btn-back" onClick={() => setStep(1)}>السابق</button>
                <button type="button" className="btn-next" onClick={() => setStep(3)}>التالي (معلومات الولي) ⬅</button>
            </div>
        </div>
    );

    const renderBeneficiaryStep3 = () => (
        <div className="form-card-step animate-fade">
            <h4 className="step-inner-title">👨‍👩‍👦‍👦 الخطوة ٣: معلومات ولي الأمر / التوتير</h4>
            <div className="inputs-grid">
                <div className="form-group">
                    <label>الاسم العائلي لولي الأمر *</label>
                    <input className="form-control" name="nom_tuteur" placeholder="الاسم العائلي" value={formData.nom_tuteur} onChange={handleChange} required />
                </div>
                <div className="form-group">
                    <label>الاسم الشخصي لولي الأمر *</label>
                    <input className="form-control" name="prenom_tuteur" placeholder="الاسم الشخصي" value={formData.prenom_tuteur} onChange={handleChange} required />
                </div>
                <div className="form-group">
                    <label>رقم البطاقة الوطنية (CIN) *</label>
                    <input className="form-control" name="CIN" placeholder="مثال: AB123456" value={formData.CIN} onChange={handleChange} required />
                </div>
                <div className="form-group">
                    <label>البريد الإلكتروني للتواصل *</label>
                    <input className="form-control" name="email_tuteur" placeholder="name@example.com" type="email" value={formData.email_tuteur} onChange={handleChange} required />
                </div>
                <div className="form-group">
                    <label>المنطقة / الجهة التابع لها *</label>
                    <select className="form-control" name="region_id" value={formData.region_id} onChange={handleChange} required>
                        <option value="">- اختر المنطقة -</option>
                        {regData.regions && regData.regions.map(r => <option key={r.id} value={r.id}>{r.nom_region}</option>)}
                    </select>
                </div>
                <div className="form-group">
                    <label>رقم الهاتف المحمول *</label>
                    <input className="form-control" name="telephon" placeholder="0600000000" value={formData.telephon} onChange={handleChange} required />
                </div>
            </div>
            <div className="step-buttons-action">
                <button type="button" className="btn-back" onClick={() => setStep(2)}>السابق</button>
                <button type="button" className="btn-next" onClick={() => setStep(4)}>التالي (بيانات الحساب) ⬅</button>
            </div>
        </div>
    );

    const renderBeneficiaryStep4 = () => (
        <div className="form-card-step animate-fade">
            <h4 className="step-inner-title">🔐 الخطوة ٤: إنشاء بيانات الحساب الإلكتروني</h4>
            <div className="inputs-grid">
                <div className="form-group">
                    <label>اسم المستخدم (تُسجل به الدخول للموقع مستقبلاً) *</label>
                    <input className="form-control" name="nom_utilisateur" placeholder="اسم المستخدم بالإنجليزية مثلاً" value={formData.nom_utilisateur} onChange={handleChange} required />
                </div>
                <div className="form-group">
                    <label>كلمة السر الخاصة بالحساب *</label>
                    <input className="form-control" name="mot_de_pass" placeholder="اكتب كلمة سر قوية" type="password" value={formData.mot_de_pass} onChange={handleChange} required />
                </div>
            </div>
            <div className="step-buttons-action">
                <button type="button" className="btn-back" onClick={() => setStep(3)}>السابق</button>
                <button type="submit" className="btn-submit-final">تأكيد وإرسال طلب التسجيل بالمركز 💾</button>
            </div>
        </div>
    );

    return (
        <>
            <PageBanner title="التسجيل والالتحاق بالمركز" />
        <div style={{ direction: 'rtl', fontFamily: 'Segoe UI, Arial, sans-serif', textAlign: 'right' }}>
            <style>{`
                /* ── الـ Variables الأساسية للموقع ── */
                :root {
                    --pink:    #f05074;
                    --pink2:   #ff7e5f;
                    --dark:    #1a1a2e;
                    --gray:    #f7f8fc; 
                    --border:  #ececec;
                    --text:    #333;
                    --muted:   #666;
                }

                /* ── Hero القسم الأول بخلفية متميزة ── */
                .reg-hero {
                    background: var(--gray);
                    color: var(--dark);
                    padding: 80px 0 50px;
                    text-align: center;
                    border-bottom: 1px solid var(--border);
                }
                .reg-hero h1 {
                    font-size: 38px;
                    font-weight: 700;
                    margin: 0 0 14px;
                }
                .reg-hero h1 span { color: var(--pink); }
                .reg-hero p {
                    font-size: 17px;
                    color: var(--muted);
                    max-width: 700px;
                    line-height: 1.8;
                    margin: 0 auto;
                }
                .reg-badge {
                    display: inline-block;
                    background: white;
                    border: 1px solid rgba(240,80,116,0.2);
                    color: var(--pink);
                    font-size: 13px;
                    padding: 6px 18px;
                    border-radius: 50px;
                    margin-bottom: 16px;
                    font-weight: 600;
                }

                /* ── Layout Container ── */
                .reg-container {
                    max-width: 1100px;
                    margin: 0 auto;
                    padding: 50px 24px 0;
                }

                /* ── الشروط والوثائق ── */
                .info-grid {
                    display: grid;
                    grid-template-columns: 1fr 1fr;
                    gap: 32px;
                    margin-bottom: 60px;
                }
                .info-card {
                    background: white;
                    border: 1px solid var(--border);
                    border-radius: 20px;
                    padding: 30px;
                    box-shadow: 0 4px 20px rgba(0,0,0,0.02);
                }
                .card-title-box {
                    display: flex;
                    align-items: center;
                    gap: 12px;
                    margin-bottom: 20px;
                }
                .card-icon { font-size: 28px; }
                .card-title-box h3 {
                    font-size: 22px;
                    font-weight: 700;
                    color: var(--dark);
                    margin: 0;
                }
                .custom-list { list-style: none; padding: 0; margin: 0; }
                .custom-list li {
                    position: relative;
                    padding-right: 28px;
                    margin-bottom: 14px;
                    font-size: 15px;
                    color: #444;
                    line-height: 1.7;
                }
                .custom-list li::before {
                    content: '✓';
                    position: absolute;
                    right: 0; top: 0;
                    color: var(--pink);
                    font-weight: 700;
                }

                /* ── شريط المتابعة العلوي المطور (Steps Indicator) ── */
                .steps-indicator-bar {
                    display: flex;
                    justify-content: space-between;
                    background: rgba(255, 255, 255, 0.08);
                    padding: 15px 20px;
                    border-radius: 14px;
                    margin-bottom: 30px;
                    border: 1px solid rgba(255, 255, 255, 0.1);
                }
                .ind-step {
                    font-size: 14px;
                    color: rgba(255, 255, 255, 0.5);
                    font-weight: 600;
                    display: flex;
                    align-items: center;
                    gap: 8px;
                }
                .ind-step.active {
                    color: #ffffff !important;
                    text-shadow: 0 0 10px rgba(255,255,255,0.2);
                }
                .ind-step.active .ind-num {
                    background: var(--pink);
                    color: white;
                }
                .ind-num {
                    width: 26px; height: 26px;
                    background: rgba(255,255,255,0.15);
                    color: rgba(255,255,255,0.7);
                    border-radius: 50%;
                    display: flex; align-items: center; justify-content: center;
                    font-size: 12px;
                }

                /* ── البوكس المطور الجديد والتعديل المطلوب للكتابة والفوتر ── */
                .form-interactive-section {
                    background: linear-gradient(135deg, #1e3c72, #2a5298); /* نفس اللون المريح للعين والجاذب */
                    border-radius: 24px;
                    padding: 45px 40px;
                    box-shadow: 0 15px 35px rgba(30, 60, 114, 0.18);
                    border: 1px solid rgba(255, 255, 255, 0.12);
                    margin-bottom: 110px; /* مسافة أمان ممتازة وضخمة لمنع الاشتباك مع الفوتر */
                }
                .form-interactive-section h2 {
                    font-size: 26px;
                    font-weight: 700;
                    color: #ffffff !important; /* لون أبيض ناصع ثابت */
                    text-align: center;
                    margin: 0 0 10px;
                }
                .form-interactive-section p.subtitle {
                    text-align: center;
                    color: #ffffff !important; /* لون أبيض ناصع ثابت */
                    opacity: 0.9;
                    font-size: 15px;
                    margin-bottom: 35px;
                }

                /* كارت الخطوة الداخلي (تصميم جديد بخلفية فاتحة مريحة للقراءة) */
                .form-card-step {
                    background: #ffffff;
                    border-radius: 18px;
                    padding: 35px 30px;
                    box-shadow: 0 4px 15px rgba(0,0,0,0.05);
                }
                .step-inner-title {
                    font-size: 18px;
                    font-weight: 700;
                    color: var(--dark) !important;
                    margin-bottom: 24px;
                    border-bottom: 2px solid var(--gray);
                    padding-bottom: 14px;
                }

                /* شبكة المدخلات والـ Inputs بلون داكن سهل القراءة ومريح */
                .inputs-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; }
                .form-group { display: flex; flex-direction: column; gap: 8px; margin-bottom: 16px; }
                .form-group.full-width { grid-column: 1 / -1; }
                .form-group label { font-size: 14px; font-weight: 600; color: var(--dark) !important; }
                
                .form-control, .form-control-file {
                    background: #ffffff !important;
                    border: 1px solid #ced4da !important;
                    border-radius: 10px !important;
                    padding: 12px 16px !important;
                    color: var(--text) !important;
                    font-size: 15px !important;
                }
                .form-control:focus {
                    border-color: var(--pink) !important;
                    box-shadow: 0 0 0 3px rgba(240,80,116,0.1) !important;
                    outline: none;
                }
                .form-control::placeholder { color: #999 !important; }

                /* المجموعات الخاصة بالراديو والـ Checkbox */
                .radio-group { display: flex; gap: 20px; padding: 5px 0; }
                .radio-label, .checkbox-label { color: var(--text) !important; font-size: 15px; cursor: pointer; display: flex; align-items: center; gap: 8px; }
                .checkbox-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(180px, 1fr)); gap: 12px; background: var(--gray); padding: 16px; border-radius: 12px; }

                /* أزرار التحكم والتنقل */
                .step-buttons-action { display: flex; justify-content: space-between; margin-top: 30px; border-top: 1px solid var(--gray); padding-top: 20px; }
                .btn-next, .btn-submit-final {
                    background: linear-gradient(90deg, var(--pink), var(--pink2));
                    color: white; border: none; border-radius: 10px; padding: 12px 30px; font-size: 15px; font-weight: 700; cursor: pointer;
                    transition: transform 0.2s;
                }
                .btn-back {
                    background: var(--gray);
                    color: var(--dark); border: 1px solid var(--border); border-radius: 10px; padding: 12px 30px; font-size: 15px; cursor: pointer;
                }
                .btn-next:hover, .btn-submit-final:hover { transform: translateY(-1px); opacity: 0.95; }

                /* انيميشن انتقال ناعم */
                .animate-fade { animation: fadeIn 0.4s ease-in-out; }
                @keyframes fadeIn { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: translateY(0); } }

                @media (max-width: 768px) {
                    .info-grid, .inputs-grid, .steps-indicator-bar { grid-template-columns: 1fr; gap: 12px; }
                    .form-interactive-section { padding: 30px 20px; margin-bottom: 60px; }
                    .reg-hero h1 { font-size: 28px; }
                }
            `}</style>

            {/* ── 1. الهيرو (القسم الأول المميز للموقع) ── */}
            <section className="reg-hero">
                <div className="reg-badge">بوابة التسجيل والالتحاق</div>
                <h1>شروط ومراحل الانضمام لـ<span>مركز بلسم</span></h1>
                <p>
                    نحن هنا لتسهيل عملية دمج وتأهيل طفلك. يرجى الاطلاع على المتطلبات، ثم يمكنك البدء في ملء بيانات الأسرة بالأسفل مباشرة.
                </p>
            </section>

            <div className="reg-container">
                
                {/* ── 2. شروط الاستفادة والوثائق المطلوبة ── */}
                <section className="info-grid">
                    <div className="info-card">
                        <div className="card-title-box">
                            <span className="card-icon">📋</span>
                            <h3>شروط الاستفادة</h3>
                        </div>
                        <ul className="custom-list">
                            <li>أن يكون الطفل مشخّصاً باضطراب طيف التوحد (أو لديه تقرير طبي مبدئي).</li>
                            <li>الالتزام التام من طرف أولياء الأمور بحضور المقابلات والتوجيهات الدورية.</li>
                            <li>أن يتناسب عمر الطفل مع الفئات والبرامج المتوفرة داخل فضاءات المركز.</li>
                            <li>الموافقة على بنود النظام الداخلي الخاص بالتكفل داخل مركز بلسم.</li>
                        </ul>
                    </div>

                    <div className="info-card">
                        <div className="card-title-box">
                            <span className="card-icon">📂</span>
                            <h3>الوثائق المطلوبة</h3>
                        </div>
                        <ul className="custom-list">
                            <li>نسخة من التقرير الطبي أو النفسي الحركي المعتمد للطفل.</li>
                            <li>نسخة من بطاقة التعريف الوطنية للأب أو الولي، وعقد الازدياد للطفل.</li>
                            <li>صورتان شمسيتان حديثتان للطفل.</li>
                            <li>ملف طبي فرعي يوضح الحصيلة الصحية العامة للطفل (حساسية أو أدوية).</li>
                        </ul>
                    </div>
                </section>

                {/* ── 3. استمارة التسجيل الإلكترونية المباشرة والمحسنة ── */}
                <section className="form-interactive-section">
                    <h2>📝 حساب أسرة مستفيدة جديدة</h2>
                    <p className="subtitle">يرجى ملء بيانات طفلكم والأسرة لتسجيل الحساب وإرسال طلب الالتحاق المباشر لقاعدة بيانات المركز.</p>

                    {/* شريط المتابعة التفاعلي الجديد في الأعلى */}
                    <div className="steps-indicator-bar">
                        <div className={`ind-step ${step === 1 ? 'active' : ''}`}><span className="ind-num">١</span> معلومات الطفل</div>
                        <div className={`ind-step ${step === 2 ? 'active' : ''}`}><span className="ind-num">٢</span> الوضعية الصحية</div>
                        <div className={`ind-step ${step === 3 ? 'active' : ''}`}><span className="ind-num">٣</span> معلومات ولي الأمر</div>
                        <div className={`ind-step ${step === 4 ? 'active' : ''}`}><span className="ind-num">٤</span> بيانات الحساب</div>
                    </div>

                    <form onSubmit={handleSubmit}>
                        {error && <div className="alert alert-danger" style={{ background: '#e74c3c', color: 'white', padding: '12px', borderRadius: '8px', marginBottom: '20px', fontSize: '15px', fontWeight: 'bold' }}>{error}</div>}
                        
                        {step === 1 && renderBeneficiaryStep1()}
                        {step === 2 && renderBeneficiaryStep2()}
                        {step === 3 && renderBeneficiaryStep3()}
                        {step === 4 && renderBeneficiaryStep4()}
                    </form>
                </section>

            </div>
        </div>
        </>
    );
}