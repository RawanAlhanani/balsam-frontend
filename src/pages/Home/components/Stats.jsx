import { useEffect, useRef, useState } from "react";
import api from "../../../api/";
import "./Stats.css";

const STAT_ITEMS = [
  { key: "sessions", label: "جلسة تقييم", icon: "fa-heartbeat" },
  { key: "activites", label: "فعاليات متنوعة", icon: "fa-calendar" },
  { key: "enfants", label: "تلاميذ ملتحقين", icon: "fa-graduation-cap" },
  { key: "formations", label: "دورات تكوينية", icon: "fa-certificate" },
];

const CountUp = ({ value }) => {
  const [display, setDisplay] = useState(0);
  const ref = useRef(null);
  const started = useRef(false);

  useEffect(() => {
    const target = Number(value) || 0;
    const el = ref.current;
    if (!el) return;

    const animate = () => {
      if (started.current) return;
      started.current = true;
      const duration = 1200;
      const start = performance.now();
      const step = (now) => {
        const progress = Math.min((now - start) / duration, 1);
        setDisplay(Math.round(target * (1 - Math.pow(1 - progress, 3))));
        if (progress < 1) requestAnimationFrame(step);
      };
      requestAnimationFrame(step);
    };

    const observer = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) animate();
    }, { threshold: 0.4 });
    observer.observe(el);
    return () => observer.disconnect();
  }, [value]);

  return <span ref={ref}>{display}</span>;
};

export default function Stats() {
  const [stats, setStats] = useState(null);

  useEffect(() => {
    api.get("/stats")
      .then(res => setStats(res.data))
      .catch(err => console.error(err));
  }, []);

  if (!stats) return null;

  return (
    <section className="balsam-stats">
      <div className="balsam-stats__container">
        {STAT_ITEMS.map(item => (
          <div className="balsam-stats__card" key={item.key}>
            <div className="balsam-stats__icon">
              <i className={`fa ${item.icon}`} aria-hidden="true"></i>
            </div>
            <h2 className="balsam-stats__value"><CountUp value={stats[item.key]} /></h2>
            <p className="balsam-stats__label">{item.label}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
