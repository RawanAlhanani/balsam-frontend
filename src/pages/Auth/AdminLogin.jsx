import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api, { adminLogin, initializeCsrfToken } from '../../api';

const AdminLogin = () => {
    const [login, setLogin] = useState('');
    const [mdp, setMdp] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    // Removed dynamic CSS injection and body class manipulation from here.
    // These styles and body attributes should be handled globally in index.html
    // or through a dedicated AdminLayout component if they are specific to admin routes.
    useEffect(() => {
        initializeCsrfToken();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        try {
            const response = await adminLogin({ login, mdp });
            localStorage.setItem('admin_token', response.data.token);
            localStorage.setItem('refresh_token', response.data.refresh_token);
            localStorage.setItem('is_admin', 'true');
            localStorage.setItem('admin_role', response.data.user.role);
            navigate('/admin/dashboard');
        } catch (err) {
            setError(err.response?.data?.message || 'البريد الإلكتروني أو كلمة المرور غير صحيحة.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="app-content content">
            <div className="content-wrapper">
                <div className="content-body">
                    <section className="flexbox-container" style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <div className="col-12 d-flex align-items-center justify-content-center">
                            <div className="col-md-4 col-10 box-shadow-2 p-0">
                                <div className="card border-grey border-lighten-3 m-0">
                                    <div className="card-header border-0">
                                        <div className="card-title text-center">
                                            <div className="p-1">
                                                {/* Removed inline width style */}
                                                <img src="/backend/app-assets/images/logo/logo.png" alt="شعار الجمعية" />
                                            </div>
                                        </div>
                                        <h6 className="card-subtitle line-on-side text-muted text-center font-small-3 pt-2">
                                            <span>تسجيل الدخول (الإدارة)</span>
                                        </h6>
                                    </div>
                                    <div className="card-content">
                                        <div className="card-body">
                                            <form className="form-horizontal form-simple" onSubmit={handleSubmit}>
                                                {error && (
                                                    <div className="alert alert-danger">
                                                        {/* Removed inline font size and margin */}
                                                        <h4 style={{ textAlign: 'center' }}>{error}</h4>
                                                    </div>
                                                )}
                                                
                                                <fieldset className="form-group position-relative has-icon-left mb-1">
                                                    <input 
                                                        dir="ltr" 
                                                        type="email" 
                                                        className="form-control form-control-lg" 
                                                        placeholder="البريد الإلكتروني"
                                                        value={login}
                                                        onChange={(e) => setLogin(e.target.value)}
                                                        required 
                                                    />
                                                    {/* Removed inline top style */}
                                                    <div className="form-control-position">
                                                        <i className="ft-user"></i>
                                                    </div>
                                                </fieldset>
                                                <fieldset className="form-group position-relative has-icon-left mb-2">
                                                    <input 
                                                        dir="ltr" 
                                                        type="password" 
                                                        className="form-control form-control-lg" 
                                                        placeholder="كلمة المرور"
                                                        value={mdp}
                                                        onChange={(e) => setMdp(e.target.value)}
                                                        required 
                                                    />
                                                    {/* Removed inline top style */}
                                                    <div className="form-control-position">
                                                        <i className="la la-key"></i>
                                                    </div>
                                                </fieldset>
                                            
                                                {/* Removed inline padding and font size */}
                                                <button 
                                                    type="submit" 
                                                    className="btn btn-info btn-lg btn-block"
                                                    disabled={loading}
                                                >
                                                    <i className="ft-unlock"></i> {loading ? 'جاري تسجيل الدخول...' : 'تسجيل الدخول'}
                                                </button>
                                            </form>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>
                </div>
            </div>
        </div>
    );
};

export default AdminLogin;