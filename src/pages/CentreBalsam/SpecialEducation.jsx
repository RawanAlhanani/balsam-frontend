import React from 'react';
import { Link } from 'react-router-dom';
import Header from '../../components/Header/Header';
import PageBanner from "../../components/PageBanner.jsx";

export default function SpecialEducation() {
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

                /* كرات ملونة ناعمة جداً في الخلفية */
                .creative-blob-1 { position: absolute; top: -5%; left: -5%; width: 500px; height: 500px; background: radial-gradient(circle, rgba(240,80,116,0.04) 0%, transparent 70%); filter: blur(60px); pointer-events: none; }
                .creative-blob-2 { position: absolute; top: 40%; right: -10%; width: 600px; height: 600px; background: radial-gradient(circle, rgba(30,60,114,0.03) 0%, transparent 70%); filter: blur(70px); pointer-events: none; }

                /* هيرو سكشن مريح وجذاب */
                .creative-hero { position: relative; padding: 120px 24px 80px; text-align: center; z-index: 2; background: radial-gradient(circle at center, #ffffff 0%, #f7f9fc 100%); }
                .creative-tag { display: inline-flex; align-items: center; gap: 8px; background: rgba(240, 80, 116, 0.06); border: 1px solid rgba(240, 80, 116, 0.15); color: var(--pink); font-size: 14px; padding: 8px 20px; border-radius: 100px; margin-bottom: 24px; font-weight: 600; box-shadow: 0 4px 15px rgba(240,80,116,0.03); }
                .creative-hero h1 { font-size: 46px; font-weight: 800; margin: 0 0 20px; line-height: 1.3; color: #1a202c; }
                .creative-hero h1 span { background: var(--pink-gradient); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
                .creative-hero p { font-size: 19px; color: var(--text-muted); max-width: 750px; line-height: 1.8; margin: 0 auto; font-weight: 400; }

                /* شبكة الـ Bento الفنية والمبتكرة بالخلفية الفاتحة */
                .bento-grid { max-width: 1100px; margin: 0 auto; padding: 0 24px 120px; display: grid; grid-template-columns: repeat(3, 1fr); gap: 30px; position: relative; z-index: 2; }
                
                /* كروت الـ Bento الفاتحة التفاعلية */
                .bento-card { background: var(--card-bg); border-radius: 26px; padding: 40px; border: 1px solid rgba(230, 235, 245, 0.8); box-shadow: 0 10px 35px rgba(165, 175, 200, 0.06); transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1); position: relative; overflow: hidden; display: flex; flex-direction: column; justify-content: space-between; }
                .bento-card:hover { transform: translateY(-6px); border-color: rgba(240, 80, 116, 0.2); box-shadow: 0 20px 45px rgba(30, 60, 114, 0.08); }

                /* تقسيمات أحجام بينتو غير المتناظرة */
                .size-large { grid-column: span 2; }
                .size-tall { grid-column: span 1; grid-row: span 2; }
                .size-full { grid-column: span 3; }

                /* الصور داخل كروت البينتو */
                .bento-img-frame { width: 100%; height: 220px; border-radius: 18px; overflow: hidden; position: relative; margin-bottom: 24px; border: 1px solid #edf2f7; }
                .bento-img-frame img { width: 100%; height: 100%; object-fit: cover; transition: transform 0.5s; }
                .bento-card:hover .bento-img-frame img { transform: scale(1.05); }

                /* الأيقونات الأنيقة */
                .bento-icon { font-size: 28px; width: 56px; height: 56px; border-radius: 16px; display: flex; align-items: center; justify-content: center; margin-bottom: 24px; transition: transform 0.3s; }
                .icon-bg-pink { background: rgba(240, 80, 116, 0.06); color: var(--pink); }
                .icon-bg-blue { background: rgba(30, 60, 114, 0.06); color: var(--dark-blue); }
                .bento-card:hover .bento-icon { transform: scale(1.1) rotate(-5deg); }
                
                .bento-card h3 { font-size: 22px; font-weight: 700; color: var(--dark-blue); margin: 0 0 16px; }
                .bento-card p { font-size: 16px; color: var(--text-muted); line-height: 1.8; margin: 0; }

                /* القائمة على شكل كبسولات فاتحة وأنيقة */
                .creative-capsules { display: flex; flex-wrap: wrap; gap: 14px; margin-top: 24px; }
                .capsule-item { background: #f8fafc; border: 1px solid #edf2f7; padding: 14px 24px; border-radius: 100px; font-size: 16px; color: #334155; display: flex; align-items: center; gap: 10px; font-weight: 500; transition: all 0.2s; }
                .capsule-item:hover { background: #ffffff; border-color: rgba(240, 80, 116, 0.25); transform: translateX(-3px); }
                .capsule-dot { width: 8px; height: 8px; background: var(--pink); border-radius: 50%; }

                /* بطاقة الـ CTA النهائية الفخمة بالألوان القديمة */
                .premium-cta { background: var(--blue-gradient); border-radius: 32px; padding: 60px 40px; text-align: center; position: relative; overflow: hidden; box-shadow: 0 20px 50px rgba(30, 60, 114, 0.18); }
                .premium-cta h4 { font-size: 28px; font-weight: 800; color: #ffffff !important; margin: 0 0 12px; }
                .premium-cta p { font-size: 17px; color: rgba(255,255,255,0.85) !important; margin: 0 0 32px; max-width: 600px; margin-inline: auto; line-height: 1.7; }
                .modern-cta-btn { display: inline-flex; align-items: center; gap: 10px; background: #ffffff; color: #1e3c72 !important; font-weight: 700; font-size: 16px; padding: 16px 40px; border-radius: 16px; text-decoration: none; box-shadow: 0 10px 25px rgba(0,0,0,0.08); transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1); }
                .modern-cta-btn:hover { transform: translateY(-3px) scale(1.02); box-shadow: 0 15px 30px rgba(0,0,0,0.12); background: var(--pink-gradient); color: #ffffff !important; }

                @media (max-width: 1024px) {
                    .bento-grid { grid-template-columns: repeat(2, 1fr); }
                    .size-large, .size-tall, .size-full { grid-column: span 2; }
                }
                @media (max-width: 768px) {
                    .bento-grid { grid-template-columns: 1fr; }
                    .size-large, .size-tall, .size-full { grid-column: span 1; }
                    .creative-hero h1 { font-size: 32px; }
                }
            `}</style>

          
              <PageBanner/>

            <div className="creative-blob-1"></div>
            <div className="creative-blob-2"></div>

            <section className="creative-hero">
                <div className="creative-tag">
                    <span>📚</span> التأهيل التربوي والبيداغوجي المخصص
                </div>
                <h1>التربية الخاصة و<span>تعديل السلوك</span></h1>
                <p>نصمم برامج تعليمية فردية متكاملة تهدف إلى تنمية وتطوير القدرات الذهنية والمعرفية والاعتماد الذاتي للأطفال المستفيدين.</p>
            </section>

            <div className="bento-grid">
                
                {/* كرت 1: تعريف الخدمة */}
                <div className="bento-card size-large">
                    <div>
                        <div className="bento-icon icon-bg-blue">💡</div>
                        <h3>تعريف الخدمة</h3>
                        <p>منهج تربوي تأهيلي مخصص لوضع وتطبيق برامج وخطط تعليمية بيداغوجية فردية تناسب وتلبي وتيرة واحتياجات كل طفل لتنمية مهاراته الذهنية الأساسية بشكل مستقل وعلمي دون التقيد بالقوالب النمطية الجاهزة.</p>
                    </div>
                </div>

                {/* كرت 2: طولي مع صورة للفئة المستهدفة */}
                <div className="bento-card size-tall">
                    <div>
                        <div className="bento-img-frame">
                            <img src="https://images.unsplash.com/photo-1577896851231-70ef18881754?q=80&w=600&auto=format&fit=crop" alt="الأطفال المستفيدون" />
                        </div>
                        <h3>الفئة المستفيدة</h3>
                        <p>الأطفال الذين يعانون من طيف التوحد، صعوبات التعلم الأكاديمي، فرط الحركة وتشتت الانتباه، أو أي تأخر ملحوظ في النمو الذهني والادراكي الأساسي.</p>
                    </div>
                </div>

                {/* كرت 3: طريقة الاشتغال */}
                <div className="bento-card">
                    <div>
                        <div className="bento-icon icon-bg-pink">⚙️</div>
                        <h3>طريقة الاشتغال</h3>
                        <p>تتم داخل فضاءات مجهزة بالكامل بالوسائل البيداغوجية والتعليمية والألعاب الذهنية المحفزة، من خلال حصص فردية أو مجموعات مصغرة لضمان تفاعل تربوي واجتماعي مثمر.</p>
                    </div>
                </div>

                {/* كرت 4: الفريق المشرف */}
                <div className="bento-card">
                    <div>
                        <div className="bento-icon icon-bg-blue">👥</div>
                        <h3>الفريق المشرف</h3>
                        <p>مربيات ومربون متخصصون في التربية الخاصة وتعديل السلوك وتأهيل الأطفال ذوي الاحتياجات الخاصة بكفاءة وصبر متميزين لضمان رعاية متطورة وسليمة.</p>
                    </div>
                </div>

                {/* كرت 5: الأهداف بكبسولات منبثقة تفاعلية */}
                <div className="bento-card size-full">
                    <div>
                        <div className="bento-icon icon-bg-pink">📌</div>
                        <h3>أهداف الخدمة المستدامة</h3>
                        <p>نشتغل وفق خطط علمية دقيقة ترتكز على تحقيق النتائج التالية لضمان اندماج الطفل:</p>
                        <div className="creative-capsules">
                            <div className="capsule-item"><span className="capsule-dot"></span> بناء المهارات الاستدلالية وما قبل الأكاديمية (الأشكال، الألوان، الأرقام والحروف)</div>
                            <div className="capsule-item"><span className="capsule-dot"></span> تنمية قدرات التركيز والاستقلالية التامة للطفل داخل قاعة الدراسة والمنزل</div>
                            <div className="capsule-item"><span className="capsule-dot"></span> تعديل واحتواء السلوكيات غير النمطية وتعزيز سلوكيات إيجابية تفاعلية بديلة</div>
                        </div>
                    </div>
                </div>

                {/* كرت 6: الـ CTA النهائي */}
                <div className="bento-card size-full premium-cta">
                    <div>
                        <h4>نمهد لطفلكم طريقاً تعليمياً فريداً ومستقلاً</h4>
                        <p>لإدراج طفلك ضمن الخطط التربوية والبيداغوجية المصممة خصيصاً بالمركز، بادر بملء طلب الاستمارة الإلكترونية لتحديد موعد التقييم الأولي.</p>
                        <Link to="/inscription" className="modern-cta-btn">
                            <span>سجل طفلك الآن بالمركز</span> 📝
                        </Link>
                    </div>
                </div>

            </div>

        </div>
            </>
    );
}