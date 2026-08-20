import { useEffect, useState } from "react";
import { getScheduleById, deleteSchedule } from "../data/schedules";
import { getSongs } from "../data/songs";

function ScheduleDetail({ scheduleId, onNavigate }) {
  const [schedule, setSchedule] = useState(null);
  const [songsList, setSongsList] = useState([]);

  useEffect(() => {
    const fetchScheduleData = async () => {
      if (!scheduleId) return;
      
      try {
        const foundSchedule = await getScheduleById(scheduleId);
        if (foundSchedule) {
          setSchedule(foundSchedule);

          // Buscamos la información real de las canciones asignadas
          const allSongs = await getSongs();
          const assignedSongs = allSongs.filter((song) =>
            foundSchedule.songIds?.includes(String(song.id))
          );
          setSongsList(assignedSongs);
        }
      } catch (error) {
        console.error("Error al cargar los detalles de la programación:", error);
      }
    };

    fetchScheduleData();
  }, [scheduleId]);

  const handleDelete = async () => {
    if (window.confirm(`¿Estás seguro de que deseas eliminar "${schedule.title}"?`)) {
      try {
        await deleteSchedule(schedule.id);
        if (onNavigate) onNavigate("schedules");
      } catch (error) {
        console.error("Error al eliminar la programación:", error);
      }
    }
  };

  return (
    <div 
      style={{ 
        minHeight: "100vh", 
        width: "100%", 
        display: "flex", 
        flexDirection: "column", 
        alignItems: "center", 
        justifyContent: "flex-start", 
        padding: "40px 20px", 
        boxSizing: "border-box" 
      }}
    >
      <div style={{ width: "100%", maxWidth: "900px" }}>
        {/* BOTÓN VOLVER */}
        <div style={{ display: "flex", gap: "12px", marginBottom: "20px" }}>
          <button
            className="back-button"
            onClick={() => onNavigate && onNavigate("schedules")}
          >
            ← Programaciones
          </button>
          <button
            className="back-button"
            onClick={() => onNavigate && onNavigate("home")}
          >
            🏠 Inicio
          </button>
        </div>

        {!schedule ? (
          <div className="no-results" style={{ textAlign: "center", margin: "60px 0" }}>
            <span className="no-results-icon" style={{ fontSize: "3rem" }}>📅</span>
            <h3>Programación no encontrada</h3>
          </div>
        ) : (
          <section className="schedules-page" style={{ width: "100%" }}>
            {/* ENCABEZADO */}
            <div className="schedules-header" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "24px", flexWrap: "wrap", gap: "16px" }}>
              <div>
                <span className={`status-badge status-${schedule.status?.toLowerCase()}`}>
                  {schedule.status}
                </span>
                <h2 style={{ marginTop: "12px", fontSize: "2rem" }}>{schedule.title}</h2>
                <p style={{ color: "#94a3b8" }}>📅 {schedule.date} · ⏰ {schedule.time}</p>
              </div>

              {/* ACCIONES DE ADMINISTRADOR */}
              <div style={{ display: "flex", gap: "10px" }}>
                <button
                  type="button"
                  className="create-button"
                  onClick={() => onNavigate && onNavigate("edit-schedule", schedule.id)}
                >
                  ✏️ Editar
                </button>
                <button
                  type="button"
                  className="delete-song-button"
                  onClick={handleDelete}
                >
                  🗑️ Eliminar
                </button>
              </div>
            </div>

            {/* RECURSOS Y DETALLES */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: "24px", marginTop: "16px" }}>
              
              {/* LISTA DE CANCIONES (SETLIST) */}
              <div className="song-form" style={{ background: "rgba(15, 23, 42, 0.6)", border: "1px solid rgba(255,255,255,0.1)", padding: "24px", borderRadius: "16px" }}>
                <h3 style={{ margin: "0 0 4px 0" }}>🎵 Lista de Canciones ({songsList.length})</h3>
                <p style={{ color: "#94a3b8", fontSize: "0.9rem", marginBottom: "16px" }}>Canciones asignadas para esta fecha.</p>

                {songsList.length === 0 ? (
                  <p style={{ color: "#a0aec0" }}>No hay canciones asignadas.</p>
                ) : (
                  <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: "10px" }}>
                    {songsList.map((song, idx) => (
                      <li
                        key={song.id}
                        onClick={() => onNavigate && onNavigate("song-detail", song.id)}
                        style={{
                          background: "rgba(255,255,255,0.05)",
                          padding: "12px 16px",
                          borderRadius: "10px",
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                          cursor: "pointer"
                        }}
                      >
                        <div>
                          <strong>{idx + 1}. {song.title}</strong>
                          <div style={{ fontSize: "0.85rem", color: "#a0aec0" }}>{song.artist}</div>
                        </div>
                        <span className="status-badge" style={{ background: "rgba(56,189,248,0.1)", color: "#38bdf8" }}>
                          Tono: {song.key}
                        </span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>

              {/* EQUIPO ASIGNADO */}
              <div className="song-form" style={{ background: "rgba(15, 23, 42, 0.6)", border: "1px solid rgba(255,255,255,0.1)", padding: "24px", borderRadius: "16px" }}>
                <h3 style={{ margin: "0 0 4px 0" }}>👥 Equipo Confirmado ({schedule.team?.length || 0})</h3>
                <p style={{ color: "#94a3b8", fontSize: "0.9rem", marginBottom: "16px" }}>Integrantes participando en este servicio.</p>

                {!schedule.team || schedule.team.length === 0 ? (
                  <p style={{ color: "#a0aec0" }}>No hay integrantes asignados.</p>
                ) : (
                  <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: "10px" }}>
                    {schedule.team.map((member, idx) => (
                      <li
                        key={idx}
                        style={{
                          background: "rgba(255,255,255,0.05)",
                          padding: "12px 16px",
                          borderRadius: "10px",
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center"
                        }}
                      >
                        <strong>{member.name}</strong>
                        <span style={{ fontSize: "0.85rem", color: "#cbd5e1" }}>{member.role}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>

            {/* NOTAS */}
            {schedule.notes && (
              <div className="song-form" style={{ background: "rgba(15, 23, 42, 0.6)", border: "1px solid rgba(255,255,255,0.1)", padding: "24px", borderRadius: "16px", marginTop: "24px" }}>
                <h3 style={{ margin: "0 0 8px 0" }}>📌 Notas e Instrucciones</h3>
                <p style={{ color: "#e2e8f0", margin: 0 }}>{schedule.notes}</p>
              </div>
            )}
          </section>
        )}
      </div>
    </div>
  );
}

export default ScheduleDetail;