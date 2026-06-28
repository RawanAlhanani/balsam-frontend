import React, { useEffect, useState } from 'react';
import { getActivities, getProjects } from '../../api';
import { Link } from 'react-router-dom';
import { getStorageUrl } from '../../utils/formatters';
import PageBanner from '../../components/PageBanner';

const ProgramsAndActivities = () => {
const [activities, setActivities] = useState([]);
const [projects, setProjects] = useState([]);
const [loading, setLoading] = useState(true);
const [error, setError] = useState(null);
const [activeTab, setActiveTab] = useState('all');

useEffect(() => {
    // جلب البيانات بشكل آمن ومتوازي
    Promise.all([getActivities(), getProjects()])
        .then(([activitiesResponse, projectsResponse]) => {
            if (activitiesResponse && activitiesResponse.data) {
                setActivities(activitiesResponse.data);
            }
            if (projectsResponse && projectsResponse.data) {
                setProjects(projectsResponse.data);
            }
            setLoading(false);
        })
        .catch(err => {
            console.error("Error loading data:", err);
            setError("حدث خطأ أثناء تحميل البيانات، يرجى تحديث الصفحة.");
            setLoading(false);
        });
}, []);

if (loading) {
    return (
        <div style={{ direction: 'rtl', fontFamily: 'Segoe UI, sans-serif', textAlign: 'center', padding: '100px 20px' }}>
            <PageBanner title="البرامج والأنشطة" />
            <h3 style={{ color: '#1e3c72', marginTop: '30px' }}>جاري تحميل الأنشطة والمشاريع...</h3>
        </div>
    );
}

if (error) {
    return (
        <div style={{ direction: 'rtl', fontFamily: 'Segoe UI, sans-serif', textAlign: 'center', padding: '100px 20px' }}>
            <div style={{ background: '#f8d7da', color: '#721c24', padding: '20px', borderRadius: '10px', display: 'inline-block' }}>
                {error}
            </div>
        </div>
    );
}

// تصفية العناصر بدقة لمنع ظهور أي كارت فارغ أو غير معرف
const filteredItems = [
    ...projects.map(p => ({ ...p, itemType: 'project' })),
    ...activities.map(a => ({ ...a, itemType: 'activity' }))
].filter(item => {
    if (activeTab === 'projects') return item.itemType === 'project';
    if (activeTab === 'activities') return item.itemType === 'activity';
    return true;
});

return (
    <>
        <PageBanner/>
    <div style={{ direction: 'rtl', fontFamily: 'Segoe UI, Arial, sans-serif', textAlign: 'right', background: '#f9fbfe', minHeight: '100vh', paddingBottom: '80px' }}>
        
        {/* التنسيقات العصرية مدمجة داخلياً لضمان عدم ضياعها */}
        <style>{`
            .hub-header { text-align: center; padding: 60px 20px 20px; max-width: 800px; margin: 0 auto; }
            .hub-header h2 { font-size: 36px; color: #1e3c72; font-weight: 800; margin-bottom: 15px; }
            .hub-header h2 span { color: #f05074; }
            .hub-header p { color: #5a6e85; font-size: 16px; line-height: 1.8; }

            /* أزرار التصفية الفاخرة */
            .tabs-wrapper { display: flex; justify-content: center; gap: 15px; margin: 30px 0 50px; padding: 0 20px; flex-wrap: wrap; }
            .tab-trigger { background: #ffffff; border: 1px solid #e2e8f0; padding: 12px 30px; font-weight: 700; font-size: 15px; color: #1e3c72; border-radius: 50px; cursor: pointer; transition: all 0.3s ease; box-shadow: 0 4px 10px rgba(0,0,0,0.02); }
            .tab-trigger:hover { border-color: #f05074; color: #f05074; }
            .tab-trigger.active { background: linear-gradient(135deg, #1e3c72 0%, #2a5298 100%); color: #ffffff; border-color: transparent; box-shadow: 0 8px 20px rgba(30,60,114,0.15); }

            /* شبكة عرض البطاقات المبتكرة */
            .grid-container { max-width: 1200px; margin: 0 auto; padding: 0 20px; display: grid; grid-template-columns: repeat(auto-fill, minmax(320px, 1fr)); gap: 30px; }
            
            /* كروت المزيج الرائعة */
            .mix-card { background: #ffffff; border-radius: 20px; border: 1px solid #edf2f7; overflow: hidden; box-shadow: 0 10px 25px rgba(0,0,0,0.03); display: flex; flex-direction: column; justify-content: space-between; transition: transform 0.3s ease, box-shadow 0.3s ease; }
            .mix-card:hover { transform: translateY(-5px); box-shadow: 0 15px 35px rgba(30,60,114,0.08); }

            /* شارات التمييز */
            .media-box { width: 100%; height: 200px; position: relative; overflow: hidden; background: #edf2f7; }
            .media-box img { width: 100%; height: 100%; object-fit: cover; }
            .badge-tag { position: absolute; top: 15px; right: 15px; padding: 6px 14px; border-radius: 30px; font-size: 12px; font-weight: 700; color: #ffffff; box-shadow: 0 4px 10px rgba(0,0,0,0.1); }
            .bg-project { background: linear-gradient(135deg, #1e3c72 0%, #2a5298 100%); }
            .bg-activity { background: linear-gradient(135deg, #f05074 0%, #ff7e5f 100%); }

            /* تفاصيل البطاقة */
            .info-box { padding: 25px; flex-grow: 1; display: flex; flex-direction: column; justify-content: space-between; }
            .meta-flex { display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px; font-size: 13px; color: #718096; }
            .category-label { background: #f7fafc; padding: 4px 12px; border-radius: 20px; font-weight: 600; color: #f05074; border: 1px solid #e2e8f0; }
            
            .info-box h4 { font-size: 18px; font-weight: 700; color: #1e3c72; margin: 0 0 12px; line-height: 1.5; }
            .info-box h4 a { text-decoration: none; color: inherit; }
            .info-box h4 a:hover { color: #f05074; }
            .info-box p { font-size: 14px; color: #4a5568; line-height: 1.7; margin: 0 0 20px; }

            .action-link { display: inline-flex; align-items: center; font-size: 14px; font-weight: 700; color: #f05074; text-decoration: none; transition: color 0.2s; }
            .action-link:hover { color: #1e3c72; }
        `}</style>

        <PageBanner title="البرامج والأنشطة" />

        {/* سكشن التمهيد والترحيب المعبر */}
        <div className="hub-header">
            <h2>مبادرات و برامج <span>جمعية بلسم</span></h2>
            <p>نجمع لكم في هذه المنصة الموحدة كافة الأنشطة الدورية والورشات التعليمية، بالإضافة للمشاريع الكبرى والمستدامة الموجهة لخدمة الصالح العام ورعاية أطفالنا الأحباء.</p>
        </div>

        {/* نظام التبويب السلس للتنقل */}
        <div className="tabs-wrapper">
            <button className={`tab-trigger ${activeTab === 'all' ? 'active' : ''}`} onClick={() => setActiveTab('all')}>
                ✦ جميع المبادرات ({projects.length + activities.length})
            </button>
            <button className={`tab-trigger ${activeTab === 'projects' ? 'active' : ''}`} onClick={() => setActiveTab('projects')}>
                💼 مشاريع الجمعية ({projects.length})
            </button>
            <button className={`tab-trigger ${activeTab === 'activities' ? 'active' : ''}`} onClick={() => setActiveTab('activities')}>
                🎨 الأنشطة والورشات ({activities.length})
            </button>
        </div>

        {/* شبكة الكروت المتفاعلة */}
        <div className="grid-container">
            {filteredItems.map((item) => {
                const isProj = item.itemType === 'project';
                const targetLink = isProj ? `/projet/${item.id}` : `/uneActivite/${item.id}`;
                const finalImage = getStorageUrl(isProj ? item.projet_image : item.image_activite);

                return (
                    <div key={`${item.itemType}-${item.id}`} className="mix-card">
                        
                        {/* غلاف الكارت مع الشارة الذكية */}
                        <div className="media-box">
                            <span className={`badge-tag ${isProj ? 'bg-project' : 'bg-activity'}`}>
                                {isProj ? '💼 مشروع مستدام' : '✨ نشاط وورشة'}
                            </span>
                            <img src={finalImage} alt={item.titre || "بلسم"} />
                        </div>

                        {/* تفاصيل المبادرة */}
                        <div className="info-box">
                            <div>
                                <div className="meta-flex">
                                    <span className="category-label">
                                        {isProj ? "تنمية وتطوير" : (item.typeactivite?.nom_type || "نشاط حي")}
                                    </span>
                                    {!isProj && item.date_activite && (
                                        <span>📅 {item.date_activite}</span>
                                    )}
                                </div>

                                <h4>
                                    <Link to={targetLink}>{item.titre}</Link>
                                </h4>

                                <p>
                                    {item.description 
                                        ? item.description.replace(/--|---|===/g, "").substring(0, 120) + "..."
                                        : "وصف موجز للمبادرة المتاحة حالياً بالمركز لرعاية وتأهيل المستفيدين."}
                                </p>
                            </div>

                            <div style={{ borderTop: '1px solid #f7fafc', paddingTop: '15px' }}>
                                <Link to={targetLink} className="action-link">
                                    اقرأ المزيد وتفاصيل أدق ➔
                                </Link>
                            </div>
                        </div>

                    </div>
                );
            })}
        </div>

    </div>
        </>

);
};

export default ProgramsAndActivities;