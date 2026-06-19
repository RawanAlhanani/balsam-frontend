import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import PageBanner from "../../components/PageBanner";
import api from "../../api";

const DevenirBenevole = () => {
    const navigate = useNavigate();
    const [regData, setRegData] = useState({ regions: [] });
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    
    const [formData, setFormData] = useState({
        nom_tuteur: '',
        prenom_tuteur: '',
        email_tuteur: '',
        region_id: '',
        professional_field: '',
        interests: [],
        nom_utilisateur: '',
        mot_de_pass: ''
    });

    useEffect(() => {
        api.get('/registration-data')
            .then(res => setRegData(res.data))
            .catch(err => console.error("خطأ في جلب البيانات", err));
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleInterestChange = (e) => {
        const { value, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            interests: checked 
                ? [...prev.interests, value] 
                : prev.interests.filter(i => i !== value)
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        
        const data = new FormData();
        data.append('account_type', 'volunteer');
        
        Object.keys(formData).forEach(key => {
            if (key === 'interests') {
                formData[key].forEach(val => data.append(`${key}[]`, val));
            } else {
                data.append(key, formData[key]);
            }
        });

        try {
            // 👈 تم التعديل هنا ليرسل الطلب مباشرة لجدول المتطوعين الجديد
            await api.post('/register-volunteer', data, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            setSuccess('تم تسجيلك كمتطوع بنجاح! يتم توجيهك لصفحة تسجيل الدخول...');
            setTimeout(() => {
                navigate('/se_connecter');
            }, 2000);
        } catch (err) {
            setError('خطأ في التسجيل. يرجى التأكد من ملء جميع الحقول المطلوبة بشكل صحيح.');
        }
    };

    return (
        <div className="content">
            <PageBanner />

            <section className="mt-5 mb-5">
                <div className="container">
                    <div className="eco_contact_form">
                        <div className="row">
                            <div className="col-md-8 offset-md-2 col-sm-12">
                                
                                {/* ─── إطار الاستمارة المطور ─── */}
                                <div className="card border-0 shadow-sm" style={{ borderRadius: '15px', overflow: 'hidden', backgroundColor: '#ffffff' }}>
                                    
                                    {/* شريط جمالي علوي بلون التطوع الأخضر */}
                                    <div style={{ height: '6px', backgroundColor: '#28a745' }}></div>
                                    
                                    <div className="card-body p-5">
                                        <h3 className="eco_sm_titles text-center mb-4" style={{ color: '#28a745', fontWeight: 'bold' }}>
                                            <i className="fa fa-heart mr-2"></i> طلب الانضمام كمتطوع / داعم
                                        </h3>
                                        <p className="text-center text-muted mb-4" style={{ fontSize: '14px' }}>يسعدنا انضمامك إلينا، يرجى ملء البيانات التالية لتسجيل حسابك</p>
                                        
                                        {error && <div className="alert alert-danger text-right shadow-sm border-0" style={{ borderRadius: '8px' }}>{error}</div>}
                                        {success && <div className="alert alert-success text-right shadow-sm border-0" style={{ borderRadius: '8px' }}>{success}</div>}

                                        <form onSubmit={handleSubmit}>
                                            <div className="row text-right" dir="rtl">
                                                <div className="form-group col-md-6 mb-3">
                                                    <label className="float-right mb-1 font-weight-bold" style={{ color: '#495057' }}>الاسم العائلي :</label>
                                                    <input className="form-control" style={{ borderRadius: '8px', padding: '10px' }} name="nom_tuteur" placeholder="الاسم العائلي" value={formData.nom_tuteur} onChange={handleChange} required />
                                                </div>
                                                <div className="form-group col-md-6 mb-3">
                                                    <label className="float-right mb-1 font-weight-bold" style={{ color: '#495057' }}>الاسم الشخصي :</label>
                                                    <input className="form-control" style={{ borderRadius: '8px', padding: '10px' }} name="prenom_tuteur" placeholder="الاسم الشخصي" value={formData.prenom_tuteur} onChange={handleChange} required />
                                                </div>
                                                <div className="form-group col-md-6 mb-3">
                                                    <label className="float-right mb-1 font-weight-bold" style={{ color: '#495057' }}>البريد الإلكتروني :</label>
                                                    <input className="form-control" style={{ borderRadius: '8px', padding: '10px' }} name="email_tuteur" placeholder="example@email.com" type="email" value={formData.email_tuteur} onChange={handleChange} required />
                                                </div>
                                                <div className="form-group col-md-6 mb-3">
                                                    <label className="float-right mb-1 font-weight-bold" style={{ color: '#495057' }}>المدينة / المنطقة :</label>
                                                    <select className="form-control" style={{ borderRadius: '8px', height: 'auto', padding: '10px' }} name="region_id" value={formData.region_id} onChange={handleChange} required>
                                                        <option value="">- اختر المدينة -</option>
                                                        {regData.regions && regData.regions.map(r => (
                                                            <option key={r.id} value={r.id}>{r.nom_region}</option>
                                                        ))}
                                                    </select>
                                                </div>
                                                <div className="form-group col-md-12 mb-4">
                                                    <label className="float-right mb-1 font-weight-bold" style={{ color: '#495057' }}>المجال المهني :</label>
                                                    <select className="form-control" style={{ borderRadius: '8px', height: 'auto', padding: '10px' }} name="professional_field" value={formData.professional_field} onChange={handleChange} required>
                                                        <option value="">- اختر مجال تخصصك -</option>
                                                        <option value="طالب">طالب</option>
                                                        <option value="أخصائي">أخصائي</option>
                                                        <option value="متطوع">متطوع</option>
                                                        <option value="باحث">باحث</option>
                                                        <option value="مهتم">مهتم</option>
                                                    </select>
                                                </div>
                                                
                                                <div className="form-group col-md-12 mb-4 text-right">
                                                    <label className="d-block mb-3 font-weight-bold" style={{ color: '#28a745', borderBottom: '1px dashed #dee2e6', paddingBottom: '8px' }}>مجالات الاهتمام والتطوع :</label>
                                                    <div className="row pr-3">
                                                        {['التوعية', 'التربية', 'التكوين', 'التطوع', 'الدعم الرقمي', 'التبرع'].map(i => (
                                                            <div key={i} className="col-md-4 mb-2">
                                                                <div className="form-check form-check-inline float-right align-items-center">
                                                                    <input className="form-check-input" style={{ width: '16px', height: '16px', cursor: 'pointer' }} type="checkbox" id={`interest-${i}`} value={i} onChange={handleInterestChange} /> 
                                                                    <label className="form-check-label mr-2" style={{ cursor: 'pointer', userSelect: 'none' }} htmlFor={`interest-${i}`}>{i}</label>
                                                                </div>
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>

                                                <div className="col-md-12 mb-3 mt-2">
                                                    <h5 style={{ color: '#495057', fontWeight: 'bold', borderRight: '3px solid #28a745', paddingRight: '8px' }}>معلومات الحساب الشخصي</h5>
                                                </div>

                                                <div className="form-group col-md-6 mb-3">
                                                    <label className="float-right mb-1 font-weight-bold" style={{ color: '#495057' }}>اسم المستخدم :</label>
                                                    <input className="form-control" style={{ borderRadius: '8px', padding: '10px' }} name="nom_utilisateur" placeholder="اسم المستخدم باللاتينية" value={formData.nom_utilisateur} onChange={handleChange} required />
                                                </div>
                                                <div className="form-group col-md-6 mb-3">
                                                    <label className="float-right mb-1 font-weight-bold" style={{ color: '#495057' }}>كلمة السر :</label>
                                                    <input className="form-control" style={{ borderRadius: '8px', padding: '10px' }} name="mot_de_pass" placeholder="كلمة السر" type="password" value={formData.mot_de_pass} onChange={handleChange} required />
                                                </div>
                                            </div>

                                            <div className="text-center mt-4">
                                                <button type="submit" className="btn btn-success pl-5 pr-5 pt-2 pb-2 shadow-sm" style={{ borderRadius: '25px', fontWeight: 'bold', fontSize: '16px', transition: '0.3s' }}>
                                                    إرسال طلب التطوع
                                                </button>
                                            </div>
                                        </form>
                                    </div>

                                </div>
                                {/* ─── نهاية الإطار ─── */}
                                
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default DevenirBenevole;