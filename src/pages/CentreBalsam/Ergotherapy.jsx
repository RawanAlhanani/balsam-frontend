import React from 'react';
import { Link } from 'react-router-dom';
import Header from '../../components/Header/Header';
import PageBanner from "../../components/PageBanner.jsx";

export default function Activities() {
    return (
        <>

            

        <div style={{ direction: 'rtl', fontFamily: 'Segoe UI, Arial, sans-serif', textAlign: 'right', background: '#fdfeff', color: '#1a202c', overflowX: 'hidden', position: 'relative' }}>

            <style>{`
                :root {
                    --pink-gradient: linear-gradient(135deg, #f05074 0%, #ff7e5f 100%);
                    --blue-gradient: linear-gradient(135deg, #1e3c72 0%, #2a5298 100%);
                    --pink: #f05074;
                    --dark-blue: #1e3c72;
                    --text-muted: #5a6e85;
                    --card-bg: #ffffff;
                }

                /* كرات ملونة ناعمة وديناميكية في الخلفية */
                .creative-blob-1 { position: absolute; top: 2%; left: -10%; width: 550px; height: 550px; background: radial-gradient(circle, rgba(240,80,116,0.05) 0%, transparent 70%); filter: blur(60px); pointer-events: none; }
                .creative-blob-2 { position: absolute; top: 50%; right: -5%; width: 550px; height: 550px; background: radial-gradient(circle, rgba(30,60,114,0.04) 0%, transparent 70%); filter: blur(70px); pointer-events: none; }

                /* هيرو سكشن بلمسة فنية ومبهجة */
                .creative-hero { position: relative; padding: 130px 24px 90px; text-align: center; z-index: 2; background: radial-gradient(circle at center, #ffffff 0%, #fcf8fa 100%); }
                .creative-tag { display: inline-flex; align-items: center; gap: 8px; background: rgba(240, 80, 116, 0.06); border: 1px solid rgba(240, 80, 116, 0.15); color: var(--pink); font-size: 14px; padding: 8px 20px; border-radius: 100px; margin-bottom: 24px; font-weight: 600; box-shadow: 0 4px 15px rgba(240,80,116,0.03); }
                .creative-hero h1 { font-size: 48px; font-weight: 900; margin: 0 0 20px; line-height: 1.3; color: #1a202c; }
                .creative-hero h1 span { background: var(--pink-gradient); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
                .creative-hero p { font-size: 20px; color: var(--text-muted); max-width: 780px; line-height: 1.8; margin: 0 auto; font-weight: 400; }

                /* شبكة الـ Bento المبتكرة والمرحة */
                .bento-grid { max-width: 1100px; margin: 0 auto; padding: 0 24px 120px; display: grid; grid-template-columns: repeat(3, 1fr); gap: 30px; position: relative; z-index: 2; }
                
                /* كروت البينتو الفاتحة بهندسة غير متناظرة ومرحة */
                .bento-card { background: var(--card-bg); border-radius: 32px 16px 32px 32px; padding: 40px; border: 1px solid rgba(230, 235, 245, 0.8); box-shadow: 0 12px 40px rgba(165, 175, 200, 0.06); transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275); position: relative; overflow: hidden; display: flex; flex-direction: column; justify-content: space-between; }
                .bento-card:nth-child(even) { border-radius: 16px 32px 32px 32px; }
                .bento-card:hover { transform: translateY(-8px) scale(1.01); border-color: rgba(240, 80, 116, 0.25); box-shadow: 0 25px 50px rgba(30, 60, 114, 0.09); }

                /* تقسيمات أحجام بينتو الفنية */
                .size-large { grid-column: span 2; }
                .size-tall { grid-column: span 1; grid-row: span 2; }
                .size-full { grid-column: span 3; }

                /* إطارات الصور الفنية داخل البينتو */
                .bento-img-frame { width: 100%; height: 230px; border-radius: 20px; overflow: hidden; position: relative; margin-bottom: 24px; border: 1px solid #edf2f7; }
                .bento-img-frame img { width: 100%; height: 100%; object-fit: cover; transition: transform 0.6s ease; }
                .bento-card:hover .bento-img-frame img { transform: scale(1.07) rotate(1deg); }

                /* الأيقونات الحركية */
                .bento-icon { font-size: 30px; width: 60px; height: 60px; border-radius: 18px; display: flex; align-items: center; justify-content: center; margin-bottom: 24px; transition: all 0.4s; }
                .icon-bg-pink { background: rgba(240, 80, 116, 0.06); color: var(--pink); }
                .icon-bg-blue { background: rgba(30, 60, 114, 0.06); color: var(--dark-blue); }
                .bento-card:hover .bento-icon { transform: scale(1.15) rotate(-8deg); }
                
                .bento-card h3 { font-size: 24px; font-weight: 800; color: var(--dark-blue); margin: 0 0 16px; }
                .bento-card p { font-size: 16px; color: var(--text-muted); line-height: 1.8; margin: 0; }

                /* كبسولات الأنشطة الإبداعية المتناثرة */
                .creative-capsules { display: flex; flex-wrap: wrap; gap: 12px; margin-top: 24px; }
                .capsule-item { background: #fbfbfc; border: 1px solid #edf2f7; padding: 14px 24px; border-radius: 100px; font-size: 16px; color: #334155; display: flex; align-items: center; gap: 10px; font-weight: 600; transition: all 0.3s; }
                .capsule-item:hover { background: #ffffff; border-color: rgba(240, 80, 116, 0.3); transform: translateY(-3px); box-shadow: 0 5px 15px rgba(240,80,116,0.05); }
                .capsule-emoji { font-size: 18px; }

                /* بطاقة الـ CTA اللامعة والمبهجة */
                .premium-cta { background: var(--blue-gradient); border-radius: 36px; padding: 65px 40px; text-align: center; position: relative; overflow: hidden; box-shadow: 0 20px 50px rgba(30, 60, 114, 0.18); }
                .premium-cta h4 { font-size: 30px; font-weight: 800; color: #ffffff !important; margin: 0 0 14px; }
                .premium-cta p { font-size: 18px; color: rgba(255,255,255,0.85) !important; margin: 0 0 32px; max-width: 650px; margin-inline: auto; line-height: 1.7; }
                .modern-cta-btn { display: inline-flex; align-items: center; gap: 10px; background: #ffffff; color: #1e3c72 !important; font-weight: 700; font-size: 16px; padding: 16px 40px; border-radius: 16px; text-decoration: none; box-shadow: 0 10px 25px rgba(0,0,0,0.08); transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1); }
                .modern-cta-btn:hover { transform: translateY(-4px) scale(1.02); box-shadow: 0 18px 35px rgba(0,0,0,0.12); background: var(--pink-gradient); color: #ffffff !important; }

                @media (max-width: 1024px) {
                    .bento-grid { grid-template-columns: repeat(2, 1fr); }
                    .size-large, .size-tall, .size-full { grid-column: span 2; }
                }
                @media (max-width: 768px) {
                    .bento-grid { grid-template-columns: 1fr; }
                    .size-large, .size-tall, .size-full { grid-column: span 1; }
                    .creative-hero h1 { font-size: 34px; }
                }
            `}</style>

            <PageBanner/>

            <div className="creative-blob-1"></div>
            <div className="creative-blob-2"></div>

            <section className="creative-hero">
                <div className="creative-tag">
                    <span>🎨</span> فضاء الفنون والترفيه الهادف
                </div>
                <h1>الأنشطة الموازية و<span>الورشات الإبداعية</span></h1>
                <p>نؤمن أن خلف كل تحدٍ موهبة تنتظر بزوغها. نفتح للأطفال آفاق التعبير الحر عبر الفن والموسيقى والأشغال التي تبني شخصيتهم.</p>
            </section>

            <div className="bento-grid">
                
                {/* كرت 1: عريض لتعريف الخدمة وفلسفتها المرحة */}
                <div className="bento-card size-large">
                    <div>
                        <div className="bento-icon icon-bg-pink">🎈</div>
                        <h3>رؤيتنا للأنشطة الموازية</h3>
                        <p>ليست مجرد أوقات ترفيهية، بل هي ركيزة أساسية مكملة للعلاجات الطبية والتربوية بالمركز. صُممت ورشاتنا بعناية لتكون بمثابة جسر ممتع يدمج الأطفال اجتماعياً وثقافياً، ويحفز حواسهم الفنية ومهاراتهم الحركية والذهنية في جو يملؤه الفرح والاستكشاف العفوي دون ضغوط.</p>
                    </div>
                </div>

                {/* كرت 2: طولي ومميز مع صورة لورشة رسم وطبيعة الفئات */}
                <div className="bento-card size-tall">
                    <div>
                        <div className="bento-img-frame">
                            <img src="https://images.unsplash.com/photo-1460661419201-fd4cecdf8a8b?q=80&w=600&auto=format&fit=crop" alt="أطفال في ورشة رسم وفنون" />
                        </div>
                        <h3>الفئة المستفيدة</h3>
                        <p>نستقبل جميع أطفال المركز المستفيدين من المواكبة الطبية أو التربوية، الراغبين في تفجير طاقاتهم الكامنة وتطوير مهارات الاندماج الاجتماعي مع أقرانهم من خلال بيئة تفاعلية مرحة.</p>
                    </div>
                </div>

                {/* كرت 3: طريقة الاشتغال والورشات */}
                <div className="bento-card">
                    <div>
                        <div className="bento-icon icon-bg-blue">🎭</div>
                        <h3>آلية الاشتغال</h3>
                        <p>تُنظم الأنشطة في شكل ورشات دورية (فردية أو جماعية مصغرة) داخل فضاءات فنية فسيحة بالمركز، مجهزة بجميع الخامات والمعدات الآمنة تماماً والملائمة لمختلف الفئات العمرية.</p>
                    </div>
                </div>

                {/* كرت 4: الفريق المشرف الفني */}
                <div className="bento-card">
                    <div>
                        <div className="bento-icon icon-bg-pink">🧩</div>
                        <h3>الفريق المشرف</h3>
                        <p>مؤطرون متخصصون في التنشيط التربوي، العلاج بالفن (Art-thérapie)، والتعليم الإبداعي للأطفال، يتقنون مهارات الاحتواء وبناء التواصل الإيجابي المبهج.</p>
                    </div>
                </div>

                {/* كرت 5: كبسولات تفاعلية مرحة ومميزة للورشات المتاحة */}
                <div className="bento-card size-full">
                    <div>
                        <div className="bento-icon icon-bg-blue">🚀</div>
                        <h3>أبرز الورشات والأنشطة التي نتميز بها</h3>
                        <p>تتعدد نوافذ الإبداع بالمركز لتغطي كافة الجوانب الحسية والجمالية المفيدة لطفلك:</p>
                        <div className="creative-capsules">
                            <div className="capsule-item"><span className="capsule-emoji">🎨</span> ورشات الرسم، التلوين، وتشكيل العجين الطبي</div>
                            <div className="capsule-item"><span className="capsule-emoji">✂️</span> الأشغال اليدوية التدويرية لتنمية الذكاء الحركي</div>
                            <div className="capsule-item"><span className="capsule-emoji">🎵</span> التعبير الموسيقي الحسي والألعاب الحركية الإيقاعية</div>
                            <div className="capsule-item"><span className="capsule-emoji">🎪</span> المسرح التعبيري ومسرح العرائس لتعزيز النطق والتواصل</div>
                        </div>
                    </div>
                </div>

                {/* كرت 6: الـ CTA الحماسي النهائي */}
                <div className="bento-card size-full premium-cta">
                    <div>
                        <h4>دعنا نكتشف شغف طفلك ونقوده نحو التميز</h4>
                        <p>الأنشطة الموازية هي المفتاح السحري لتسريع استجابة طفلك للتأهيل الحركي والنطقي. سجل بيانات طفلك الآن ودعه ينضم لورشاتنا المليئة بالنشاط والحيوية.</p>
                        <Link to="/inscription" className="modern-cta-btn">
                            <span>انضم إلى ورشاتنا الإبداعية</span> ✨
                        </Link>
                    </div>
                </div>

            </div>

        </div>
        </>
    );
}