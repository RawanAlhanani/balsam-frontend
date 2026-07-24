import React, { useState } from 'react';
import { getStorageUrl } from '../../utils/formatters';
import PageBanner from "../../components/PageBanner.jsx";
const VISION = `رؤية جمعية بلسم: أن تصبح منظمة عالمية لمساعدة الناس على تحسين حياتهم في مجالات التوحد، مجتمعياً، والانتقال نحو مجتمع قوي.`;

const MISSION = `مهمة جمعية بلسم هي المساهمة في تحسين حياة ذوي التوحد، عن طريق خدماتنا وبرامجنا التي تساعد الناس اليوم — من أسرة طفل توحدي تم تشخيصه حديثًا ولا يعرف إلى أين يتجه، إلى أحد أفراد عائلة شخص بالغ شُخص باضطراب طيف التوحد يجد نفسه في وضع مقدم الرعاية الأساسي.`;

const ABOUT = `فريق بلسم هو مجموعة من أمهات وآباء لأطفال ذوي التوحد، أخذوا على عاتقهم مهمة المساهمة في تحسين حياة ذوي التوحد عن طريق: الدعم، والاحتضان، والتوجيه، والإرشاد، والتكوين، وتقديم الخدمات الشبه طبية، تحت إشراف مختصين في المجال. "بلسم" عضو بتحالف الجمعيات العاملة في إعاقة التوحد بالمغرب (CAM)، وتتعاون وتنسق مع المنظمات غير الحكومية الوطنية الدولية والسلطات المحلية لتوفير أفضل الخدمات لذوي التوحد.`;

const GOALS = [
  'استفادة الأطفال ذوي التوحد من تمدرس يمكنهم من الاندماج في المؤسسات التعليمية العمومية والخصوصية.',
  'تقديم جميع أنواع الخدمات الطبية والشبه الطبية للأطفال والأشخاص التوحديين في حدود الإمكانيات المتوفرة.',
  'تقديم خدمات تربوية، صحية، اجتماعية، رياضية، وتنظيم مخيمات تستجيب لمختلف حاجيات الأشخاص ذوي التوحد.',
  'تمكين أسر الأشخاص ذوي التوحد من تكوينات تستجيب لتطلعاتهم من أجل تكفل أفضل بهم.',
  'عقد شراكات مع المؤسسات الرسمية والخاصة والتعاون معها فيما له علاقة بمجال إفادة الأشخاص ذوي التوحد.',
];

const VALUES = [
  { icon: '🤝', title: 'التضامن',      desc: 'نؤمن بقوة الدعم المتبادل بين الأسر والمختصين.' },
  { icon: '💡', title: 'الاحترافية',  desc: 'نعمل وفق أعلى المعايير العلمية والمهنية.' },
  { icon: '❤️', title: 'الإنسانية',   desc: 'كل طفل يستحق الرعاية والمرافقة اللازمة.' },
  { icon: '🌐', title: 'الشمولية',    desc: 'خدماتنا مفتوحة لجميع الأسر بغض النظر عن وضعها.' },
];

const DB_IMAGES = [
  { id: 3, nomImage: '1617892397.png' },
  { id: 4, nomImage: '1617892196.png' },
  { id: 5, nomImage: '1617892473.png' },
  { id: 6, nomImage: '1617893342.png' },
  { id: 7, nomImage: '1617893451.png' },
  { id: 8, nomImage: '1617893506.png' },
  { id: 9, nomImage: '1617893787.png' },
  { id: 10, nomImage: '1617915228.png' },
  { id: 11, nomImage: '1617893665.png' },
  { id: 12, nomImage: '1617893708.png' },
  { id: 13, nomImage: '1617893825.png' },
  { id: 15, nomImage: '1618007489.png' },
  { id: 16, nomImage: '1619567988.jpg' },
  { id: 17, nomImage: '1619568034.jpg' },
];

