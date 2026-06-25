import React, { useState, useEffect } from 'react';
import api from '../../api';

const TeamPage = () => {
    const [team, setTeam] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchTeam();
    }, []);

    const fetchTeam = async () => {
        try {
            const res = await api.get('/admin/accounts');

            const filtered = res.data.filter(user =>
                ['president', 'vice_president', 'secretary', 'treasurer'].includes(user.role)
            );

            setTeam(filtered);
        } catch (err) {
            console.error("Erreur lors du chargement de l'équipe:", err);
        } finally {
            setLoading(false);
        }
    };

    const getRoleDetails = (role) => {
        switch (role?.toLowerCase()) {
            case 'president':
                return { text: 'رئيس الجمعية', color: 'badge-danger' };
            case 'vice_president':
                return { text: 'نائب الرئيس', color: 'badge-warning' };
            case 'secretary':
                return { text: 'الكاتب العام', color: 'badge-success' };
            case 'treasurer':
                return { text: 'أمين المال', color: 'badge-primary' };
            default:
                return { text: 'عضو الطاقم', color: 'badge-info' };
        }
    };

    return (
        <div
            className="main-content"
            style={{
                direction: 'rtl',
                textAlign: 'right',
                backgroundColor: '#f8fafc', // 👈 خلفية مهدئة ومريحة جداً للعين (Soft Slate)
                minHeight: '100vh',
                fontFamily: 'inherit'
            }}
        >
            {/* ⚪ الهيدر البسيط والموزون مساحاتياً */}
            <div className="bg-white border-bottom border-light" style={{ padding: '80px 0 50px 0' }}> {/* 👈 تم تكبير المساحة العلوية والسفلية لراحة بصرية أكبر */}
                <div className="container text-center">
                    <h1 className="fw-bold position-relative d-inline-block pb-3" style={{ fontSize: '2.4rem', color: '#1e3a8a' }}> {/* 👈 لون كحلي نيلي فاخر وغير مزعج */}
                        فريق العمل والمسؤولين
                        <span className="position-absolute bottom-0 start-50 translate-middle-x" style={{ width: '60px', height: '3px', backgroundColor: '#3b82f6', borderRadius: '2px' }}></span>
                    </h1>
                    <p className="text-muted mx-auto mt-3 fs-6" style={{ maxWidth: '500px', fontWeight: '400', color: '#64748b' }}>
                        الهيئة الإدارية الساهرة على إدارة وتسيير مشاريع جمعية بلسم
                    </p>
                </div>
            </div>

            <div className="container pb-5">
                {loading ? (
                    <div className="text-center my-5 py-5">
                        <div className="spinner-border text-primary" role="status" style={{ width: '2.5rem', height: '2.5rem' }}>
                            <span className="visually-hidden">جاري التحميل...</span>
                        </div>
                    </div>
                ) : team.length === 0 ? (
                    <div className="alert alert-light text-center shadow-sm border py-4" style={{ borderRadius: '12px', color: '#64748b' }}>
                        لا يوجد أعضاء في الهيئة الإدارية مضافين حالياً.
                    </div>
                ) : (
                    <div className="row justify-content-center">
                        {team.map(member => {
                            const roleDetails = getRoleDetails(member.role);

                            return (
                                <div className="col-12 col-md-6 col-lg-4 mb-4" key={member.id}>
                                    <div className="card h-100 border-0 card-minimalistic p-4">
                                        
                                        <div className="card-body d-flex flex-column justify-content-between p-0">
                                            <div>
                                                {/* شارة المنصب في الأعلى كعنوان فرعي ملوّن بارد */}
                                                <div className="mb-2">
                                                    <span className={`badge-role ${roleDetails.color}`}>
                                                        {roleDetails.text}
                                                    </span>
                                                </div>

                                                {/* الاسم بخط عريض وأنيق */}
                                                <h3 className="fw-bold mb-3 text-name" title={member.name}>
                                                    {member.name}
                                                </h3>
                                                
                                                {/* نبذة صغيرة منسقة */}
                                                <p className="text-secondary small lh-relaxed mb-4" style={{ color: '#64748b' }}>
                                                    يتولى مهام الإشراف والمتابعة المستمرة لكافة الأنشطة والخدمات التمكينية لضمان تحقيق رؤية وأهداف المركز.
                                                </p>
                                            </div>

                                            {/* رابط البريد الإلكتروني الأنيق جداً في الأسفل */}
                                            <div className="pt-3 border-top border-light-subtle">
                                                <a 
                                                    href={`mailto:${member.email}`} 
                                                    className="email-link d-flex align-items-center gap-2"
                                                >
                                                    <i className="la la-envelope-open fs-5"></i>
                                                    <span className="text-truncate">{member.email}</span>
                                                </a>
                                            </div>
                                        </div>

                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>

            {/* 💅 ستايلات الـ Minimal CSS الاحترافية بلمسات لونية ناعمة */}
            <style>{`
                /* تنسيق البطاقات المبسطة */
                .card-minimalistic {
                    border-radius: 16px !important;
                    background: #ffffff !important;
                    box-shadow: 0 4px 20px rgba(15, 23, 42, 0.015) !important;
                    border: 1px solid #e2e8f0 !important;
                    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1) !important;
                }
                
                .card-minimalistic:hover {
                    transform: translateY(-5px);
                    box-shadow: 0 12px 30px rgba(30, 58, 138, 0.05) !important;
                    border-color: #cbd5e1 !important;
                }

                /* اسم العضو */
                .text-name {
                    color: #0f172a !important; /* لون رمادي داكن يقارب الأسود ومريح جداً */
                    font-size: 1.35rem;
                    letter-spacing: -0.3px;
                }

                /* رابط الإيميل التفاعلي */
                .email-link {
                    color: #64748b;
                    text-decoration: none;
                    font-size: 0.88rem;
                    font-weight: 500;
                    transition: color 0.2s ease;
                }

                .card-minimalistic:hover .email-link {
                    color: #3b82f6;
                }

                .email-link:hover {
                    color: #1d4ed8 !important;
                    text-decoration: underline !important;
                }

                /* تصميم الشارات بخلفيات ناعمة جداً وباردة (Pastel Colors) غير مزعجة */
                .badge-role {
                    display: inline-block;
                    padding: 4px 12px;
                    border-radius: 6px;
                    font-size: 0.8rem;
                    font-weight: 600;
                }

                .badge-danger { background-color: #fef2f2; color: #ef4444; }
                .badge-warning { background-color: #fffbeb; color: #d97706; }
                .badge-success { background-color: #f0fdf4; color: #16a34a; }
                .badge-primary { background-color: #eff6ff; color: #3b82f6; }
                .badge-info { background-color: #ecfeff; color: #0891b2; }
            `}</style>
        </div>
    );
};

export default TeamPage;