import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Header = () => {
    const [user, setUser] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            setUser(JSON.parse(storedUser));
        }
    }, []);

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setUser(null);
        navigate('/');
    };

    return (
        <header>
            <div className="kode_eco_navigations">
                <div className="container">
                    <div className="kode_eco-top_bar">
                        <div className="kode_eco_logo">
                            <Link to="/"><img src="/content/view/themes/balsam/assests/images/logo.png" alt="" /></Link>
                        </div>
                        
                        <style>{`
                            .navigation > ul > li > a {
                                padding: 25px 20px 26px !important;
                            }
                            .sub-menu {
                                display: none;
                                position: absolute;
                                background: #fff;
                                box-shadow: 0 2px 5px rgba(0,0,0,0.1);
                                z-index: 999;
                                list-style: none;
                                padding: 10px;
                                min-width: 150px;
                            }
                            .nav-menu li:hover .sub-menu {
                                display: block;
                            }
                        `}</style>

                        <div className="kode_navigaion_bar">
                            <nav className="navigation" id="trans-nav">
                                <ul className="nav-menu">
                                    <li className="active"><Link title="" to="/">الرئيسية </Link></li>
                                    <li><Link title="" to="/about">من نحن </Link></li>
                                    <li><Link title="" to="/autisme">فهم التوحد </Link></li>
                                    <li><Link title="" to="/projets">مشاريعنا </Link></li>
                                    <li><Link title="" to="/nosInfos">أخبارنا </Link></li>
                                    <li><Link title="" to="/nosActivites">أنشطتنا</Link></li>
                                    <li><Link title="" to="/nosPhotos">صورنا</Link></li>
                                    <li><Link title="" to="/partenaires">شركاؤنا </Link></li>
                                    <li>
                                        {user ? (
                                            <>
                                                <Link title="" to="#" style={{ color: '#f05074' }}>
                                                    {user.nom_tuteur} {user.prenom_tuteur}
                                                </Link>
                                                <ul className="children sub-menu">
                                                    <li><Link to={`/tuteur/${user.id}/modifier`}>حسابي</Link></li>
                                                    <li><a href="#" onClick={handleLogout}>خروج</a></li>
                                                </ul>
                                            </>
                                        ) : (
                                            <Link title="" to="/se_connecter">حسابي</Link>
                                        )}
                                    </li>
                                </ul>
                            </nav>
                        </div>
                    </div>
                </div>
            </div>
        </header>
    );
};

export default Header;
