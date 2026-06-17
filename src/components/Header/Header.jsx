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
                        
                        {/* LOGO */}
                        <div className="kode_eco_logo">
                            <Link to="/">
                                <img src="/content/view/themes/balsam/assests/images/logo.png" alt="" />
                            </Link>
                        </div>

                        {/* CSS */}
                        <style>{`

                 
.nav-menu {
  display: flex;
  align-items: center;
  flex-wrap: nowrap;
  gap: 8px;
}

.nav-menu > li {
  position: relative;
  white-space: nowrap;
}

.navigation > ul > li > a {
  padding: 20px 10px 20px !important;
  font-size: 14px;
  display: inline-block;
}


.sub-menu {
  display: none;
  position: absolute;
  top: 100%;
  right: 0;
  background: #fff;
  min-width: 220px;
  border-radius: 10px;
  box-shadow: 0 10px 25px rgba(0,0,0,0.1);
  padding: 10px 0;
  z-index: 9999;
}
  .nav-menu li {
  position: relative;
}

.nav-menu li:hover .sub-menu {
  display: block;
}


.sub-menu li {
  padding: 0;
}


.sub-menu li a {
  display: block;
  padding: 12px 20px;
  color: #333;
  font-size: 14px;
  transition: 0.3s;
}


.sub-menu li a:hover {
  background: linear-gradient(135deg, #f05074, #ff7e5f);
  color: white;
}


.dropdown > a::after {
  content: " ▼";
  font-size: 10px;
  margin-right: 5px;
}


.navigation {
  overflow: visible;
}

.navigation::-webkit-scrollbar {
  display: none;
}


@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

                        `}</style>

                        {/* NAVBAR */}
                        <div className="kode_navigaion_bar">
                            <nav className="navigation" id="trans-nav">
                                <ul className="nav-menu">

                                    <li><Link to="/">الرئيسية</Link></li>
                                    <li><Link to="/about">من نحن</Link></li>
                                    <li><Link to="/autisme">فهم التوحد</Link></li>
                                    <li><Link to="/projets">مشاريعنا</Link></li>
                                    <li><Link to="/nosInfos">أخبارنا</Link></li>
                                    <li><Link to="/nosActivites">أنشطتنا</Link></li>
                                    <li><Link to="/nosPhotos">صورنا</Link></li>
                                    <li><Link to="/partenaires">شركاؤنا</Link></li>

                                    {/* 🔥 مركز بلسم */}
                                    <li className="dropdown">
                                        <Link to="#">مركز بلسم</Link>
                                        <ul className="sub-menu">
                                            <li><Link to="/centre/soutien-psychologique">حصص الدعم النفسي</Link></li>
                                            <li><Link to="/centre/orthophonie">حصص تقويم النطق</Link></li>
                                            <li><Link to="/centre/psychomoteur">حصص النفس حركي</Link></li>
                                            <li><Link to="/centre/education-speciale">حصص التربية الخاصة</Link></li>
                                            <li><Link to="/centre/ergotherapie">حصص العلاج الوظيفي</Link></li>
                                        </ul>
                                    </li>

                                    {/* USER */}
                                    <li>
                                        {user ? (
                                            <>
                                                <Link to="#" style={{ color: '#f05074' }}>
                                                    {user.nom_tuteur} {user.prenom_tuteur}
                                                </Link>
                                                <ul className="sub-menu">
                                                    <li>
                                                        <Link to={`/tuteur/${user.id}/modifier`}>
                                                            حسابي
                                                        </Link>
                                                    </li>
                                                    <li>
                                                        <a href="#" onClick={handleLogout}>
                                                            خروج
                                                        </a>
                                                    </li>
                                                </ul>
                                            </>
                                        ) : (
                                            <Link to="/se_connecter">حسابي</Link>
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