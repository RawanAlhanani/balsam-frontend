import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api, { login, initializeCsrfToken } from '../../api';
import PageBanner from '../../components/PageBanner';

const Login = () => {
    const [username, setUsername] = useState('');
    const [mdp, setMdp] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        // Initialize CSRF token on component mount
        initializeCsrfToken();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        try {
            const response = await login({ login: username, mdp });
            localStorage.setItem('token', response.data.access_token);
            localStorage.setItem('refresh_token', response.data.refresh_token);
            localStorage.setItem('user', JSON.stringify(response.data.user));
            navigate('/');
        } catch (err) {
            console.error('Login error:', err);
            setError(err.response?.data?.message || 'اسم المستخدم أو كلمة المرور غير صحيحة.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="content">
            <PageBanner title="تسجيل الدخول" />
            
            <section className="eco_services_environment">
                <div className="container">
                    <div className="eco_headings" style={{ marginTop: '-10px' }}>
                        <h3><b>تسجيل الدخول</b></h3>
                        <span><i className="icon-nature-2"></i></span>
                    </div>
                    
                    <div className="eco_featured_causes">
                        <div className="row">
                            {/* Removed inline width and used Bootstrap grid classes for responsiveness */}
                            <div className="sendMail col-lg-4 col-md-6 mx-auto">
                                {error && <div className="alert alert-danger" style={{ textAlign: 'center' }}>{error}</div>}
                                <form onSubmit={handleSubmit}>
                                    <div className="col-md-12">
                                        <div style={{ textAlign: 'center', fontSize: '16px', marginBottom: '10px' }}>
                                            <span>اسم المستخدم</span>
                                        </div>
                                        <input 
                                            type="text" 
                                            className="form-control" 
                                            value={username} 
                                            onChange={(e) => setUsername(e.target.value)} 
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
                                        {/* Removed inline width and used Bootstrap utility classes for responsiveness */}
                                        <button 
                                            type="submit" 
                                            className="btn-small xsmall-btn w-75 mx-auto d-block"
                                            disabled={loading}
                                        >
                                            {loading ? 'جاري تسجيل الدخول...' : 'تسجيل الدخول'}
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