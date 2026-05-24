import React from 'react';
import { Link } from 'react-router-dom';

const AdminSidebar = () => {
    return (
        <div className="main-menu menu-fixed menu-light menu-accordion menu-shadow" data-scroll-to-active="true">
            <div className="main-menu-content">
                <ul className="navigation navigation-main" id="main-menu-navigation" data-menu="menu-navigation">
                    <li className="nav-item">
                        <a href="#"><i className="la la-home"></i><span className="menu-title">المسجلين في الموقع</span></a>
                        <ul className="menu-content">
                            <li className="active"><Link className="menu-item" to="/admin/tuteurs">أولياء الأمور وأبناؤهم</Link></li>
                        </ul>
                    </li>
                    <li className="nav-item">
                        <a href="#"><i className="la la-home"></i><span className="menu-title">الأنشطة</span></a>
                        <ul className="menu-content">
                            <li><Link className="menu-item" to="/admin/activites">جميع الأنشطة</Link></li>
                            <li><Link className="menu-item" to="/admin/ajoutActivite">إضافة نشاط</Link></li>
                        </ul>
                    </li>
                    <li className="nav-item">
                        <a href="#"><i className="la la-home"></i><span className="menu-title">الأخبار</span></a>
                        <ul className="menu-content">
                            <li><Link className="menu-item" to="/admin/infos">جميع الأخبار</Link></li>
                            <li><Link className="menu-item" to="/admin/ajoutInfo">إضافة خبر</Link></li>
                        </ul>
                    </li>
                    <li className="nav-item">
                        <a href="#"><i className="la la-home"></i><span className="menu-title">الشركاء</span></a>
                        <ul className="menu-content">
                            <li><Link className="menu-item" to="/admin/partenaires">جميع الشركاء</Link></li>
                            <li><Link className="menu-item" to="/admin/ajoutPartenaire">إضافة شريك</Link></li>
                        </ul>
                    </li>
                    <li className="nav-item">
                        <a href="#"><i className="la la-home"></i><span className="menu-title">الصورة الرئيسية</span></a>
                        <ul className="menu-content">
                            <li><Link className="menu-item" to="/admin/imagesprincipales">جميع الصور الرئيسية</Link></li>
                            <li><Link className="menu-item" to="/admin/ajoutImagesPrincipales">إضافة صور رئيسية</Link></li>
                        </ul>
                    </li>
                    <li className="nav-item">
                        <a href="#"><i className="la la-home"></i><span className="menu-title">معرض الصور</span></a>
                        <ul className="menu-content">
                            <li><Link className="menu-item" to="/admin/imagesexpos">جميع الصور</Link></li>
                            <li><Link className="menu-item" to="/admin/addImageExpo">إضافة صور</Link></li>
                        </ul>
                    </li>
                    <li className="nav-item">
                        <a href="#"><i className="la la-home"></i><span className="menu-title">صفحات التوحد</span></a>
                        <ul className="menu-content">
                            <li><Link className="menu-item" to="/admin/pagesautisme">جميع الصفحات</Link></li>
                            <li><Link className="menu-item" to="/admin/ajoutPageAutisme">إضافة صفحة</Link></li>
                        </ul>
                    </li>
                    <li className="nav-item">
                        <a href="#"><i className="la la-home"></i><span className="menu-title">من نحن</span></a>
                        <ul className="menu-content">
                            <li><Link className="menu-item" to="/admin/aboutuses">جميع الصفحات</Link></li>
                            <li><Link className="menu-item" to="/admin/ajoutAboutUs">إضافة صفحة</Link></li>
                        </ul>
                    </li>
                    <li className="nav-item">
                        <a href="#"><i className="la la-home"></i><span className="menu-title">مشاريعنا</span></a>
                        <ul className="menu-content">
                            <li><Link className="menu-item" to="/admin/projets">جميع الصفحات</Link></li>
                            <li><Link className="menu-item" to="/admin/ajoutProjet">إضافة صفحة</Link></li>
                        </ul>
                    </li>
                    <li className="nav-item">
                        <a href="#"><i className="la la-home"></i><span className="menu-title">إعدادات</span></a>
                        <ul className="menu-content">
                            <li><Link className="menu-item" to="/admin/types">جميع أنواع الأنشطة</Link></li>
                            <li><Link className="menu-item" to="/admin/ajouttype">إضافة نوع نشاط</Link></li>
                            <li><Link className="menu-item" to="/admin/regions">جميع المناطق</Link></li>
                            <li><Link className="menu-item" to="/admin/ajoutregion">إضافة منطقة</Link></li>
                            <li><Link className="menu-item" to="/admin/doctors">جميع الإختصاصات</Link></li>
                            <li><Link className="menu-item" to="/admin/ajoutDoctor">إضافة اختصاص</Link></li>
                        </ul>
                    </li>
                </ul>
            </div>
        </div>
    );
};

export default AdminSidebar;
