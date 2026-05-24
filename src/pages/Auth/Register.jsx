import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../api';
import PageBanner from '../../components/PageBanner';

const Register = () => {
    const navigate = useNavigate();
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
        api.get('/registration-data').then(res => setRegData(res.data));
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
        const data = new FormData();
        Object.keys(formData).forEach(key => {
            if (key === 'doctor') {
                formData[key].forEach(val => data.append('doctor[]', val));
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
            setError('خطأ في التسجيل. يرجى التأكد من جميع المعلومات.');
        }
    };

    return (
        <div className="content">
            <PageBanner />

            <section>
                <div className="container">
                    <div className="eco_contact_form">
                        <div className="row">
                            <div className="col-md-10 offset-md-2 no-padding col-sm-12 responsive-991-width">
                                {error && <div className="alert alert-danger">{error}</div>}
                                <form onSubmit={handleSubmit}>
                                    
                                    {/* Kid Info Section */}
                                    <div className="progress-names">
                                        <div className="progress-wrap progress">
                                            <div className="progress-bar progress" style={{ width: '30%' }}></div>
                                        </div>
                                    </div>
                                    <div className="your-submit-message">
                                        <h4 className="eco_sm_titles">معلومات شخصية عن الطفل التوحدي</h4>
                                        <div className="row">
                                            <div className="form-group col-md-6">
                                                <input className="form-control" name="nom_enfant" placeholder="الاسم العائلي للطفل" onChange={handleChange} required />
                                            </div>
                                            <div className="form-group col-md-6">
                                                <input className="form-control" name="prenom_enfant" placeholder="الاسم الشخصي للطفل" onChange={handleChange} required />
                                            </div>
                                            <div className="form-group col-md-6">
                                                <p className="droite">تاريخ الازدياد :</p>
                                                <input className="form-control" name="date_naissance" type="date" onChange={handleChange} required />
                                            </div>
                                            <div className="form-group col-md-6">
                                                <p className="droite">حمل صورة للطفل :</p>
                                                <input className="form-control-file" type="file" onChange={(e) => setPhoto(e.target.files[0])} />
                                            </div>
                                            <div className="form-group col-md-6">
                                                <p className="droite">الجنس :</p>
                                                <div className="col-md-6 d-flex">
                                                    <label className="mr-3"><input type="radio" name="sexeEnfant" value="1" onChange={handleChange} /> أنثى</label>
                                                    <label><input type="radio" name="sexeEnfant" value="2" onChange={handleChange} /> ذكر</label>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Kid Condition Section */}
                                    <div className="progress-names">
                                        <div className="progress-wrap progress">
                                            <div className="progress-bar progress" style={{ width: '50%' }}></div>
                                        </div>
                                    </div>
                                    <div className="your-submit-message">
                                        <h4 className="eco_sm_titles">معلومات عن وضعية الطفل التوحدي</h4>
                                        <div className="row">
                                            <div className="form-group col-md-6">
                                                <select className="form-control" name="statut" onChange={handleChange} required>
                                                    <option value="">- اختر حالة الطفل -</option>
                                                    <option value="1">توحد خفيف</option>
                                                    <option value="2">توحد متوسط</option>
                                                    <option value="3">توحد شديد</option>
                                                </select>
                                            </div>
                                            <div className="form-group col-md-6">
                                                <select className="form-control" name="parole" onChange={handleChange} required>
                                                    <option value="">- اختر كلام الطفل -</option>
                                                    <option value="1">غير متكلم</option>
                                                    <option value="2">يصدر بعض الأصوات</option>
                                                    <option value="3">يتكلم بعض الكلمات</option>
                                                    <option value="4">يتكلم</option>
                                                </select>
                                            </div>
                                            <div className="form-group col-md-12">
                                                <p className="droite">هل يتابع الطفل عند أحد التخصصات الطبية أو شبه الطبية؟</p>
                                                <div className="row">
                                                    {regData.specialites.map(s => (
                                                        <div key={s.id} className="col-md-3">
                                                            <label>
                                                                <input type="checkbox" value={s.id} onChange={(e) => {
                                                                    const val = e.target.value;
                                                                    const checked = e.target.checked;
                                                                    setFormData(prev => ({
                                                                        ...prev,
                                                                        doctor: checked ? [...prev.doctor, val] : prev.doctor.filter(d => d !== val)
                                                                    }));
                                                                }} /> {s.nom_doctor}
                                                            </label>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                            <div className="form-group col-md-6">
                                                <p className="droite">هل للطفل مرافق :</p>
                                                <label className="mr-3"><input type="radio" name="avs" value="1" onChange={handleChange} /> نعم</label>
                                                <label><input type="radio" name="avs" value="2" onChange={handleChange} /> لا</label>
                                            </div>
                                            <div className="form-group col-md-6">
                                                <p className="droite">هل الطفل متمدرس :</p>
                                                <label className="mr-3"><input type="radio" name="etude" value="1" onChange={handleChange} /> نعم</label>
                                                <label><input type="radio" name="etude" value="2" onChange={handleChange} /> لا</label>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Tuteur Info Section */}
                                    <div className="progress-names">
                                        <div className="progress-wrap progress">
                                            <div className="progress-bar progress" style={{ width: '70%' }}></div>
                                        </div>
                                    </div>
                                    <div className="your-submit-message">
                                        <h4 className="eco_sm_titles">معلومات عن ولي أمر الطفل</h4>
                                        <div className="row">
                                            <div className="form-group col-md-6">
                                                <input className="form-control" name="nom_tuteur" placeholder="الاسم العائلي" onChange={handleChange} required />
                                            </div>
                                            <div className="form-group col-md-6">
                                                <input className="form-control" name="prenom_tuteur" placeholder="الاسم الشخصي" onChange={handleChange} required />
                                            </div>
                                            <div className="form-group col-md-6">
                                                <input className="form-control" name="CIN" placeholder="رقم البطاقة الوطنية" onChange={handleChange} required />
                                            </div>
                                            <div className="form-group col-md-6">
                                                <input className="form-control" name="adresse" placeholder="عنوان السكن" onChange={handleChange} required />
                                            </div>
                                            <div className="form-group col-md-6">
                                                <input dir="ltr" className="form-control" name="email_tuteur" placeholder="البريد الإلكتروني" type="email" onChange={handleChange} required />
                                            </div>
                                            <div className="form-group col-md-6">
                                                <select className="form-control" name="region_id" onChange={handleChange} required>
                                                    <option value="">- اختر المنطقة -</option>
                                                    {regData.regions.map(r => <option key={r.id} value={r.id}>{r.nom_region}</option>)}
                                                </select>
                                            </div>
                                            <div className="form-group col-md-6">
                                                <input className="form-control" name="telephon" placeholder="رقم الهاتف" type="number" onChange={handleChange} required />
                                            </div>
                                            <div className="form-group col-md-6">
                                                <input className="form-control" name="whatsapp" placeholder="رقم الواتساب" type="number" onChange={handleChange} required />
                                            </div>
                                            <div className="form-group col-md-6">
                                                <p className="droite">نوع القرابة</p>
                                                <label className="mr-2"><input type="radio" name="type_Tuteur" value="1" onChange={handleChange} /> أب</label>
                                                <label className="mr-2"><input type="radio" name="type_Tuteur" value="2" onChange={handleChange} /> أم</label>
                                                <label><input type="radio" name="type_Tuteur" value="3" onChange={handleChange} /> آخر</label>
                                            </div>
                                            <div className="form-group col-md-6">
                                                <p className="droite">هل خضعتم لأي تكوين حول التوحد :</p>
                                                <label className="mr-3"><input type="radio" name="formation" value="1" onChange={handleChange} /> نعم</label>
                                                <label><input type="radio" name="formation" value="2" onChange={handleChange} /> لا</label>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Account Section */}
                                    <div className="progress-names">
                                        <div className="progress-wrap progress">
                                            <div className="progress-bar progress" style={{ width: '100%' }}></div>
                                        </div>
                                    </div>
                                    <div className="your-submit-message">
                                        <h4 className="eco_sm_titles">إنشاء حساب</h4>
                                        <div className="row">
                                            <div className="form-group col-md-6">
                                                <input dir="ltr" className="form-control" name="nom_utilisateur" placeholder="اسم المستخدم" onChange={handleChange} required />
                                            </div>
                                            <div className="form-group col-md-6">
                                                <input dir="ltr" className="form-control" name="mot_de_pass" placeholder="كلمة السر" type="password" onChange={handleChange} required />
                                            </div>
                                        </div>
                                    </div>

                                    <button type="submit" className="btn-small xsmall-btn">أرسل</button>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default Register;
