import React from 'react';
import { Link } from 'react-router-dom';
import Header from '../../components/Header/Header';
import Footer from '../../components/Footer/Footer'; 

export default function PsychologicalSupport() {
    return (
        <div style={{ direction: 'rtl', fontFamily: 'Segoe UI, Arial, sans-serif', textAlign: 'right', background: '#fafafa' }}>
            <style>{`
                :root {
                    --pink:    #f05074;
                    --pink2:   #ff7e5f;
                    --dark:    #1a1a2e;
                    --gray:    #f7f8fc; 
                    --border:  #ececec;
                    --text:    #333;
                }
                .service-hero { background: var(--gray); color: var(--dark); padding: 80px 0 50px; text-align: center; border-bottom: 1px solid var(--border); }
                .service-hero h1 { font-size: 38px; font-weight: 700; margin: 0 0 14px; }
                .service-hero h1 span { color: var(--pink); }
                .service-hero p { font-size: 17px; color: #666; max-width: 700px; line-height: 1.8; margin: 0 auto; }
                .service-badge { display: inline-block; background: white; border: 1px solid rgba(240,80,116,0.2); color: var(--pink); font-size: 13px; padding: 6px 18px; border-radius: 50px; margin-bottom: 16px; font-weight: 600; }
                .service-container { max-width: 1000px; margin: 0 auto; padding: 50px 24px 110px; }
                .info-card-panel { background: #ffffff; border-radius: 20px; padding: 35px; margin-bottom: 25px; border: 1px solid var(--border); box-shadow: 0 4px 20px rgba(0,0,0,0.02); }
                .card-panel-header { display: flex; align-items: center; gap: 12px; margin-bottom: 20px; border-bottom: 2px solid var(--gray); padding-bottom: 14px; }
                .card-panel-header h3 { font-size: 22px; color: #1e3c72; font-weight: 700; margin: 0; }
                .info-card-panel p { font-size: 16px; color: #444; line-height: 1.8; margin: 0; }
                .styled-list { list-style: none; padding: 0; margin: 0; }
                .styled-list li { position: relative; padding-right: 28px; margin-bottom: 14px; font-size: 16px; color: #444; line-height: 1.7; }
                .styled-list li::before { content: '✓'; position: absolute; right: 0; color: var(--pink); font-weight: 700; }
                .register-box-cta { background: linear-gradient(135deg, #1e3c72, #2a5298); border-radius: 24px; padding: 45px 40px; text-align: center; box-shadow: 0 15px 35px rgba(30, 60, 114, 0.18); border: 1px solid rgba(255, 255, 255, 0.12); }
                .register-box-cta h4 { font-size: 24px; font-weight: 700; margin-bottom: 12px; color: #fff !important; }
                .register-box-cta p { font-size: 16px; margin-bottom: 30px; color: #fff !important; opacity: 0.9; }
                .cta-button-link { display: inline-block; background: linear-gradient(90deg, var(--pink), var(--pink2)); color: white !important; font-weight: 700; padding: 14px 35px; border-radius: 10px; text-decoration: none; transition: transform 0.2s; }
                .cta-button-link:hover { transform: translateY(-1px); opacity: 0.95; }
                @media (max-width: 768px) { .service-hero h1 { font-size: 28px; } .register-box-cta { padding: 30px 20px; } }
            `}</style>

            <Header />

            <section className="service-hero">
                <div className="service-badge">الرعاية النفسية والسلوكية</div>
                <h1>الدعم النفسي و<span>المواكبة للأسر</span></h1>
                <p>نرافقكم خطوة بخطوة لتخفيف الضغوط النفسية وتوجيهكم نحو آليات التعامل الإيجابي والعلمي مع أطفالكم.</p>
            </section>

            <div className="service-container">
                <div className="info-card-panel">
                    <div className="card-panel-header"><h3>🧠 تعريف الخدمة</h3></div>
                    <p>خدمة متخصصة تهدف إلى تقديم تقييم نفسي وسلوكي شامل وعلمي للأطفال، بالإضافة إلى مرافقة ومواكبة أولياء الأمور لتخفيف الضغوط النفسية والاجتماعية الناتجة عن رعاية الطفل وتوجيههم لآليات التعامل الإيجابي.</p>
                </div>

                <div className="info-card-panel">
                    <div className="card-panel-header"><h3>🎯 الفئة المستفيدة</h3></div>
                    <p>الأطفال الذين يواجهون اضطرابات سلوكية، نوبات غضب، قلق، أو صعوبات في الاندماج الاجتماعي، إلى جانب عائلات وأولياء أمور الأطفال التوحديين الذين يحتاجون لمواكبة نفسية وإرشاد مستمر.</p>
                </div>

                <div className="info-card-panel">
                    <div className="card-panel-header"><h3>📌 أهداف الخدمة</h3></div>
                    <ul className="styled-list">
                        <li>تعديل السلوكيات غير المرغوبة لدى الطفل وبناء مهارات تفاعلية إيجابية بديلة.</li>
                        <li>تقديم الدعم المعرفي والمعنوي للأسرة للحد من الاحتراق النفسي والتوتر اليومي.</li>
                        <li>تطوير المرونة النفسية والاجتماعية لدى الطفل لضمان اندماجه مع محيطه بسلاسة.</li>
                    </ul>
                </div>

                <div className="info-card-panel">
                    <div className="card-panel-header"><h3>⚙️ طريقة الاشتغال</h3></div>
                    <p>تتم عبر جلسات فردية للطفل قائمة على الملاحظة العلمية المباشرة وتعديل السلوك، بالتوازي مع ورشات عمل دورية وجلسات استماع واستشارات مخصصة للأمهات والآباء لتنسيق برنامج رعاية موحد بين المركز والبيت.</p>
                </div>

                <div className="info-card-panel">
                    <div className="card-panel-header"><h3>👥 الفريق المشرف</h3></div>
                    <p>أخصائيون في علم النفس العيادي، ومعدلو وموجهو سلوك معتمدون ذوو خبرة طويلة في اضطرابات النمو العصبي والتوحد.</p>
                </div>

                <div className="register-box-cta">
                    <h4>كيفية التسجيل والاستفادة من الخدمة</h4>
                    <p>للاستفادة من خدمة الدعم النفسي والمواكبة، يرجى ملء طلب التسجيل الإلكتروني للمركز وسيتصل بكم الفريق لتحديد موعد المقابلة الأولى والتقييم.</p>
                    <Link to="/inscription" className="cta-button-link">سجل طفلك الآن بالمركز 📝</Link>
                </div>
            </div>

            <Footer />
        </div>
    );
}