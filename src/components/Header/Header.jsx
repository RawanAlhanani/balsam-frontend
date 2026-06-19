import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Header = () => {
  const [user, setUser] = useState(null);
  const [openMenu, setOpenMenu] = useState(false);
  const [openServices, setOpenServices] = useState(false);
  const [openUserMenu, setOpenUserMenu] = useState(false);
  const [openShareMenu, setOpenShareMenu] = useState(false);
  const navigate = useNavigate();
  
  const balsamRef = useRef(null);
  const userRef = useRef(null);
  const shareRef = useRef(null);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) setUser(JSON.parse(storedUser));
  }, []);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (balsamRef.current && !balsamRef.current.contains(e.target)) {
        setOpenMenu(false);
        setOpenServices(false);
      }
      if (userRef.current && !userRef.current.contains(e.target)) {
        setOpenUserMenu(false);
      }
      if (shareRef.current && !shareRef.current.contains(e.target)) {
        setOpenShareMenu(false);
      }
    };
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    navigate('/');
  };

  const closeAll = () => {
    setOpenMenu(false);
    setOpenServices(false);
    setOpenUserMenu(false);
    setOpenShareMenu(false);
  };

  return (
    <header>
      <div className="kode_eco_navigations">
        <div className="container">
          <div className="kode_eco-top_bar">

            {/* LOGO */}
            <div className="kode_eco_logo">
              <Link to="/">
                <img src="/content/view/themes/balsam/assests/images/logo.png" alt="logo" />
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

              .navigation > ul > li > a,
              .navigation > ul > li > span {
                padding: 20px 10px !important;
                font-size: 14px;
                display: inline-flex;
                align-items: center;
                gap: 4px;
                cursor: pointer;
              }

              .sub-menu {
                display: block;
                position: absolute;
                top: 100%;
                right: 0;
                background: #fff;
                min-width: 230px;
                border-radius: 10px;
                box-shadow: 0 10px 25px rgba(0,0,0,0.15);
                padding: 8px 0;
                z-index: 9999;
                animation: fadeDown 0.15s ease;
              }

              @keyframes fadeDown {
                from { opacity: 0; transform: translateY(-6px); }
                to   { opacity: 1; transform: translateY(0); }
              }

              .sub-menu li {
                list-style: none;
                position: relative;
              }

              .sub-menu li a,
              .sub-menu li .sub-trigger {
                display: flex;
                align-items: center;
                justify-content: space-between;
                padding: 11px 20px;
                color: #333;
                font-size: 14px;
                text-decoration: none;
                transition: 0.2s;
                cursor: pointer;
                white-space: nowrap;
              }

              .sub-menu li a:hover,
              .sub-menu li .sub-trigger:hover,
              .sub-menu li .sub-trigger.active {
                background: linear-gradient(135deg, #f05074, #ff7e5f);
                color: white;
              }

              .sub-divider {
                border: none;
                border-top: 1px solid #f0f0f0;
                margin: 5px 12px;
              }

              .sub-sub-menu {
                position: absolute;
                top: 0;
                left: calc(100% + 4px);
                background: #fff;
                min-width: 220px;
                border-radius: 10px;
                box-shadow: 0 10px 25px rgba(0,0,0,0.15);
                padding: 8px 0;
                z-index: 10000;
                animation: fadeDown 0.15s ease;
              }

              .sub-sub-menu li { list-style: none; }

              .sub-sub-menu li a {
                display: block;
                padding: 11px 20px;
                color: #333;
                font-size: 14px;
                text-decoration: none;
                transition: 0.2s;
              }

              .sub-sub-menu li a:hover {
                background: linear-gradient(135deg, #f05074, #ff7e5f);
                color: white;
              }

              .sub-category-label {
                font-size: 11px;
                color: #bbb;
                padding: 4px 20px 6px;
                letter-spacing: 0.05em;
                text-transform: uppercase;
              }

              .arrow-down {
                font-size: 9px;
                opacity: 0.7;
              }

              .sub-arrow {
                font-size: 9px;
                opacity: 0.5;
              }

              .navigation { overflow: visible; }
            `}</style>

            {/* NAVBAR */}
            <div className="kode_navigaion_bar">
              <nav className="navigation" id="trans-nav">
                <ul className="nav-menu">
                  <li><Link to="/" onClick={closeAll}>الرئيسية</Link></li>
                  <li><Link to="/about" onClick={closeAll}>من نحن</Link></li>
                  <li><Link to="/autisme" onClick={closeAll}>فهم التوحد</Link></li>
                  <li><Link to="/projets" onClick={closeAll}>مشاريعنا</Link></li>
                  <li><Link to="/nosInfos" onClick={closeAll}>أخبارنا</Link></li>
                  <li><Link to="/nosActivites" onClick={closeAll}>أنشطتنا</Link></li>
                  <li><Link to="/nosPhotos" onClick={closeAll}>صورنا</Link></li>
                  <li><Link to="/partenaires" onClick={closeAll}>شركاؤنا</Link></li>

                  {/* ─── مركز بلسم ─── */}
                  <li ref={balsamRef}>
                    <a
                      href="#"
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        setOpenMenu(!openMenu);
                        if (openMenu) setOpenServices(false);
                      }}
                    >
                      مركز بلسم <span className="arrow-down">▼</span>
                    </a>

                    {openMenu && (
                      <ul className="sub-menu" onClick={(e) => e.stopPropagation()}>
                        <li><Link to="/centre/about" onClick={closeAll}>عن المركز</Link></li>
                        <hr className="sub-divider" />
                        
                        {/* خدمات التكفل */}
                        <li>
                          <span
                            className={`sub-trigger ${openServices ? 'active' : ''}`}
                            onClick={(e) => {
                              e.stopPropagation();
                              setOpenServices(!openServices);
                            }}
                          >
                            خدمات التكفل والتأهيل
                            <span className="sub-arrow">◀</span>
                          </span>

                          {openServices && (
                            <ul className="sub-sub-menu">
                              <div className="sub-category-label">خدماتنا</div>
                              <li><Link to="/centre/psychological-support" onClick={closeAll}>الدعم النفسي</Link></li>
                              <li><Link to="/centre/orthophonie" onClick={closeAll}>تقويم النطق والتواصل</Link></li>
                              <li><Link to="/centre/psychomoteur" onClick={closeAll}>الترويض الحركي</Link></li>
                              <li><Link to="/centre/education-speciale" onClick={closeAll}>التربية الخاصة</Link></li>
                              <li><Link to="/centre/ergotherapie" onClick={closeAll}>العلاج الوظيفي</Link></li>
                            </ul>
                          )}
                        </li>

                        <hr className="sub-divider" />
                        <li><Link to="/centre/process" onClick={closeAll}>مسار الاستفادة من الخدمات</Link></li>
                        <li><Link to="/centre/inscription" onClick={closeAll}>التسجيل والالتحاق بالمركز</Link></li>
                        <li><Link to="/centre/programmes" onClick={closeAll}>البرامج والأنشطة</Link></li>
                        <hr className="sub-divider" />
                        <li><Link to="/centre/team" onClick={closeAll}>فريق بلسم</Link></li>
                        <li><Link to="/centre/contact" onClick={closeAll}>تواصل مع المركز</Link></li>
                      </ul>
                    )}
                  </li>

                  {/* ─── شاركنا ─── */}
                  <li ref={shareRef}>
                    <a
                      href="#"
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        setOpenShareMenu(!openShareMenu);
                      }}
                    >
                      شاركنا <span className="arrow-down">▼</span>
                    </a>
                    {openShareMenu && (
                      <ul className="sub-menu" onClick={(e) => e.stopPropagation()}>
                        <li>
                          <Link to="/centre/devenir-benevole" onClick={closeAll}>تطوع معنا</Link>
                        </li>
                        <li>
                          <Link to="/centre/devenir-stagiaire" onClick={closeAll}> طلب تدريب (Stage)</Link>
                        </li>
                      </ul>
                    )}
                  </li>

                  {/* ─── COMPTE UTILISATEUR ─── */}
                  <li ref={userRef}>
                    {user ? (
                      <>
                        <a
                          href="#"
                          style={{ color: '#f05074' }}
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            setOpenUserMenu(!openUserMenu);
                          }}
                        >
                          {user.nom_tuteur || user.nom_stagiaire} {user.prenom_tuteur || user.prenom_stagiaire} <span className="arrow-down">▼</span>
                        </a>
                        {openUserMenu && (
                          <ul className="sub-menu" onClick={(e) => e.stopPropagation()}>
                            <li>
                              <Link to={user.nom_stagiaire ? `/stagiaire/${user.id}/modifier` : `/tuteur/${user.id}/modifier`} onClick={closeAll}>حسابي</Link>
                            </li>
                            <li>
                              <a href="#" onClick={(e) => { e.preventDefault(); handleLogout(); }}>خروج</a>
                            </li>
                          </ul>
                        )}
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