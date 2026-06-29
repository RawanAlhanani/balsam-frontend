import React from 'react';
import { Link } from 'react-router-dom';
import PageBanner from '../../components/PageBanner';

export default function SpeechTherapy() {
    return (
        <>
              
       
        <div style={{ direction: 'rtl', fontFamily: 'Segoe UI, Arial, sans-serif', textAlign: 'right', background: '#fdfeff', overflowX: 'hidden', position: 'relative' }}>
            <style>{`
                :root {
                    --primary-gradient: linear-gradient(135deg, #1e3c72 0%, #2a5298 100%);
                    --accent-gradient: linear-gradient(90deg, #f05074 0%, #ff7e5f 100%);
                    --pink: #f05074;
                    --pink-light: rgba(240, 80, 116, 0.08);
                    --blue-light: rgba(30, 60, 114, 0.04);
                    --text-dark: #1a202c;
                    --text-muted: #5a6e85;
                }

                /* الخلفية الفنية التجريدية الخلفية */
                .bg-blob-1 { position: absolute; top: 10%; left: -100px; width: 400px; height: 400px; background: rgba(240, 80, 116, 0.05); filter: blur(80px); border-radius: 50%; z-index: 0; pointer-events: none; }
                .bg-blob-2 { position: absolute; top: 50%; right: -100px; width: 500px; height: 500px; background: rgba(42, 82, 152, 0.04); filter: blur(100px); border-radius: 50%; z-index: 0; pointer-events: none; }

                /* Hero Section بتصميم عصري */
                .modern-hero { position: relative; padding: 120px 24px 80px; text-align: center; background: radial-gradient(circle at center, #ffffff 0%, #f7f9fc 100%); z-index: 1; }
                .service-badge { display: inline-flex; align-items: center; gap: 8px; background: white; border: 1px solid rgba(240,80,116,0.15); color: var(--pink); font-size: 14px; padding: 8px 20px; border-radius: 100px; margin-bottom: 24px; font-weight: 600; box-shadow: 0 4px 15px rgba(240,80,116,0.05); }
                .modern-hero h1 { font-size: 46px; font-weight: 800; color: var(--text-dark); margin: 0 0 20px; line-height: 1.3; letter-spacing: -0.5px; }
                .modern-hero h1 span { background: var(--accent-gradient); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
                .modern-hero p { font-size: 19px; color: var(--text-muted); max-width: 750px; line-height: 1.8; margin: 0 auto; font-weight: 400; }

                /* الحاوية والشبكة الذكية */
                .main-grid { max-width: 1100px; margin: 0 auto; padding: 0 24px 120px; position: relative; z-index: 1; display: grid; grid-template-columns: repeat(2, 1fr); gap: 30px; }
                .full-width-card { grid-column: span 2; }

                /* البطاقات بتأثير الـ Neo-brutalism الناعم والتفاعلي */
                .interactive-card { background: #ffffff; border-radius: 24px; padding: 40px; border: 1px solid rgba(230, 235, 245, 0.8); box-shadow: 0 10px 30px rgba(165, 175, 200, 0.06); transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1); position: relative; overflow: hidden; }
                .interactive-card::before { content: ''; position: absolute; top: 0; left: 0; width: 100%; height: 4px; background: transparent; transition: background 0.3s; }
                .interactive-card:hover::before { background: var(--accent-gradient); }
                .interactive-card:hover { transform: translateY(-6px); box-shadow: 0 20px 40px rgba(30, 60, 114, 0.08); border-color: rgba(30, 60, 114, 0.1); }

                /* أيقونات وعناوين البطاقات */
                .card-icon-wrapper { width: 56px; height: 56px; border-radius: 16px; display: flex; align-items: center; justify-content: center; font-size: 26px; margin-bottom: 24px; transition: transform 0.3s; }
                .interactive-card:hover .card-icon-wrapper { transform: scale(1.1) rotate(-3deg); }
                .icon-bg-blue { background: rgba(30, 60, 114, 0.06); color: #1e3c72; }
                .icon-bg-pink { background: rgba(240, 80, 116, 0.06); color: var(--pink); }
                
                .interactive-card h3 { font-size: 22px; color: #1e3c72; font-weight: 700; margin: 0 0 16px; }
                .interactive-card p { font-size: 16px; color: var(--text-muted); line-height: 1.8; margin: 0; }

                /* القائمة المحدثة بالكامل */
                .modern-list { list-style: none; padding: 0; margin: 0; display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 16px; }
                .modern-list li { background: #f8fafc; border-radius: 14px; padding: 16px 20px; font-size: 16px; color: var(--text-dark); font-weight: 500; display: flex; align-items: center; gap: 12px; border: 1px solid #edf2f7; transition: all 0.2s; }
                .modern-list li::before { content: '✦'; color: var(--pink); font-size: 18px; font-weight: bold; }
                .modern-list li:hover { background: white; border-color: rgba(240, 80, 116, 0.2); transform: translateX(-5px); }

                /* Call To Action فخم وغير تقليدي */
                .premium-cta { grid-column: span 2; background: var(--primary-gradient); border-radius: 32px; padding: 60px 40px; text-align: center; position: relative; overflow: hidden; box-shadow: 0 20px 50px rgba(30, 60, 114, 0.2); }
                .premium-cta::after { content: ''; position: absolute; bottom: -50px; right: -50px; width: 200px; height: 200px; background: rgba(255,255,255,0.03); border-radius: 50%; }
                .premium-cta h4 { font-size: 28px; font-weight: 800; color: #ffffff !important; margin: 0 0 12px; }
                .premium-cta p { font-size: 17px; color: rgba(255,255,255,0.85) !important; margin: 0 0 32px; max-width: 600px; margin-inline: auto; line-height: 1.7; }
                .modern-cta-btn { display: inline-flex; align-items: center; gap: 10px; background: #ffffff; color: #1e3c72 !important; font-weight: 700; font-size: 16px; padding: 16px 40px; border-radius: 16px; text-decoration: none; box-shadow: 0 10px 25px rgba(0,0,0,0.1); transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1); }
                .modern-cta-btn:hover { transform: translateY(-3px) scale(1.02); box-shadow: 0 15px 30px rgba(0,0,0,0.15); background: var(--accent-gradient); color: #ffffff !important; }

                @media (max-width: 900px) {
                    .main-grid { grid-template-columns: 1fr; gap: 24px; }
                    .full-width-card, .premium-cta { grid-column: span 1; }
                    .modern-hero h1 { font-size: 32px; }
                    .premium-cta { padding: 40px 24px; }
                }
            `}</style>
             <PageBanner/>

            {/* عناصر فنية بالخلفية */}
            <div className="bg-blob-1"></div>
            <div className="bg-blob-2"></div>

            <section className="modern-hero">
                <div className="service-badge">
                    <span>✨</span> اضطرابات النطق والتخاطب
                </div>
                <h1>تقويم النطق و<span>قنوات التواصل</span></h1>
                <p>نبتكر حلولاً تواصلية متكاملة لتطوير مهارات التعبير واللفظ الوظيفي، لتمكين الأطفال من صياغة عالمهم والتفاعل بكل ثقة.</p>
            </section>

            <div className="main-grid">
                
                <div className="interactive-card">
                    <div className="card-icon-wrapper icon-bg-blue">🗣️</div>
                    <h3>تعريف الخدمة</h3>
                    <p>برنامج علاجي وتأهيلي مخصص لعلاج اضطرابات اللفظ، وتأخر الكلام، وتطوير مهارات التواصل الوظيفي اللفظي وغير اللفظي باستخدام أحدث الوسائل والبرامج المعتمدة العالمية.</p>
                </div>

                <div className="interactive-card">
                    <div className="card-icon-wrapper icon-bg-pink">🎯</div>
                    <h3>الفئة المستفيدة</h3>
                    <p>الأطفال غير الناطقين، أو الذين يعانون من تأخر نطق واهتزاز في مخارج الحروف، وغياب التواصل البصري واللفظي التفاعلي المتبادل في محيطهم الاجتماعي.</p>
                </div>

                <div className="interactive-card full-width-card">
                    <div className="card-icon-wrapper icon-bg-blue">📌</div>
                    <h3>أهداف الخدمة المستدامة</h3>
                    <ul className="modern-list">
                        <li>تصحيح وتأهيل مخارج الحروف وتحفيز الكلام التلقائي والسياقي.</li>
                        <li>تدريب الطفل على أنظمة التواصل البديل والمعزز (مثل نظام PECS) لغير الناطقين.</li>
                        <li>زيادة الحصيلة اللغوية والقدرة على فهم واستيعاب الحوار المتبادل.</li>
                    </ul>
                </div>

                <div className="interactive-card">
                    <div className="card-icon-wrapper icon-bg-pink">⚙️</div>
                    <h3>طريقة الاشتغال</h3>
                    <p>تتم عبر جلسات فردية مكثفة تعتمد على الألعاب اللغوية المبتكرة، البطاقات المصورة، والوسائل الرقمية والتفاعلية المحفزة لتشجيع الطفل على النطق السليم وتوظيف الكلمات تلقائياً.</p>
                </div>

                <div className="interactive-card">
                    <div className="card-icon-wrapper icon-bg-blue">👥</div>
                    <h3>الفريق المشرف</h3>
                    <p>أخصائيو تقويم النطق والتخاطب وتأهيل قنوات التواصل البديل (Orthophonistes) من ذوي الخبرة الطويلة والكفاءة المعتمدة.</p>
                </div>

                <div className="premium-cta">
                    <h4>ابدأ رحلة طفلك نحو تواصل أفضل</h4>
                    <p>للاستفادة من حصص تقويم النطق والتواصل، يرجى تعبئة استمارة التسجيل الإلكترونية لحجز موعد التشخيص والتقييم الفردي مع خبراء المركز.</p>
                    <Link to="/inscription" className="modern-cta-btn">
                        <span>سجل طفلك الآن بالمركز</span> 📝
                    </Link>
                </div>

            </div>

        </div>
        </>
    );
}