import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../api';
import {
    AdminPage, AdminPageHeader, AdminCard, AdminLoading, AdminAlert, AdminBtn
} from '../../components/Admin/ui/AdminUI';

const AdminDashboard = () => {
    const [stats, setStats] = useState({
        tuteurs_count: 0,
        activites_count: 0,
        news_count: 0,
        partenaires_count: 0
    });
    const [recentActivities, setRecentActivities] = useState([]);
    const [recentNews, setRecentNews] = useState([]);
    const [recentTuteurs, setRecentTuteurs] = useState([]);
    const [adminRole, setAdminRole] = useState(''); // State for admin role

    const [loading, setLoading] = useState(true);
    const [alert, setAlert] = useState({ message: '', type: '' });

    useEffect(() => {
        // Fetch admin role from local storage
        const role = localStorage.getItem('admin_role');
        if (role) {
            setAdminRole(role);
        }

        const fetchDashboardData = async () => {
            setLoading(true);
            try {
                const [statsRes, activitiesRes, newsRes, tuteursRes] = await Promise.all([
                    api.get('/admin/stats'),
                    api.get('/admin/activities'), // Assuming this returns all activities
                    api.get('/admin/news'),       // Assuming this returns all news
                    api.get('/admin/tuteurs')     // Assuming this returns all tuteurs
                ]);

                setStats(statsRes.data);
                // Sort and take latest 3 for display
                setRecentActivities(activitiesRes.data.sort((a, b) => new Date(b.created_at) - new Date(a.created_at)).slice(0, 3));
                setRecentNews(newsRes.data.sort((a, b) => new Date(b.created_at) - new Date(a.created_at)).slice(0, 3));
                setRecentTuteurs(tuteursRes.data.sort((a, b) => new Date(b.created_at) - new Date(a.created_at)).slice(0, 3));

            } catch (err) {
                console.error("Error fetching dashboard data:", err);
                setAlert({ message: 'خطأ في تحميل بيانات لوحة التحكم.', type: 'danger' });
            } finally {
                setLoading(false);
            }
        };
        fetchDashboardData();
    }, []);

    // Function to translate role for display
    const getTranslatedRole = (role) => {
        switch (role) {
            case 'president': return 'الرئيس';
            case 'secretary': return 'الكاتب العام';
            case 'treasurer': return 'أمين المال';
            case 'member': return 'عضو';
            default: return '';
        }
    };

    return (
        <>
            <AdminPage>
                <AdminPageHeader
                    title="لوحة التحكم"
                    subtitle="نظرة عامة على أداء الموقع وخيارات الإدارة السريعة"
                    badge="الرئيسية"
                />
                <div className="content-body">
                    {loading ? (
                        <AdminLoading />
                    ) : (
                        <>
                            {/* Removed flexWrap: 'nowrap' and overflowX: 'auto' to allow responsive wrapping */}
                            <div className="row admin-dashboard-grid">
                                <div className="col-xl-4 col-lg-6 col-12">
                                    <div className="admin-card">
                                        <div className="admin-card-body">
                                            <div className="d-flex align-items-start">
                                                <div>
                                                    <p className="admin-card-title">المسجلين</p>
                                                    <h2 className="admin-card-value">{stats.tuteurs_count}</h2>
                                                </div>
                                                <div className="admin-card-icon bg-info ml-auto">
                                                    <i className="la la-users"></i>
                                                </div>
                                            </div>
                                            <div className="admin-card-actions">
                                                <Link to="/admin/parents" className="btn btn-sm btn-outline-info">عرض</Link>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="col-xl-4 col-lg-6 col-12">
                                    <div className="admin-card">
                                        <div className="admin-card-body">
                                            <div className="d-flex align-items-start">
                                                <div>
                                                    <p className="admin-card-title">الأنشطة</p>
                                                    <h2 className="admin-card-value">{stats.activites_count}</h2>
                                                </div>
                                                <div className="admin-card-icon bg-warning ml-auto">
                                                    <i className="la la-calendar"></i>
                                                </div>
                                            </div>
                                            <div className="admin-card-actions">
                                                <Link to="/admin/activities" className="btn btn-sm btn-outline-warning">عرض</Link>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="col-xl-4 col-lg-6 col-12">
                                    <div className="admin-card">
                                        <div className="admin-card-body">
                                            <div className="d-flex align-items-start">
                                                <div>
                                                    <p className="admin-card-title">الأخبار</p>
                                                    <h2 className="admin-card-value">{stats.news_count}</h2>
                                                </div>
                                                <div className="admin-card-icon bg-success ml-auto">
                                                    <i className="la la-newspaper-o"></i>
                                                </div>
                                            </div>
                                            <div className="admin-card-actions">
                                                <Link to="/admin/news" className="btn btn-sm btn-outline-success">عرض</Link>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                {/* The fourth card will now wrap to the next row on xl screens if space is tight */}
                                <div className="col-xl-4 col-lg-6 col-12">
                                    <div className="admin-card">
                                        <div className="admin-card-body">
                                            <div className="d-flex align-items-start">
                                                <div>
                                                    <p className="admin-card-title">الشركاء</p>
                                                    <h2 className="admin-card-value">{stats.partenaires_count}</h2>
                                                </div>
                                                <div className="admin-card-icon bg-danger ml-auto">
                                                    <i className="la la-users"></i>
                                                </div>
                                            </div>
                                            <div className="admin-card-actions">
                                                <Link to="/admin/partners" className="btn btn-sm btn-outline-danger">عرض</Link>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="row mt-4">
                                <div className="col-12">
                                    <div className="admin-card admin-welcome-card">
                                        <div className="admin-card-body">
                                            <h4>مرحباً بك، {getTranslatedRole(adminRole)} في لوحة تحكم جمعية بلسم</h4> {/* Personalized message */}
                                            <p className="admin-dashboard-note">تحكم في المحتوى، تابع التقارير، وأدر الأعضاء والمشاريع بسهولة. استخدم القائمة الجانبية للوصول السريع إلى أي قسم.</p>
                                            <div className="admin-welcome-actions">
                                                <Link to="/admin/static-pages">الصفحات الثابتة</Link>
                                                <Link to="/admin/media">الصور والمعرض</Link>
                                                <Link to="/admin/settings">إعدادات النظام</Link>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Quick Actions Card */}
                            <div className="row mt-4">
                                <div className="col-12">
                                    <AdminCard title="إجراءات سريعة" icon="la-bolt">
                                        <div className="admin-card-actions">
                                            <AdminBtn variant="success" icon="la-plus" as={Link} to="/admin/activities">إضافة نشاط جديد</AdminBtn>
                                            <AdminBtn variant="success" icon="la-plus" as={Link} to="/admin/news">إضافة خبر جديد</AdminBtn>
                                            <AdminBtn variant="success" icon="la-plus" as={Link} to="/admin/partners">إضافة شريك جديد</AdminBtn>
                                            <AdminBtn variant="success" icon="la-plus" as={Link} to="/admin/static-pages/add">إضافة محتوى صفحة ثابتة</AdminBtn>
                                        </div>
                                    </AdminCard>
                                </div>
                            </div>

                            {/* Recent Activity Card */}
                            <div className="row mt-4">
                                <div className="col-12">
                                    <AdminCard title="الأنشطة الأخيرة" icon="la-history">
                                        <div className="row">
                                            <div className="col-md-4">
                                                <h5 className="admin-section-title">آخر الأنشطة</h5>
                                                <ul className="list-group">
                                                    {recentActivities.length > 0 ? (
                                                        recentActivities.map(activity => (
                                                            <li key={activity.id} className="list-group-item d-flex justify-content-between align-items-center">
                                                                <Link to={`/admin/activities`}>{activity.titre}</Link> {/* Link to activities list */}
                                                                <small className="text-muted">{new Date(activity.created_at).toLocaleDateString()}</small>
                                                            </li>
                                                        ))
                                                    ) : (
                                                        <li className="list-group-item text-muted">لا توجد أنشطة حديثة.</li>
                                                    )}
                                                </ul>
                                            </div>
                                            <div className="col-md-4">
                                                <h5 className="admin-section-title">آخر الأخبار</h5>
                                                <ul className="list-group">
                                                    {recentNews.length > 0 ? (
                                                        recentNews.map(newsItem => (
                                                            <li key={newsItem.id} className="list-group-item d-flex justify-content-between align-items-center">
                                                                <Link to={`/admin/news`}>{newsItem.titre}</Link> {/* Link to news list */}
                                                                <small className="text-muted">{new Date(newsItem.created_at).toLocaleDateString()}</small>
                                                            </li>
                                                        ))
                                                    ) : (
                                                        <li className="list-group-item text-muted">لا توجد أخبار حديثة.</li>
                                                    )}
                                                </ul>
                                            </div>
                                            <div className="col-md-4">
                                                <h5 className="admin-section-title">آخر المسجلين</h5>
                                                <ul className="list-group">
                                                    {recentTuteurs.length > 0 ? (
                                                        recentTuteurs.map(tuteur => (
                                                            <li key={tuteur.id} className="list-group-item d-flex justify-content-between align-items-center">
                                                                <Link to={`/admin/parents`}>{tuteur.nom_tuteur} {tuteur.prenom_tuteur}</Link> {/* Corrected property names */}
                                                                <small className="text-muted">{new Date(tuteur.created_at).toLocaleDateString()}</small>
                                                            </li>
                                                        ))
                                                    ) : (
                                                        <li className="list-group-item text-muted">لا يوجد مسجلون حديثون.</li>
                                                    )}
                                                </ul>
                                            </div>
                                        </div>
                                    </AdminCard>
                                </div>
                            </div>
                        </>
                    )}
                </div>
            </AdminPage>
            {alert.message && (
                <AdminAlert message={alert.message} type={alert.type} onClose={() => setAlert({ message: '', type: '' })} />
            )}
        </>
    );
};

export default AdminDashboard;