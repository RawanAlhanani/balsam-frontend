import React, { useState, useEffect, useRef } from 'react';
import { Link, NavLink, useNavigate, useLocation } from 'react-router-dom';

const Header = () => {
  const [user, setUser] = useState(null);
  const [openMenu, setOpenMenu] = useState(false);
  const [openServices, setOpenServices] = useState(false);
  const [openUserMenu, setOpenUserMenu] = useState(false);
  const [openShareMenu, setOpenShareMenu] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const navigate = useNavigate();
  const { pathname } = useLocation();

  const balsamRef = useRef(null);
  const userRef = useRef(null);
  const shareRef = useRef(null);

  useEffect(() => {
    // Re-read on every navigation, not just on mount — Header persists across
    // client-side route changes, so without this, logging in/out (which
    // navigates but doesn't reload the page) never updates the header until
    // a manual refresh, even though localStorage and auth state are correct.
    const storedUser = localStorage.getItem('user');
    setUser(storedUser ? JSON.parse(storedUser) : null);
    // Also covers browser back/forward navigation, which bypasses the
    // per-link onClick={closeAll} handlers that normally close the drawer.
    setMobileOpen(false);
  }, [pathname]);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 12);
    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
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

  // Lock page scroll while the mobile drawer is open, and let Escape close it.
  useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = 'hidden';
      const handleKeyDown = (e) => { if (e.key === 'Escape') setMobileOpen(false); };
      document.addEventListener('keydown', handleKeyDown);
      return () => {
        document.body.style.overflow = '';
        document.removeEventListener('keydown', handleKeyDown);
      };
    }
  }, [mobileOpen]);

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
    setMobileOpen(false);
  };

  return (
    <header>
      <div className={`kode_eco_navigations${scrolled ? ' is-scrolled' : ''}`}>
        <div className="container">
          <div className="kode_eco-top_bar">

            {/* LOGO */}
            <div className="kode_eco_logo">
              <Link to="/">
                <img src="/content/view/themes/balsam/assests/images/logo.png" alt="شعار جمعية بلسم" />
              </Link>
            </div>

            {/* MOBILE HAMBURGER TOGGLE */}
            <button
              type="button"
              className={`mobile-nav-toggle${mobileOpen ? ' is-active' : ''}`}
              onClick={() => setMobileOpen(o => !o)}
              aria-label={mobileOpen ? 'إغلاق قائمة التنقل' : 'فتح قائمة التنقل'}
              aria-expanded={mobileOpen}
              aria-controls="trans-nav"
            >
              <span></span>
              <span></span>
              <span></span>
            </button>

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

              /* ---------- Narrow-desktop/laptop fit (>991px still uses the
                 horizontal menu, but 11 top-level items at the original
                 20px/10px padding + 8px gaps overflow the 80%-width nav
                 column around ~1000-1300px, pushing the page into horizontal
                 scroll). Tighten spacing so it fits on one line without
                 needing to touch the mobile drawer styles below. */
              @media (max-width: 1300px) {
                .nav-menu { gap: 2px; }
                .navigation > ul > li > a,
                .navigation > ul > li > span {
                  padding: 20px 6px !important;
                  font-size: 13px;
                }
              }

              /* ---------- Mobile hamburger button ---------- */
              .mobile-nav-toggle {
                display: none;
                flex-direction: column;
                justify-content: center;
                align-items: center;
                gap: 5px;
                width: 42px;
                height: 42px;
                border: none;
                border-radius: 10px;
                background: rgba(240, 80, 116, 0.08);
                cursor: pointer;
                z-index: 10001;
                flex-shrink: 0;
              }
              .mobile-nav-toggle span {
                display: block;
                width: 20px;
                height: 2px;
                border-radius: 2px;
                background: #f05074;
                transition: transform .25s ease, opacity .2s ease;
              }
              .mobile-nav-toggle.is-active span:nth-child(1) { transform: translateY(7px) rotate(45deg); }
              .mobile-nav-toggle.is-active span:nth-child(2) { opacity: 0; }
              .mobile-nav-toggle.is-active span:nth-child(3) { transform: translateY(-7px) rotate(-45deg); }

              .mobile-nav-backdrop {
                display: none;
              }

              .mobile-nav-close {
                display: none;
              }

              /* ---------- Mobile layout (<=991px): legacy responsive.css sets
                 .navigation{display:none} here expecting a jQuery dl-menu
                 widget that was never wired into this React header — this
                 block replaces it with a self-contained off-canvas drawer. */
              @media (max-width: 991px) {
                .kode_eco-top_bar {
                  display: flex !important;
                  align-items: center;
                  justify-content: space-between;
                  /* Logo is the first DOM child (right edge in RTL by
                     default) and the hamburger the second (left edge) -
                     reversed here so the hamburger sits on the right and
                     the logo on the left, mobile only. */
                  flex-direction: row-reverse;
                  float: none !important;
                  width: 100% !important;
                  padding: 14px 0 !important;
                  margin-bottom: 0 !important;
                }
                .kode_eco_logo {
                  float: none !important;
                  width: auto !important;
                  margin-bottom: 0 !important;
                }
                .kode_eco_logo img {
                  max-height: 42px;
                  width: auto;
                }
                .kode_navigaion_bar {
                  /* display:contents takes it out of .kode_eco-top_bar's own
                     flex layout (it was an empty third flex item still
                     claiming a justify-content:space-between slot, pushing
                     the hamburger into the middle instead of the edge) while
                     its child <nav> keeps its own closed(display:none)/open
                     (position:fixed) behavior unchanged either way. */
                  display: contents;
                }
                .mobile-nav-toggle { display: flex; }

                .mobile-nav-backdrop {
                  display: block;
                  position: fixed;
                  inset: 0;
                  background: rgba(7, 38, 44, 0.5);
                  z-index: 10000;
                  animation: mobileNavFade .2s ease;
                }

                .navigation.is-mobile-open {
                  display: block !important;
                  position: fixed !important;
                  top: 0;
                  right: 0;
                  float: none !important;
                  width: min(320px, 85vw);
                  height: 100vh;
                  overflow-y: auto;
                  background: #fff;
                  text-align: right;
                  z-index: 10001;
                  padding: 70px 18px 40px;
                  box-shadow: -12px 0 40px rgba(0,0,0,0.22);
                  animation: mobileNavSlide .25s ease;
                }

                .mobile-nav-close {
                  display: flex;
                  align-items: center;
                  justify-content: center;
                  position: absolute;
                  top: 14px;
                  left: 14px;
                  width: 36px;
                  height: 36px;
                  border: none;
                  border-radius: 50%;
                  background: rgba(240, 80, 116, 0.08);
                  color: #f05074;
                  font-size: 16px;
                  cursor: pointer;
                }

                .navigation.is-mobile-open .nav-menu {
                  display: block;
                  width: 100%;
                }
                .navigation.is-mobile-open .nav-menu > li {
                  float: none;
                  width: 100%;
                  white-space: normal;
                  border-bottom: 1px solid #f0f0f0;
                }
                .navigation.is-mobile-open .nav-menu > li > a,
                .navigation.is-mobile-open .nav-menu > li > span {
                  display: flex !important;
                  width: 100%;
                  justify-content: space-between;
                  padding: 15px 4px !important;
                }

                .navigation.is-mobile-open .sub-menu,
                .navigation.is-mobile-open .sub-sub-menu {
                  position: static;
                  left: auto;
                  top: auto;
                  min-width: 0;
                  width: 100%;
                  box-shadow: none;
                  border-radius: 8px;
                  margin: 4px 0 8px;
                  padding: 4px 0;
                  animation: none;
                }
                .navigation.is-mobile-open .sub-menu {
                  background: #fafafa;
                }
                .navigation.is-mobile-open .sub-sub-menu {
                  background: #f2f2f4;
                }
              }

              @keyframes mobileNavSlide {
                from { transform: translateX(100%); }
                to   { transform: translateX(0); }
              }
              @keyframes mobileNavFade {
                from { opacity: 0; }
                to   { opacity: 1; }
              }
              @media (prefers-reduced-motion: reduce) {
                .navigation.is-mobile-open,
                .mobile-nav-backdrop { animation: none; }
              }
            `}</style>

            {/* NAVBAR */}
            <div className="kode_navigaion_bar">
              {mobileOpen && (
                <div className="mobile-nav-backdrop" onClick={closeAll}></div>
              )}
              <nav className={`navigation${mobileOpen ? ' is-mobile-open' : ''}`} id="trans-nav">
                {mobileOpen && (
                  <button type="button" className="mobile-nav-close" onClick={closeAll} aria-label="إغلاق قائمة التنقل">
                    <i className="fa fa-times" aria-hidden="true"></i>
                  </button>
                )}
                <ul className="nav-menu">
                  <li><NavLink to="/" end onClick={closeAll} className={({ isActive }) => isActive ? 'active-link' : ''}>الرئيسية</NavLink></li>
                  <li><NavLink to="/about" onClick={closeAll} className={({ isActive }) => isActive ? 'active-link' : ''}>من نحن</NavLink></li>
                  <li><NavLink to="/autisme" onClick={closeAll} className={({ isActive }) => isActive ? 'active-link' : ''}>فهم التوحد</NavLink></li>
                  <li><NavLink to="/projets" onClick={closeAll} className={({ isActive }) => isActive ? 'active-link' : ''}>مشاريعنا</NavLink></li>
                  <li><NavLink to="/nosInfos" onClick={closeAll} className={({ isActive }) => isActive ? 'active-link' : ''}>أخبارنا</NavLink></li>
                  <li><NavLink to="/nosActivites" onClick={closeAll} className={({ isActive }) => isActive ? 'active-link' : ''}>أنشطتنا</NavLink></li>
                  <li><NavLink to="/nosPhotos" onClick={closeAll} className={({ isActive }) => isActive ? 'active-link' : ''}>صورنا</NavLink></li>
                  <li><NavLink to="/partenaires" onClick={closeAll} className={({ isActive }) => isActive ? 'active-link' : ''}>شركاؤنا</NavLink></li>

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
                      <Link to="/se_connecter" onClick={closeAll}>حسابي</Link>
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
