import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../../api';
import PageBanner from '../../components/PageBanner';

const Login = () => {
    const [login, setLogin] = useState('');
    const [mdp, setMdp] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        try {
            const response = await api.post('/login', { login, mdp });
            localStorage.setItem('token', response.data.access_token);
            localStorage.setItem('user', JSON.stringify(response.data.user));
            navigate('/');
            window.location.reload();
        } catch (err) {
            setError(err.response?.data?.message || 'اسم المستخدم أوكلمة المرور غير صحيحة.');
        }
    };

    return (
        <div className="content">
            <PageBanner />
            
            <section className="eco_services_environment">
                <div className="container">
                    <div className="eco_headings" style={{ marginTop: '-10px' }}>
                        <h3><b>تسجيل الدخول</b></h3>
                        <span><i className="icon-nature-2"></i></span>
                    </div>
                    
                    <div className="eco_featured_causes">
                        <div className="row">
                            <div className="sendMail" style={{ display: 'table', margin: 'auto', width: '40%' }}>
                                {error && <div className="alert alert-danger" style={{ textAlign: 'center' }}>{error}</div>}
                                <form onSubmit={handleSubmit}>
                                    <div className="col-md-12">
                                        <div style={{ textAlign: 'center', fontSize: '16px', marginBottom: '10px' }}>
                                            <span>اسم المستخدم</span>
                                        </div>
                                        <input 
                                            type="text" 
                                            className="form-control" 
                                            value={login} 
                                            onChange={(e) => setLogin(e.target.value)} 
                                            dir="ltr"
                                            required
                                        />
                                    </div>
                                    <br />
                                    <div className="col-md-12">
                                        <div style={{ textAlign: 'center', fontSize: '16px', marginBottom: '10px' }}>
                                            <span>كلمة المرور</span>
                                        </div>
                                        <input 
                                            type="password" 
                                            className="form-control" 
                                            value={mdp} 
                                            onChange={(e) => setMdp(e.target.value)} 
                                            dir="ltr"
                                            required
                                        />
                                    </div>
                                    <br /><br />
                                    <div className="col-md-12" style={{ textAlign: 'center' }}>
                                        <button type="submit" className="btn-small xsmall-btn" style={{ width: '70%', display: 'table', margin: 'auto' }}>
                                            تسجيل الدخول
                                        </button>
                                    </div>
                                    <br />
                                    <div className="col-md-12">
                                        <div className="aboutus" style={{ textAlign: 'center' }}>
                                            <p>جديد في الموقع؟ <Link to="/inscription"><strong style={{ color: '#f05477' }}>أنشئ حساب</strong></Link></p>
                                        </div>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default Login;
