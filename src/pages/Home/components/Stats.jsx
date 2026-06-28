import { useEffect, useState } from "react";
import api from "../../../api/"; // Explicitly import index.js

export default function Stats() {
  const [stats, setStats] = useState(null);

  useEffect(() => {
    api.get("/stats") // Use the api instance with the relative path
      .then(res => setStats(res.data))
      .catch(err => console.error(err));
  }, []);

  if (!stats) return null;

  return (
    <section style={styles.section}>
      <div style={styles.container}>
        
        <div style={styles.card}>
          <h2>{stats.sessions}</h2>
          <p>جلسة تقييم</p>
        </div>

        <div style={styles.card}>
          <h2>{stats.activites}</h2>
          <p>فعاليات متنوعة</p>
        </div>

        <div style={styles.card}>
          <h2>{stats.enfants}</h2>
          <p>تلاميذ ملتحقين</p>
        </div>

        <div style={styles.card}>
          <h2>{stats.formations}</h2>
          <p>دورات تكوينية</p>
        </div>

      </div>
    </section>
  );
}

const styles = {
  section: {
    background: "#f5f7fa",
    padding: "60px 20px",
    textAlign: "center"
  },
  container: {
    display: "flex",
    justifyContent: "center",
    gap: "30px",
    flexWrap: "wrap"
  },
  card: {
    background: "#ffffff",
    padding: "30px",
    borderRadius: "15px",
    width: "200px",
    boxShadow: "0 5px 20px rgba(0,0,0,0.1)",
    transition: "0.3s"
  }
};