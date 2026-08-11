import React from 'react';
import { getStorageUrl } from '../../utils/formatters';
import PageBanner from "../../components/PageBanner.jsx";

const PATH_STEPS = [
  {
    number: '1',
    title: 'التواصل مع المركز',
    desc: 'تبدأ أولى الخطوات باتصال الأسرة بالمركز أو زيارتنا لحجز موعد مبدئي والاستفسار عن الخدمات المتاحة.',
    icon: '📞',
    color: '#f05074'
  },
  {
    number: '2',
    title: 'مقابلة أولية مع الأسرة',
    desc: 'جلسة ودية تجمع الأخصائيين بالوالدين للاستماع إلى التاريخ التطوري للطفل وفهم التحديات والاحتياجات الأساسية.',
    icon: '🤝',
    color: '#ff7e5f'
  },
  {
    number: '3',
    title: 'تقييم حالة الطفل',
    desc: 'يخضع الطفل لتقييم شامل ومتعدد التخصصات (شبه طبي وسلوكي) تحت إشراف مختصين لتحديد نقاط القوة ومجالات التدخل.',
    icon: '📊',
    color: '#4a90e2'
  },
  {
    number: '4',
    title: 'إعداد برنامج فردي للتكفل',
    desc: 'بناءً على نتائج التقييم، يصمم الفريق التربوي خطة علاجية وتأهيلية مخصصة ومفصلة تناسب قدرات الطفل وتطلعات أسرته.',
    icon: '📝',
    color: '#2ecc71'
  },
  {
    number: '5',
    title: 'بداية الحصص والمتابعة',
    desc: 'انطلاق الجلسات التأهيلية والتربوية بانتظام، مع إشراك الأسرة وتوجيهها لكيفية التعامل والمتابعة في المنزل.',
    icon: '🎒',
    color: '#9b59b6'
  },
  {
    number: '6',
    title: 'تقييم دوري للتقدم',
    desc: 'مراجعة مستمرة ومدى استجابة الطفل للبرنامج المخطط له كل فترة، مع تحديث الأهداف لضمان استمرار التطور والنمو.',
    icon: '📈',
    color: '#f1c40f'
  }
];

