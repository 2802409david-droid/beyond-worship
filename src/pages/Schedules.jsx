import { useEffect, useState } from "react";
import { subscribeToSchedules } from "../data/schedules";

function Schedules({ onNavigate }) {
  const [schedulesList, setSchedulesList] = useState([]);

  useEffect(() => {
    // Nos suscribimos a Firebase en tiempo real
    const unsubscribe = subscribeToSchedules((schedules) => {
      setSchedulesList(schedules);
    });

    // Limpiamos la suscripción al desmontar el componente
    return () => unsubscribe();
  }, []);

  return (
    <div className="page-container" style={{ maxWidth: "800px", margin: "0 auto", padding: "40px 20px" }}>
      {/* BOTÓN VOLVER */}
      <button
        type="button"
        className="back-button"
        onClick={() => {
          if (typeof onNavigate === "function") {
            onNavigate("home");
          }
        }}
        style={{ cursor: "pointer", marginBottom: "20px" }}
      >
        ← Inicio
      </button>

      {/* ENCABEZADO */}
      <div className="schedules-header" style={{ marginBottom: "24px" }}>
        <span className="page-label" style={{ color: "#38bdf8", fontWeight: "700", textTransform: "uppercase", fontSize: "0.85rem", letterSpacing: "0.05em" }}>Agenda</span>
        <h2 style={{ margin: "6px 0", fontSize: "2rem", color: "#fff" }}>Cultos y Programaciones</h2>
        <p style={{ color: "#94a3b8", margin: "0 0 16px 0" }}>Organiza los repertorios y asigna músicos para cada servicio.</p>
        
        {/* BOTÓN PARA PROGRAMAR CULTO */}
        <button
          type="button"
          onClick={() => {
            if (typeof onNavigate === "function") {
              onNavigate("new-schedule");
            }
          }}
          style={{
            background: "#38bdf8",
            color: "#0f172a",
            border: "none",
            padding: "10px 18px",
            borderRadius: "8px",
            fontWeight: "bold",
            cursor: "pointer",
            fontSize: "0.9rem"
          }}
        >
          + Programar Culto
        </button>
      </div>

      {/* CONTENIDO VACÍO O LISTA */}
      {schedulesList.length === 0 ? (
        <div style={{ textAlign: "center", padding: "60px 0", background: "rgba(30, 41, 59, 0.4)", borderRadius: "16px", border: "1px solid rgba(255,255,255,0.05)" }}>
          <span style={{ fontSize: "3rem" }}>📅</span>
          <h3 style={{ color: "#fff", marginTop: "10px" }}>No hay cultos programados</h3>
          <p style={{ color: "#94a3b8" }}>Presiona "Programar Culto" para organizar el próximo servicio.</p>
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
          {schedulesList.map((sched) => (
            <div
              key={sched.id}
              onClick={() => onNavigate && onNavigate("schedule-detail", sched.id)}
              style={{ background: "rgba(15, 23, 42, 0.6)", border: "1px solid rgba(255,255,255,0.08)", padding: "16px 20px", borderRadius: "12px", cursor: "pointer", display: "flex", justifyContent: "space-between", alignItems: "center" }}
            >
              <div>
                <h4 style={{ margin: "0 0 4px 0", color: "#fff", fontSize: "1.1rem" }}>{sched.title}</h4>
                <span style={{ color: "#94a3b8", fontSize: "0.8rem" }}>📅 {sched.date} · ⏰ {sched.time}</span>
              </div>
              <span style={{ color: "#38bdf8", fontSize: "0.9rem", fontWeight: "bold" }}>Ver detalles →</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Schedules;