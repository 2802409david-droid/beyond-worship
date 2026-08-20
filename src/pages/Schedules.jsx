import { useEffect, useState } from "react";
import { subscribeToSchedules } from "../data/schedules";

function Schedules({ onNavigate }) {
  const [schedulesList, setSchedulesList] = useState([]);

  useEffect(() => {
    const unsubscribe = subscribeToSchedules((schedules) => {
      setSchedulesList(schedules);
    });
    return () => unsubscribe();
  }, []);

  return (
    <div className="page-container" style={{ maxWidth: "800px", margin: "0 auto", padding: "40px 20px" }}>
      {/* BOTÓN VOLVER */}
      <button type="button" className="back-button" onClick={() => onNavigate("home")}>
        ← Inicio
      </button>

      <div className="schedules-header" style={{ marginBottom: "24px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div>
          <span className="page-label" style={{ color: "#38bdf8" }}>Agenda</span>
          <h2 style={{ color: "#fff", margin: "6px 0" }}>Cultos y Programaciones</h2>
        </div>
        {/* BOTÓN PARA CREAR NUEVO CULTO */}
        <button
          onClick={() => onNavigate("new-schedule")}
          style={{ background: "#38bdf8", color: "#0f172a", border: "none", padding: "10px 20px", borderRadius: "8px", fontWeight: "bold", cursor: "pointer" }}
        >
          + Crear Culto
        </button>
      </div>

      {schedulesList.length === 0 ? (
        <div style={{ textAlign: "center", padding: "60px 0", background: "rgba(30, 41, 59, 0.4)", borderRadius: "16px" }}>
          <h3>No hay cultos programados</h3>
          <p>Presiona el botón "+ Crear Culto" de arriba para empezar.</p>
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
          {schedulesList.map((sched) => (
            <div key={sched.id} onClick={() => onNavigate("schedule-detail", sched.id)} style={{ background: "rgba(15, 23, 42, 0.6)", padding: "16px", borderRadius: "12px", cursor: "pointer", border: "1px solid rgba(255,255,255,0.1)" }}>
              <h4 style={{ margin: "0" }}>{sched.title}</h4>
              <span style={{ color: "#94a3b8" }}>{sched.date}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Schedules;