export default function CentreAbout() {
  const [images] = useState(DB_IMAGES);

  return (

    <div style={{ direction: 'rtl', fontFamily: 'Segoe UI, Arial, sans-serif', textAlign: 'right' }}>
      <style>{`
        /* ── Variables ── */
        :root {
          --pink:    #f05074;
          --pink2:   #ff7e5f;
          --dark:    #1a1a2e;
          --gray:    #f7f8fc; /* الباكجراوند المتميز لفصل أول الصفحة عن الهيدر المشترك */
          --border:  #ececec;
          --text:    #444;
          --muted:   #666;
        }

        .about-hero {
          background: var(--gray); 
          color: var(--dark);
          padding: 90px 0 60px;
          text-align: center; 
          border-bottom: 1px solid var(--border);
        }
        .about-hero h1 {
          font-size: 42px;
          font-weight: 700;
          margin: 0 0 16px;
          color: var(--dark);
        }
        .about-hero h1 span { color: var(--pink); }
        .about-hero p {
          font-size: 18px;
          color: var(--muted);
          max-width: 750px;
          line-height: 1.8;
          margin: 0 auto; 
        }
        .hero-badge {
          display: inline-block;
          background: white;
          border: 1px solid rgba(240,80,116,0.25);
          color: var(--pink);
          font-size: 13px;
          padding: 6px 20px;
          border-radius: 50px;
          margin-bottom: 20px;
          font-weight: 600;
          box-shadow: 0 2px 8px rgba(0,0,0,0.02);
        }

        /* ── Layout ── */
        .about-container {
          max-width: 1100px;
          margin: 0 auto;
          padding: 0 24px;
        }

        /* ── Section title ── */
        .section-wrap { padding: 70px 0; background: #ffffff; }
        .section-wrap.alt { background: var(--gray); }

        .section-label {
          font-size: 13px;
          font-weight: 600;
          color: var(--pink);
          margin-bottom: 8px;
        }
        .section-title {
          font-size: 28px;
          font-weight: 700;
          color: var(--dark);
          margin: 0 0 16px;
          text-align: right;
        }
        .section-line {
          width: 48px;
          height: 3px;
          background: linear-gradient(90deg, var(--pink), var(--pink2));
          border-radius: 2px;
          margin-bottom: 28px;
        }

        /* ── About intro ── */
        .about-intro-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 48px;
          align-items: center;
        }
        .about-intro-text { font-size: 16px; color: var(--text); line-height: 1.9; text-align: justify; }
        .about-intro-img {
          border-radius: 16px;
          overflow: hidden;
          aspect-ratio: 4/3;
          background: #e8e8f0;
          display: flex; align-items: center; justify-content: center;
          font-size: 48px;
          box-shadow: 0 8px 24px rgba(0,0,0,0.04);
        }
        .about-intro-img img { width: 100%; height: 100%; object-fit: cover; }

        /* ── Vision / Mission cards ── */
        .vm-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 24px;
        }
        .vm-card {
          background: white;
          border-radius: 16px;
          border: 1px solid var(--border);
          padding: 32px;
          position: relative;
          overflow: hidden;
        }
        .vm-card::before {
          content: '';
          position: absolute;
          top: 0; right: 0;
          width: 4px; height: 100%;
          background: linear-gradient(180deg, var(--pink), var(--pink2));
          border-radius: 0 16px 16px 0;
        }
        .vm-card-icon { font-size: 32px; margin-bottom: 14px; text-align: right; }
        .vm-card-title {
          font-size: 20px; font-weight: 700;
          color: var(--dark); margin-bottom: 12px;
          text-align: right;
        }
        .vm-card-text { font-size: 15px; color: var(--muted); line-height: 1.8; text-align: justify; }

        /* ── Goals ── */
        .goals-list { list-style: none; padding: 0; margin: 0; display: grid; gap: 14px; }
        .goals-list li {
          display: flex; gap: 14px; align-items: flex-start;
          background: white;
          border: 1px solid var(--border);
          border-radius: 12px;
          padding: 18px 20px;
          font-size: 15px;
          color: var(--text);
          line-height: 1.7;
          transition: box-shadow 0.2s, transform 0.2s;
        }
        .goals-list li:hover {
          box-shadow: 0 4px 18px rgba(240,80,116,0.10);
          transform: translateX(-3px);
        }
        .goal-num {
          min-width: 32px; height: 32px;
          background: linear-gradient(135deg, var(--pink), var(--pink2));
          color: white;
          border-radius: 50%;
          display: flex; align-items: center; justify-content: center;
          font-size: 13px; font-weight: 700;
          flex-shrink: 0;
        }

        /* ── Values ── */
        .values-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 20px;
        }
        .value-card {
          background: white;
          border: 1px solid var(--border);
          border-radius: 16px;
          padding: 28px 20px;
          text-align: center;
          transition: box-shadow 0.2s, transform 0.2s;
        }
        .value-card:hover {
          box-shadow: 0 6px 24px rgba(240,80,116,0.12);
          transform: translateY(-4px);
        }
        .value-icon { font-size: 36px; margin-bottom: 12px; }
        .value-title { font-size: 17px; font-weight: 700; color: var(--dark); margin-bottom: 8px; }
        .value-desc { font-size: 13px; color: var(--muted); line-height: 1.7; }

        /* ── Gallery ── */
        .gallery-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
          gap: 16px;
        }
        .gallery-item {
          border-radius: 12px;
          overflow: hidden;
          aspect-ratio: 4/3;
          background: #eaebf2;
          box-shadow: 0 4px 12px rgba(0,0,0,0.03);
        }
        .gallery-item img {
          width: 100%; height: 100%;
          object-fit: cover;
          transition: transform 0.3s;
        }
        .gallery-item:hover img { transform: scale(1.06); }
        .gallery-empty {
          text-align: center; color: var(--muted);
          padding: 40px; font-size: 15px;
          grid-column: 1/-1;
        }

        /* ── Partners strip ── */
        .partners-strip {
          display: flex; align-items: center; gap: 12px;
          flex-wrap: wrap;
          margin-top: 24px;
        }
        .partner-badge {
          background: var(--gray);
          border: 1px solid var(--border);
          border-radius: 8px;
          padding: 10px 18px;
          font-size: 14px;
          color: var(--dark);
          font-weight: 500;
        }

        @media (max-width: 768px) {
          .about-intro-grid,
          .vm-grid { grid-template-columns: 1fr; }
          .values-grid { grid-template-columns: 1fr 1fr; }
          .about-hero h1 { font-size: 28px; }
        }
      `}</style>
      <PageBanner title="عن مركز بلسم" />
      <section className="about-hero">
        <div className="about-container">
          <div className="hero-badge">مركز بلسم — التعريف والهوية</div>
          <h1>عن <span>مركز بلسم</span></h1>
          <p>
            نحن أسرة من الآباء والأمهات والمختصين، نعمل معاً لأجل مستقبل أفضل
            لكل طفل ذي توحد في المغرب.
          </p>
        </div>
      </section>

      {/* ── 1. نبذة ── */}
      <section className="section-wrap">
        <div className="about-container">
          <div className="about-intro-grid">
            <div>
              <div className="section-label">من نحن</div>
              <h2 className="section-title">نبذة عن <span style={{color: 'var(--pink)'}}>مركز بلسم</span></h2>
              <div className="section-line" />
              <p className="about-intro-text">{ABOUT}</p>
              <div className="partners-strip">
                <span className="partner-badge">عضو CAM</span>
                <span className="partner-badge">شريك المؤسسات الرسمية</span>
                <span className="partner-badge">تعاون دولي</span>
              </div>
            </div>
            <div className="about-intro-img">
              {images[0]
                ? <img 
                    src={getStorageUrl(images[0].nomImage)} 
                    alt="مركز بلسم" 
                  />
                : <span>🏫</span>
              }
            </div>
          </div>
        </div>
      </section>

      {/* ── 2. الرؤية والرسالة ── */}
      <section className="section-wrap alt">
        <div className="about-container">
          <div className="section-label">توجهنا</div>
          <h2 className="section-title">الرؤية والرسالة</h2>
          <div className="section-line" />
          <div className="vm-grid">
            <div className="vm-card">
              <div className="vm-card-icon">🔭</div>
              <div className="vm-card-title">رؤيتنا</div>
              <p className="vm-card-text">{VISION}</p>
            </div>
            <div className="vm-card">
              <div className="vm-card-icon">🎯</div>
              <div className="vm-card-title">مهمتنا</div>
              <p className="vm-card-text">{MISSION}</p>
            </div>
          </div>
        </div>
      </section>

      {/* ── 3. الأهداف ── */}
      <section className="section-wrap">
        <div className="about-container">
          <div className="section-label">ما نسعى إليه</div>
          <h2 className="section-title">أهداف المركز</h2>
          <div className="section-line" />
          <ul className="goals-list">
            {GOALS.map((g, i) => (
              <li key={i}>
                <span className="goal-num">{i + 1}</span>
                <span>{g}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* ── 4. القيم ── */}
      <section className="section-wrap alt">
        <div className="about-container">
          <div className="section-label">ما يوحدنا</div>
          <h2 className="section-title">القيم والمبادئ</h2>
          <div className="section-line" />
          <div className="values-grid">
            {VALUES.map((v, i) => (
              <div className="value-card" key={i}>
                <div className="value-icon">{v.icon}</div>
                <div className="value-title">{v.title}</div>
                <p className="value-desc">{v.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 5. فضاءات المركز وعرض الصور ── */}
      <section className="section-wrap">
        <div className="about-container">
          <div className="section-label">جولة في المركز</div>
          <h2 className="section-title">فضاءات وتجهيزات المركز</h2>
          <div className="section-line" />
          <div className="gallery-grid">
            {images.length > 0
              ? images.map((img, i) => (
                  <div className="gallery-item" key={img.id || i}>
                    <img
                      src={getStorageUrl(img.nomImage)}
                      alt={`فضاء ${i + 1}`}
                      onError={e => { 
                        // لتجنب كسر التصميم في حال غياب الصورة تماماً من السيرفر
                        e.target.style.display = 'none'; 
                      }}
                    />
                  </div>
                ))
              : <div className="gallery-empty">لا توجد صور متاحة حالياً</div>
            }
          </div>
        </div>
      </section>
    </div>
  );
}