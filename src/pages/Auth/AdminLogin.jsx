import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../api';

const AdminLogin = () => {
    const [login, setLogin] = useState('');
    const [mdp, setMdp] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        // Apply body classes and attributes exactly like the original Blade
        document.body.className = "vertical-layout vertical-menu 1-column menu-expanded blank-page blank-page";
        document.body.setAttribute("data-open", "click");
        document.body.setAttribute("data-menu", "vertical-menu");
        document.body.setAttribute("data-col", "1-column");
        
        // Ensure reset of any frontend theme properties
        document.documentElement.style.height = '100%';
        document.body.style.height = '100%';
        document.body.style.overflow = 'auto';

        const styles = [
            "/backend/app-assets/fonts/line-awesome/css/line-awesome.min.css",
            "/backend/app-assets/fonts/simple-line-icons/style.css",
            "/backend/app-assets/css-rtl/vendors.css",
            "/backend/app-assets/vendors/css/forms/icheck/icheck.css",
            "/backend/app-assets/vendors/css/forms/icheck/custom.css",
            "/backend/app-assets/css-rtl/app.css",
            "/backend/app-assets/css-rtl/custom-rtl.css",
            "/backend/app-assets/css-rtl/core/menu/menu-types/vertical-menu.css",
            "/backend/app-assets/css-rtl/core/colors/palette-gradient.css",
            "/backend/app-assets/css-rtl/pages/login-register.css",
            "/backend/assets/css/style-rtl.css"
        ];

        const linkElements = styles.map(href => {
            const link = document.createElement('link');
            link.rel = 'stylesheet';
            link.type = 'text/css';
            link.href = href;
            link.className = 'admin-style';
            document.head.appendChild(link);
            return link;
        });

        return () => {
            document.body.className = "";
            document.body.removeAttribute("data-open");
            document.body.removeAttribute("data-menu");
            document.body.removeAttribute("data-col");
            document.documentElement.style.height = '';
            document.body.style.height = '';
            linkElements.forEach(link => {
                if (link.parentNode) link.parentNode.removeChild(link);
            });
        };
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        try {
            const response = await api.post('/admin-login', { login, mdp });
            localStorage.setItem('admin_token', response.data.token);
            localStorage.setItem('is_admin', 'true');
            localStorage.setItem('admin_role', response.data.user.role);
            navigate('/admin/dashboard');
        } catch (err) {
            setError(err.response?.data?.message || 'Email ou mot de passe non valides !!!!');
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
                                                <img src="/backend/app-assets/images/logo/logo.png" alt="branding logo" style={{ width: '120px' }} />
                                            </div>
                                        </div>
                                        <h6 className="card-subtitle line-on-side text-muted text-center font-small-3 pt-2">
                                            <span>Se connecter (Administration)</span>
                                        </h6>
                                    </div>
                                    <div className="card-content">
                                        <div className="card-body">
                                            <form className="form-horizontal form-simple" onSubmit={handleSubmit}>
                                                {error && (
                                                    <div className="alert alert-danger">
                                                        <h4 dir="ltr" style={{ textAlign: 'center', fontSize: '14px', margin: 0 }}>{error}</h4>
                                                    </div>
                                                )}
                                                
                                                <fieldset className="form-group position-relative has-icon-left mb-1">
                                                    <input 
                                                        dir="ltr" 
                                                        type="email" 
                                                        className="form-control form-control-lg" 
                                                        placeholder="Votre Email"
                                                        value={login}
                                                        onChange={(e) => setLogin(e.target.value)}
                                                        required 
                                                    />
                                                    <div className="form-control-position" style={{ top: '6px' }}>
                                                        <i className="ft-user"></i>
                                                    </div>
                                                </fieldset>
                                                <fieldset className="form-group position-relative has-icon-left mb-2">
                                                    <input 
                                                        dir="ltr" 
                                                        type="password" 
                                                        className="form-control form-control-lg" 
                                                        placeholder="Votre mot de passe"
                                                        value={mdp}
                                                        onChange={(e) => setMdp(e.target.value)}
                                                        required 
                                                    />
                                                    <div className="form-control-position" style={{ top: '6px' }}>
                                                        <i className="la la-key"></i>
                                                    </div>
                                                </fieldset>
                                            
                                                <button type="submit" className="btn btn-info btn-lg btn-block" style={{ padding: '10px', fontSize: '18px' }}>
                                                    <i className="ft-unlock"></i> Login
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
