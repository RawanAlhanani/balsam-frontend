import React from 'react';
import { Link } from 'react-router-dom';
import Header from '../../components/Header/Header';
import PageBanner from '../../components/PageBanner/PageBanner';


export default function MotorTherapy() {
    return (
        <>
            <PageBanner/>
        <div style={{ direction: 'rtl', fontFamily: 'Segoe UI, Arial, sans-serif', textAlign: 'right', background: '#fcfdfe', overflowX: 'hidden', position: 'relative' }}>
            <style>{`
                :root {
                    --primary-gradient: linear-gradient(135deg, #11998e 0%, #38ef7d 100%); /* تدرج حيوي يعبر عن النشاط والحركة */
                    --dark-gradient: linear-gradient(135deg, #1e3c72 0%, #2a5298 100%);
                    --mint: #11998e;
                    --mint-light: rgba(17, 153, 142, 0.06);
                    --blue-light: rgba(30, 60, 114, 0.04);
                    --text-dark: #1a202c;
                    --text-muted: #5a6e85;
                }

                /* الخلفية الفنية التجريدية الخلفية */
                .bg-blob-1 { position: absolute; top: 15%; right: -100px; width: 450px; height: 450px; background: rgba(56, 239, 125, 0.06); filter: blur(90px); border-radius: 50%; z-index: 0; pointer-events: none; }
                .bg-blob-2 { position: absolute; top: 60%; left: -100px; width: 450px; height: 450px; background: rgba(30, 60, 114, 0.04); filter: blur(100px); border-radius: 50%; z-index: 0; pointer-events: none; }

                /* Hero Section بتصميم عصري */
                .modern-hero { position: relative; padding: 120px 24px 80px; text-align: center; background: radial-gradient(circle at center, #ffffff 0%, #f4f9f6 100%); z-index: 1; }
                .service-badge { display: inline-flex; align-items: center; gap: 8px; background: white; border: 1px solid rgba(17, 153, 142, 0.2); color: var(--mint); font-size: 14px; padding: 8px 20px; border-radius: 100px; margin-bottom: 24px; font-weight: 600; box-shadow: 0 4px 15px rgba(17, 153, 142, 0.05); }
                .modern-hero h1 { font-size: 46px; font-weight: 800; color: var(--text-dark); margin: 0 0 20px; line-height: 1.3; }
                .modern-hero h1 span { background: var(--primary-gradient); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
                .modern-hero p { font-size: 19px; color: var(--text-muted); max-width: 750px; line-height: 1.8; margin: 0 auto; }

                /* الحاوية والشبكة الذكية المدعومة بالصور */
                .main-grid { max-width: 1100px; margin: 0 auto; padding: 0 24px 120px; position: relative; z-index: 1; display: grid; grid-template-columns: repeat(2, 1fr); gap: 35px; }
                .full-width-card { grid-column: span 2; }

                /* تصميم الكروت التفاعلية الهجينة (نص + صورة) */
                .interactive-card { background: #ffffff; border-radius: 24px; padding: 40px; border: 1px solid rgba(220, 235, 225, 0.6); box-shadow: 0 10px 30px rgba(165, 185, 175, 0.06); transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1); position: relative; overflow: hidden; display: flex; flex-direction: column; justify-content: space-between; }
                .interactive-card::before { content: ''; position: absolute; top: 0; left: 0; width: 100%; height: 4px; background: transparent; transition: background 0.3s; }
                .interactive-card:hover::before { background: var(--primary-gradient); }
                .interactive-card:hover { transform: translateY(-6px); box-shadow: 0 20px 40px rgba(17, 153, 142, 0.09); border-color: rgba(17, 153, 142, 0.15); }

                /* ميديا وصور داخل الكروت */
                .card-image-wrapper { width: 100%; height: 200px; border-radius: 16px; overflow: hidden; margin-bottom: 24px; position: relative; border: 1px solid #edf2f7; }
                .card-image-wrapper img { width: 100%; height: 100%; object-fit: cover; transition: transform 0.5s; }
                .interactive-card:hover .card-image-wrapper img { transform: scale(1.06); }

                /* أيقونات وعناوين البطاقات */
                .card-icon-wrapper { width: 56px; height: 56px; border-radius: 16px; display: flex; align-items: center; justify-content: center; font-size: 26px; margin-bottom: 24px; transition: transform 0.3s; }
                .interactive-card:hover .card-icon-wrapper { transform: scale(1.1) rotate(5deg); }
                .icon-bg-mint { background: rgba(17, 153, 142, 0.07); color: var(--mint); }
                .icon-bg-blue { background: rgba(30, 60, 114, 0.06); color: #1e3c72; }
                
                .interactive-card h3 { font-size: 22px; color: #1e3c72; font-weight: 700; margin: 0 0 16px; }
                .interactive-card p { font-size: 16px; color: var(--text-muted); line-height: 1.8; margin: 0; }

                /* القائمة المحدثة بالكامل */
                .modern-list { list-style: none; padding: 0; margin: 0; display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 16px; width: 100%; }
                .modern-list li { background: #f4fbf7; border-radius: 14px; padding: 18px 20px; font-size: 16px; color: var(--text-dark); font-weight: 500; display: flex; align-items: center; gap: 12px; border: 1px solid #e6f4ed; transition: all 0.2s; }
                .modern-list li::before { content: '⚡'; color: #38ef7d; font-size: 16px; }
                .modern-list li:hover { background: white; border-color: rgba(56, 239, 125, 0.3); transform: translateX(-5px); }

                /* Call To Action فخم وغير تقليدي */
                .premium-cta { grid-column: span 2; background: var(--dark-gradient); border-radius: 32px; padding: 60px 40px; text-align: center; position: relative; overflow: hidden; box-shadow: 0 20px 50px rgba(30, 60, 114, 0.2); }
                .premium-cta h4 { font-size: 28px; font-weight: 800; color: #ffffff !important; margin: 0 0 12px; }
                .premium-cta p { font-size: 17px; color: rgba(255,255,255,0.85) !important; margin: 0 0 32px; max-width: 600px; margin-inline: auto; line-height: 1.7; }
                .modern-cta-btn { display: inline-flex; align-items: center; gap: 10px; background: #ffffff; color: #1e3c72 !important; font-weight: 700; font-size: 16px; padding: 16px 40px; border-radius: 16px; text-decoration: none; box-shadow: 0 10px 25px rgba(0,0,0,0.1); transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1); }
                .modern-cta-btn:hover { transform: translateY(-3px) scale(1.02); box-shadow: 0 15px 30px rgba(0,0,0,0.15); background: var(--primary-gradient); color: #ffffff !important; }

                @media (max-width: 900px) {
                    .main-grid { grid-template-columns: 1fr; gap: 24px; }
                    .full-width-card, .premium-cta { grid-column: span 1; }
                    .modern-hero h1 { font-size: 32px; }
                    .premium-cta { padding: 40px 24px; }
                }
            `}</style>

            <Header />

            <div className="bg-blob-1"></div>
            <div className="bg-blob-2"></div>

            <section className="modern-hero">
                <div className="service-badge">
                    <span>🏃‍♂️</span> العلاجات الفيزيائية والحركية
                </div>
                <h1>التررويض الحركي و<span>التناسق الجسدي</span></h1>
                <p>نعمل على تعزيز اللياقة العضلية العامة للطفل، تحسين التوازن الديناميكي، وضبط التوجيه الحركي والمكاني لجسده بيسر وأمان.</p>
            </section>

            <div className="main-grid">
                
                <div className="interactive-card">
                    <div>
                        <div className="card-image-wrapper">
                            <img src="https://images.unsplash.com/photo-1516627145497-ae6968895b74?q=80&w=600&auto=format&fit=crop" alt="تعريف الترويض الحركي" />
                        </div>
                        <div className="card-icon-wrapper icon-bg-mint">🟢</div>
                        <h3>تعريف الخدمة</h3>
                        <p>جلسات وعلاجات حركية وفيزيائية متكاملة تسعى لتطوير اللياقة والقدرة العضلية العامة للطفل وتحسين توازنه العام وتناسق حركاته الكبرى لتأمين حركية مستقرة مستقلة.</p>
                    </div>
                </div>

                <div className="interactive-card">
                    <div>
                        <div className="card-image-wrapper">
                            <img src="https://images.unsplash.com/photo-1502086223501-7ea6ecd79368?q=80&w=600&auto=format&fit=crop" alt="الأطفال المستفيدون" />
                        </div>
                        <div className="card-icon-wrapper icon-bg-blue">🎯</div>
                        <h3>الفئة المستفيدة</h3>
                        <p>الأطفال الذين يعانون من خمول حركي، تشنج أو ارتخاء عضلي، عدم الاتزان أثناء المشي والجري، أو صعوبة في ضبط التوجيه الجسدي العام والمكاني.</p>
                    </div>
                </div>

                <div className="interactive-card full-width-card">
                    <div>
                        <div className="card-icon-wrapper icon-bg-mint">📌</div>
                        <h3>أهداف الخدمة المستدامة</h3>
                        <ul className="modern-list">
                            <li>تقوية الجهاز العضلي وتحسين المرونة والقدرة الجسدية الشاملة للطفل.</li>
                            <li>تطوير مهارات التوازن والتحكم التلقائي الذاتي في الجسد أثناء الحركة واللعب.</li>
                            <li>تعزيز التآزر الحركي البصري (العين، اليد، والقدم) وتناسق الاتجاهات المختلفة معاً.</li>
                        </ul>
                    </div>
                </div>

                <div className="interactive-card">
                    <div>
                        <div className="card-icon-wrapper icon-bg-blue">⚙️</div>
                        <h3>طريقة الاشتغال</h3>
                        <p>تتم الاستفادة داخل قاعة الترويض الطبي الخاصة بالمركز والمجهزة بأحدث المعدات، الكرات العلاجية، والمسارات الحركية المصممة للأطفال عبر تمارين مدروسة ومحفزة للنشاط البدني.</p>
                    </div>
                </div>

                <div className="interactive-card">
                    <div>
                        <div className="card-icon-wrapper icon-bg-mint">👥</div>
                        <h3>الفريق المشرف</h3>
                        <p>أخصائيون مجازون رسمياً في الترويض الطبي والعلاج الفيزيائي الحركي المتخصص للأطفال الصغار بطرق بيداغوجية حديثة وممتعة.</p>
                    </div>
                </div>

                <div className="premium-cta">
                    <h4>امنح طفلك القوة والتوازن المناسب لغدٍ أفضل</h4>
                    <p>لحجز مقعد لطفلكم ضمن برنامج الترويض الحركي المتقدم وتلقي التقييم الأولي، يرجى تعبئة طلب التسجيل الإلكتروني بالبوابة مباشرة.</p>
                    <Link to="/inscription" className="modern-cta-btn">
                        <span>سجل طفلك الآن بالمركز</span> 📝
                    </Link>
                </div>

            </div>

        </div>
        </>
    );
}