export default function ServicePath() {
  return (
      <>
        <PageBanner title="مسار الاستفادة من الخدمات" />
    <div style={{ direction: 'rtl', fontFamily: 'Segoe UI, Arial, sans-serif', textAlign: 'right' }}>
      <style>{`
        /* ── Variables ── */
        :root {
          --pink:    #f05074;
          --pink2:   #ff7e5f;
          --dark:    #1a1a2e;
          --gray:    #f7f8fc; 
          --border:  #ececec;
          --text:    #444;
          --muted:   #666;
        }

        /* ── Hero ── */
        .path-hero {
          background: var(--gray);
          color: var(--dark);
          padding: 80px 0 50px;
          text-align: center;
          border-bottom: 1px solid var(--border);
        }
        .path-hero h1 {
          font-size: 38px;
          font-weight: 700;
          margin: 0 0 14px;
        }
        .path-hero h1 span { color: var(--pink); }
        .path-hero p {
          font-size: 17px;
          color: var(--muted);
          max-width: 700px;
          line-height: 1.8;
          margin: 0 auto;
        }
        .path-badge {
          display: inline-block;
          background: white;
          border: 1px solid rgba(240,80,116,0.2);
          color: var(--pink);
          font-size: 13px;
          padding: 6px 18px;
          border-radius: 50px;
          margin-bottom: 16px;
          font-weight: 600;
        }

        /* ── Layout ── */
        .path-container {
          max-width: 1100px;
          margin: 0 auto;
          padding: 60px 24px 0; /* تم إلغاء البادينغ السفلي للاعتماد على المارجن */
        }

        /* ── Intro Content Section ── */
        .path-intro-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 48px;
          align-items: center;
          margin-bottom: 60px;
        }
        .path-intro-text h2 {
          font-size: 28px;
          color: var(--dark);
          margin-bottom: 16px;
        }
        .path-intro-text p {
          font-size: 16px;
          color: var(--text);
          line-height: 1.8;
          text-align: justify;
        }
        .path-intro-img {
          border-radius: 20px;
          overflow: hidden;
          box-shadow: 0 10px 30px rgba(0,0,0,0.06);
          background: #e2e8f0;
          aspect-ratio: 16/10;
        }
        .path-intro-img img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        /* ── Timeline Design ── */
        .timeline-wrapper {
          position: relative;
          margin: 40px 0;
          padding-right: 40px;
        }
        .timeline-line {
          position: absolute;
          right: 16px;
          top: 20px;
          bottom: 20px;
          width: 4px;
          background: #e9ecef;
          border-radius: 2px;
        }
        .timeline-step {
          position: relative;
          margin-bottom: 40px;
          background: white;
          border: 1px solid var(--border);
          border-radius: 16px;
          padding: 24px 30px;
          display: flex;
          align-items: flex-start;
          gap: 20px;
          transition: transform 0.2s, box-shadow 0.2s;
        }
        .timeline-step:hover {
          transform: translateX(-5px);
          box-shadow: 0 8px 24px rgba(0,0,0,0.04);
        }
        .step-dot {
          position: absolute;
          right: -32px;
          top: 30px;
          width: 20px;
          height: 20px;
          border-radius: 50%;
          border: 4px solid white;
          box-shadow: 0 0 0 3px #e9ecef;
          z-index: 2;
        }
        .step-icon-box {
          width: 55px;
          height: 55px;
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 26px;
          flex-shrink: 0;
        }
        .step-content {
          flex-grow: 1;
        }
        .step-header {
          display: flex;
          align-items: center;
          gap: 10px;
          margin-bottom: 8px;
        }
        .step-number {
          font-size: 13px;
          font-weight: 700;
          padding: 2px 8px;
          border-radius: 4px;
          color: white;
        }
        .step-title {
          font-size: 19px;
          font-weight: 700;
          color: var(--dark);
          margin: 0;
        }
        .step-desc {
          font-size: 15px;
          color: var(--muted);
          line-height: 1.7;
          margin: 0;
          text-align: justify;
        }

        /* ── التعديل الجديد: شكل البوكس الأجمل والمسافة الآمنة من الفوتر ── */
        .path-footer-banner {
          background: linear-gradient(135deg, #1e3c72, #2a5298); /* تدرج كحلي ونيلي ناعم مريح للعين */
          border-radius: 24px; /* زوايا دائرية أكثر عصرية */
          padding: 45px 40px;
          text-align: center;
          margin-top: 60px;
          margin-bottom: 90px; /* مسافة أمان سفلية ضخمة تمنع الاشتباك مع الفوتر */
          box-shadow: 0 15px 35px rgba(30, 60, 114, 0.18); /* ظل ناعم يعطي تأثير طفو راقي */
          border: 1px solid rgba(255, 255, 255, 0.12);
          position: relative;
          overflow: hidden;
        }
        
        /* لمسة ديكور خلفية ناعمة داخل البوكس */
        .path-footer-banner::before {
          content: '';
          position: absolute;
          top: -50%; left: -50%;
          width: 200%; height: 200%;
          background: radial-gradient(circle, rgba(255,255,255,0.05) 0%, transparent 70%);
          pointer-events: none;
        }

        /* تأكيد اللون الأبيض الناصع للكتابة */
        .path-footer-banner h3 {
          font-size: 26px;
          margin: 0 0 14px;
          font-weight: 700;
          color: #ffffff !important; /* قفل اللون باللون الأبيض */
          text-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }
        .path-footer-banner p {
          font-size: 16px;
          max-width: 680px;
          margin: 0 auto;
          line-height: 1.8;
          color: #ffffff !important; /* قفل اللون باللون الأبيض */
          opacity: 0.95;
        }

        @media (max-width: 768px) {
          .path-intro-grid { grid-template-columns: 1fr; gap: 24px; }
          .timeline-wrapper { padding-right: 30px; }
          .timeline-line { right: 10px; }
          .step-dot { right: -26px; top: 26px; }
          .timeline-step { padding: 20px; flex-direction: column; gap: 14px; }
          .path-hero h1 { font-size: 28px; }
          .path-footer-banner { margin-bottom: 60px; padding: 30px 20px; }
        }
      `}</style>

      {/* ── 1. الهيرو ── */}
      <section className="path-hero">
        <div className="path-badge">دليل أولياء الأمور</div>
        <h1>رحلة طفلك في <span>مركز بلسم</span></h1>
        <p>
          نحن هنا لنرافقكم خطوة بخطوة. إليكم المسار الواضح والمنظم الذي نتبعه لضمان تقديم أفضل رعاية وتأهيل مخصص لطفلكم.
        </p>
      </section>

      <div className="path-container">
        
        {/* ── 2. قسم تمهيدي مع صورة ── */}
        <section className="path-intro-grid">
          <div className="path-intro-text">
            <h2>كيف نبدأ معكم؟</h2>
            <p>
              نهتم في مركز بلسم بأن تكون تجربة الأسرة واضحة ومريحة منذ اللحظة الأولى. نؤمن بأن التكفل الناجح يبدأ من الفهم الدقيق والتعاون الوثيق بين الأخصائيين والمنزل، لذلك صممنا مساراً علمياً متكاملاً يضمن وضع النقاط على الحروف ومتابعة تقدم طفلك بشكل مستمر ودوري.
            </p>
          </div>
          <div className="path-intro-img">
            <img 
              src="https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=600&q=80" 
              alt="رعاية الأطفال والأسرة" 
            />
          </div>
        </section>

        {/* ── 3. الخط الزمني المتسلسل (Timeline) ── */}
        <section style={{ marginTop: '20px' }}>
          <h2 style={{ fontSize: '24px', fontWeight: '700', color: 'var(--dark)', marginBottom: '30px' }}>
            خطوات الاستفادة من الخدمات:
          </h2>

          <div className="timeline-wrapper">
            <div className="timeline-line" />

            {PATH_STEPS.map((step, index) => (
              <div className="timeline-step" key={index}>
                <div className="step-dot" style={{ backgroundColor: step.color }} />
                
                <div className="step-icon-box" style={{ backgroundColor: `${step.color}15`, color: step.color }}>
                  {step.icon}
                </div>

                <div className="step-content">
                  <div className="step-header">
                    <span className="step-number" style={{ backgroundColor: step.color }}>
                      الخطوة {step.number}
                    </span>
                    <h4 className="step-title">{step.title}</h4>
                  </div>
                  <p className="step-desc">{step.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ── 4. البنر الختامي (بالشكل الجديد والخط الأبيض والمسافة الآمنة عن الفوتر) ── */}
        <section className="path-footer-banner">
          <h3>🤝 شراكتنا مع الأسرة هي أساس النجاح</h3>
          <p>
            كل خطوة في هذا المسار تتم بـشفافية كاملة وبتنسيق دائم معكم، لأننا نؤمن أن التكامل بين المركز والبيت يصنع الفارق الأكبر في حياة أطفالنا.
          </p>
        </section>

      </div>
    </div>
        </>
  );
}