import React, { useState } from 'react';

const DevenirStagiaire = () => {
  const [formData, setFormData] = useState({
    nom: '',
    prenom: '',
    email: '',
    telephone: '',
    specialite: '',
    etablissement: '',
    date_debut: '',
    date_fin: '',
    cin: '',
    niveau_etude: '',
    region_id: '3', // البداية من بئر رامي (ID: 3)
    cv: null,
    nom_utilisateur: '', // 👈 Ajouté
    mot_de_pass: '',     // 👈 Ajouté
  });

  const [status, setStatus] = useState({ success: null, message: '' });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleFileChange = (e) => {
    setFormData({ ...formData, cv: e.target.files[0] });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setStatus({ success: null, message: '' });

    const duree = `من ${formData.date_debut} إلى ${formData.date_fin}`;

    // 🌟 حماية قاطعة: التحقق من أن المعرف لا يمكن أن يكون أقل من 3
    let validatedRegionId = parseInt(formData.region_id, 10);
    if (isNaN(validatedRegionId) || validatedRegionId < 3) {
      validatedRegionId = 3; 
    }

    const data = new FormData();
    
    // 1. حقول الـ Validation الكلاسيكية القديمة
    data.append('nom', formData.nom);
    data.append('prenom', formData.prenom);
    data.append('email', formData.email);
    data.append('telephone', formData.telephone);
    data.append('specialite', formData.specialite);
    data.append('etablissement', formData.etablissement);
    data.append('date_debut', formData.date_debut);
    data.append('date_fin', formData.date_fin);
    data.append('cv', formData.cv);

    // 2. الحقول الحقيقية الموجهة لقاعدة البيانات مباشرة
    data.append('nom_stagiaire', formData.nom);
    data.append('prenom_stagiaire', formData.prenom);
    data.append('cin', formData.cin);
    data.append('niveau_etude', formData.niveau_etude);
    data.append('region_id', validatedRegionId); 
    data.append('duree_stage', duree);
    
    // 3. Envoi des vraies valeurs saisies par l'utilisateur au lieu des valeurs statiques/aléatoires
    data.append('nom_utilisateur', formData.nom_utilisateur);
    data.append('mot_de_pass', formData.mot_de_pass);

    try {
      const response = await fetch('http://127.0.0.1:8000/api/register-stagiaire', {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
        },
        body: data,
      });

      const result = await response.json();

      if (response.ok) {
        setStatus({ 
          success: true, 
          message: result.message || 'تم إرسال طلبكم بنجاح. سيقوم القسم الإداري بالمركز بمراجعة ملفكم والتواصل معكم في أقرب وقت.' 
        });
        setFormData({
          nom: '', prenom: '', email: '', telephone: '', specialite: '', etablissement: '', date_debut: '', date_fin: '', cin: '', niveau_etude: '', region_id: '3', cv: null, nom_utilisateur: '', mot_de_pass: ''
        });
      } else {
        if (result.errors) {
          const firstError = Object.values(result.errors)[0][0];
          setStatus({ success: false, message: `خطأ في البيانات: ${firstError}` });
        } else {
          setStatus({ success: false, message: result.message || 'حدث خطأ أثناء إرسال الطلب.' });
        }
      }
    } catch (error) {
      setStatus({ success: false, message: 'تعذر الاتصال بالخادم حالياً. يرجى المحاولة لاحقاً.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="stage-page-wrapper" style={{ direction: 'rtl', backgroundColor: '#fafafa', minHeight: '100vh' }}>
      
      <style>{`
        .stage-classic-header { background-color: #ffffff; border-bottom: 1px solid #eaeaea; padding: 60px 0 40px 0; margin-top: 20px; margin-bottom: 50px; text-align: center; }
        .classic-title { color: #1a1a1a; font-size: 32px; font-weight: 700; margin-bottom: 15px; position: relative; display: inline-block; }
        .classic-title::after { content: ""; position: absolute; bottom: -8px; left: 10%; right: 10%; height: 3px; background: linear-gradient(to right, #f05074, #ff7e5f); border-radius: 2px; }
        .classic-subtitle { color: #666666; font-size: 15px; max-width: 750px; margin: 20px auto 0 auto; line-height: 1.7; }
        .stage-professional-card { background: #ffffff; border: 1px solid #e2e8f0; border-radius: 8px; padding: 30px; margin-bottom: 30px; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.02); }
        .card-classic-title { color: #1a1a1a; font-size: 18px; font-weight: 600; margin-bottom: 20px; padding-bottom: 10px; border-bottom: 2px solid #f1f5f9; }
        .form-label { font-weight: 500; color: #334155; margin-bottom: 6px; display: block; font-size: 14px; }
        .form-control { border-radius: 6px; border: 1px solid #cbd5e1; padding: 11px 14px; width: 100%; font-size: 14px; color: #334155; transition: border-color 0.2s ease, box-shadow 0.2s ease; background-color: #fff; }
        .form-control:focus { border-color: #f05074; box-shadow: 0 0 0 3px rgba(240, 80, 116, 0.1); outline: none; }
        .btn-submit-classic { background: linear-gradient(135deg, #f05074 0%, #ff7e5f 100%); color: #ffffff; border: none; padding: 13px 24px; border-radius: 6px; font-weight: 600; font-size: 15px; cursor: pointer; width: 100%; }
        .btn-submit-classic:disabled { background: #cbd5e1; cursor: not-allowed; }
        .classic-list { padding-right: 15px; margin-bottom: 20px; }
        .classic-list li { margin-bottom: 12px; font-size: 14px; color: #475569; list-style-type: none; position: relative; padding-right: 20px; line-height: 1.6; }
        .classic-list li::before { content: "■"; position: absolute; right: 0; color: #f05074; font-size: 10px; top: 1px; }
        .account-section-title { font-size: 15px; font-weight: 600; color: #475569; margin: 25px 0 15px 0; padding-right: 8px; border-right: 3px solid #ff7e5f; }
      `}</style>

      <div className="stage-classic-header">
        <div className="container">
          <h1 className="classic-title">طلب فترة تدريبية</h1>
          <p className="classic-subtitle">يتيح مركز بلسم لتأهيل أطفال التوحد فرص التدريب الميداني للطلبة لتطوير مهاراتهم التطبيقية.</p>
        </div>
      </div>

      <div className="container">
        <div className="row">
          
          <div className="col-md-4">
            <div className="stage-professional-card">
              <h3 className="card-classic-title">التخصصات المطلوبة</h3>
              <ul className="classic-list">
                <li>علم النفس (العيادي والتطوري)</li>
                <li>تقويم النطق والتواصل (Orthophonie)</li>
                <li>الترويض الحركي الوظيفي (Psychomotricité)</li>
              </ul>
            </div>
          </div>

          <div className="col-md-8">
            <div className="stage-professional-card">
              <h3 className="card-classic-title">استمارة معلومات المرشح</h3>
              
              {status.message && (
                <div className="alert" style={{ borderRadius: '6px', padding: '12px', marginBottom: '20px', textAlign: 'center', fontSize: '14px', backgroundColor: status.success ? '#f0fdf4' : '#fef2f2', color: status.success ? '#166534' : '#991b1b', border: `1px solid ${status.success ? '#bbf7d0' : '#fecaca'}` }}>
                  {status.message}
                </div>
              )}

              <form onSubmit={handleSubmit} encType="multipart/form-data">
                <div className="row">
                  <div className="col-md-6 mb-3">
                    <label className="form-label">الاسم الشخصي <span style={{ color: '#f05074' }}>*</span></label>
                    <input type="text" name="prenom" className="form-control" value={formData.prenom} onChange={handleChange} required />
                  </div>
                  <div className="col-md-6 mb-3">
                    <label className="form-label">الاسم العائلي <span style={{ color: '#f05074' }}>*</span></label>
                    <input type="text" name="nom" className="form-control" value={formData.nom} onChange={handleChange} required />
                  </div>
                </div>

                <div className="row">
                  <div className="col-md-6 mb-3">
                    <label className="form-label">رقم البطاقة الوطنية (CIN) <span style={{ color: '#f05074' }}>*</span></label>
                    <input type="text" name="cin" className="form-control" placeholder="مثال: AB123456" value={formData.cin} onChange={handleChange} required />
                  </div>
                  <div className="col-md-6 mb-3">
                    <label className="form-label">رقم الهاتف <span style={{ color: '#f05074' }}>*</span></label>
                    <input type="tel" name="telephone" className="form-control" placeholder="0600000000" value={formData.telephone} onChange={handleChange} required />
                  </div>
                </div>

                <div className="row">
                  <div className="col-md-12 mb-3">
                    <label className="form-label">البريد الإلكتروني <span style={{ color: '#f05074' }}>*</span></label>
                    <input type="email" name="email" className="form-control" value={formData.email} onChange={handleChange} required />
                  </div>
                </div>

                <div className="row">
                  <div className="col-md-6 mb-3">
                    <label className="form-label">التخصص الدراسي <span style={{ color: '#f05074' }}>*</span></label>
                    <input type="text" name="specialite" className="form-control" value={formData.specialite} onChange={handleChange} required />
                  </div>
                  <div className="col-md-6 mb-3">
                    <label className="form-label">المستوى الدراسي <span style={{ color: '#f05074' }}>*</span></label>
                    <input type="text" name="niveau_etude" className="form-control" placeholder="مثال: إجازة، ماستر..." value={formData.niveau_etude} onChange={handleChange} required />
                  </div>
                </div>

                <div className="row">
                  <div className="col-md-6 mb-3">
                    <label className="form-label">المؤسسة التعليمية / الجامعة <span style={{ color: '#f05074' }}>*</span></label>
                    <input type="text" name="etablissement" className="form-control" value={formData.etablissement} onChange={handleChange} required />
                  </div>
                  <div className="col-md-6 mb-3">
                    <label className="form-label">الحي / المنطقة (القنيطرة) <span style={{ color: '#f05074' }}>*</span></label>
                    <select name="region_id" className="form-control" value={formData.region_id} onChange={handleChange} required>
                      <option value="3">بئر رامي</option>
                      <option value="4">لافيلوط</option>
                      <option value="5">لوفالون</option>
                      <option value="6">المغرب العربي</option>
                      <option value="7">أولاد أوجيه</option>
                      <option value="8">الاسماعيلية</option>
                      <option value="9">الحوزية</option>
                      <option value="10">ميموزة</option>
                      <option value="11">الملاح</option>
                      <option value="12">حي الشهداء</option>
                      <option value="13">بئر أنزران</option>
                      <option value="14">بام 1</option>
                      <option value="15">لابيطا</option>
                      <option value="16">ديور عشرة آلاف</option>
                      <option value="17">الارشاد</option>
                      <option value="18">البوشتيين</option>
                      <option value="19">باب فاس</option>
                      <option value="20">طهرون</option>
                      <option value="21">أولاد عرفة</option>
                      <option value="22">عين السبع</option>
                      <option value="23">حي الوفاء 1</option>
                      <option value="24">حي الوفاء 2</option>
                      <option value="25">حي الوفاء 3</option>
                      <option value="26">حي الوفاء 4</option>
                      <option value="27">بام 2</option>
                    </select>
                  </div>
                </div>

                <div className="row">
                  <div className="col-md-6 mb-3">
                    <label className="form-label">تاريخ بدء التدريب المقترح <span style={{ color: '#f05074' }}>*</span></label>
                    <input type="date" name="date_debut" className="form-control" value={formData.date_debut} onChange={handleChange} required />
                  </div>
                  <div className="col-md-6 mb-3">
                    <label className="form-label">تاريخ نهاية التدريب المقترح <span style={{ color: '#f05074' }}>*</span></label>
                    <input type="date" name="date_fin" className="form-control" value={formData.date_fin} onChange={handleChange} required />
                  </div>
                </div>

                <div className="mb-3">
                  <label className="form-label">إرفاق السيرة الذاتية (CV) <span style={{ color: '#f05074' }}>*</span></label>
                  <input type="file" accept=".pdf,.doc,.docx" className="form-control" onChange={handleFileChange} required />
                </div>

                {/* 🔒 Section des identifiants du compte ajoutée */}
                <h4 className="account-section-title">بيانات الحساب (لتسجيل الدخول لاحقاً)</h4>
                <div className="row">
                  <div className="col-md-6 mb-4">
                    <label className="form-label">اسم المستخدم <span style={{ color: '#f05074' }}>*</span></label>
                    <input type="text" name="nom_utilisateur" className="form-control" placeholder="اختر اسم مستخدم باللاتينية" value={formData.nom_utilisateur} onChange={handleChange} required />
                  </div>
                  <div className="col-md-6 mb-4">
                    <label className="form-label">كلمة السر <span style={{ color: '#f05074' }}>*</span></label>
                    <input type="password" name="mot_de_pass" className="form-control" placeholder="••••••••" value={formData.mot_de_pass} onChange={handleChange} required />
                  </div>
                </div>

                <button type="submit" className="btn-submit-classic" disabled={loading}>
                  {loading ? 'جاري معالجة الطلب وإرساله...' : 'إرسال الملف عبر المنصة'}
                </button>
              </form>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default DevenirStagiaire;